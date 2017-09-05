import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@IonicPage()
@Component({
  selector: 'page-chat-view',
  templateUrl: 'chat-view.html',
})
export class ChatViewPage {

  chat:any;
  user:any = {
    name: null,
    surname: null,
    key: null
  };
  messages:any;// mensajes descargados
  message:any = {
    msg: null
  };//mensaje pendiente de enviar

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider,
              public alertCtrl : AlertController) {
      this.chat = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatViewPage');
  }

  ionViewDidEnter(){//Cada vez que entro a administración
    //Cargo los datos de la BBDD
    this.dbFirebase.getMessagesFromChat('1504469397735').subscribe(messages=>{
      this.messages = messages;
    })

    this.dbFirebase.getUserData().then((user)=>{
      this.user.name = user.val().name;
      this.user.surname = user.val().surname;
      this.user.key = user.val().password;
      //this.user.admin = user.val().admin // por si quiero destacar de alguna manera a los que son admin en el chat
    })

  }

  cerrarChat(){
    this.viewCtrl.dismiss();
  }

  enviarMensaje(){
    let message = {
      msg: this.message.msg,
      userName: this.user.name +' '+ this.user.surname,
      userKey: this.user.key
    }
    this.dbFirebase.createChatMessage('1504469397735', message).then(res=>{
        console.log('mesaje creado');
        this.message.msg = null;
    })
  }

}
