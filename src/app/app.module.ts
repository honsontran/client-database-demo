import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FIREBASE_CREDENTIALS } from './firebase.credentials';

import { AppComponent } from './app.component';
import { ClientSearchComponent } from './clients/client-search/client-search.component';
import { ClientsService } from './clients/shared/client.service';
import { ClientsComponent } from './clients/clients.component';
import { ClientComponent } from './clients/client/client.component';
import { ClientListComponent } from './clients/client-list/client-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ToastrModule} from 'ngx-toastr';
import { DashAllComponent } from './dashboard/dash-all/dash-all.component';
import { DashMonthlyComponent } from './dashboard/dash-monthly/dash-monthly.component';
import { DashDocumentsComponent } from './dashboard/dash-documents/dash-documents.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthService } from './core/auth.service';
import { AuthGuard } from './core/auth.guard';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { CaseloadComponent } from './caseload/caseload.component';

const routes: Routes = [
  { path: 'records', component: ClientsComponent, canActivate: [AuthGuard] },
  { path: 'caseload', component: CaseloadComponent},
  
  { path: '', component: DashboardComponent, children: [
    { path: '', component: DashAllComponent },
    { path: 'monthly', component: DashMonthlyComponent },
    { path: 'documents', component: DashDocumentsComponent }
  ]},
];

@NgModule({
  declarations: [
  AppComponent,
  ClientSearchComponent,
  ClientsComponent,
  ClientComponent,
  ClientListComponent,
  DashboardComponent,
  DashAllComponent,
  DashMonthlyComponent,
  DashDocumentsComponent,
  UserProfileComponent,
  CaseloadComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(FIREBASE_CREDENTIALS),
    AngularFireDatabaseModule,
    FormsModule,
    RouterModule,
    RouterModule.forRoot(routes),
    ToastrModule.forRoot()
  ],
  providers: [AuthGuard, ClientsService, AuthService, AngularFireAuth, AngularFirestore],
  bootstrap: [AppComponent]
})

export class AppModule {
  
  constructor(public afAuth: AngularFireAuth) {

  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
