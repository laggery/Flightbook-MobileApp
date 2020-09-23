import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoursFormatPipe } from './hours-format/hours-format.pipe';

@NgModule({
  declarations: [HoursFormatPipe],
  imports: [
    CommonModule
  ],
  exports: [
    HoursFormatPipe
  ]
})
export class ApplicationPipesModule { }
