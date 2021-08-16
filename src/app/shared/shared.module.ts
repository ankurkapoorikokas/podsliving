import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FlexLayoutModule} from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class SharedModule { }
