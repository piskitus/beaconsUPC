import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular'
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@IonicPage()
@Component({
  selector: 'page-modal-add-beacon',
  templateUrl: 'modal-add-beacon.html',
})
export class ModalAddBeaconPage {

  title: string = '';
  description: string = '';
  color: any = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAddBeaconPage');
  }

  cerrarModal(){
    this.viewCtrl.dismiss();
  }


}
