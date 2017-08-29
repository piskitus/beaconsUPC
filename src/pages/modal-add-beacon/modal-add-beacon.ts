import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular'
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@IonicPage()
@Component({
  selector: 'page-modal-add-beacon',
  templateUrl: 'modal-add-beacon.html',
})
export class ModalAddBeaconPage {

  beacon: any;
  regions: any;
  news: any;
  markers: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider,
              public alertCtrl : AlertController) {
    this.beacon = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAddBeaconPage');
  }

  ionViewDidEnter(){//Cada vez que entro a administración

    this.dbFirebase.getRegions().subscribe(regions=>{
      this.regions = regions;
    })

    this.dbFirebase.getNews().subscribe(news=>{
      this.news = news;
    })
    this.dbFirebase.getMarkers().subscribe(markers=>{
      this.markers = markers;
    })
  }

  cerrarModal(){
    this.viewCtrl.dismiss();
  }

  crearBeacon(){
    let beacon = {
      uuid: this.beacon.uuid,
      major: this.beacon.major,
      minor: this.beacon.minor,
      //advInterval: this.beacon.advInterval,
      //txPower: this.beacon.txPower,
      title: this.beacon.title,
      description: this.beacon.description,
      news: this.beacon.news,
      //img: 'assets/img/ibks-105.png',
      marker: this.beacon.marker
    }

    this.dbFirebase.saveBeacon(beacon).then(res=>{
            console.log('beacon guardado en firebase:');
            this.cerrarModal();
        })
  }

  guardarBeacon(){
    let beacon = {
      key: this.beacon.key,
      uuid: this.beacon.uuid,
      major: this.beacon.major,
      minor: this.beacon.minor,
      //advInterval: this.beacon.advInterval,
      //txPower: this.beacon.txPower,
      title: this.beacon.title,
      description: this.beacon.description,
      news: this.beacon.news,
      //img: 'assets/img/ibks-105.png',
      marker: this.beacon.marker
    }
    this.dbFirebase.updateBeacon(beacon).then(res=>{
    console.log('beacon modificado en firebase');
    this.cerrarModal();
    })
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
               // AquÍ borramos el beacon de la base de datos
               this.dbFirebase.deleteBeacon(key);
               this.cerrarModal();

           }
        }
      ]
    });

    alert.present();
  }

}
