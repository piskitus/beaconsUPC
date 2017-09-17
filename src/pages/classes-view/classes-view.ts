import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular'
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';


@IonicPage()
@Component({
  selector: 'page-classes-view',
  templateUrl: 'classes-view.html',
})
export class ClassesViewPage {

  classesDay:any;
  classTitle:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider,
              public alertCtrl : AlertController) {
    this.classesDay = this.navParams.data;

    if(this.classesDay[0].day == 'lunes'){
      this.classTitle = 'L U N E S'
    }
    else if(this.classesDay[0].day == 'martes'){
      this.classTitle = 'M A R T E S'
    }
    else if(this.classesDay[0].day == 'miercoles'){
      this.classTitle = 'M I É R C O L E S'
    }
    else if(this.classesDay[0].day == 'jueves'){
      this.classTitle = 'J U E V E S'
    }
    else if(this.classesDay[0].day == 'viernes'){
      this.classTitle = 'V I E R N E S'
    }
    else{}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClassesViewPage');
  }

  cerrarVista(){
    this.viewCtrl.dismiss();
  }

}
