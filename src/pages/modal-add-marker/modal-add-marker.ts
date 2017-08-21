import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';


@IonicPage()
@Component({
  selector: 'page-modal-add-marker',
  templateUrl: 'modal-add-marker.html',
})
export class ModalAddMarkerPage {

  coords:any = {lat: null,lng: null};
  title: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider, ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAddMarkerPage');
  }

  cerrarModal(){
    this.viewCtrl.dismiss();
  }

  guardarMarker(){
    //TODO: validación de que los campos estén rellenos antes de insertar nada a la base de datos
    let marker = {
      title: this.title,
      lat: this.coords.lat,
      lng: this.coords.lng
    }
    this.dbFirebase.saveMarker(marker).then(res=>{
        console.log('Marker guardado en firebase');
        this.cerrarModal();
    })
  }

}
