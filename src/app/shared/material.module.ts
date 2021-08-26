import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';



@NgModule({
    declarations: [],
    imports: [
        MatIconModule,
        MatInputModule
    ],
    exports:[ 
        MatIconModule,
        MatInputModule
    ]
  })
  export class MaterialModule { }