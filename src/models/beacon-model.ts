export class BeaconModel {

  uuid: string;
  major: number;
  minor: number;
  rssi: number;
  proximity: string;
  tx: number;
  accuracy: number;
  distance: number;
  time: number;
  key: string;

  constructor(public beacon: any) {
    this.key = beacon.uuid +":"+ beacon.major +":"+ beacon.minor;
    this.uuid = beacon.uuid;
    this.major = beacon.major;
    this.minor = beacon.minor;
    this.rssi = beacon.rssi;
    this.proximity = beacon.proximity;
    this.tx = beacon.tx;
    this.accuracy = beacon.accuracy;
    this.distance = null;
    this.time = null;
  }
}
