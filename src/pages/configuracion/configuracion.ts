import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Push, PushToken } from '@ionic/cloud-angular';

@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth : AuthProvider, private push: Push) {
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

}
