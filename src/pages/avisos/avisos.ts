import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController,AlertController, Content } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@IonicPage()
@Component({
  selector: 'page-avisos',
  templateUrl: 'avisos.html',
})
export class AvisosPage {
  @ViewChild(Content) content: Content;

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(1000);
    }, 500);
  }

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
    //console.log("Hoy es: ", this.today)

  }

  ionViewDidEnter(){//Cada vez que entro a avisos

    // si es jueves o viernes bajo la vista hasta abajo para que se vean esos días
    if(this.today == 'jueves' || this.today == 'viernes'){
      this.scrollToBottom();
    }

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
            // recorro el objeto que me llega transformando la hora en minutos para luego poder ordenarla
            for (let i=0; i < lunes.length; i++){
              let hora = lunes[i].startTime.split(':');// startTime format -> HH:mm
              let minutos = (+hora[0])*60+(+hora[1]);
              lunes[i].minutos = minutos;
            }
            // ordeno en función de la hora (minutos)
            this.lunes = lunes.sort((a, b) => a.minutos - b.minutos);
          })
        }
        else if(classes[i].$key == 'martes'){
          this.dbFirebase.getUserClassesDay('martes').subscribe(martes=>{
            for (let i=0; i < martes.length; i++){
              let hora = martes[i].startTime.split(':');// startTime format -> HH:mm
              let minutos = (+hora[0])*60+(+hora[1]);
              martes[i].minutos = minutos;
            }
            this.martes = martes.sort((a, b) => a.minutos - b.minutos);
          })
        }
        else if(classes[i].$key == 'miercoles'){
          this.dbFirebase.getUserClassesDay('miercoles').subscribe(miercoles=>{
            for (let i=0; i < miercoles.length; i++){
              let hora = miercoles[i].startTime.split(':');// startTime format -> HH:mm
              let minutos = (+hora[0])*60+(+hora[1]);
              miercoles[i].minutos = minutos;
            }
            this.miercoles = miercoles.sort((a, b) => a.minutos - b.minutos);
          })
        }
        else if(classes[i].$key == 'jueves'){
          this.dbFirebase.getUserClassesDay('jueves').subscribe(jueves=>{
            for (let i=0; i < jueves.length; i++){
              let hora = jueves[i].startTime.split(':');// startTime format -> HH:mm
              let minutos = (+hora[0])*60+(+hora[1]);
              jueves[i].minutos = minutos;
            }
            this.jueves = jueves.sort((a, b) => a.minutos - b.minutos);
          })
        }
        else if(classes[i].$key == 'viernes'){
          this.dbFirebase.getUserClassesDay('viernes').subscribe(viernes=>{
            for (let i=0; i < viernes.length; i++){
              let hora = viernes[i].startTime.split(':');// startTime format -> HH:mm
              let minutos = (+hora[0])*60+(+hora[1]);
              viernes[i].minutos = minutos;
            }
            this.viernes = viernes.sort((a, b) => a.minutos - b.minutos);
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
      obs: ''
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
      obs: ''
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
      obs: ''
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
      obs: ''
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
      obs: ''
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
      obs: ''
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
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Ha respondido que no así que no hacemos nada
          }
        },
        {
          text: 'Aceptar',
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
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Ha respondido que no así que no hacemos nada
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
               // AquÍ borramos la noticia de la base de datos
               this.dbFirebase.deleteUserNews(id);
           }
        }
      ]
    });
    alert.present();
  }

  goToClassesView(classesDay){
    let modal = this.modalCtrl.create( 'ClassesViewPage', classesDay);
    modal.present();
  }

  openNews(newsID){
    let modal = this.modalCtrl.create( 'NewsViewPage', {id: newsID});
    modal.present();
  }

}
