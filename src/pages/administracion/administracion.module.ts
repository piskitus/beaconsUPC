import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdministracionPage } from './administracion';

@NgModule({
  declarations: [
    AdministracionPage,
  ],
  imports: [
    IonicPageModule.forChild(AdministracionPage),
  ],
})
export class AdministracionPageModule {}
