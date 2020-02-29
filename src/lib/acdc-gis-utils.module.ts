import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { AcdcGisUtilsComponent } from './acdc-gis-utils.component';
import { LocationPickerInputComponent } from './location-picker-input/location-picker-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [AcdcGisUtilsComponent, LocationPickerInputComponent],
  exports: [
    AcdcGisUtilsComponent,
    LocationPickerInputComponent
  ]
})
export class AcdcGisUtilsModule { }
