
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private LoginService:LoginService) { }
  
  ngOnInit(): void {
  }
  login(email:string, password:string){
  
    this.LoginService.login(email, password).subscribe(access=> {
      console.log(access)
    });
  }
}
