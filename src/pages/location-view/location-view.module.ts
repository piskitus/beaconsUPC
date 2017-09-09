import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationViewPage } from './location-view';

@NgModule({
  declarations: [
    LocationViewPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationViewPage),
  ],
})
export class LocationViewPageModule {}
