import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddChatPage } from './modal-add-chat';

@NgModule({
  declarations: [
    ModalAddChatPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddChatPage),
  ],
})
export class ModalAddChatPageModule {}
