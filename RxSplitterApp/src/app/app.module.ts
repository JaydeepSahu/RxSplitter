import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { ForgetPasswordComponent } from './home/forget-password/forget-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeModule } from './home/home.module';
import { HashLocationStrategy,LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerComponent } from './spinner/spinner.component'
import { LoadingInterceptor } from './loading.interceptor';       
// import {MatCardModule, MatIconModule,MatInputModule,MatListModule,MatMenuModule,MatPaginatorModule,MatProgressBarModule,MatSortModule,MatStepperModule,MatTableModule, MatTabsModule,MatToolbarModule} from '@angular/material';   
@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    // ToPositiveAmountPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    UserModule,
    HomeModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{provide:LocationStrategy,useClass:HashLocationStrategy},
    {
      provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
