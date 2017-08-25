import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

@IonicPage()
@Component({
  selector: 'page-avisos',
  templateUrl: 'avisos.html',
})
export class AvisosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private firebaseAnalytics: FirebaseAnalytics ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AvisosPage');

    // this.firebaseAnalytics.logEvent('page_view', {page: "dashboard"})
    // .then((res: any) => {
    //   console.log(res)
    //   this.firebaseAnalytics.setUserProperty("prueba", "true");
    // })
    // .catch((error: any) => console.error(error));


  }

}
