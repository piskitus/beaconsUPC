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

  guardaMarker(marker){
     return this.afDB.database.ref('markers/'+marker.title).set(marker)
  }

  guardaNoticia(noticia){
    if(!noticia.id){
      noticia.id = Date.now(); //Le creo un ID único
    }
    return this.afDB.database.ref('noticias/'+noticia.id).set(noticia)
  }



  //GETS
  getAlgos(){
    return this.afDB.list('algo/'+this.auth.getUser());
  }

  getMarkers(){
    return this.afDB.list('markers');
  }

  getNoticias(){
    return this.afDB.list('noticias');
  }

  getUserEmail(){

  }



  //DELETES
  borrarAlgo(id){
      this.afDB.database.ref('algo/'+this.auth.getUser()+'/'+id).remove();
  }

  public borrarNoticia(id){
        this.afDB.database.ref('noticias/'+id).remove();
  }



}
