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
  classes:any;

  // se guardan las clases de la base de datos según en que día de la semana están guardadas
  lunes:any = null;
  martes:any = null;
  miercoles:any = null;
  jueves:any = null;
  viernes:any = null;
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
    this.dbFirebase.getUserClasses().subscribe(classes=>{
      this.classes = classes;

      for(let i=0; i<classes.length; i++){
        if(classes[i].$key == 'lunes'){
          this.lunes = classes[i];
        }
        else if(classes[i].$key == 'martes'){
          this.martes = classes[i];
        }
        else if(classes[i].$key == 'miercoles'){
          this.miercoles = classes[i];
        }
        else if(classes[i].$key == 'jueves'){
          this.jueves = classes[i];
        }
        else if(classes[i].$key == 'viernes'){
          this.viernes = classes[i];
        }
        else{}
      }
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

  nuevaClase(){
    let clase = {
      subject: 'null',
      day: 'lunes',
      startTime: '10:00',
      building: 'null',
      obs: null
    }

   let modal = this.modalCtrl.create( 'ModalAddClassPage', clase);
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
