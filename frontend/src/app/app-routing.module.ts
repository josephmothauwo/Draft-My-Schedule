import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ValidatedComponent } from './components/validated/validated.component';


const routes: Routes = [
  { path:  'register', component:  RegisterComponent},
  { path:  '', component:  LoginComponent},
  { path:  'validated', component:  ValidatedComponent},
  {path: '**', redirectTo: ""}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
