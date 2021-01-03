import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private AdminService: AdminService) { }

  ngOnInit(): void {
  }
  givePriveleges(email:string){
    this.AdminService.givePriveleges(email).subscribe(user => {
      console.log(user)
    });
  }


}
