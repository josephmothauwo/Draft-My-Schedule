
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private LoginService:LoginService) { }
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
  
  
}
