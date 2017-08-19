import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AlertController } from 'ionic-angular';


@Injectable()
export class AuthProvider {

  constructor(private afAuth :  AngularFireAuth, private alertCtrl: AlertController) {
    console.log('Hello AuthProvider Provider');
  }

  // Registro de usuario
  registerUser(email:string, password:string){
  return this.afAuth.auth.createUserWithEmailAndPassword( email, password)
  .then((newUser)=>{// El usuario se ha creado correctamente. (guardo los datos en la base de datos)
    firebase.database().ref('/userProfile').child(newUser.uid).set({ email: email });
  })
  .catch(err=>Promise.reject(err))
  }

  // Login de usuario
  loginUser(email:string, password:string){
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(user => Promise.resolve(user))
      .catch(err => Promise.reject(err))
  }

  //Reset de password
  resetPassword(email: string): firebase.Promise<void> {
  return firebase.auth().sendPasswordResetEmail(email);
}

  // Devuelve la session
  get Session(){
    return this.afAuth.authState;
  }

  // Obtenemos el id de usuario.
 getUser(){
    return this.afAuth.auth.currentUser.uid;
 }

  // Logout de usuario
  logout(){
    this.afAuth.auth.signOut().then(()=>{
      // hemos salido
    })
  }

}
