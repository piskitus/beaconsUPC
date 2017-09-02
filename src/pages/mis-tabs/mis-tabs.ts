import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-mis-tabs',
  templateUrl: 'mis-tabs.html'
})
export class MisTabsPage {

  inicioRoot = 'InicioPage'
  avisosRoot = 'AvisosPage'
  mapaRoot = 'MapaPage'
  beaconsRoot = 'BeaconsPage'
  configuracionRoot = 'ConfiguracionPage'


  constructor(public navCtrl: NavController) {

  }

}
