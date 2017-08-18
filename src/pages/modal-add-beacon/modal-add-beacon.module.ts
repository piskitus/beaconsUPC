import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddBeaconPage } from './modal-add-beacon';

@NgModule({
  declarations: [
    ModalAddBeaconPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddBeaconPage),
  ],
})
export class ModalAddBeaconPageModule {}
