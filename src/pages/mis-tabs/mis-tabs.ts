import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the MyTabsPage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */

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


  constructor(public navCtrl: NavController) {}

}
