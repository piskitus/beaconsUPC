import { Injectable } from '@angular/core';
import { IBeacon } from '@ionic-native/ibeacon';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@Injectable()
export class BeaconProvider {

  delegate: any;
  region: any;
  beacons = {};
  beaconStatusChangedHandlers = [];
  regionStatusInfo = {};


  nearBeaconMinor:number = 0;
  BeaconMinorDetected1:number = null;//to do resilency
  BeaconMinorDetected2:number = null;

  nearBeaconKey:any = null;
  beaconKeyDetected1:number = null;
  beaconKeyDetected2:number = null;

  //Date.now() en el que entro o salgo de la región
  enterRegionTime:number;
  exitRegionTime:number;


  //Bases de datos
  reminders:any;

  constructor(private iBeacon: IBeacon, private localNotifications: LocalNotifications,public dbFirebase :FirebaseDbProvider) {
    console.log('➡️ Beacon provider🔆');
  }

  start(identifier, uuid): any {//Inicializo los procesos de búsqueda de beacons
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
          this.startRangingBeacons(this.region);//SI ENTRO EN LA REGIÓN EMPIEZO A BUSCAR BEACONS

          console.log("🔵didEnterRegion: ", data.region.identifier);
          //this.setLocalNotification(data.region.identifier)
          this.enterRegionTime = Date.now();
          this.enterRegionDisplayNotifications(true);
          //this.regionChangeStatus(data.region.identifier, true);
        }
      );
      this.delegate.didExitRegion().subscribe(
        data => {
          this.stopBeaconRanging();//SI SALGO DE LA REGION DEJO DE BUSCAR BEACONS PARA NO SATURAR
          console.log("🔴didExitRegion: ", data.region.identifier);
          this.exitRegionTime = Date.now();
          this.enterRegionDisplayNotifications(false);
          //this.regionChangeStatus(data.region.identifier, false);
        }
      );

      //Inicio el monitoreo (EL RANGING SE INICIA O SE PARA EN FUNCIÓN DEL MONITOREO: si entro en la región se inicia, si salgo se para)
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
    //console.log("🔆 saveBeacons")
    let nearBeaconKey//Beacon más cercano
    let accuracy: number = 100.00;
        for (let beacon of data.beacons) {
          beacon.accuracy = this.calculateAccuracy(beacon.rssi, beacon.tx);
          beacon.key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
          beacon.timestamp = (new Date()).getTime();
          this.beacons[beacon.key] = beacon;
          //console.log("Beacon accuracy -> ", beacon.accuracy);

          if (beacon.accuracy < accuracy){//Función para detectar el beacon más cercano
            //console.log("Entro -> ", beacon.accuracy, " vs ", accuracy);
            nearBeaconKey = beacon.key;
            accuracy = beacon.accuracy;
          }

        }
        this.notifyBeaconStatusChanged();
        this.beaconNearestHandle(nearBeaconKey);
  }

  notifyBeaconStatusChanged(): any {
    //console.log("🔆 notifyBeaconStatusChanged")
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
    console.log("🔆 getNearBeaconKey", this.nearBeaconKey)
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

  setLocalNotification(id, title, text){
    console.log("🔆 setLocalNotification")
    this.localNotifications.schedule({
      id: id,
      title: title,
      text: text,
      icon: 'res://icon'
    });
  }

//Función para determinar el beacon más cercano y guardarlo para mostrar la info en la pantalla de inicio
  beaconNearestHandle(nearBeaconKey){
    //console.log("🔆 beaconNearestHandle")
    if (this.beaconKeyDetected2 == null){ //Entro sólo cuando detecto el primer beacon porque a partir del segundo ya este valor no será null y tendrá que pasar el filtro
      this.nearBeaconKey = nearBeaconKey;
    }

    if(this.beaconKeyDetected1 != null){//No entro con el primer beacon cercano detectado
      this.beaconKeyDetected2 = this.beaconKeyDetected1; //Guardo el beacon cercano encontrado anteriormente
    }

    this.beaconKeyDetected1 = nearBeaconKey;//Guardo el beacon detectado ahora

    if(this.beaconKeyDetected1 == this.beaconKeyDetected2){//Esta función añade robustez por si no se detecta el beacon cercano por error o se detecta otro más cerca por error
      this.nearBeaconKey = nearBeaconKey;                   //Si el beacon cercano de antes no es el mismo que el de ahora, no guardo el beacon cercano como verdadero
    }                                                        // Tengo que detectar 2 veces seguidas un beacon como EL MÁS CERCANO para que lo elija como cercano
    console.log("🔴🔴NEARBEACONKEY: ",this.nearBeaconKey)
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



enterRegionDisplayNotifications(action:boolean){
  //Cargo los datos de la BBDD
  this.dbFirebase.getUserReminders().subscribe(reminders => {
    let dateUpdate = Date.now() - 10000;//le quito 10 segundos para entrar cuando se inicia la app

    for (let id in reminders) {
      let reminder = reminders[id];
      if (reminder.when == 'entrar' && action == true && (dateUpdate < this.enterRegionTime)) {//Si entro en la region
        if (reminder.period == 'once') {
          this.setLocalNotification(reminder.id, reminder.title, reminder.description);
          this.dbFirebase.deleteUserReminder(reminder.id); //Borro el recordatorio de la base de datos
        }
        else {//period == always
          if ((reminder.time + 28800000) < Date.now()) {//Si la última notificación +8h no supera el date now de ahora entro a notificar xq quiere decir que han pasado mínimo 8h desde la última notificación
            this.setLocalNotification(reminder.id, reminder.title, reminder.description);
            reminder.time = Date.now(); //Reinicializo el time para que no pueda volver a entrar hasta de aquí 8h como mínimo
            this.dbFirebase.updateReminder(reminder);//Guardo en la Base de datos
          }
        }
      }
      else if(reminder.when == 'salir' && action == false && (dateUpdate < this.exitRegionTime)){
        if (reminder.period == 'once') {
          this.setLocalNotification(reminder.id, reminder.title, reminder.description);
          this.dbFirebase.deleteUserReminder(reminder.id); //Borro el recordatorio de la base de datos
        }
        else {//period == always
          if ((reminder.time + 28800000) < Date.now()) {//Si la última notificación +8h no supera el date now de ahora entro a notificar xq quiere decir que han pasado mínimo 8h desde la última notificación
            this.setLocalNotification(reminder.id, reminder.title, reminder.description);
            reminder.time = Date.now(); //Reinicializo el time para que no pueda volver a entrar hasta de aquí 8h como mínimo
            this.dbFirebase.updateReminder(reminder);//Guardo en la Base de datos
          }
        }
      }
      else{
        //No cumplo ningún requisito del if (debe haber sido una actualización de la BBDD o que los avisos no cumplen las condiciones)
      }
    }//Se cierra el for

  })

}
}
