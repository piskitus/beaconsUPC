import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController,AlertController } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@IonicPage()
@Component({
  selector: 'page-administracion',
  templateUrl: 'administracion.html',
})
export class AdministracionPage {

  segment:string = "beacons";//Segmento por defecto
  noticias:any;
  beacons:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController,
              public dbFirebase :FirebaseDbProvider, public modalCtrl : ModalController, public alertCtrl : AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdministracionPage');
  }

  ionViewDidEnter(){//Cada vez que entro a administración

    this.dbFirebase.getNews().subscribe(noticias=>{
      this.noticias = noticias;
    })
    this.dbFirebase.getBeacons().subscribe(beacons=>{
      this.beacons = beacons;
    })

  }

  cerrarPaginaAdministracion(){
    this.viewCtrl.dismiss();
  }

  muestraNoticia(noticia){
  // aquí vamos a abrir el modal para añadir nuestro sitio.
   let modalNews = this.modalCtrl.create( 'ModalAddNewsPage', noticia);
   modalNews.present();
  }

  muestraBeacon(beacon){
    let modalBeacon = this.modalCtrl.create( 'ModalAddBeaconPage', beacon);
    modalBeacon.present();
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
           }
        }
      ]
    });
    alert.present();
  }

  borrarBeacon(key){
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
               this.dbFirebase.deleteBeacon(key);
           }
        }
      ]
    });
    alert.present();
  }

  //MODALES QUE SE ABREN AL HACER CLICK EN LOS BOTONES DEL FAB
  nuevaNoticia(){
  // aquí vamos a abrir el modal para añadir nuestro sitio.
   let modalBeacon = this.modalCtrl.create( 'ModalAddNewsPage'/*,this.coords Aquí puede ir info*/);
   modalBeacon.present();
  }

  nuevoBeacon(){
  // aquí vamos a abrir el modal para añadir nuestro sitio.
   let modalBeacon = this.modalCtrl.create( 'ModalAddBeaconPage'/*,this.coords Aquí puede ir info*/);
   modalBeacon.present();
  }

}
