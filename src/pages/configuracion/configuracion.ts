import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Push, PushToken } from '@ionic/cloud-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {

  locationPermission:boolean = false;
  email:any = "marcalarcon1994@gmail.com";

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth : AuthProvider, private push: Push,
  private locationAccuracy: LocationAccuracy,private dbFirebase :FirebaseDbProvider, public modalCtrl : ModalController,
  private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfiguracionPage');

  }

  cerrarSesion(){
      this.auth.logout();
  }

  disablePushNotifications(){
      this.push.unregister();
  }

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
          this.auth.deleteUser(data.password);
        }
      }
    ]
  });
  alert.present();
  }

}
