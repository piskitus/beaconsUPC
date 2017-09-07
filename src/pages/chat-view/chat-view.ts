import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Content } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@IonicPage()
@Component({
  selector: 'page-chat-view',
  templateUrl: 'chat-view.html',
})
export class ChatViewPage {

  @ViewChild(Content) content: Content;

  scrollToBottom() {
    console.log("EJECUTO SCROLL TO BOTTOM")
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 500);

  }


  chat:any = {
    active: true
  };
  chatID:any;
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
      //console.log("this.chatID", this.navParams.data)
      //this.chat = this.navParams.data;
      this.chatID = this.navParams.get('id');
      console.log("this.chat", this.chatID)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatViewPage');

      this.scrollToBottom();

  }

  ionViewDidEnter(){//Cada vez que entro a administración

    var chat = this.dbFirebase.getSpecificChat2(this.chatID);
    chat.on('value', snapshot => {
      console.log("QUE RECIBO CON EL ON: ", snapshot.val());
      this.chat = snapshot.val();
      //this.updateChat(snapshot.val());
      //updateStarCount(postElement, snapshot.val());
      console.log("CHATTTTTTTT", this.chat.active)
    });


    //Cargo los datos de la BBDD
    this.dbFirebase.getMessagesFromChat(this.chatID).subscribe(messages=>{
      this.messages = messages;
      // cuando recibo un mensaje nuevo hago scroll down
      this.scrollToBottom();
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
    this.dbFirebase.createChatMessage(this.chatID, message).then(res=>{
        console.log('mesaje creado');
        this.message.msg = null;
    })
  }

}
