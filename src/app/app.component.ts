import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { IBeacon } from '@ionic-native/ibeacon';
import { BeaconProvider } from '../providers/beacon/beacon';
import { Push, PushToken } from '@ionic/cloud-angular';
import { Geofence } from '@ionic-native/geofence';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any = HomePage; //Se escribe sin comillas si viene de un import
  rootPage:any = 'LoginPage';//si ponemos comillas no necesitamos importarlo, se carga utilizando lazy loaded

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private auth: AuthProvider,
    private ibeacon: IBeacon,
    private beaconProvider: BeaconProvider,
    private push: Push,
    private geofence: Geofence) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.auth.Session.subscribe(session=>{
        if(session){
            this.rootPage = 'MisTabsPage';
            this.registerAppInServer();

        }
          else{
            this.rootPage = 'LoginPage';
          }
      });

      statusBar.styleDefault();
      splashScreen.hide();
      //Enciendo bluetooth al abrir la aplicación
      this.ibeacon.enableBluetooth();

      //Arranco la búsqueda de beacons pasándole la Región a escanear el valor major y el valor minor
      //BeaconRegion(identifier, uuid, major, minor, notifyEntryStateOnDisplay)
      //beaconProvider.start('Estimote','B9407F30-F5F8-466E-AFF9-25556B57FE6D');
      beaconProvider.start('CASA','6a1a5d49-a1bd-4ae8-bdcb-f2ee498e609a');
      });


      //TODO: que solo inicialice el geofence si NO detecta ninguno creado ya
      geofence.getWatched().then(
        (data) => {
          var geofences = JSON.parse(data);//Leo las geofences que tiene activas el dispositivo
          //EN data veo los geofences que estoy viendo
          console.log("DATA GEOFENCE: ",geofences)
          if(geofences.length > 0){//REVIEW: Si detecto alguna geofence no hago nada xq quiere decir que ya están registradas
            console.log("entro al if")
            //Si ya tengo mi geofence activa no la vuelvo a inicializar
          }
          else{//Si no detecto ninguna geofence, las inicializo
            console.log("Entro al else")
            this.initializeGeofence();
          }
        },
        (err) => {

        }
      )



      // geofence.removeAll().then( //Borrar todas las Geofences
      //   () => {},
      //   (err) => {}
      // )



    }

//For push notifications
  registerAppInServer(){
    this.push.register().then((t: PushToken) => {
      return this.push.saveToken(t);
    }).then((t: PushToken) => {
      console.log('Token saved:', t.token);
    });

    //handler (decido que hacer cuando el usuario hace click en la notificación push que le llegó)
    this.push.rx.notification()
      .subscribe((msg) => {
        alert(msg.title + ': ' + msg.text);
      });
  }


//Inicializo Geofence
  initializeGeofence(){
    // initialize the plugin of geofence
    this.geofence.initialize().then(
    // resolved promise does not return a value
    () => {
      console.log('Geofence Plugin Ready')
      this.addGeofence(); //AÑADO LA ZONA para controlar la entrada
    },
    (err) => console.log(err)
    )
  }

//AÑADO LA ZONA A INTEGRAR EN GOOGLE SERVICES PARA QUE VAYA VIENDO SI ENTRO EN EL PERÍMETRO ESTABLECIDO
  addGeofence() {//EN android se pueden añadir 100 en iOS 20
    //options describing
    let fence = {
      id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb', //any unique ID
      latitude:       41.319147, //center of geofence radius
      longitude:      2.020015,
      radius:         300, //radius to edge of geofence in meters
      transitionType: 1, //1: Enter, 2: Leave, 3: Both
      notification: { //notification settings
          id:             1, //any unique ID
          title:          '¿Estás llegando a casa?', //notification title
          text:           'Abre la app para tener una mejor experiencia!', //notification body
          openAppOnClick: true, //open app when notification is tapped
          // smallIcon: 'assets/img/icon.png',
          // icon: 'assets/img/icon.png'
      }
    }

    this.geofence.addOrUpdate(fence).then(
       () => console.log('Geofence added'),
       (err) => console.log('Geofence failed to add')
     );
  }
}
