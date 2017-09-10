import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddClassPage } from './modal-add-class';

@NgModule({
  declarations: [
    ModalAddClassPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddClassPage),
  ],
})
export class ModalAddClassPageModule {}
