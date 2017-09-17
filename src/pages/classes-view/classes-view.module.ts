import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClassesViewPage } from './classes-view';

@NgModule({
  declarations: [
    ClassesViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ClassesViewPage),
  ],
})
export class ClassesViewPageModule {}
