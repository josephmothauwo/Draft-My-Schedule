import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { RegisterService } from 'src/app/services/register.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private LoginService:LoginService, private RegisterService:RegisterService) { }
  sentBack  = null
  showMe = false
  token = null
  ngOnInit(): void {
  }
  login(email:string, password:string){
  
    this.LoginService.login(email, password).subscribe(access=> {
      // console.log(access)
      this.sentBack = access
      // console.log(this.sentBack)
      if(this.sentBack.message == "not verified"){
        window.alert("you are not verified")
      }
      else{
        console.log(this.sentBack.accesstoken)
        localStorage.setItem('currentToken', this.sentBack.accesstoken)
        console.log(localStorage.getItem('currentToken'))
        console.log(this.sentBack.user)
        if(this.sentBack.user.isAdmin){
          localStorage.setItem('admin', "YES")
        }
      }
    });
  }

  validate(token:string){
    this.RegisterService.validate(token).subscribe(user=>{
      // console.log(user)
    })
  }

  validateAgain(){
    this.showMe = true
    console.log(this.showMe)
  }

}
