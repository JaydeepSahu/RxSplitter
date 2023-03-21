import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';
import { TokenCheckGuard } from '../services/token-check.guard';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  
  {
    path:"",    
    component:LoginComponent
  },
  {
    path:"Login/:token",
    component:LoginComponent
  },
  {
    path:"forgetPassword",
    component: ForgetPasswordComponent
  },
  {
    path:"resetPassword",
    component: ResetPasswordComponent,
    canActivate:[AuthGuardService]
  },
  {
    path:"resetPassword/:token",
    component: ResetPasswordComponent,
    canActivate:[TokenCheckGuard]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
