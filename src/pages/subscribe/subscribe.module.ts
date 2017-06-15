import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app/shared/shared.module';
import { SubscribeComponent } from './subscribe-component/subscribe.component';

@NgModule({
  declarations: [
    SubscribeComponent
  ],
  imports: [
  	CommonModule,
  	SharedModule
  ],
  exports: [
    SubscribeComponent
  ],
  entryComponents:[
  	SubscribeComponent
  ]
})
export class SubscribeModule {}
