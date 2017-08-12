import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { IBeacon } from '@ionic-native/ibeacon';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';


import { MyApp } from './app.component';
import { AuthProvider } from '../providers/auth/auth';
import { BeaconProvider } from '../providers/beacon/beacon';

export const firebaseConfig = {
  apiKey: "AIzaSyCZWjxucxAMcoJOmkF5xLGxol4NjQRNels",
  authDomain: "beaconsupc.firebaseapp.com",
  databaseURL: "https://beaconsupc.firebaseio.com",
  projectId: "beaconsupc",
  storageBucket: "",
  messagingSenderId: "837769766760"
};

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '1a910b3b'
  },
  'push': {
    'sender_id': '837769766760',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    AuthProvider,
    BeaconProvider,
    IBeacon,
    LocalNotifications,
    Diagnostic,
    LocationAccuracy
  ]
})
export class AppModule {}
