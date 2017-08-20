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

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController,
              public dbFirebase :FirebaseDbProvider, public modalCtrl : ModalController, public alertCtrl : AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdministracionPage');
  }

  ionViewDidEnter(){//Cada vez que entro a administración

    this.dbFirebase.getNoticias().subscribe(noticias=>{
      this.noticias = noticias;
    })

  }

  cerrarPaginaAdministracion(){
    this.viewCtrl.dismiss();
  }

  muestraNoticia(noticia){
  // aquí vamos a abrir el modal para añadir nuestro sitio.
   let modalBeacon = this.modalCtrl.create( 'ModalAddBeaconPage', noticia);
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
               this.dbFirebase.borrarNoticia(id);

           }
        }
      ]
    });

    alert.present();
  }

  //MODALES QUE SE ABREN AL HACER CLICK EN LOS BOTONES DEL FAB
  nuevaNoticia(){
  // aquí vamos a abrir el modal para añadir nuestro sitio.
   let modalBeacon = this.modalCtrl.create( 'ModalAddBeaconPage'/*,this.coords Aquí puede ir info*/);
   modalBeacon.present();
  }

}
