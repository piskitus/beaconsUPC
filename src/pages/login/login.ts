import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController  } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { SettingsProvider } from '../../providers/settings/settings';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user= { email : '', password : ''};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth : AuthProvider,
    public alertCtrl : AlertController,
    public modalCtrl : ModalController,
    public settingsProvider: SettingsProvider,
    public dbFirebase :FirebaseDbProvider,
    ) {
      console.log('➡️ LoginPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }



  //FUNCIONES ASOCIADAS A UN BOTÓN DE LA VISTA
  signin(){

    // this.auth.registerUser(this.user.email, this.user.password)
    //   .then((user) => {
    //     // El usuario se ha creado correctamente
    //   })
    //   .catch(err => {
    //     let alert = this.alertCtrl.create({
    //       title: 'Error',
    //       subTitle: err.message,
    //       buttons: ['Aceptar']
    //     });
    //     alert.present();
    //   })

    // aquí vamos a abrir el modal para añadir nuestro sitio.
     let modal = this.modalCtrl.create( 'RegisterPage');
     modal.present();

  }

  login(){
    if(this.loginValidation()){
      // si ha introducido los campos hago el login
      this.auth.loginUser(this.user.email, this.user.password)
      .then((user) => {
      })
      .catch(err => {
        this.settingsProvider.showToast('No existe un usuario con esos datos', 2000, 'error', false);
      })
    }
  }

// comprovación de que los campos estén rellenos
  loginValidation(){
    if(this.user.email){
      if(this.user.password){
        return true
      }else{this.settingsProvider.showToast('Introduce una contraseña válida', 2000, 'error', false);return false}
    }else{this.settingsProvider.showToast('Debes introducir un email válido', 2000, 'error', false);return false}
  }

  resetPassword() {
    let prompt = this.alertCtrl.create({
      title: 'Restablecer contraseña',
      message: "Introduce la dirección de correo electronico de la que quieres restablecer la contraseña",
      inputs: [
        {
          name: 'email',
          placeholder: 'contact@beaconsUPC.com'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Restablecer',
          handler: data => {
            this.auth.resetPassword(data.email).then((response) => {
              let alert = this.alertCtrl.create({
                title: 'Correo enviado',
                subTitle: 'Consulta tu correo electrónico y cambia la contraseña',
                buttons: ['Vale']
              });
              alert.present();
            })
            .catch(err => {
              this.settingsProvider.showToast('El correo introducido no existe en la base de datos', 2000, 'error', false);
            })
          }
        }
      ]
    });
    prompt.present();
  }

}
