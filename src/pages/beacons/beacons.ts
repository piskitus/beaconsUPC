//Core stuff
import { Component, ChangeDetectorRef} from '@angular/core'; //ngZone:optimizar el rendimiento al iniciar un trabajo que consiste en una o más tareas asíncronas
import { IonicPage, NavController, NavParams, Platform, Events, LoadingController, ModalController } from 'ionic-angular';

//plugins
import { IBeacon } from '@ionic-native/ibeacon';
import { LocalNotifications } from '@ionic-native/local-notifications';

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

  // para los datos de bbdd
  beaconsBBDD = [];
  displayableBeaconsBBDD: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform,
  private iBeacon: IBeacon, public beaconProvider: BeaconProvider, public events: Events, public changeDetectorRef: ChangeDetectorRef,
  private localNotifications: LocalNotifications, public loadingCtrl: LoadingController, public modalCtrl : ModalController,
  public dbFirebase :FirebaseDbProvider) {

    beaconProvider.addBeaconStatusChangedHandler(this.handleBeaconStatusChanged);


  }

  private handleBeaconStatusChanged = (beacons) => {
      const maxAge = 30000; //30 segundos de vida
      let displayableBeacons: Array<any> = [];

      this.displayableBeaconsBBDD = [];// Vacío el array para que luego se vuelva a llenar

      let currentTimestamp = (new Date()).getTime();
      for (let key in beacons) {
        let beacon = beacons[key];

        console.log("💛💛BEACON ORIGINAL RECIBIDO: ", beacon)

        this.getBeaconFromBBDD(key, beacon);

        //let isWithinRange = this.settings.accuracyThreshold === 0 || beacon.accuracy <= this.settings.accuracyThreshold;
        let age = (currentTimestamp - beacon.timestamp);
        let isWithinAgeLimit = age <= maxAge;
        beacon.age = age;
        beacon.color = this.setBeaconColor(age);
        if (isWithinAgeLimit) {
          displayableBeacons.push(beacon);
        }
      }
      this.beacons = displayableBeacons.sort((a, b) => a.accuracy - b.accuracy);
      this.beaconsBBDD = this.displayableBeaconsBBDD.sort((a, b) => a.accuracy - b.accuracy);// lo ordeno
      console.log("💛💛💛💛💛💛displayableBeacons",displayableBeacons)
      console.log("💜💜💜💜💜💜this.displayableBeaconsBBDD",this.displayableBeaconsBBDD)

      //console.log("💜💜this.beaconsBBDD", this.beaconsBBDD);

      this.changeDetectorRef.detectChanges();
    }


  ionViewDidLoad() {

    this.presentLoading();

    this.platform.ready().then(() => {

      setInterval(() => { //Para definir un intervalo
        //console.log("Han pasado 5 segundos");
        this.regionStatus = this.beaconProvider.getRegionStatus();
        //console.log("------------------------>",JSON.stringify(this.regionStatus, null, 2))
        //this.setLocalNotification();
      }, 5000);

    });

  }

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

  setLocalNotification(){
    this.localNotifications.schedule({
      id: 1,
      title: 'Hola',
      text: 'Single ILocalNotification'
    });
  }

  presentLoading() {
  let loader = this.loadingCtrl.create({
    content: "Buscando beacons...",
    duration: 2500
  });
  loader.present();
}

getBeaconFromBBDD(beaconKey, beaconRx){
  this.dbFirebase.getSpecificBeacon(beaconKey).then((snapshot)=>{
    let beacon = snapshot.val();
    beacon.accuracy = beaconRx.accuracy;
    beacon.age = beaconRx.age;
    beacon.color = beaconRx.color;
    beacon.proximity = beaconRx.proximity;
    beacon.rssi = beaconRx.rssi;
    beacon.timestamp = beaconRx.timestamp;
    beacon.tx = beaconRx.tx;

    console.log("💜💜BEACON BBDD + beaconRX", beacon)
    this.displayableBeaconsBBDD.push(beacon);
  })
}

openChat(chatID){
  let modal = this.modalCtrl.create( 'ChatViewPage', {id: chatID});
  modal.present();
}


}
