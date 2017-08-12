import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private diagnostic: Diagnostic,
    public platform: Platform, private locationAccuracy: LocationAccuracy) {

    platform.ready().then(() => {
      //Miro si la localización está activada
      this.isLocationEnabled();

    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioPage');

  }


  isLocationEnabled(){

    let successCallback = (isAvailable) => { console.log('Is available? ' + isAvailable);
                                            if (!isAvailable){//Si no lo tiene activado le pido que lo active
                                              this.activarUbicacion();
                                            }
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

}
