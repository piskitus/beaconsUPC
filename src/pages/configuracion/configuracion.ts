import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Push, PushToken } from '@ionic/cloud-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {

  locationPermission:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth : AuthProvider, private push: Push,
  private locationAccuracy: LocationAccuracy) {
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

}
