import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalLoadingPage } from './modal-loading';

@NgModule({
  declarations: [
    ModalLoadingPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalLoadingPage),
  ],
})
export class ModalLoadingPageModule {}
