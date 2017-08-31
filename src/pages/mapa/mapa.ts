import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController,  LoadingController } from 'ionic-angular';
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
  beacons:any;
  beaconMarkers: any;
  userMarker: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public  platform: Platform,
    private geolocation: Geolocation,
    private dbFirebase :FirebaseDbProvider,
    public modalCtrl : ModalController,
    public loadingCtrl: LoadingController){

      platform.ready().then(() => {
      // La plataforma esta lista y ya tenemos acceso a los plugins.
      this.obtenerPosicion();//Obtengo posición y cargo el mapa centrándolo en ella

      });

    }

  ionViewDidLoad() {//Solo se ejecuta la primera vez que abro esta pestaña, las siguientes es en ionViewDidEnter()
    //this.getMarkersFromDB();
    this.presentLoading();
    //this.loadMap();



  }

  ionViewDidEnter(){//Cada vez que entro a administración


  }

  loadMap(coords, zoom:number){
    let mapContainer = document.getElementById('map');
    this.map = new google.maps.Map(mapContainer, {
      center: coords,
      zoom: zoom
    });


    this.getBeaconsMarkers();//Una vez cargado el mapa añado los marcadores de los beacons
    this.markerUserInterval();//Empiezo a cargar el marcador de posición del usuario


    //this.chargeMarkersIntoMap();

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
      this.loadMap(LatLng, 20);

      //this.map.setCenter(LatLng)
    })
    .catch(
      (error)=>{
        console.log(error);
      }
    );
  }



  //MODALES QUE SE ABREN AL HACER CLICK EN LOS BOTONES DEL FAB
  nuevoMarker(){
  // aquí vamos a abrir el modal para añadir nuestro sitio.
   let modalMarker = this.modalCtrl.create( 'ModalAddMarkerPage'/*,this.coords Aquí puede ir info*/);
   modalMarker.present();
}

// getMarkersFromDB(){
//   this.dbFirebase.getMarkers().subscribe(markers=>{
//     this.markers = markers;
//     //console.log("Markers: ", JSON.stringify(markers.length))
//     this.loadMap();
//     //this.chargeMarkersIntoMap();
//   })
//
// }

chargeMarkersIntoMap(){
  console.log("ENTRO A CARGAR MARKERS", this.markers[0].lat);
  for(let i = 0; i < this.markers.length; i++){
    console.log("ENTRO EN EL FOR")
    let coords = new google.maps.LatLng(this.markers[i].lat, this.markers[i].lng);
    let marker = new google.maps.Marker({
              icon : 'assets/img/markers/pin_icon.png',
              //map: this.map,
              position: coords,
              title: this.markers[i].title
          });

      marker.setMap(this.map);
      }

  }



//Función que coje los marcadores asociados a los beacons para cargarlos en el mapa
getBeaconsMarkers(){
  this.dbFirebase.getBeacons().subscribe(beacons=>{//Cojo los beacons de la base de datos
    this.beacons = beacons;
    for(let i=0; i<beacons.length; i++){//Recorro los beacons buscando sus identificadores de marcador
      if(this.beacons[i].marker != 'null'){ //Solo entro para los beacons que tengan marcador válido
        this.dbFirebase.getSpecificMarker(this.beacons[i].marker).then((snapshot) => { //cojo de la base de datos el marcador y lo cargo en el mapa
          let title = snapshot.val().title;
          let lat = snapshot.val().lat;
          let lng = snapshot.val().lng;
          this.chargeMarkerIntoMap(title,lat,lng, 'assets/img/markers/ibks.png'); //Le paso el icono de beacon
        })
      }
      else{}
    }
  })
}

//Función para cargar un marcador en el mapa a partir de ciertos parámetros
chargeMarkerIntoMap(title, lat, lng, icon){
  let coords = new google.maps.LatLng(lat, lng);
  let marker = new google.maps.Marker({
    icon: icon,
    position: coords,
    title: title
  });
  marker.setMap(this.map);
}

markerUserInterval(){

 //this.chargeMarkerIntoMap('userMarker', this.coords.lat, this.coords.lng, 'assets/img/markers/logo_location_user.png')
 let LatLng = new google.maps.LatLng(this.coords.lng, this.coords.lng);
  this.userMarker = new google.maps.Marker({
    icon: 'assets/img/markers/logo_location_user.png',
    position: LatLng,
    title: 'userMarker'
  });
  this.userMarker.setMap(this.map);

  setInterval(() => { //Para definir un intervalo

    this.geolocation.getCurrentPosition().then(res => {
      this.coords.lat = res.coords.latitude;
      this.coords.lng = res.coords.longitude;

      let LatLng = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);

      this.userMarker.setPosition(LatLng);

    })
    .catch(
      (error)=>{
        console.log(error);
      }
    );

  }, 5000);//Cada 2 segundos
}

centerMapButton(){
  this.geolocation.getCurrentPosition().then(res => {
    this.coords.lat = res.coords.latitude;
    this.coords.lng = res.coords.longitude;
    let LatLng = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
    this.map.setCenter(LatLng);

  })
  .catch(
    (error)=>{
      console.log(error);
    }
  );
}

//Muestro un loading la primera vez que abro la pestaña mapa para dar tiempo a cargar todo
presentLoading() {
  let loader = this.loadingCtrl.create({
    content: "Cargando mapa...",
    duration: 2000
  });
  loader.present();
}
}
