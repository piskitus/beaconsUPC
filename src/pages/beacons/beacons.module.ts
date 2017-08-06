import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BeaconsPage } from './beacons';

@NgModule({
  declarations: [
    BeaconsPage,
  ],
  imports: [
    IonicPageModule.forChild(BeaconsPage),
  ],
})
export class BeaconsPageModule {}
