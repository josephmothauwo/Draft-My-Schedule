import { Component, OnInit } from '@angular/core';
import { RegisterService } from 'src/app/services/register.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private RegisterService:RegisterService) { }

  ngOnInit(): void {
  }
  register(email:string, username: string, password:string){
    
    this.RegisterService.register(email, username, password).subscribe(access=> {
      console.log(access)
    });
  }

}
