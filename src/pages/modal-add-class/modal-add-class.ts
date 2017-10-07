import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular'
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { SettingsProvider } from '../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-modal-add-class',
  templateUrl: 'modal-add-class.html',
})
export class ModalAddClassPage {

  clase:any;
  subjects:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider,
              public alertCtrl : AlertController, public toastCtrl: ToastController, public settingsProvider: SettingsProvider) {
    this.clase = this.navParams.data;
  }

  ionViewDidLoad() {

    this.settingsProvider.showToast('HOLA', 1000, 'info', false);


    console.log('ionViewDidLoad ModalAddClassPage');

    this.dbFirebase.getUserSubjects().subscribe(subjects=>{
      this.subjects = subjects;
      //console.log("subjects: ", subjects)
    })

  }

  cerrarModal(){
    this.viewCtrl.dismiss();
  }


  newSubject() {
  let alert = this.alertCtrl.create({
    title: 'Añadir asignatura',
    // message: 'Introduce el nombre y las siglas de la asignatura que quieres crear',
    inputs: [
      {
        name: 'acronym',
        placeholder: 'Nombre corto (obligatorio): CAL'
      },
      {
        name: 'name',
        placeholder: 'Nombre largo (opcional): Cálculo'
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: data => {
          //console.log('Cancel clicked');
        }
      },
      {
        text: 'Crear',
        handler: data => {
          let subject = {
            name: data.name,
            acronym: data.acronym
          }
          // compruebo los campos (el acronym es obligatorio y no puede ser más largo de 6 caracteres)
          if (subject.acronym != '') {
            if(subject.name == ''){// si no han puesto nombre largo lo pongo en null para que no se guarde en la bbdd
              subject.name = null;
            }else{}
            if(subject.acronym.length <= 7){
              console.log("TODO OK", subject.acronym)
              this.dbFirebase.createSubject(subject);// añado la asignatura a la base de datos
            }
            else{
              this.settingsProvider.showToast('Nombre corto demasiado largo (max 7 caracteres)', 2000, 'error', false)
              return false;
              //acronyme demasiado largo
            }
          } else {
            this.settingsProvider.showToast('Campos incompletos', 2000, 'error', false)
            console.log("ACRONYM ES NULL")
            // campos incompletos
            return false;
          }

        }
      }
    ]
  });
  alert.present();
}


deleteSubjects() {
    let alert = this.alertCtrl.create();
    alert.setTitle('¿Qué asignaturas quieres eliminar?');
    alert.setSubTitle('No se borrarán las clases que estén creadas con las asignaturas que borres')

    // listo las asignaturas a escojer
    for(let i=0; i<this.subjects.length; i++){
      alert.addInput({
          type: 'checkbox',
          label: this.subjects[i].acronym+' - '+this.subjects[i].name,
          value: this.subjects[i].acronym,
      });
    }

    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Eliminar',
      handler: (data: any) => {
          //console.log('Checkbox data:', data);

          // cojo los acronimos seleccionados por el usuario y los elimino
          for(let i=0; i<data.length;i++){
            this.dbFirebase.deleteSubject(data[i]);
          }
      }
    });

    alert.present();
  }


  crearClase(){
    let clase = {
      subject: this.clase.subject,
      day: this.clase.day,
      startTime: this.clase.startTime,
      classroom: this.clase.classroom,
      building: this.clase.building,
      obs: this.clase.obs
    }

    // validación
    if(clase.subject != 'null'){// elegir asignatura
      if(clase.classroom != null){// rellenar número aula
        this.dbFirebase.createClass(clase).then(res=>{
            console.log('Clase guardada en firebase:');
            this.settingsProvider.showToast('Clase creada correctamente', 2000, 'success', false)
            this.cerrarModal();
        })
      }else{this.settingsProvider.showToast('Debes definir un número de aula', 2000, 'error', false)}
    }else{this.settingsProvider.showToast('Debes seleccionar una asignatura', 2000, 'error', false)}

  }

  actualizarClase(){
    let clase = {
      id: this.clase.id,
      subject: this.clase.subject,
      day: this.clase.day,
      startTime: this.clase.startTime,
      classroom: this.clase.classroom,
      building: this.clase.building,
      obs: this.clase.obs
    }

    // validación
    if(clase.subject != 'null'){// elegir asignatura
      if(clase.classroom != null){// rellenar número aula
        this.dbFirebase.updateClass(clase).then(res=>{
            console.log('Clase guardada en firebase:');
            this.settingsProvider.showToast('Clase actualizada correctamente', 2000, 'success', false)
            this.cerrarModal();
        })
      }else{this.settingsProvider.showToast('Debes definir un número de aula', 2000, 'error', false)}
    }else{this.settingsProvider.showToast('Debes seleccionar una asignatura', 2000, 'error', false)}

  }

  borrarClase(dia, id){
    let alert = this.alertCtrl.create({
      title: '¿Estás segur@?',
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
               // AquÍ borramos la clase de la base de datos
               this.dbFirebase.deleteClass(dia, id);
               this.settingsProvider.showToast('Clase eliminada correctamente', 2000, 'success', false)
               this.cerrarModal();
           }
        }
      ]
    });

    alert.present();
  }

  showToast(message:string, duration:number, color:string) {
      let toast = this.toastCtrl.create({
        message: message,
        position: 'top',
        duration: duration,
        // showCloseButton: true,
        // closeButtonText: 'x',
        cssClass: color
      });
      toast.present();
    }

}
