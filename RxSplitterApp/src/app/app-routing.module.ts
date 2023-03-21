import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path:"",
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
    //loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path:"Home",
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path:"User",
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
