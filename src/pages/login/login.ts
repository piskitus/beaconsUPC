import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

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
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }



  //FUNCIONES ASOCIADAS A UN BOTÓN DE LA VISTA
  signin(){
    this.auth.registerUser(this.user.email, this.user.password)
      .then((user) => {
        // El usuario se ha creado correctamente
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

  login(){
    this.auth.loginUser(this.user.email, this.user.password)
    .then((user) => {
    //OK
    }
    )
      .catch(err => {
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: err.message,
          buttons: ['Aceptar']
        });
        alert.present();
      })
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
              let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'El correo introducido es incorrecto o no coincide con el de ningún usuario registrado',
                buttons: ['Vale']
              });
              alert.present();
            })
          }
        }
      ]
    });
    prompt.present();
  }


}
