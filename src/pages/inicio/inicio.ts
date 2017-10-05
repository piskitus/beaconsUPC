import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { BeaconProvider } from '../../providers/beacon/beacon';
import { AuthProvider } from '../../providers/auth/auth';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SettingsProvider } from '../../providers/settings/settings';


@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {

  //chat:any;
  //coords: any;
  //nearBeaconMinor: number;
  cardInfoShow:boolean = false;//Card de información principal visible al entrar
  // userProfile: any;

  nearBeaconKey:any = null;
  newsID:any = null;

  news:any = { //Vista por defecto
    title: 'Bienvenido a BeaconsUPC',
    description: 'En esta vista irán apareciendo las noticias asociadas al beacon más cercano en el que te encuentres 😜 ',
    color: 'white',
    marker: 'null'
    //url: 'https://github.com/piskitus/beaconsUPC/blob/master/README.md'
  };


  constructor(public navCtrl: NavController, public navParams: NavParams, private diagnostic: Diagnostic,
    public platform: Platform, private locationAccuracy: LocationAccuracy, public dbFirebase :FirebaseDbProvider,
    public beaconProvider: BeaconProvider, private auth: AuthProvider, private iab: InAppBrowser, public settingsProvider: SettingsProvider) {



    platform.ready().then(() => {
      //Miro si la localización está activada
      this.settingsProvider.isLocationEnabled();

      //TODO: que si salgo de la región me vuelva a mostrar la card principal

      setInterval(() => { //Para definir un intervalo
        //Miro si tengo que notificar una clase
        this.beaconProvider.classesDisplayNotifications();

        //Miro si hay un beacon cercano
        let nearBeaconKey = this.beaconProvider.getNearBeaconKey();

        if(nearBeaconKey != null && (nearBeaconKey != this.nearBeaconKey)){//Compruebo que no sean iguales para entrar (xq si son el mismo no necesito actualizar la noticia)
          console.log("💚LOS BEACONSKEY SON DIFERENTES")
          this.nearBeaconKey = nearBeaconKey;

          if(this.nearBeaconKey != null){//Busco la noticia asociada al beacon
            console.log("💚Entro al bucle xq detecto nearBeaconKey", this.nearBeaconKey)
            this.dbFirebase.getNewsId(this.nearBeaconKey).then((snapshot) => { //cojo de la base de datos el valor que hay en "news" para obtener el id de la noticia
              //console.log("news snapshot", snapshot.val().news)
              let newsID = snapshot.val().news
              //console.log("this.newsID", this.newsID)

              if(newsID != null && (newsID != this.newsID)){//Cojo la noticia de la base de datos y le actualizo los campos (compruebo que la noticia sea diferente xq puede ser que muchos beacons tengan la misma y así me ahorro un acceso a la bbdd)
                this.newsID = newsID;
                console.log("💚Entro a newsID", this.newsID)
                this.dbFirebase.getSpecificNews(this.newsID).then((snapshot)=>{
                  this.news.title = snapshot.val().title;
                  this.news.description = snapshot.val().description;
                  this.news.color = snapshot.val().color;
                  this.news.id = snapshot.val().id;
                  this.news.url = snapshot.val().url;
                  this.news.startNews = snapshot.val().startNews;
                  this.news.marker = snapshot.val().marker;
                  this.news.saveTime = Date.now(); //timestamp del momento en el que el usuario guardó la noticia para luego poder ordenarla en la vista
                  //console.log("DATAAAAAA:", this.news.title, this.news.description, this.news.color)
                })
              }
            })
          }
        }
      }, 2000);//Cada 2 segundos

    });//Cierro platformReady

  }

  ionViewDidLoad() {
    console.log('➡️ InicioPage');
  }


  ionViewDidEnter(){

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

//Cierro la card informativa
closeCardInfo(){
  this.cardInfoShow = false;
}

saveUserNews(){
  this.dbFirebase.saveUserNews(this.news).then(res=>{
          console.log('💛💛Noticia guardada correctamente en la pestaña de avisos');
      })
}

openNewsMarkerInMapButton(marker){
  this.navCtrl.push('MapaPage', {
      id: "123",
      name: "Carl"
    });
}

openURL(newsURL){

  const browser = this.iab.create(newsURL, '_self','location=no,zoom=no' );

}

}
