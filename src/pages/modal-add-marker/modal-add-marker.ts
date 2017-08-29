import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';


@IonicPage()
@Component({
  selector: 'page-modal-add-marker',
  templateUrl: 'modal-add-marker.html',
})
export class ModalAddMarkerPage {

  marker:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider,
              public alertCtrl : AlertController) {
      this.marker = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAddMarkerPage');
  }

  cerrarModal(){
    this.viewCtrl.dismiss();
  }

  crearMarcador(){
    //TODO: validación de que los campos estén rellenos antes de insertar nada a la base de datos
    let marker = {
      title: this.marker.title,
      lat: this.marker.lat,
      lng: this.marker.lng
    }
    this.dbFirebase.saveMarker(marker).then(res=>{
        console.log('Marker guardado en firebase');
        this.cerrarModal();
    })
  }

  guardarMarcador(){
    let marker = {
      id: this.marker.id,
      title: this.marker.title,
      lat: this.marker.lat,
      lng: this.marker.lng
      //Añadir img para seleccionar un tipo de marcador
    }
    this.dbFirebase.updateMarker(marker).then(res=>{
    console.log('Noticia modificada en firebase');
    this.cerrarModal();
    })
  }

  borrarMarcador(id){
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
               this.dbFirebase.deleteMarker(id);
               this.cerrarModal();

           }
        }
      ]
    });

    alert.present();
  }

}
