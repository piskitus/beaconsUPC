import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular'
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@IonicPage()
@Component({
  selector: 'page-modal-add-news',
  templateUrl: 'modal-add-news.html',
})
export class ModalAddNewsPage {

  // title: string = '';
  // description: string = '';
  // color: any = 'white';//color por defecto

  noticia: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider,
              public alertCtrl : AlertController) {
    this.noticia = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAddBeaconPage');
  }

  cerrarModal(){
    this.viewCtrl.dismiss();
  }

  crearNoticia(){
    let noticia = {
      title: this.noticia.title,
      description: this.noticia.description,
      color: this.noticia.color
    }

    this.dbFirebase.saveNews(noticia).then(res=>{
            console.log('Noticia guardada en firebase:');
            this.cerrarModal();
        })
  }

  guardarNoticia(){
    let noticia = {
      id: this.noticia.id,
      title: this.noticia.title,
      description: this.noticia.description,
      color: this.noticia.color
    }
    this.dbFirebase.saveNews(noticia).then(res=>{
    console.log('Noticia modificada en firebase');
    this.cerrarModal();
    })

  }

  borrarNoticia(id){
    let alert = this.alertCtrl.create({
      title: '¿Estás seguro?',
      message: 'Una vez borrada ya no se podrá recuperar',
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
               this.dbFirebase.deleteNews(id);
               this.cerrarModal();

           }
        }
      ]
    });

    alert.present();
  }

}