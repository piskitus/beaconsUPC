import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  map: any; // Manejador del mapa.
  coords : any = { lat: 0, lng: 0 }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public  platform: Platform,
    private geolocation: Geolocation,
    private dbFirebase :FirebaseDbProvider,)
    {
      platform.ready().then(() => {
      // La plataforma esta lista y ya tenemos acceso a los plugins.
      this.obtenerPosicion();
     });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapaPage');
  }

  loadMap(){
    let mapContainer = document.getElementById('map');
    this.map = new google.maps.Map(mapContainer, {
      center: this.coords,
      zoom: 17
    });

    // Colocamos el marcador
    let miMarker = new google.maps.Marker({
              icon : 'assets/img/pin_icon.png',
              map: this.map,
              position: this.coords
          });

    }

  obtenerPosicion():any{
    this.geolocation.getCurrentPosition().then(res => {
      this.coords.lat = res.coords.latitude;
      this.coords.lng = res.coords.longitude;


      //this.firebaseSave(this.coords);

      this.loadMap();
    })
    .catch(
      (error)=>{
        console.log(error);
      }
    );
  }

  //Guardar en firebase
  firebaseSave(algo){
    this.dbFirebase.guardaAlgo(algo).then(res=>{
          console.log('Algo guardado en firebase:');
          //this.cerrarModal();
      })
  }


}
