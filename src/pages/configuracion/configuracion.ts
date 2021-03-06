import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Push, PushToken } from '@ionic/cloud-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { BeaconProvider } from '../../providers/beacon/beacon';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { SettingsProvider } from '../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {

  locationPermission:boolean = false;
  adminPermission:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth : AuthProvider, private push: Push,
  private locationAccuracy: LocationAccuracy,private dbFirebase :FirebaseDbProvider, public modalCtrl : ModalController,
  private alertCtrl: AlertController, public beaconProvider: BeaconProvider, private firebaseAnalytics: FirebaseAnalytics,
  public settingsProvider: SettingsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfiguracionPage');

    //Cargo los permisos de administración del usuario para mostrarle o no el botón para acceder al panel de administración
    this.dbFirebase.getUserData().then((user)=>{
      this.adminPermission = user.val().admin;
      console.log("Permisos de administrador: ", this.adminPermission)
    })

  }

  cerrarSesion(){
      this.settingsProvider.showToast('Hasta pronto!', 2000, 'info', false);
      this.auth.logout();

      //Dejo de buscar beacons
      //this.beaconProvider.stopBeaconMonitoring();
      //this.beaconProvider.stopBeaconRanging();
  }

  // disablePushNotifications(){
  //     this.push.unregister();
  // }

  activarUbicacion(){ //Función para solicitar la activación de la ubicación
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {//El usuario acepta
            console.log('Request successful')
            //El usuario acepta
          },
          error => {//El usuario no acepta
            console.log('Error requesting location permissions', error)
            this.activarUbicacion();
          }
        );
      }

    });
  }

  changePermissionToggle(){
    //alert(this.locationPermission);
  }

  abrirPanelAdministracion(){
  // aquí vamos a abrir el modal para añadir nuestro sitio.
   let modalAdmin = this.modalCtrl.create( 'AdministracionPage'/*,this.coords Aquí puede ir info*/);
   modalAdmin.present();
  }

  deleteUser(){
  let alert = this.alertCtrl.create({
    title: '¿Estás segura/o?',
    message: 'Vuelve a introducir la contraseña para continuar',
    inputs: [
      {
        name: 'password',
        placeholder: 'Contraseña',
        type: 'password'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
        }
      },
      {
        text: 'Eliminar',
        handler: data => {
          //Ejecuto la función para eliminar usuario
          if(data.password.length > 5){
            this.auth.deleteUser(data.password)
            this.settingsProvider.showToast('Eliminando cuenta... ', 2000, 'success', false);
          }
          else{
            this.settingsProvider.showToast('Introduce una contraseña válida', 2000, 'error', false);
            return false;
          }
        }
      }
    ]
  });
  alert.present();
  }


  disablePushNotifications(){
    this.push.unregister();
  }


// se borrará en breve, solo es una demo
  demoChat(){
    let chatID = '1504469397735';
    let modal = this.modalCtrl.create( 'ChatViewPage');
    modal.present();

  }

}
