import { Injectable } from '@angular/core';
import { IBeacon } from '@ionic-native/ibeacon';

@Injectable()
export class BeaconProvider {

  delegate: any;
  region: any;
  beacons = {};
  beaconStatusChangedHandlers = [];

  constructor(private iBeacon: IBeacon) {  }

  start(identifier, uuid): any {
    this.delegate = this.iBeacon.Delegate();// create a new delegate and register it with the native layer

    this.region = this.iBeacon.BeaconRegion(identifier, uuid);//Defino mi región (los parámetros vienen del app.component)


    // Subscribe to some of the delegate’s event handlers (detect beacons)
    this.delegate.didRangeBeaconsInRegion().subscribe(
      data => {
        console.log("Detected Beacons: ", data.beacons.length);//Muestro en la consola del inspector cuantos beacons detecto
        if (data.beacons.length != 0) {//Si detecto beacons, llamo a la función que los guarda
          this.saveBeacons(data);
        }
      },
      error => console.error()
      );

      this.delegate.didStartMonitoringForRegion().subscribe(
        data => {
          console.log('didStartMonitoringForRegion: ', data.region.identifier)
        },
        error => console.error()
      );

      this.delegate.didEnterRegion().subscribe(
        data => {
          console.log("didEnterRegion: ", data.region.identifier);
        }
      );
      this.delegate.didExitRegion().subscribe(
        data => {
          console.log("didExitRegion: ", data.region.identifier);
        }
      );
      //Inicio el monitoreo y el ranging
      this.startRangingBeacons(this.region);
      this.startMonitoringBeacons(this.region);
  }



  startRangingBeacons(region){
    this.iBeacon.startRangingBeaconsInRegion(region).then(
      () => console.log('Native layer recieved the request to ranging: ', region),
      error => console.error('Failed to begin monitoring: ', error)
    );
  }


  startMonitoringBeacons(region){
    this.iBeacon.startMonitoringForRegion(region).then(
      () => console.log('Native layer recieved the request to monitoring: ', region),
      error => console.error('Native layer failed to begin monitoring: ', error)
    );
  }

  saveBeacons(data) {
        for (let beacon of data.beacons) {
          beacon.accuracy = this.calculateAccuracy(beacon.rssi, beacon.tx);
          beacon.key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
          beacon.timestamp = (new Date()).getTime();
          this.beacons[beacon.key] = beacon;
        }
        this.notifyBeaconStatusChanged();
  }

  notifyBeaconStatusChanged(): any {
    //Para cada
    for (let beaconStatusChangedHandler of this.beaconStatusChangedHandlers) {
      beaconStatusChangedHandler(this.beacons);
    }
  }

  //Pongo el detector de cambios en el array
  addBeaconStatusChangedHandler(beaconStatusChangedHandler): any {
    this.beaconStatusChangedHandlers.push(beaconStatusChangedHandler);
  };

  getBeacons(): any {
    return this.beacons;
  };








  //Calculadora de proximidad
  calculateAccuracy(rssi, tx): void {
    let ratio = rssi / tx;
    let accuracy;
    if (ratio < 1.0) {
      accuracy = Math.pow(ratio, 10);
    }
    else {
      accuracy = 0.89976 * Math.pow(ratio, 7.7095) + 0.111;
    }
    if (accuracy < 1) {
      accuracy = Math.round(accuracy * 100) / 100;
    }
    else if (accuracy < 10) {
      accuracy = Math.round(accuracy * 10) / 10;
    }
    else {
      accuracy = Math.round(accuracy);
    }
    return accuracy;
  }
}
