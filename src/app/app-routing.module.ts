import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.resolver';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { AppComponent } from './app.component';
import { SignComponent } from './sign/sign.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'authCallback', component: AuthCallbackComponent },
  { path: 'sign', canActivate: [AuthGuard], component: SignComponent }, // this is protected by an Auth Guard.
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
