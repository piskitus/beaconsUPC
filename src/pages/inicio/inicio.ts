import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { BeaconProvider } from '../../providers/beacon/beacon';

@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {

  coords: any;
  nearBeaconMinor: number;

  nearBeacon: any = {
    minor: 0,
    title: 'hola',
    color: 'yellow',
    description: 'La magia está apunto de empezar',
    image: 'assets/img/ibeacon_icon.png'
  }

  beaconsInfo = [
  {
    minor: 1,
    title: "Estás cerca del lila",
    color: "purple",
    description: "Has entrado a la zona lila, bienvenido!",
    image: "assets/img/beacon_purple.jpg",
  },
  {
    minor: 2,
    title: "Estás cerca del verde",
    color: "green",
    description: "Has entrado a la zona verde, bienvenido!",
    image: "assets/img/beacon_green.jpg",
  },
  {
    minor: 3,
    title: "Estás cerca del azul",
    color: "blue",
    description: "Has entrado a la zona azul, bienvenido!",
    image: "assets/img/beacon_blue.jpg",
  }
];

  constructor(public navCtrl: NavController, public navParams: NavParams, private diagnostic: Diagnostic,
    public platform: Platform, private locationAccuracy: LocationAccuracy, public dbFirebase :FirebaseDbProvider,
    public beaconProvider: BeaconProvider,) {

    platform.ready().then(() => {
      //Miro si la localización está activada
      this.isLocationEnabled();

      setInterval(() => { //Para definir un intervalo
        this.nearBeaconMinor = this.beaconProvider.getNearBeaconMinor();
        console.log("NEAR BEACON MINOR", this.nearBeaconMinor);
        this.playWithNearestBeacon(this.nearBeaconMinor);
      }, 1000);//Cada segundo

    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioPage');

  }


  isLocationEnabled(){

    let successCallback = (isAvailable) => { console.log('Is available? ' + isAvailable);
                                            if (!isAvailable){//Si no lo tiene activado le pido que lo active
                                              this.activarUbicacion();
                                            }
                                              };
    let errorCallback = (e) => console.error(e);

    this.diagnostic.isLocationAvailable().then(successCallback).catch(errorCallback);
  }

  activarUbicacion(){ //Función para solicitar la activación de la ubicación
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {//El usuario acepta
            console.log('Request successful')
            //El usuario acepta

          },
          error => {//El usuario no acepta
            console.log('Error requesting location permissions', error)
            alert("Algunas de las funcionalidades de la aplicación no funcionarán, puedes activar los permisos en el apartado de configuración.");
          }
        );
      }

    });
  }

  ionViewDidEnter(){

    this.dbFirebase.getAlgos().subscribe(algo=>{
      this.coords = algo;
      console.log("ALGO---> ", JSON.stringify(this.coords));
    })
}

playWithNearestBeacon(minor){
  if(this.nearBeacon.minor != minor){
    this.nearBeacon = this.beaconsInfo[minor-1];
  }
}

}
