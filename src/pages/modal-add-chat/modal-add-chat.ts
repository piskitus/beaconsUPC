import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';


@IonicPage()
@Component({
  selector: 'page-modal-add-chat',
  templateUrl: 'modal-add-chat.html',
})
export class ModalAddChatPage {

  chat:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider,
              public alertCtrl : AlertController) {
      this.chat = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAddChatPage');
  }

  cerrarModal(){
    this.viewCtrl.dismiss();
  }

  crearChat(){
    let chat = {
      title: this.chat.title,
      description: this.chat.description,
      active: this.chat.active
    }
    this.dbFirebase.createChat(chat).then(res=>{
        console.log('Chat creado en firebase');
        this.cerrarModal();
    })
  }

  guardarChat(){
    let chat = {
      id: this.chat.id,
      title: this.chat.title,
      description: this.chat.description,
      active: this.chat.active
    }
    this.dbFirebase.updateChat(chat).then(res=>{
    console.log('Chat modificado en firebase');
    this.cerrarModal();
    })
  }

  borrarChat(id){
    let alert = this.alertCtrl.create({
      title: '¿Estás seguro?',
      message: 'Se perderán todos los mensajes del chat',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Ha respondido que no así que no hacemos nada
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
               // AquÍ borramos la noticia de la base de datos
               this.dbFirebase.deleteChat(id);
               this.cerrarModal();

           }
        }
      ]
    });

    alert.present();
  }



}
