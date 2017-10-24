//Core stuff
import { Component, ChangeDetectorRef} from '@angular/core'; //ngZone:optimizar el rendimiento al iniciar un trabajo que consiste en una o más tareas asíncronas
import { IonicPage, NavController, NavParams, Platform, Events, LoadingController, ModalController } from 'ionic-angular';

//plugins
import { IBeacon } from '@ionic-native/ibeacon';

//providers
import { BeaconProvider } from '../../providers/beacon/beacon';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { SettingsProvider } from '../../providers/settings/settings';


// models
import { BeaconModel } from '../../models/beacon-model';


@IonicPage()
@Component({
  selector: 'page-beacons',
  templateUrl: 'beacons.html',
})


export class BeaconsPage {
  beaconsFind = [];// guardo los beacons detectados por bluetooth
  beaconsBBDD:any;// guardo los beacons descargados de la bbdd

  recarga:boolean = true; // recarga activa (hace que el spiner se mueva y el botón pause se muestre)

  // array de beacons que mostraré por pantalla (info de beacon detectado + info beacon bbdd)
  beacons = [];



  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform,
  private iBeacon: IBeacon, public beaconProvider: BeaconProvider, public events: Events, public changeDetectorRef: ChangeDetectorRef,
  public loadingCtrl: LoadingController, public modalCtrl : ModalController,
  public dbFirebase :FirebaseDbProvider, public settingsProvider: SettingsProvider) {
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
      this.beaconsFind = displayableBeacons.sort((a, b) => a.accuracy - b.accuracy);
      // paso los beacons ordenados a la función que recojerá los datos de cada beacon almacenados en la bbdd
      this.fusionBeacons(this.beaconsFind);

      this.changeDetectorRef.detectChanges();
    }


  ionViewDidLoad() {

    this.settingsProvider.isLocationEnabled();

    this.presentLoading();// loading al entrar a la tab para simular la primera carga y detección de beacons

    // descargo todos los beacons de la base de datos (COMO ESTOY SUSCRITO, SI HAY CAMBIOS EN LA BBDD SE ACTUALIZAN)
    this.dbFirebase.getBeacons().subscribe(beacons=>{
      this.beaconsBBDD = beacons;
    })

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


// función que coje los datos de los beacons detectados y los de los beacons descargados de la bbdd y los junta
fusionBeacons(beacons){
  if (this.recarga){// solo se entra si está la recarga activa

    let displayableBeacons : Array<any> = [];// Array vacío para ir guardando los beacons fusionados

    for(let i=0; i < beacons.length; i++){// recorro cada beacon de los detectados por bluetooth (estos beacons ya estaban ordenados por proximidad)

      // recorro los beacons de la bbdd buscando coincidencia de KEY entre el detectado y el descargado
      for(let j=0; j < this.beaconsBBDD.length; j++){
        if(this.beaconsBBDD[j].key == beacons[i].key){
            this.beaconsBBDD[j].accuracy = beacons[i].accuracy;
            this.beaconsBBDD[j].age = beacons[i].age;
            this.beaconsBBDD[j].color = beacons[i].color;
            this.beaconsBBDD[j].proximity = beacons[i].proximity;
            this.beaconsBBDD[j].rssi = beacons[i].rssi;
            this.beaconsBBDD[j].timestamp = beacons[i].timestamp;
            this.beaconsBBDD[j].tx = beacons[i].tx;

            // guardo el beacon fusionado en el array
            displayableBeacons.push(this.beaconsBBDD[j]);
        }
      }

      //una vez ya he salido del bucle y ya tengo todos los beacons completos los paso a el array que se muestra en el html
      setTimeout(() => {
        this.beacons = displayableBeacons;
      }, 500);

    }
  }
}

openChat(chatID){
  let modal = this.modalCtrl.create( 'ChatViewPage', {id: chatID});
  modal.present();
}

openNews(newsID){
  let modal = this.modalCtrl.create( 'NewsViewPage', {id: newsID});
  modal.present();
}

pausarRecarga(){
  this.recarga = false;
}
reanudarRecarga(){
  this.recarga = true;
}


}
