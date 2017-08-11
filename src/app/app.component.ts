import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { IBeacon } from '@ionic-native/ibeacon';
import { BeaconProvider } from '../providers/beacon/beacon';

//import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any = HomePage; //Se escribe sin comillas si viene de un import
  rootPage:any = 'LoginPage';//si ponemos comillas no necesitamos importarlo, se carga utilizando lazy loaded

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private auth: AuthProvider,
    private ibeacon: IBeacon,
    private beaconProvider: BeaconProvider) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.auth.Session.subscribe(session=>{
        if(session){
            this.rootPage = 'MisTabsPage';
        }
          else{
            this.rootPage = 'LoginPage';
          }
      });

      statusBar.styleDefault();
      splashScreen.hide();
      //Enciendo bluetooth al abrir la aplicación
      this.ibeacon.enableBluetooth();

      //Arranco la búsqueda de beacons pasándole la Región a escanear el valor major y el valor minor
      //BeaconRegion(identifier, uuid, major, minor, notifyEntryStateOnDisplay)
      beaconProvider.start('Estimote','B9407F30-F5F8-466E-AFF9-25556B57FE6D');
    });
  }
}
