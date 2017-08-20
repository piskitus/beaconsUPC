import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the AdministracionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-administracion',
  templateUrl: 'administracion.html',
})
export class AdministracionPage {

  segment:string = "beacons";//Segmento por defecto

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdministracionPage');
  }

  cerrarPaginaAdministracion(){
    this.viewCtrl.dismiss();
  }

}
