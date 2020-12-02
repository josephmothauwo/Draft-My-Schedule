import { Component, OnInit } from '@angular/core';
import { RegisterService } from 'src/app/services/register.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private RegisterService:RegisterService) { }
  validateToken = null
  ngOnInit(): void {
  }
  register(email:string, username: string, password:string){
    
    this.RegisterService.register(email, username, password).subscribe(token=> {
      console.log(token)
      this.validateToken= token.url
    });
  }

  validate(token:string){
    this.RegisterService.validate(token).subscribe(user=>{
      console.log(user)
    })
  }

}
