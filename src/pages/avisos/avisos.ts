import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController,AlertController } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@IonicPage()
@Component({
  selector: 'page-avisos',
  templateUrl: 'avisos.html',
})
export class AvisosPage {

  segment:string = "classes";//Segmento por defecto

  reminders:any;
  news:any;
  classes:any;

  today:any;

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

    var d = new Date();
    var weekday = new Array(7);
      weekday[0] =  "domingo";
      weekday[1] = "lunes";
      weekday[2] = "martes";
      weekday[3] = "miercoles";
      weekday[4] = "jueves";
      weekday[5] = "viernes";
      weekday[6] = "sabado";
    this.today = weekday[d.getDay()];
    console.log("Hoy es: ", this.today)

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
          this.dbFirebase.getUserClassesDay('lunes').subscribe(lunes=>{
            this.lunes = lunes;
          })
        }
        else if(classes[i].$key == 'martes'){
          this.dbFirebase.getUserClassesDay('martes').subscribe(martes=>{
            this.martes = martes;
          })
        }
        else if(classes[i].$key == 'miercoles'){
          this.dbFirebase.getUserClassesDay('miercoles').subscribe(miercoles=>{
            this.miercoles = miercoles;
          })
        }
        else if(classes[i].$key == 'jueves'){
          this.dbFirebase.getUserClassesDay('jueves').subscribe(jueves=>{
            this.jueves = jueves;
          })
        }
        else if(classes[i].$key == 'viernes'){
          this.dbFirebase.getUserClassesDay('viernes').subscribe(viernes=>{
            this.viernes = viernes;
          })
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
      classroom: null,
      obs: null
    }

   let modal = this.modalCtrl.create( 'ModalAddClassPage', clase);
   modal.present();
  }

  nuevaClaseLunes(){
    let clase = {
      subject: 'null',
      day: 'lunes',
      startTime: '10:00',
      building: 'null',
      classroom: null,
      obs: null
    }
   let modal = this.modalCtrl.create( 'ModalAddClassPage', clase);
   modal.present();
  }

  nuevaClaseMartes(){
    let clase = {
      subject: 'null',
      day: 'martes',
      startTime: '10:00',
      building: 'null',
      classroom: null,
      obs: null
    }
   let modal = this.modalCtrl.create( 'ModalAddClassPage', clase);
   modal.present();
  }

  nuevaClaseMiercoles(){
    let clase = {
      subject: 'null',
      day: 'miercoles',
      startTime: '10:00',
      building: 'null',
      classroom: null,
      obs: null
    }
   let modal = this.modalCtrl.create( 'ModalAddClassPage', clase);
   modal.present();
  }

  nuevaClaseJueves(){
    let clase = {
      subject: 'null',
      day: 'jueves',
      startTime: '10:00',
      building: 'null',
      classroom: null,
      obs: null
    }
   let modal = this.modalCtrl.create( 'ModalAddClassPage', clase);
   modal.present();
  }

  nuevaClaseViernes(){
    let clase = {
      subject: 'null',
      day: 'viernes',
      startTime: '10:00',
      building: 'null',
      classroom: null,
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
