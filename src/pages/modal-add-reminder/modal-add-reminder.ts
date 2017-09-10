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
  cardInfoShow:boolean=true; //card de información

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider,
              public alertCtrl : AlertController) {
    this.reminder = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAddReminderPage');
    var d = new Date();
    var weekday = new Array(7);
      weekday[0] =  "domingo";
      weekday[1] = "lunes";
      weekday[2] = "martes";
      weekday[3] = "miercoles";
      weekday[4] = "jueves";
      weekday[5] = "viernes";
      weekday[6] = "sabado";
    var n = weekday[d.getDay()];
    console.log("Hoy es: ", n)
  }

  cerrarModal(){
    this.viewCtrl.dismiss();
  }

  crearRecordatorio(){
    let reminder = {
      title: this.reminder.title,
      description: this.reminder.description,
      when: this.reminder.when,
      period: this.reminder.period,
      day: this.reminder.day,
      time: Date.now() - 28800000 //Le creo un time (milisegundos) y le resto 8horas para que ya pueda empezar a funcionar pasando el filtro del controller
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
      when: this.reminder.when,
      period: this.reminder.period,
      day: this.reminder.day
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
               this.dbFirebase.deleteUserReminder(id);
               this.cerrarModal();

           }
        }
      ]
    });

    alert.present();
  }

  closeCardInfo(){
    this.cardInfoShow = false;
  }

}
