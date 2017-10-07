import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { ToastController } from 'ionic-angular'


@Injectable()
export class SettingsProvider {

  constructor(private diagnostic: Diagnostic, private locationAccuracy: LocationAccuracy, public toastCtrl: ToastController) {
    console.log('Hello SettingsProvider Provider');
  }


// verificar ubicación y solicitar activación en caso de que no esté
  isLocationEnabled(){
    let successCallback = (isAvailable) => { // si no lo tiene activado le pido que lo active
                                              if (!isAvailable){this.activarUbicacion();}
                                           };
    let errorCallback = (e) => console.error(e);

    this.diagnostic.isLocationAvailable().then(successCallback).catch(errorCallback);
  }

  activarUbicacion(){ //Función para solicitar la activación de la ubicación
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {//El usuario acepta
            console.log('Request successful')
            //El usuario acepta
          },
          error => {//El usuario no acepta
            console.log('Error requesting location permissions', error)
            alert("Algunas de las funcionalidades de la aplicación no funcionarán, puedes activar los permisos en el apartado de configuración.");
          }
        );
      }
    });
  }

// TOAST genérico
showToast(message:string, duration:number, color:string, close:boolean) {
    let toast = this.toastCtrl.create({
      message: message,
      position: 'top',
      duration: duration,
      showCloseButton: close,
      closeButtonText: 'x',
      cssClass: color
    });
    toast.present();
  }

}
