import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthProvider } from '../auth/auth';

@Injectable()
export class FirebaseDbProvider {

  constructor(public afDB: AngularFireDatabase, public auth: AuthProvider) {
    console.log('➡️ Firebase Provider📊');
  }

  //SETS TO SAVE AND UPDATE

  saveMarker(marker){
    if(!marker.id){
      marker.id = Date.now(); //ID único
    }
     return this.afDB.database.ref('markers/'+marker.id).set(marker)
  }

  updateMarker(marker){
    return this.afDB.database.ref('markers/'+marker.id).update(marker)
  }

  saveNews(news){
    if(!news.id){
      news.id = Date.now(); //Le creo un ID único
    }
    return this.afDB.database.ref('noticias/'+news.id).set(news)
  }

  updateNews(news){
    return this.afDB.database.ref('noticias/'+news.id).update(news)
  }

  saveBeacon(beacon){
    if(!beacon.key){
      beacon.key = beacon.uuid+":"+beacon.major+":"+beacon.minor;//Creo la clave única del beacon
    }
    return this.afDB.database.ref('beacons/'+beacon.key).set(beacon)
  }

  updateBeacon(beacon){
    return this.afDB.database.ref('beacons/'+beacon.key).update(beacon)

  }

  saveReminder(reminder){
    if(!reminder.id){
      reminder.id = Date.now(); //Le creo un ID único
    }
    return this.afDB.database.ref('users/'+this.auth.getUser()+'/reminders/'+reminder.id).set(reminder)
  }

  updateReminder(reminder){
    return this.afDB.database.ref('users/'+this.auth.getUser()+'/reminders/'+reminder.id).update(reminder)

  }

  // saveUserData(user){
  //   return this.afDB.database.ref('users/'+user.uid).set(user)
  // }

//EN principio no se utilizan
  // saveNewsInBeacon(beaconKey, newsID){
  //   return this.afDB.database.ref('beacons/'+beaconKey+'/newsID').set(newsID)
  // }
  //
  // saveMarkerInBeacon(beaconKey, markerID){
  //
  // }



  //GETS

  getMarkers(){
    return this.afDB.list('markers');
  }

  getNews(){
    return this.afDB.list('noticias');
  }

  getUserEmail(){

  }

  getBeacons(){
    return this.afDB.list('beacons');
  }

  getRegions(){
    return this.afDB.list('regions');
  }

  getUserReminders(){
    return this.afDB.list('users/'+this.auth.getUser()+'/reminders')
  }

//Cojo el identificador de la noticia de un beacon concreto
  getNewsId(beaconKey){
    return this.afDB.database.ref('beacons/' + beaconKey).once('value');
  }

//Cojo una noticia específica a partir de su identificador
  getSpecificNews(newsID){
    return this.afDB.database.ref('noticias/' + newsID).once('value');
  }

//Cojo los datos guardados de un usuario
  getUserData(){
    return this.afDB.database.ref('users/'+this.auth.getUser()).once('value');
  }

  getUserReminder(reminderID){

  }




  //DELETES

  public deleteNews(id){
        this.afDB.database.ref('noticias/'+id).remove();
  }

  public deleteMarker(id){
        this.afDB.database.ref('markers/'+id).remove();
  }

  public deleteBeacon(key){
        this.afDB.database.ref('beacons/'+key).remove();
  }

  public deleteReminder(id){
        this.afDB.database.ref('users/'+this.auth.getUser()+'/reminders/'+id).remove();
  }




}
