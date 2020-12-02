import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private LoginService:LoginService) { }
  
  ngOnInit(): void {
  }
  login(email:string, password:string){
  
    this.LoginService.login(email, password).subscribe(access=> {
      console.log(access)
    });
  }

}
