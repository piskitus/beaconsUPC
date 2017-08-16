import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
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
  coords : any = { lat: 41.319131, lng: 2.020011 };
  markers:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public  platform: Platform,
    private geolocation: Geolocation,
    private dbFirebase :FirebaseDbProvider,
    public modalCtrl : ModalController)
    {
      platform.ready().then(() => {
      // La plataforma esta lista y ya tenemos acceso a los plugins.
      setInterval(() => {this.obtenerPosicion();},5000);
     });
    }

  ionViewDidLoad() {//Solo se ejecuta la primera vez que abro esta pestaña, las siguientes es en ionViewDidEnter()
    this.getMarkersFromDB();

  }

  ionViewDidEnter(){//Cada vez que entro a esta pestaña MAPA
  }

  loadMap(){
    let mapContainer = document.getElementById('map');
    this.map = new google.maps.Map(mapContainer, {
      center: this.coords,
      zoom: 17
    });

    this.chargeMarkersIntoMap();

    // Colocamos el marcador
    // let marker = new google.maps.Marker({
    //           icon : 'assets/img/pin_icon.png',
    //           map: this.map,
    //           position: this.coords,
    //           title: 'MyMarker'
    //       });

    }

  obtenerPosicion():any{
    this.geolocation.getCurrentPosition().then(res => {
      this.coords.lat = res.coords.latitude;
      this.coords.lng = res.coords.longitude;

      let LatLng = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);

      this.map.setCenter(LatLng)

      //this.firebaseSave(this.coords);

      //this.loadMap();
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
      });
  }


  //MODALES QUE SE ABREN AL HACER CLICK EN LOS BOTONES DEL FAB
  nuevoMarker(){
  // aquí vamos a abrir el modal para añadir nuestro sitio.
   let modalMarker = this.modalCtrl.create( 'ModalAddMarkerPage'/*,this.coords Aquí puede ir info*/);
   modalMarker.present();
}

getMarkersFromDB(){
  this.dbFirebase.getMarkers().subscribe(markers=>{
    this.markers = markers;
    //console.log("Markers: ", JSON.stringify(markers.length))
    this.loadMap();
    //this.chargeMarkersIntoMap();
  })

}

chargeMarkersIntoMap(){
  console.log("ENTRO A CARGAR MARKERS", this.markers[0].lat);
  for(let i = 0; i < this.markers.length; i++){
    console.log("ENTRO EN EL FOR")
    let coords = new google.maps.LatLng(this.markers[i].lat, this.markers[i].lng);
    let marker = new google.maps.Marker({
              icon : 'assets/img/pin_icon.png',
              //map: this.map,
              position: coords,
              title: this.markers[i].title
          });

      marker.setMap(this.map);
      }

  }

}
