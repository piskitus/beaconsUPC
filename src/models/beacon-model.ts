export class BeaconModel {

  uuid: string;
  major: number;
  minor: number;
  rssi: number;
  proximity: string;
  tx: number;
  accuracy: number;
  distance: number;

  constructor(public beacon: any) {
    this.uuid = beacon.uuid;
    this.major = beacon.major;
    this.minor = beacon.minor;
    this.rssi = beacon.rssi;
    this.proximity = beacon.proximity;
    this.tx = beacon.tx;
    this.accuracy = beacon.accuracy;
    this.distance = null;
  }
}
