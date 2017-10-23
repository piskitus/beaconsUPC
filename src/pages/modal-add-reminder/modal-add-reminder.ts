import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular'
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { SettingsProvider } from '../../providers/settings/settings';


@IonicPage()
@Component({
  selector: 'page-modal-add-reminder',
  templateUrl: 'modal-add-reminder.html',
})
export class ModalAddReminderPage {

  reminder: any;
  cardInfoShow:boolean=true; //card de información
  cardInfoShow2:boolean=true; //card de información

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider,
              public alertCtrl : AlertController, public settingsProvider: SettingsProvider) {
    this.reminder = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAddReminderPage');

  }

  cerrarModal(){
    this.viewCtrl.dismiss();
  }

  crearRecordatorio(){
    let reminder = {
      title: this.reminder.title,
      description: this.reminder.description,
      when: this.reminder.when,
      period: this.reminder.period,
      time: Date.now() - 28800000 //Le creo un time (milisegundos) y le resto 8horas para que ya pueda empezar a funcionar pasando el filtro del controller
    }

    if(this.reminderValidation(reminder)){
      this.dbFirebase.saveReminder(reminder).then(res=>{
        this.settingsProvider.showToast('Recordatorio creado', 2000, 'success', false)
        this.cerrarModal();
    })
    }
  }

  guardarRecordatorio(){
    let reminder = {
      id: this.reminder.id,
      title: this.reminder.title,
      description: this.reminder.description,
      when: this.reminder.when,
      period: this.reminder.period,
    }
    if(this.reminderValidation(reminder)){
      this.dbFirebase.updateReminder(reminder).then(res=>{
        console.log('Recordatorio modificada en firebase');
        this.settingsProvider.showToast('Recordatorio actualizado', 2000, 'success', false)        
        this.cerrarModal();
        })
    }
  }

  borrarRecordatorio(id){
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
               // AquÍ borramos de la base de datos
               this.dbFirebase.deleteUserReminder(id);
               this.settingsProvider.showToast('Recordatorio eliminado', 2000, 'success', false)
               
               this.cerrarModal();

           }
        }
      ]
    });

    alert.present();
  }

  closeCardInfo(){
    this.cardInfoShow = false;
  }

  closeCardInfo2(){
    this.cardInfoShow2 = false;
  }

  // validación de los campos 
  reminderValidation(reminder:any){
    if(reminder.title != '' && reminder.description != ''){
        return true;
    }else{this.settingsProvider.showToast('Campos incompletos', 2000, 'error', false); return false;}
  }

}
