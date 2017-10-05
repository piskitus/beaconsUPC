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

  nearBeaconKey:any = null;
  beaconKeyDetected1:number = null;
  beaconKeyDetected2:number = null;

  //Date.now() en el que entro o salgo de la región
  enterRegionTime:number;
  exitRegionTime:number;

  // lo utilizo para saber si estoy dentro o fuera de la región
  insideRegion:boolean = false;
  // lo utilizo para guardar la última notificación de clase que se ha hecho al usuario para no repetir notificaciones iguales
  lastClassNotification:number = null;

  //Bases de datos
  reminders:any;
  classes:any;


  today:any;
  minutesNow:any;

  constructor(private iBeacon: IBeacon, private localNotifications: LocalNotifications,public dbFirebase :FirebaseDbProvider) {
    console.log('➡️ Beacon provider🔆');

    // que día es hoy?
    var d = new Date();
    var weekday = new Array(7);
      weekday[0] =  "domingo";
      weekday[1] = "lunes";
      weekday[2] = "martes";
      weekday[3] = "miercoles";
      weekday[4] = "jueves";
      weekday[5] = "viernes";
      weekday[6] = "sabado";
    this.today = weekday[d.getDay()];
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
        console.log(dateTime+" Detected Beacons: "+ data.beacons.length);//Muestro en la consola del inspector cuantos beacons detecto "JSON.stringify(data, null, 10)""
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
          this.insideRegion = true;
          //this.regionChangeStatus(data.region.identifier, true);
        }
      );
      this.delegate.didExitRegion().subscribe(
        data => {
          this.stopBeaconRanging();//SI SALGO DE LA REGION DEJO DE BUSCAR BEACONS PARA NO SATURAR
          console.log("🔴didExitRegion: ", data.region.identifier);
          this.exitRegionTime = Date.now();
          this.insideRegion = false;
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

  getNearBeaconKey(): any{
    //console.log("🔆 getNearBeaconKey", this.nearBeaconKey)
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
    // función para añadir los beacons de resilencia.
    if (this.beaconKeyDetected2 == null && this.beaconKeyDetected1 == null){ // mientras los dos sean null solo guardo el detectado en el 1 (hasta q el 1 no sea != null no se hace nada)
      this.beaconKeyDetected1 = nearBeaconKey;
    }
    else{// entro cuando el 1 ya no es null y guardo 1 y 2
      this.beaconKeyDetected2 = this.beaconKeyDetected1; //Guardo el beacon cercano encontrado anteriormente en 2
      this.beaconKeyDetected1 = nearBeaconKey;//Guardo el beacon detectado ahora en 1
    }

    // función para guardar el beacon cercano (solo si el 1 y el 2 son iguales y diferentes a 2)
    if(this.beaconKeyDetected1 == this.beaconKeyDetected2 && this.beaconKeyDetected1 != null && this.beaconKeyDetected2 != null){
      this.nearBeaconKey = nearBeaconKey;
    }
    else{
      // 1 y 2 no son iguales o alguno de los dos vale null
    }

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

//this.classesDisplayNotifications();

classesDisplayNotifications(){
  // si estoy dentro de la región y no he notificado aún o la última notificación fué hace más de 30 minutos entro
  if(this.insideRegion && (this.lastClassNotification == null || this.lastClassNotification+1800000 < Date.now())){// 1800000 = 30min
    // miro que hora es y la paso a minutos
    var d = new Date();
    this.minutesNow = (d.getHours())*60+(d.getMinutes());

    this.dbFirebase.getUserClasses().subscribe(classes=>{
      this.classes = classes;

      for(let i=0; i<classes.length; i++){
        if(classes[i].$key == this.today){
          this.dbFirebase.getUserClassesDay(this.today).subscribe(dia=>{
            // recorro el objeto que me llega transformando la hora en minutos para luego poder compararla con minutesNow (hora actual)
            for (let i=0; i < dia.length; i++){
              let hora = dia[i].startTime.split(':');// startTime format -> HH:mm
              let minutos = (+hora[0])*60+(+hora[1]);
              dia[i].minutos = minutos;
            }
            //recorro el dia que ha coincidido para ver si encuentro alguna clase entre los 20 minutos antes y los 10 despues de la hora actual
            for(let j=0; j < dia.length; j++){
              if(dia[j].minutos-20 <= this.minutesNow && dia[j].minutos+10 >= this.minutesNow){
                // monto la notificación
                let edificio=null
                if(dia[j].building == 'rojo'){edificio='❤️'}
                else if(dia[j].building == 'amarillo'){edificio='💛'}
                else if(dia[j].building == 'azul'){edificio='💙'}
                else{edificio=''}

                let observaciones=null
                if(dia[j].obs != ''){observaciones='Obs: '+dia[j].obs}
                else{observaciones='Que vaya bien la clase!'}

                let title = '⚫ '+dia[j].subject+' en el aula '+dia[j].classroom+edificio+' a las '+dia[j].startTime+'h'
                let description = '⚪ '+observaciones

                // envío la notificación
                this.setLocalNotification(dia[j].id, title, description);

                // guardo la hora de esta notificación
                this.lastClassNotification = Date.now();
              }else{}
            }
          })
        }
        else{
          //console.log("NO COINCIDE NINGÚN DÍA")
        }
      }
    })

  }
  else{
    //console.log("No ejecuto la función de notificación de clase")
  }

}
}
