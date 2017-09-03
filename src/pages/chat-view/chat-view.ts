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

  }

  cerrarChat(){
    this.viewCtrl.dismiss();
  }

  enviarMensaje(){
    let message = {
      msg: this.message.msg,
      userName: 'Marc Cabezas manual'
    }
    this.dbFirebase.createChatMessage('1504469397735', message).then(res=>{
        console.log('mesaje creado');
        this.message.msg = null;
    })
  }

}
