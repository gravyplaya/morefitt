import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app/shared/shared.module';
import { TrifectaComponent } from './trifecta-component/trifecta.component';

@NgModule({
  declarations: [
    TrifectaComponent
  ],
  imports: [
  	CommonModule,
  	SharedModule
  ],
  exports: [
    TrifectaComponent
  ],
  entryComponents:[
  	TrifectaComponent
  ]
})
export class TrifectaModule {}
