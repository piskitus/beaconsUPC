import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController,AlertController } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@IonicPage()
@Component({
  selector: 'page-administracion',
  templateUrl: 'administracion.html',
})
export class AdministracionPage {

  segment:string = "beacons";//Segmento por defecto
  noticias:any;
  beacons:any;
  markers:any;
  chats:any;
  users:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController,
              public dbFirebase :FirebaseDbProvider, public modalCtrl : ModalController, public alertCtrl : AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdministracionPage');
  }

  ionViewDidEnter(){//Cada vez que entro a administración
    //Cargo los datos de la BBDD
    this.dbFirebase.getNews().subscribe(noticias=>{
      this.noticias = noticias;
    })
    this.dbFirebase.getBeacons().subscribe(beacons=>{
      this.beacons = beacons;
    })
    this.dbFirebase.getMarkers().subscribe(markers=>{
      this.markers = markers;
    })
    this.dbFirebase.getChats().subscribe(chats=>{
      this.chats = chats;
    })
    this.dbFirebase.getUsers().subscribe(users=>{
      this.users = users;
    })

  }

  cerrarPaginaAdministracion(){
    this.viewCtrl.dismiss();
  }

  muestraNoticia(noticia){
  // aquí vamos a abrir el modal para añadir nuestro sitio.
   let modalNews = this.modalCtrl.create( 'ModalAddNewsPage', noticia);
   modalNews.present();
  }

  muestraBeacon(beacon){
    let modalBeacon = this.modalCtrl.create( 'ModalAddBeaconPage', beacon);
    modalBeacon.present();
  }

  muestraMarcador(marker){
   let modalMarker = this.modalCtrl.create( 'ModalAddMarkerPage', marker);
   modalMarker.present();
  }

  muestraChat(chat){
   let modal = this.modalCtrl.create( 'ModalAddChatPage', chat);
   modal.present();
  }


  borrarNoticia(id){
    let alert = this.alertCtrl.create({
      title: '¿Estás seguro?',
      message: 'Una vez borrada ya no se podrá recuperar',
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
               this.dbFirebase.deleteNews(id);
           }
        }
      ]
    });
    alert.present();
  }

  borrarBeacon(key){
    let alert = this.alertCtrl.create({
      title: '¿Estás seguro?',
      message: 'Una vez borrado ya no se podrá recuperar',
      buttons: [
        {
          text: 'Aceptar',
          role: 'cancel',
          handler: () => {
            // Ha respondido que no así que no hacemos nada
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
               // AquÍ borramos la noticia de la base de datos
               this.dbFirebase.deleteBeacon(key);
           }
        }
      ]
    });
    alert.present();
  }

  borrarMarcador(id){
    let alert = this.alertCtrl.create({
      title: '¿Estás seguro?',
      message: 'Una vez borrado ya no se podrá recuperar',
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
               this.dbFirebase.deleteMarker(id);
           }
        }
      ]
    });
    alert.present();
  }


  borrarUsuarioBBDD(key){
    let alert = this.alertCtrl.create({
      title: '¿Estás seguro?',
      message: 'Solo se borrará el usuario de la base de datos. Para borrar el usuario del sistema contacta con el administrador principal',
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
               this.dbFirebase.deleteUser(key);
           }
        }
      ]
    });
    alert.present();
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
           }
        }
      ]
    });
    alert.present();
  }

  borrarMensajesChat(id){
    let alert = this.alertCtrl.create({
      title: '¿Estás seguro?',
      message: 'Se borrarán todos los mensajes del chat y no se podrán recuperar',
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
               this.dbFirebase.deleteChatMessages(id);
           }
        }
      ]
    });
    alert.present();
  }

  hacerUsuarioAdministrador(userKey){
    let user:any= {
      password: userKey,
      admin: true
    }
    this.dbFirebase.updateUser(user);
  }

  eliminarUsuarioAdministrador(userKey){
    let user:any= {
      password: userKey,
      admin: false
    }
    this.dbFirebase.updateUser(user);
  }

  ponerChatActivo(id){
    let chat:any= {
      id: id,
      active: true
    }
    this.dbFirebase.updateChat(chat);
  }

  ponerChatInactivo(id){
    let chat:any= {
      id: id,
      active: false
    }
    this.dbFirebase.updateChat(chat);
  }





  //MODALES QUE SE ABREN AL HACER CLICK EN LOS BOTONES DEL FAB
  nuevaNoticia(){
  let tzoffset = (new Date()).getTimezoneOffset() * 60000;

  let newsDefault:any = {
    color:'gainsboro',
    startNews:(new Date(Date.now() - tzoffset)).toISOString().slice(0,-1),//Hora por defecto la actual
    url: '',
    marker: 'null'
    }
    let modalNoticia = this.modalCtrl.create( 'ModalAddNewsPage', newsDefault);
    modalNoticia.present();
  }

  nuevoBeacon(){
   let modalBeacon = this.modalCtrl.create( 'ModalAddBeaconPage'/*, Aquí puede ir info*/);
   modalBeacon.present();
  }

  nuevoMarcador(){
   let modalMarcador = this.modalCtrl.create( 'ModalAddMarkerPage'/*, Aquí puede ir info*/);
   modalMarcador.present();
  }

  nuevoChat(){
    let chat:any = {
      active: true
    }
   let modal = this.modalCtrl.create( 'ModalAddChatPage', chat);
   modal.present();
  }

}
