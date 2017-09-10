import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular'
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@IonicPage()
@Component({
  selector: 'page-modal-add-class',
  templateUrl: 'modal-add-class.html',
})
export class ModalAddClassPage {

  class:any;
  subjects:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private dbFirebase :FirebaseDbProvider,
              public alertCtrl : AlertController) {
    this.class = this.navParams.data;
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
          this.dbFirebase.createSubject(subject);

          //TODO: validar que no hayan campos vacíos y que el acrónimo no tenga espacios

          // if (User.isValid(data.username, data.password)) {
          //   // logged in!
          // } else {
          //   // invalid login
          //   return false;
          // }

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

}
