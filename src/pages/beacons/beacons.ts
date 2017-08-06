//Core stuff
import { Component, NgZone } from '@angular/core'; //ngZone:optimizar el rendimiento al iniciar un trabajo que consiste en una o más tareas asíncronas
import { IonicPage, NavController, NavParams, Platform, Events } from 'ionic-angular';

//plugins
import { IBeacon } from '@ionic-native/ibeacon';

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

  beacons: BeaconModel[] = [];
  zone: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform,
  private iBeacon: IBeacon, public beaconProvider: BeaconProvider, public events: Events) {

    // required for UI update
    this.zone = new NgZone({ enableLongStackTrace: false });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
    // this.initScanner();
    // this.startRanging();

    this.platform.ready().then(() => {
      this.beaconProvider.initialise().then((isInitialised) => {
        console.log("isInitialised?",isInitialised);
        if (isInitialised) {
          this.listenToBeaconEvents();
        }
      });
    });

  }

  listenToBeaconEvents() {
    this.events.subscribe('didRangeBeaconsInRegion', (data) => {
      console.log("ENtro listenToBeaconEvents", JSON.stringify(data,null,10));

      // update the UI with the beacon list
      this.zone.run(() => {

        let beaconList = data.beacons;

        //Si detecto algún beacon limpio la lista
        if(beaconList.length >= 1){
          this.beacons = [];
          //Manera tradicional de hacer un FOR
          for(var i=0; i<beaconList.length;i++){
            let beaconObject = new BeaconModel(beaconList[i])
            //this.beacons.push(beaconObject);
            this.beacons[i] = beaconObject;
            this.beacons[i].distance = this.calculateAccuracy(beaconObject.tx, beaconObject.rssi)
          }
        }
      });

    });
  }

  calculateAccuracy(txPower, rssi) {
  if (rssi === 0) {
    return -1; // if we cannot determine accuracy, return -1.
  }

  var ratio = rssi * 1 / txPower;
  if (ratio < 1.0) {
    return Math.pow(ratio, 10);
  } else {
    return (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
  }
}

}
