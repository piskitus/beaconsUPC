import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController,AlertController } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@IonicPage()
@Component({
  selector: 'page-avisos',
  templateUrl: 'avisos.html',
})
export class AvisosPage {

  segment:string = "reminders";//Segmento por defecto

  reminders:any;
  news:any;
  //subjects:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController,
              public dbFirebase :FirebaseDbProvider, public modalCtrl : ModalController, public alertCtrl : AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AvisosPage');

  }

  ionViewDidEnter(){//Cada vez que entro a avisos
    //Cargo los datos de la BBDD
    this.dbFirebase.getUserReminders().subscribe(reminders=>{
      this.reminders = reminders;
    })
    this.dbFirebase.getUserNews().subscribe(news=>{
      this.news = news;
    })
    // this.dbFirebase.getSubjects().subscribe(subjects=>{
    //   this.subjects = subjects;
    // })

  }

  muestraRecordatorio(recordatorio){
  // aquí vamos a abrir el modal para añadir nuestro sitio.
   let modalNews = this.modalCtrl.create( 'ModalAddReminderPage', recordatorio);
   modalNews.present();
  }

  nuevaNotificacion(){
   let modal = this.modalCtrl.create( 'ModalAddReminderPage'/*,this.coords Aquí puede ir info*/);
   modal.present();
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
           }
        }
      ]
    });
    alert.present();
  }

  borrarNoticia(id){
    let alert = this.alertCtrl.create({
      title: '¿Estás seguro?',
      message: 'Una vez borrada ya no se podrá recuperar hasta que la vuelvas a detectar',
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
               this.dbFirebase.deleteUserNews(id);
           }
        }
      ]
    });
    alert.present();
  }

}
