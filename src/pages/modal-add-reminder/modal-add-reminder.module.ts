import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddReminderPage } from './modal-add-reminder';

@NgModule({
  declarations: [
    ModalAddReminderPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddReminderPage),
  ],
})
export class ModalAddReminderPageModule {}
