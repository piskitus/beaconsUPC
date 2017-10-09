import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import * as firebase from 'firebase/app';
import { SettingsProvider } from '../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user:any = {
    name: '',
    surname: '',
    birthday: '',
    profile: '',
    school: '',
    email: '',
    password: '',
    tracing: false,//para poder hacer seguimiento de un usuario con alguna discapacidad o que requiere asistencia en el campus
    admin: false //Para poder dar permisos diferentes a los que serán administradores
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth : AuthProvider,
    public alertCtrl : AlertController,
    private viewCtrl : ViewController,
    public settingsProvider: SettingsProvider
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register(){

    if(this.registerValidation()){
      this.auth.registerUser(this.user.email, this.user.password)
        .then((user) => {
          //Guardo los datos del usuario en la base de datos de firebase
          this.user.password = this.auth.getUser(); //Guardo en password la key que genera firebase para proteger los datos de usuario
          firebase.database().ref('users/'+this.auth.getUser()).set(this.user)
          //Cierro la vista para que me redirija a la pagina principal
          this.viewCtrl.dismiss();
          //this.settingsProvider.showToast('😊 Registro correcto', 2000, 'success', false);
        })
        .catch(err => {
          // let alert = this.alertCtrl.create({
          //   title: 'Error',
          //   subTitle: err.message,
          //   buttons: ['Aceptar']
          // });
          // alert.present();
          this.settingsProvider.showToast('El email introducido es inválido o ya está registrado', 2000, 'error', false);
        })
    }

  }

  // comprovación de que los campos estén rellenos
    registerValidation(){
      if(this.user.name && this.user.surname && this.user.email && this.user.password && this.user.birthday && this.user.profile){
        if(this.user.profile != 'visitante' && !this.user.school){this.settingsProvider.showToast('Debes seleccionar un centro docente', 2000, 'error', false);return false}
        if(this.user.password.length >= 6){
          return true
        }else{this.settingsProvider.showToast('La contraseña debe ser mayor de 5 caracteres', 2000, 'error', false);return false}
      }else{this.settingsProvider.showToast('Campos incompletos', 2000, 'error', false);return false}
    }


  cancel(){
    this.viewCtrl.dismiss();
  }

}
