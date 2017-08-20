//Core stuff
import { Component, ChangeDetectorRef} from '@angular/core'; //ngZone:optimizar el rendimiento al iniciar un trabajo que consiste en una o más tareas asíncronas
import { IonicPage, NavController, NavParams, Platform, Events, LoadingController, ModalController } from 'ionic-angular';

//plugins
import { IBeacon } from '@ionic-native/ibeacon';
import { LocalNotifications } from '@ionic-native/local-notifications';

//providers
import { BeaconProvider } from '../../providers/beacon/beacon';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform,
  private iBeacon: IBeacon, public beaconProvider: BeaconProvider, public events: Events, public changeDetectorRef: ChangeDetectorRef,
  private localNotifications: LocalNotifications, public loadingCtrl: LoadingController, public modalCtrl : ModalController) {

    beaconProvider.addBeaconStatusChangedHandler(this.handleBeaconStatusChanged);


  }

  private handleBeaconStatusChanged = (beacons) => {
      const maxAge = 30000; //30 segundos de vida
      let displayableBeacons: Array<any> = [];
      let currentTimestamp = (new Date()).getTime();
      for (let key in beacons) {
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
      this.beacons = displayableBeacons.sort((a, b) => a.accuracy - b.accuracy);
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

}
