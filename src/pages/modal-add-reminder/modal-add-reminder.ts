import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular'
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@IonicPage()
@Component({
  selector: 'page-modal-add-reminder',
  templateUrl: 'modal-add-reminder.html',
})
export class ModalAddReminderPage {

  reminder: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider,
              public alertCtrl : AlertController) {
    this.reminder = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAddReminderPage');
  }

  cerrarModal(){
    this.viewCtrl.dismiss();
  }

  crearRecordatorio(){
    let reminder = {
      title: this.reminder.title,
      description: this.reminder.description,
      when: this.reminder.when
    }

    this.dbFirebase.saveReminder(reminder).then(res=>{
            console.log('Recordatorio guardado en firebase:');
            this.cerrarModal();
        })
  }

  guardarRecordatorio(){
    let reminder = {
      id: this.reminder.id,
      title: this.reminder.title,
      description: this.reminder.description,
      when: this.reminder.when
    }
    this.dbFirebase.updateReminder(reminder).then(res=>{
    console.log('Recordatorio modificada en firebase');
    this.cerrarModal();
    })

  }

  borrarRecordatorio(id){
    let alert = this.alertCtrl.create({
      title: '¿Estás seguro?',
      message: 'Una vez borrado ya no se podrá recuperar',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            // Ha respondido que no así que no hacemos nada
          }
        },
        {
          text: 'Si',
          handler: () => {
               // AquÍ borramos la noticia de la base de datos
               this.dbFirebase.deleteReminder(id);
               this.cerrarModal();

           }
        }
      ]
    });

    alert.present();
  }

}
