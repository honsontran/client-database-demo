import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth.service';
import { AngularFireAuthModule } from 'angularfire2/auth';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule
  ],
  providers: [AuthService],
  declarations: []
})
export class CoreModule { }
