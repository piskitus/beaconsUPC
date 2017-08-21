import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddNewsPage } from './modal-add-news';

@NgModule({
  declarations: [
    ModalAddNewsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddNewsPage),
  ],
})
export class ModalAddNewsPageModule {}
