import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular'
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@IonicPage()
@Component({
  selector: 'page-modal-add-class',
  templateUrl: 'modal-add-class.html',
})
export class ModalAddClassPage {

  clase:any;
  subjects:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider,
              public alertCtrl : AlertController, public toastCtrl: ToastController) {
    this.clase = this.navParams.data;
  }

  ionViewDidLoad() {
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
    message: 'Introduce el nombre y las siglas de la asignatura que quieres crear',
    inputs: [
      {
        name: 'name',
        placeholder: 'Nombre: Cálculo'
      },
      {
        name: 'acronym',
        placeholder: 'Siglas o diminutivo: CAL'
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
          // añado asignatura a la base de datos


          //TODO: validar que no hayan campos vacíos y que el acrónimo no tenga espacios

          if (subject.acronym != '' && subject.name != '') {
            if(subject.acronym.length <= 8){
              console.log("TODO OK", subject.acronym)
              this.dbFirebase.createSubject(subject);
            }
            else{
              this.showToast('🔴 Diminutivo demasiado largo 🔴', 2000)
              return false;
              //acronyme demasiado largo
            }
          } else {
            this.showToast('🔴 Campos incompletos 🔴', 2000)
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
            this.cerrarModal();
        })
      }else{this.showToast('🔴 Debes definir un número de aula 🔴', 2000)}
    }else{this.showToast('🔴 Debes seleccionar una asignatura 🔴', 2000)}



  }

  showToast(message:string, duration:number) {
      let toast = this.toastCtrl.create({
        message: message,
        position: 'top',
        duration: duration,
        dismissOnPageChange: true,
        cssClass: "toastCSS"
      });
      toast.present();
    }

}
