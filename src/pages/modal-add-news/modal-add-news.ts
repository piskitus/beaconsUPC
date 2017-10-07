import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Content } from 'ionic-angular'
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { SettingsProvider } from '../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-modal-add-news',
  templateUrl: 'modal-add-news.html',
})
export class ModalAddNewsPage {
  @ViewChild(Content) content: Content;

  eventSelected:boolean = false;
  noticia: any;
  markers: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider,
              public alertCtrl : AlertController, public settingsProvider: SettingsProvider) {
    this.noticia = this.navParams.data;

    // si recibo un evento pongo el booleano a true
    if (this.noticia.marker != 'null'){
      this.eventSelected = true;
    }else{this.eventSelected = false;}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAddBeaconPage');
  }
  ionViewDidEnter(){//Cada vez que entro a ver una notica o crearla
    //Hago escroll para abajo porqué es donde están los parámetros rellenables
    setTimeout(() => {
      this.content.scrollToBottom(500);
      //this.settingsProvider.showToast('ℹ️ Si quieres añadir una noticia no especifíques ubicación y deja la fecha por defecto. Si quieres añadir un evento especifíca la fecha y hora del evento y su localización', 10000, 'info', true)
    }, 500);

    //Cargo los datos de la BBDD
    this.dbFirebase.getMarkers().subscribe(markers=>{
      this.markers = markers;
    })

  }

  cerrarModal(){
    this.viewCtrl.dismiss();
  }

  crearNoticia(){
    let noticia = {
      title: this.noticia.title,
      description: this.noticia.description,
      color: this.noticia.color,
      url: this.noticia.url,
      startNews: this.noticia.startNews,
      marker: this.noticia.marker,
      img: this.noticia.img
    }

    if(this.newsValidation(noticia)){
      this.dbFirebase.saveNews(noticia).then(res=>{
        if(noticia.marker == 'null'){
          this.settingsProvider.showToast('Noticia creada correctamente', 2000, 'success', false)
        }else{this.settingsProvider.showToast('Evento creado correctamente', 2000, 'success', false)}

        this.cerrarModal();
      })
    }
  }

  guardarNoticia(){
    let noticia = {
      id: this.noticia.id,
      title: this.noticia.title,
      description: this.noticia.description,
      color: this.noticia.color,
      url: this.noticia.url,
      startNews: this.noticia.startNews,
      marker: this.noticia.marker,
      img: this.noticia.img,
      updateTime: Date.now()//Guardo la fecha de la última modificación de esta noticia
    }

    if(this.newsValidation(noticia)){
      this.dbFirebase.updateNews(noticia).then(res=>{
        if(noticia.marker == 'null'){
          this.settingsProvider.showToast('Noticia actualizada correctamente', 2000, 'success', false)
        }else{this.settingsProvider.showToast('Evento actualizado correctamente', 2000, 'success', false)}
      this.cerrarModal();
      })
    }

  }


  // validación de los campos obligatorios para crear una noticia o evento
    newsValidation(news:any){
      if(news.title != ''){
        if(news.description != ''){
          return true;
        }else{this.settingsProvider.showToast('Debes añadir una descripción', 2000, 'error', false); return false;}
      }else{this.settingsProvider.showToast('Debes añadir un título', 2000, 'error', false); return false;}
    }

  borrarNoticia(id){
    let alert = this.alertCtrl.create({
      title: '¿Estás seguro?',
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
               // AquÍ borramos la noticia de la base de datos
               this.dbFirebase.deleteNews(id);
               this.cerrarModal();

           }
        }
      ]
    });

    alert.present();
  }


// Si primero era un evento y configuré una ubicación, al volver a ser noticia le quito el marcador.
  changeEventToggle(){
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    if (!this.eventSelected){
      this.noticia.marker = "null";
      this.noticia.startNews = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1)
    }
  }

}
