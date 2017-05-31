import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app/shared/shared.module';
import { MfminComponent } from './mfmin-component/mfmin.component';

@NgModule({
  declarations: [
    MfminComponent
  ],
  imports: [
  	CommonModule,
  	SharedModule
  ],
  exports: [
    MfminComponent
  ],
  entryComponents:[
    MfminComponent
  ]
})
export class MfminModule {}
