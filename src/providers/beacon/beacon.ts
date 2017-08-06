import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { IBeacon } from '@ionic-native/ibeacon';

@Injectable()
export class BeaconProvider {

  delegate: any;
  region: any;

  constructor(/*public http: Http,*/ public platform: Platform, public events: Events, private iBeacon: IBeacon) {
    console.log('Hello BeaconProvider Provider');
  }

  initialise(): any {
    let promise = new Promise((resolve, reject) => {
      // we need to be running on a device
      if (this.platform.is('cordova')) {

        // Request permission to use location on iOS
        this.iBeacon.requestWhenInUseAuthorization();
        this.iBeacon.requestAlwaysAuthorization();

        // create a new delegate and register it with the native layer
        this.delegate = this.iBeacon.Delegate();

        // Subscribe to some of the delegate’s event handlers
        this.delegate.didRangeBeaconsInRegion()
          .subscribe(
          data => {
            this.events.publish('didRangeBeaconsInRegion', data);
          },
          error => console.error()
          );

        // setup a beacon region – CHANGE THIS TO YOUR OWN UUID
        this.region = this.iBeacon.BeaconRegion('Estimote', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D');

        // start ranging
        this.iBeacon.startRangingBeaconsInRegion(this.region)
          .then(
          () => {
            resolve(true);
          },
          error => {
            console.error('Failed to begin monitoring: ', error);
            resolve(false);
          }
          );
      } else {
        console.error('This application needs to be running on a device');
        resolve(false);
      }
    });
    return promise;
  }
}
