import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';

import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
const routes :Routes = [
    { path: '', loadChildren: ()=>  HomeModule}
    
]
@NgModule({
    declarations: [],
    imports:[CommonModule,
    RouterModule.forRoot(routes)
    ],
    exports:[RouterModule]

})

export class AppRoutingModule{}