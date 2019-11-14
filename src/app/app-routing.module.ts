import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.resolver';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { AppComponent } from './app.component';
import { SignComponent } from './sign/sign.component';


const routes: Routes = [
  { path: 'authCallback', component: AuthCallbackComponent },
  { path: 'sign', canActivate: [AuthGuard], component: SignComponent }, // this is protected by an Auth Guard.
  { path: '', component: AppComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
