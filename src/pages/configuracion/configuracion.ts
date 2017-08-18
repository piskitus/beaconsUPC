import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  private locationAccuracy: LocationAccuracy,private dbFirebase :FirebaseDbProvider) {
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

  resetPassword(){
    //Recojo el email del usuario de la base de datos por si lo tengo que usar (por ejemplo para el cambio de contraseña)
    //this.email = this.dbFirebase.getUserEmail();
    this.auth.resetPassword(this.email);
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

}
