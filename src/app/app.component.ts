import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { IBeacon } from '@ionic-native/ibeacon';
import { BeaconProvider } from '../providers/beacon/beacon';
import { Push, PushToken } from '@ionic/cloud-angular';
import { Geofence } from '@ionic-native/geofence';
import { FirebaseDbProvider } from '../providers/firebase-db/firebase-db';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any = HomePage; //Se escribe sin comillas si viene de un import
  rootPage:any = 'LoginPage';//si ponemos comillas no necesitamos importarlo, se carga utilizando lazy loaded
  user:any = {

  };

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private auth: AuthProvider,
    private ibeacon: IBeacon,
    private beaconProvider: BeaconProvider,
    private push: Push,
    private geofence: Geofence,
    public dbFirebase :FirebaseDbProvider,
    private firebaseAnalytics: FirebaseAnalytics,
    public toastCtrl: ToastController,
    ) {

      console.log('➡️ app component');

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.





      this.auth.Session.subscribe(session=>{
        if(session){
          console.log('➡️ redirect MisTabsPage');
            this.toastSalutation();
            this.rootPage = 'MisTabsPage';
            this.startBeaconProvider();//Inicializo la búsqueda de beacons y regiones
            this.registerAppInServer();//Registro las notificaciones push


        }
          else{
            console.log('➡️ redirect LoginPage');
            this.rootPage = 'LoginPage';
          }
      });

      statusBar.styleDefault();
      splashScreen.hide();

      });


      // initialize the plugin of geofence
      this.geofence.initialize().then(
      // resolved promise does not return a value
      () => {
        console.log('Geofence Plugin Ready')
        this.whatchedGeofences(); //Miro las geofences que tengo añadidas
      },
      (err) => console.log(err)
      )



      // geofence.removeAll().then( //Borrar todas las Geofences
      //   () => {},
      //   (err) => {}
      // )



    }

//Inicio la búsqueda de beacons
    startBeaconProvider(){
      //Enciendo bluetooth al abrir la aplicación
      this.ibeacon.enableBluetooth();

      //Arranco la búsqueda de beacons pasándole la Región a escanear el valor major y el valor minor
      //BeaconRegion(identifier, uuid, major, minor, notifyEntryStateOnDisplay)
      this.beaconProvider.start('Estimote','B9407F30-F5F8-466E-AFF9-25556B57FE6D');
      //this.beaconProvider.start('CASA','6a1a5d49-a1bd-4ae8-bdcb-f2ee498e609a');
    }

//For push notifications
  registerAppInServer(){
    console.log('➡️ registerAppInServer');
    this.push.register().then((t: PushToken) => {
      return this.push.saveToken(t);
    }).then((t: PushToken) => {
      this.getUserAnalytics();//Cargo los datos de usuario
      console.log('Token saved:', t.token);
    });

    //handler (decido que hacer cuando el usuario hace click en la notificación push que le llegó)
    this.push.rx.notification()
      .subscribe((msg) => {
        alert(msg.title + ': ' + msg.text);
      });
  }


//Miro si ya tengo añadidas las geofences para no añadirlas 2 veces
  whatchedGeofences(){
      this.geofence.getWatched().then(
        (data) => {
          var geofences = JSON.parse(data);//Leo las geofences que tiene activas el dispositivo
          //EN data veo los geofences que estoy viendo
          console.log("DATA GEOFENCE: ",geofences)
          if(geofences.length > 0){//REVIEW: Si detecto alguna geofence no hago nada xq quiere decir que ya están registradas
            console.log("Detectadas Geofences, así q no hago nada")
            //Si ya tengo mi geofence activa no la vuelvo a inicializar
          }
          else{//Si no detecto ninguna geofence, las inicializo
            console.log("No se han detectado geogences, las añado")
            this.addGeofence();
          }
        },
        (err) => {

        }
      )
  }



//AÑADO LA ZONA A INTEGRAR EN GOOGLE SERVICES PARA QUE VAYA VIENDO SI ENTRO EN EL PERÍMETRO ESTABLECIDO
  addGeofence() {//EN android se pueden añadir 100 en iOS 20
    //options describing
    let geofence_casa_Marc = {
      id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb', //any unique ID
      latitude:       41.319147, //center of geofence radius
      longitude:      2.020015,
      radius:         300, //radius to edge of geofence in meters
      transitionType: 1, //1: Enter, 2: Leave, 3: Both
      notification: { //notification settings
          id:             1, //any unique ID (La notificación anula la anterior si tiene la misma id)
          title:          '¿Estás llegando a casa?', //notification title
          text:           'Abre la app para tener una mejor experiencia!', //notification body
          openAppOnClick: true, //open app when notification is tapped
          // smallIcon: 'assets/img/icon.png',
          //icon: 'assets/img/icon.png'
      }
    }

    let geofence_EETAC = {
      id: '6a1a5d49-a1bd-4ae8-bdcb-f2ee498e609a', //ID inventada
      latitude:       41.275737, //center of geofence radius
      longitude:      1.986996,
      radius:         350, //radius to edge of geofence in meters
      transitionType: 1, //1: Enter, 2: Leave, 3: Both
      notification: { //notification settings
          id:             2, //any unique ID
          title:          'Bienvenida/o al campus UPC', //notification title
          text:           'Abre la app para enterarte de todo', //notification body
          openAppOnClick: true, //open app when notification is tapped
          // smallIcon: 'assets/img/icon.png',
          //icon: 'assets/img/icon.png'
      }
    }

    this.geofence.addOrUpdate([geofence_casa_Marc, geofence_EETAC]).then(
       () => console.log('Geofence  añadida correctamente'),
       (err) => console.log('Geofence failed to add')
     );
  }

  getUserAnalytics(){
    let profile:string;
    let school:string;

    this.dbFirebase.getUserData(this.auth.getUser()).then((user)=>{
      profile = user.val().profile;
      school = user.val().school;
      this.setUserAnalytics(profile, school);
    })
  }

    setUserAnalytics(profile, school){
        //Añado los perfiles de usuario a analytics
        this.firebaseAnalytics.setUserProperty("perfil_usuario", profile);
        this.firebaseAnalytics.setUserProperty("centro_docente", school);
    }

    toastSalutation(){
      console.log("toastSalutation")
      this.dbFirebase.getUserData(this.auth.getUser()).then((user)=>{
        this.user.name = user.val().name;
        this.showToast(' Bienvenid@  '+this.user.name+'  👋😀', 4000)
      })
    }

    showToast(message:string, duration:number) {
        let toast = this.toastCtrl.create({
          message: message,
          duration: duration,
          position: 'top',
        });
        toast.present();
      }



}
