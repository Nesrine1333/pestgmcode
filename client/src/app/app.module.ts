import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterProviderComponent } from './components/register-provider/register-provider.component';
import { UpdateProviderComponent } from './components/update-provider/update-provider.component';
import { BuyEnergyComponent } from './components/buy-energy/buy-energy.component';
import { ProviderInfoComponent } from './components/provider-info/provider-info.component';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BodyComponent } from './components/body/body.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    RegisterProviderComponent,
    UpdateProviderComponent,
    BuyEnergyComponent,
    ProviderInfoComponent,
    LoginComponent,
    SignupComponent,
    SidebarComponent,
    BodyComponent,
    DashboardComponent,
   
 
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
 
  
 
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
