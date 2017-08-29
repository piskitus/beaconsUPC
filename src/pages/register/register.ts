import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user:any = {
    name: '',
    surname: '',
    birthday: '1990-01-01',
    profile: 'visitante',
    school: '',
    email: '',
    password: '',
    admin: false //Para poder dar permisos diferentes a los que serán administradores
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth : AuthProvider,
    public alertCtrl : AlertController,
    private viewCtrl : ViewController,
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register(){

    this.auth.registerUser(this.user.email, this.user.password)
      .then((user) => {
        //Guardo los datos del usuario en la base de datos de firebase
        this.user.password = this.auth.getUser(); //Guardo en password la key que genera firebase para proteger los datos de usuario
        firebase.database().ref('users/'+this.auth.getUser()).set(this.user)
        //Cierro la vista para que me redirija a la pagina principal
        this.viewCtrl.dismiss();
        console.log("Usuario registrado OK")
      })
      .catch(err => {
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: err.message,
          buttons: ['Aceptar']
        });
        alert.present();
      })

  }

  cancel(){
    this.viewCtrl.dismiss();
  }

}
