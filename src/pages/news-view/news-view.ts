import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Content } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-news-view',
  templateUrl: 'news-view.html',
})
export class NewsViewPage {

  newsID:any;
  news:any = {
    color: 'white'
  };
  view:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider,
              public alertCtrl : AlertController, private iab: InAppBrowser) {
      this.newsID = this.navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsViewPage');
  }

  ionViewDidEnter(){//Cada vez que entro a administración

    var news = this.dbFirebase.getSpecificNews2(this.newsID);
    news.on('value', snapshot => {
      this.news = snapshot.val();
      this.view=true;
    });

  }

  openURL(newsURL){
    const browser = this.iab.create(newsURL, '_self','location=yes,zoom=no' );
  }

  cerrarNoticia(){
    this.viewCtrl.dismiss();
  }

}
