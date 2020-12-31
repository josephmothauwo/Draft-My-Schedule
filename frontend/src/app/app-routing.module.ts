import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ValidatedUserComponent } from './components/validated-user/validated-user.component';
import { ValidatedComponent } from './components/validated/validated.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AuthenticatedComponent } from './components/authenticated/authenticated.component';



const routes: Routes = [
  { path:  'register', component:  RegisterComponent},
  { path:  'login', component:  LoginComponent},
  { path:  '', component:  HomepageComponent},
  { path:  'validated', component:  ValidatedComponent},
  { path:  'validatedUser', component:  ValidatedUserComponent},
  { path:  'authenticated', component:  AuthenticatedComponent},
  {path: '**', redirectTo: ""}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
