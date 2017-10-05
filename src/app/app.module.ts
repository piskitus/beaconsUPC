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
import { Geofence } from '@ionic-native/geofence';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';


import { MyApp } from './app.component';
import { AuthProvider } from '../providers/auth/auth';
import { BeaconProvider } from '../providers/beacon/beacon';
import { FirebaseDbProvider } from '../providers/firebase-db/firebase-db';
import { SettingsProvider } from '../providers/settings/settings';

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
    IonicModule.forRoot(MyApp,{
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ],
      monthShortNames: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      dayNames: ['domingo','lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado' ],
      dayShortNames: ['dom','lun', 'mar', 'mié', 'jue', 'vie', 'sab'],
    }),
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
    LocationAccuracy,
    FirebaseDbProvider,
    Geofence,
    FirebaseAnalytics,
    InAppBrowser,
    SettingsProvider
  ]
})
export class AppModule {}
