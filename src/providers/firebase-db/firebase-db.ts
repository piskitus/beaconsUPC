import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthProvider } from '../auth/auth';

@Injectable()
export class FirebaseDbProvider {

  constructor(public afDB: AngularFireDatabase, public auth: AuthProvider) {
    console.log('Hello FirebaseDbProvider Provider');
  }

  //SETS
  guardaAlgo(algo){
    if(!algo.id){
      algo.id  = Date.now();//Nos devuelve los milisegundos transcurridos desde el 1 de enero de 1970 para que el ID nunca sea igual
    }
     return this.afDB.database.ref('algo/'+this.auth.getUser()+'/'+algo.id).set(algo)
  }

  saveMarker(marker){
     return this.afDB.database.ref('markers/'+marker.title).set(marker)
  }

  saveNews(news){
    if(!news.id){
      news.id = Date.now(); //Le creo un ID único
    }
    return this.afDB.database.ref('noticias/'+news.id).set(news)
  }

  saveBeacon(beacon){
    if(!beacon.key){
      beacon.key = beacon.uuid+":"+beacon.major+":"+beacon.minor;//Creo la clave única del beacon
    }
    return this.afDB.database.ref('beacons/'+beacon.key).set(beacon)
  }

  guardaNoticiaEnBeacon(beaconKey, newsID){
    return this.afDB.database.ref('beacons/'+beaconKey+'/newsID').set(newsID)
  }



  //GETS
  getAlgos(){
    return this.afDB.list('algo/'+this.auth.getUser());
  }

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



  //DELETES
  borrarAlgo(id){
      this.afDB.database.ref('algo/'+this.auth.getUser()+'/'+id).remove();
  }

  public deleteNews(id){
        this.afDB.database.ref('noticias/'+id).remove();
  }

  public deleteBeacon(key){
        this.afDB.database.ref('beacons/'+key).remove();
  }



}
