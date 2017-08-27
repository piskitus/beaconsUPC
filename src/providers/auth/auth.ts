import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AlertController} from 'ionic-angular';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';


@Injectable()
export class AuthProvider {

  constructor(private afAuth :  AngularFireAuth, private alertCtrl: AlertController, private firebaseAnalytics: FirebaseAnalytics) {
    console.log('➡️ AuthProvider🔑');
  }

  // // Registro de usuario
  // registerUser(email:string, password:string, user:any){
  //   console.log("🔑 registerUser")
  // return this.afAuth.auth.createUserWithEmailAndPassword( email, password)
  // .then((newUser)=>{// El usuario se ha creado correctamente. (guardo los datos en la base de datos)
  //   //firebase.database().ref('/userProfile').child(newUser.uid).set({ email: email });
  //   firebase.database().ref('users/'+newUser.uid).set(user)
  //
  //   // //Añado los perfiles de usuario a analytics
  //   // console.log("➡️➡️➡️➡️➡️➡️➡️➡️➡️➡️➡️➡️➡️userAnalytics",user.profile, user.school)
  //   // this.firebaseAnalytics.setUserProperty("perfil_usuario", user.profile);
  //   // this.firebaseAnalytics.setUserProperty("centro_docente", user.school);
  //
  // })
  // .catch(err=>Promise.reject(err))
  // }

  // Registro de usuario
  registerUser(email:string, password:string){
  return this.afAuth.auth.createUserWithEmailAndPassword( email, password)
  .then((res)=>{
   // El usuario se ha creado correctamente.
  })
  .catch(err=>Promise.reject(err))
  }

  // Login de usuario
  loginUser(email:string, password:string){
    console.log("🔑 loginUser")
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
    console.log("🔑 get session", this.afAuth.authState)
    return this.afAuth.authState;
  }

  // Obtenemos el id de usuario.
 getUser(){
   console.log("🔑 getUser")
    return this.afAuth.auth.currentUser.uid;
 }

  // Logout de usuario
  logout(){
    console.log("🔑 logout")
    this.afAuth.auth.signOut().then(()=>{
      // hemos salido
    })
  }


  deleteUser(password:string){
    console.log("🔑 deleteUser")
    var user = firebase.auth().currentUser;
    var credentials = firebase.auth.EmailAuthProvider.credential(
      user.email,
      password
    );


    //primero lo reautentifico
    return user.reauthenticateWithCredential(credentials).then(function() {
      //Si OK, lo elimino
      user.delete().then(function() {
        //Lo borro de la base de datos
        firebase.database().ref('users/'+user.uid).remove()

        // User deleted.
      }, function(error) {
        console.log('No se ha podido eliminar la cuenta, inténtalo de nuevo')

        // An error happened.
      });
    }, function(error) {
      console.log('La contraseña introducida es incorrecta')

    });

    // //primero lo reautentifico
    // return user.reauthenticateWithCredential(credentials).then(()=>{
    //   // hemos salido
    //   console.log("credenciales OK")
    // },error => {
    //   console.log("credenciales KO")
    // });

  }






}
