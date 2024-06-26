import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyEnergyComponent } from './components/buy-energy/buy-energy.component';
import { ProviderInfoComponent } from './components/provider-info/provider-info.component';
import { RegisterProviderComponent } from './components/register-provider/register-provider.component';
import { UpdateProviderComponent } from './components/update-provider/update-provider.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'register-provider', component: RegisterProviderComponent },
  { path: 'update-provider', component: UpdateProviderComponent },
  {
    path:'dashboard',component:DashboardComponent
  },
  { path: 'buy-energy', component: BuyEnergyComponent },
  { path: 'provider-info', component: ProviderInfoComponent }
  ,{ path: 'signup', component: SignupComponent }
  ,  { path: 'login', component: LoginComponent }, 
  {path:'' ,redirectTo:'login',pathMatch:'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
