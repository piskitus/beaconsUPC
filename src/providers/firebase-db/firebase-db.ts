import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthProvider } from '../auth/auth';

@Injectable()
export class FirebaseDbProvider {

  constructor(public afDB: AngularFireDatabase, public auth: AuthProvider) {
    console.log('Hello FirebaseDbProvider Provider');
  }

  guardaAlgo(algo){
    if(!algo.id){
      algo.id  = Date.now();//Nos devuelve los milisegundos transcurridos desde el 1 de enero de 1970 para que el ID nunca sea igual
    }
     return this.afDB.database.ref('algo/'+this.auth.getUser()+'/'+algo.id).set(algo)
  }

  getAlgos(){
    return this.afDB.list('algo/'+this.auth.getUser());
  }

  borrarAlgo(id){
        this.afDB.database.ref('algo/'+this.auth.getUser()+'/'+id).remove();

}

}
