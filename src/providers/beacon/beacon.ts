import { Injectable } from '@angular/core';
import { IBeacon } from '@ionic-native/ibeacon';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Injectable()
export class BeaconProvider {

  delegate: any;
  region: any;
  beacons = {};
  beaconStatusChangedHandlers = [];
  regionStatusInfo = {};
  nearBeaconMinor:number = 0;
  nearBeaconKey:any;
  BeaconMinorDetected1:number = null;//to do resilency
  BeaconMinorDetected2:number = null;

  constructor(private iBeacon: IBeacon, private localNotifications: LocalNotifications) {
    console.log('➡️ Beacon provider🔆');
  }

  start(identifier, uuid): any {
    console.log("🔆 start beacon provider")
    this.delegate = this.iBeacon.Delegate();// create a new delegate and register it with the native layer

    this.region = this.iBeacon.BeaconRegion(identifier, uuid);//Defino mi región (los parámetros vienen del app.component)


    // Subscribe to some of the delegate’s event handlers (detect beacons)
    this.delegate.didRangeBeaconsInRegion().subscribe(
      data => {
        //let dateTime = ((new Date()).getTime()/1000);
        let dateTime = new Date().toISOString()
        console.log(dateTime+" Detected Beacons: "+ data.beacons.length);//Muestro en la consola del inspector cuantos beacons detecto
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
          //this.setLocalNotification(data.region.identifier)
          //this.regionChangeStatus(data.region.identifier, true);
        }
      );
      this.delegate.didExitRegion().subscribe(
        data => {
          console.log("didExitRegion: ", data.region.identifier);
          //this.regionChangeStatus(data.region.identifier, false);
        }
      );
      //Inicio el monitoreo y el ranging
      this.startRangingBeacons(this.region);
      this.startMonitoringBeacons(this.region);
  }


  stopBeaconMonitoring(): any {
    this.iBeacon.stopMonitoringForRegion(this.region);
  }

  stopBeaconRanging():any{
    this.iBeacon.stopRangingBeaconsInRegion(this.region);
  }



  startRangingBeacons(region){
    console.log("🔆 startRangingBeacons")
    this.iBeacon.startRangingBeaconsInRegion(region).then(
      () => console.log('Native layer recieved the request to ranging: ', region),
      error => console.error('Failed to begin monitoring: ', error)
    );
  }


  startMonitoringBeacons(region){
    console.log("🔆 startMonitoringBeacons")
    this.iBeacon.startMonitoringForRegion(region).then(
      () => console.log('Native layer recieved the request to monitoring: ', region),
      error => console.error('Native layer failed to begin monitoring: ', error)
    );
  }

  saveBeacons(data) {
    console.log("🔆 saveBeacons")
    let nearBeaconMinor
    let nearBeaconKey
    let accuracy: number = 100.00;
        for (let beacon of data.beacons) {
          beacon.accuracy = this.calculateAccuracy(beacon.rssi, beacon.tx);
          beacon.key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
          beacon.timestamp = (new Date()).getTime();
          this.beacons[beacon.key] = beacon;
          //console.log("Beacon accuracy -> ", beacon.accuracy);

          if (beacon.accuracy < accuracy){
            //console.log("Entro -> ", beacon.accuracy, " vs ", accuracy);
            nearBeaconMinor = beacon.minor;
            nearBeaconKey = beacon.key;
            accuracy = beacon.accuracy;
          }

        }
        this.notifyBeaconStatusChanged();
        this.beaconNearestHandle(nearBeaconMinor, nearBeaconKey);
  }

  notifyBeaconStatusChanged(): any {
    console.log("🔆 notifyBeaconStatusChanged")
    //Para cada
    for (let beaconStatusChangedHandler of this.beaconStatusChangedHandlers) {
      beaconStatusChangedHandler(this.beacons);
    }
  }

  //Pongo el detector de cambios en el array
  addBeaconStatusChangedHandler(beaconStatusChangedHandler): any {
    console.log("🔆 addBeaconStatusChangedHandler")
    this.beaconStatusChangedHandlers.push(beaconStatusChangedHandler);
  };

  getBeacons(): any {
    console.log("🔆 getBeacons")
    return this.beacons;
  };

  getNearBeaconMinor(): any{
    return this.nearBeaconMinor;
  }

  getNearBeaconKey(): any{
    console.log("🔆 getNearBeaconKey")
    return this.nearBeaconKey;
  }

  regionChangeStatus(region:any, state:boolean){
    console.log("🔆 regionChangeStatus")

    if (state == true){//He detectado la región
      console.log("ENTRO------>", region+" "+state);
    }
    else{
      console.log("Salgo------>", region+" "+state);
    }

  }

  getRegionStatus(): any{
    console.log("🔆 getRegionStatus")
    return this.regionStatusInfo[0];
  }

  setLocalNotification(region){
    console.log("🔆 setLocalNotification")
    this.localNotifications.schedule({
      id: 1,
      title: ('Bienvenido a '+region),
      text: 'Que pases un buen día!'
    });
  }

//Función para determinar el beacon más cercano y guardarlo para mostrar la info en la pantalla de inicio
  beaconNearestHandle(nearBeaconMinor, nearBeaconKey){
    console.log("🔆 beaconNearestHandle")
    if (this.BeaconMinorDetected2 == null){ //Entro sólo cuando detecto el primer beacon porque a partir del segundo ya este valor no será null y tendrá que pasar el filtro
      this.nearBeaconMinor = nearBeaconMinor;
      this.nearBeaconKey = nearBeaconKey;
    }

    if(this.BeaconMinorDetected1 != null){//No entro con el primer beacon cercano detectado
      this.BeaconMinorDetected2 = this.BeaconMinorDetected1; //Guardo el beacon cercano encontrado anteriormente
    }

    this.BeaconMinorDetected1 = nearBeaconMinor;//Guardo el beacon detectado ahora

    if(this.BeaconMinorDetected1 == this.BeaconMinorDetected2){//Esta función añade robustez por si no se detecta el beacon cercano por error o se detecta otro más cerca por error
      this.nearBeaconMinor = nearBeaconMinor;//Si el beacon cercano de antes no es el mismo que el de ahora, no guardo el beacon cercano como verdadero
      this.nearBeaconKey = nearBeaconKey;
    }                                                          // Tengo que detectar 2 veces seguidas un beacon como EL MÁS CERCANO para que lo elija como cercano

  }

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
