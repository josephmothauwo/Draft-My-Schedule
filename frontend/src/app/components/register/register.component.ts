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
    console.log("hey")
    window.alert("hey")
    // this.RegisterService.register(email, username, password).subscribe(token=> {
    //   window.alert("hey")
    //   // console.log(token["url"])
    //   // this.validateToken = token.url
    //   // console.log("hey")
    // });
  }

  validate(token:string){
    // console.log("hey")
    this.RegisterService.validate(token).subscribe(user=>{
      console.log(user)
    })
  }

}
