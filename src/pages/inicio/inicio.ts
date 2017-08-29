import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { BeaconProvider } from '../../providers/beacon/beacon';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {

  coords: any;
  nearBeaconMinor: number;
  cardInfoShow:boolean = true;//Card de información principal visible al entrar
  // userProfile: any;

  nearBeaconKey:any;
  newsID:any;
  news:any = {
    title: 'Bienvenido a BeaconsUPC',
    description: 'Si quieres puedes minimizarme, yo seguiré trabajando en secreto 😜 ',
    color: 'white'
  };



  nearBeacon: any = {
    minor: 0, //Plantilla que se muestra en la ventana principal
    title: 'hola',
    color: 'yellow',
    description: 'La magia está apunto de empezar',
    image: 'assets/img/logo_beaconsUPC.png'
  }

  beaconsInfo = [
  {
    minor: 0,
    title: 'hola',
    color: 'yellow',
    description: 'La magia está apunto de empezar',
    image: 'assets/img/logo_beaconsUPC.png'
  },
  {
    minor: 1,
    title: "Lorem ipsum dolor sit amet, co",
    color: "orange",
    description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et ma",
    image: "assets/img/logo_beaconsUPC.png",
  },
  {
    minor: 2,
    title: "Habitación de Nerea",
    color: "yellow",
    description: "Has entrado a la habitación de Nerea, holi!",
    image: "assets/img/logo_beaconsUPC.png",
  },
  {
    minor: 3,
    title: "Habitación de Marc",
    color: "blue",
    description: "FUERA DE AQUÍ, esta es una zona restringida!",
    image: "assets/img/logo_beaconsUPC.png",
  },
  {
    minor: 4,
    title: "Comedor",
    color: "green",
    description: "Has entrado al comedor, bienvenido!",
    image: "assets/img/logo_beaconsUPC.png",
  },
  {
    minor: 5,
    title: "Cocina",
    color: "red",
    description: "Has entrado a la cocina, bienvenido!",
    image: "assets/img/logo_beaconsUPC.png",
  }
];

  constructor(public navCtrl: NavController, public navParams: NavParams, private diagnostic: Diagnostic,
    public platform: Platform, private locationAccuracy: LocationAccuracy, public dbFirebase :FirebaseDbProvider,
    public beaconProvider: BeaconProvider, private auth: AuthProvider) {

    platform.ready().then(() => {
      //Miro si la localización está activada
      this.isLocationEnabled();

      // setInterval(() => { //Para definir un intervalo
      //   this.nearBeaconKey = this.beaconProvider.getNearBeaconKey();
      //
      //   this.dbFirebase.getNewsId(this.nearBeaconKey).then((snapshot) => { //cojo de la base de datos el valor que hay en "news" para obtener el id de la noticia
      //     this.newsID = snapshot.val().news
      //   })
      //
      //   this.dbFirebase.getSpecificNews(this.newsID).then((snapshot)=>{
      //     this.news.title = snapshot.val().title;
      //     this.news.description = snapshot.val().description;
      //     this.news.color = snapshot.val().color;
      //   })
      //
      // }, 2500);//Cada 2,5 segundos

      // setInterval(() => { //Para definir un intervalo
      //   this.nearBeaconMinor = this.beaconProvider.getNearBeaconMinor();
      //   //console.log("NEAR BEACON MINOR", this.nearBeaconMinor);
      //   this.playWithNearestBeacon(this.nearBeaconMinor);
      // }, 2500);//Cada 2,5 segundos

    });

  }

  ionViewDidLoad() {
    console.log('➡️ InicioPage');

    // this.dbFirebase.getUserData(this.auth.getUser()).then((user)=>{
    //   //this.user = user;
    //   this.userProfile = user.val().profile;
    //
    // })

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

  ionViewDidEnter(){

    // this.dbFirebase.getAlgos().subscribe(algo=>{
    //   this.coords = algo;
    //   console.log("ALGO---> ", JSON.stringify(this.coords));
    // })
}

playWithNearestBeacon(minor){
  if(this.nearBeacon.minor != minor){
    this.nearBeacon = this.beaconsInfo[minor];
  }
}

//Me muevo de vista al hacer swipe (se debe añadir en el html la siguiente función dentro de los componentes en los que quiero que funcione el swipe: (swipe)="swipeEvent($event)")
swipeEvent(e) {
  if(e.direction == '2'){//Direction left
     this.navCtrl.parent.select(1);//Avisos
  }
  else if(e.direction == '4'){//direction right
     this.navCtrl.parent.select(4);//Ajustes
  }
}

closeCardInfo(){
  this.cardInfoShow = false;
}

}
