import { Component, OnInit } from '@angular/core';
import { AuthenticatedService } from 'src/app/services/authenticated.service';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.css']
})
export class AuthenticatedComponent implements OnInit {

  constructor(private AuthenticatedService:AuthenticatedService) { }

  ngOnInit(): void {
  }
  putScheduleName(name:string, description:string, isPublic:string){
    if(isPublic.toLocaleLowerCase() != "YES"){
      isPublic = "False"
    }
    this.AuthenticatedService.putScheduleName(name, description, isPublic).subscribe(schedule => {
      console.log(schedule);
    });
  }

  deleteSchedule(deleteName:string){
    this.AuthenticatedService.deleteSchedule(deleteName).subscribe(schedule => {
      console.log(schedule);
    });
  }

}