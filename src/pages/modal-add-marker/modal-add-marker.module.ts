import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddMarkerPage } from './modal-add-marker';

@NgModule({
  declarations: [
    ModalAddMarkerPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddMarkerPage),
  ],
})
export class ModalAddMarkerPageModule {}
