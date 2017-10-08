import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController, ModalController } from 'ionic-angular'
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { SettingsProvider } from '../../providers/settings/settings';


@IonicPage()
@Component({
  selector: 'page-classes-view',
  templateUrl: 'classes-view.html',
})
export class ClassesViewPage {

  classesDay:any;
  classTitle:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider,
              public alertCtrl : AlertController, public toastCtrl: ToastController, public modalCtrl : ModalController, public settingsProvider: SettingsProvider) {
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

  borrarClase(index, dia, id){
    let alert = this.alertCtrl.create({
      title: '¿Estás segur@?',
      message: 'Una vez borrada ya no se podrá recuperar',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Ha respondido que no así que no hacemos nada
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
               // AquÍ borramos la clase de la base de datos
               this.dbFirebase.deleteClass(dia, id);
               this.settingsProvider.showToast('Clase eliminada correctamente', 2000, 'success', false)
               this.classesDay.splice(index, 1);// la borro de la lista xq no se actualiza sola la view
           }
        }
      ]
    });

    alert.present();
  }

  editarClase(clase){
    let modal = this.modalCtrl.create( 'ModalAddClassPage', clase);
    modal.present();
  }

}
