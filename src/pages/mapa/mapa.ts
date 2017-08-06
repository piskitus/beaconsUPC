import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

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
    private geolocation: Geolocation)
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
  }

  obtenerPosicion():any{
    this.geolocation.getCurrentPosition().then(res => {
      this.coords.lat = res.coords.latitude;
      this.coords.lng = res.coords.longitude;

      this.loadMap();
    })
    .catch(
      (error)=>{
        console.log(error);
      }
    );
  }

}
