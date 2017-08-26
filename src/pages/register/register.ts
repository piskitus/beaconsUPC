import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

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
    password: ''
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

    this.auth.registerUser(this.user.email, this.user.password, this.user)
      .then((newUser) => {//Si todo es correcto cierro el modal xq se redirige automáticamente al inicio
        this.viewCtrl.dismiss();
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
