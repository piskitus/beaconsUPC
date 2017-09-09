import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsViewPage } from './news-view';

@NgModule({
  declarations: [
    NewsViewPage,
  ],
  imports: [
    IonicPageModule.forChild(NewsViewPage),
  ],
})
export class NewsViewPageModule {}
