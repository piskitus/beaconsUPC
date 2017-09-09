//Core stuff
import { Component, ChangeDetectorRef} from '@angular/core'; //ngZone:optimizar el rendimiento al iniciar un trabajo que consiste en una o más tareas asíncronas
import { IonicPage, NavController, NavParams, Platform, Events, LoadingController, ModalController } from 'ionic-angular';

//plugins
import { IBeacon } from '@ionic-native/ibeacon';

//providers
import { BeaconProvider } from '../../providers/beacon/beacon';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

//models
import { BeaconModel } from '../../models/beacon-model';


@IonicPage()
@Component({
  selector: 'page-beacons',
  templateUrl: 'beacons.html',
})


export class BeaconsPage {

  beacons = [];
  regionStatus = [];

  recarga:boolean = true; // recarga activa

  // array de beacons que mostraré por pantalla (info de beacon detectado + info beacon bbdd)
  beaconsBBDD = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform,
  private iBeacon: IBeacon, public beaconProvider: BeaconProvider, public events: Events, public changeDetectorRef: ChangeDetectorRef,
  public loadingCtrl: LoadingController, public modalCtrl : ModalController,
  public dbFirebase :FirebaseDbProvider) {
    beaconProvider.addBeaconStatusChangedHandler(this.handleBeaconStatusChanged);
  }

// función que detecta cambios en los beacons detectados
  private handleBeaconStatusChanged = (beacons) => {
      const maxAge = 30000; //30 segundos de vida
      let displayableBeacons: Array<any> = []; // guardaré cada beacon de los que detecto
      let currentTimestamp = (new Date()).getTime();
      for (let key in beacons) { //recorro los beacons que he detectado
        let beacon = beacons[key];
        //let isWithinRange = this.settings.accuracyThreshold === 0 || beacon.accuracy <= this.settings.accuracyThreshold;
        let age = (currentTimestamp - beacon.timestamp);
        let isWithinAgeLimit = age <= maxAge;
        beacon.age = age;
        beacon.color = this.setBeaconColor(age);
        if (isWithinAgeLimit) {
          displayableBeacons.push(beacon);
        }
      }
      // guardo los beacons ordenados por proximidad
      this.beacons = displayableBeacons.sort((a, b) => a.accuracy - b.accuracy);
      // paso los beacons ordenados a la función que recojerá los datos de cada beacon almacenados en la bbdd
      this.getBeaconFromBBDD(this.beacons);

      this.changeDetectorRef.detectChanges();
    }


  ionViewDidLoad() {

    this.presentLoading();// loading al entrar a la tab para simular la primera carga y detección de beacons

    this.platform.ready().then(() => {
      setInterval(() => {
        this.regionStatus = this.beaconProvider.getRegionStatus();
      }, 5000);
    });

  }

// función para asignar un color a los beacons detectados en función del tiempo que hace que no se detectan
  setBeaconColor(age){
    if(age <= 10000){
      return "#D6EAF8";//Azul clarito
    }
    else if(age > 10000 && age <= 20000){
      return "#FCF3CF";//Amarillo clarito
    }
    else{
      return "#FADBD8";//Rojo clarito
    }
  }

// loading que se muestra al entrar en la pestaña por primera vez
  presentLoading() {
  let loader = this.loadingCtrl.create({
    content: "Buscando beacons...",
    duration: 2500
  });
  loader.present();
}

// función que coje los datos de la base de datos de cada beacon detectado
getBeaconFromBBDD(beacons){
  if (this.recarga){// solo se entra si está la recarga activa

    let displayableBeaconsBBDD : Array<any> = [];//limpio el array de beacons

    for(let i=0; i < beacons.length; i++){// recorro cada beacon del array (estos beacons ya estaban ordenados por proximidad)
      //accedo a la base de datos de cada beacon para obtener sus datos
      this.dbFirebase.getSpecificBeacon(beacons[i].key).then((snapshot)=>{
        let beacon = snapshot.val();//datos de la bbdd aquí

        //fusiono los datos de la bbdd con los de los beacon recibidos
        beacon.accuracy = beacons[i].accuracy;
        beacon.age = beacons[i].age;
        beacon.color = beacons[i].color;
        beacon.proximity = beacons[i].proximity;
        beacon.rssi = beacons[i].rssi;
        beacon.timestamp = beacons[i].timestamp;
        beacon.tx = beacons[i].tx;

        // meto el beacon fusionado en el array temporal
        displayableBeaconsBBDD.push(beacon);

      })
      //una vez ya he salido del bucle y ya tengo todos los beacons completos los paso a el array que se muestra en el html
      this.beaconsBBDD = displayableBeaconsBBDD;
      console.log(this.beaconsBBDD);
    }

  }

}

openChat(chatID){
  let modal = this.modalCtrl.create( 'ChatViewPage', {id: chatID});
  modal.present();
}

pausarRecarga(){
  this.recarga = false;
}
reanudarRecarga(){
  this.recarga = true;
}


}
