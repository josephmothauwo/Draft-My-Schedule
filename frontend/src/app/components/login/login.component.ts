import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private LoginService:LoginService, private RegisterService:RegisterService) { }
  sentBack  = null
  ngOnInit(): void {
  }
  login(email:string, password:string){
  
    this.LoginService.login(email, password).subscribe(access=> {
      console.log(access)
      this.sentBack = access
      console.log(this.sentBack.message)
      if(this.sentBack.message == "not verified"){
        window.alert(this.sentBack.message)
      }
    });
  }

  validate(token:string){
    this.RegisterService.validate(token).subscribe(user=>{
      console.log(user)
    })
  }

}
