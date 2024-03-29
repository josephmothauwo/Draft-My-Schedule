import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private AdminService: AdminService) { }
  admin = null
  ngOnInit(): void {
    this.admin = localStorage.getItem("admin")
  }
  givePriveleges(email:string){
    this.AdminService.givePriveleges(email).subscribe(user => {
      console.log(user)
    });
  }
  hideReview(email:string){
    this.AdminService.hideReview(email).subscribe(review => {
      console.log(review)
    });
  }
  showReview(id:string){
    this.AdminService.showReview(id).subscribe(review => {
      console.log(review)
    });
  }
  decactivateUser(email:string){
    this.AdminService.deactivateUser(email).subscribe(review => {
      console.log(review)
    });
  }
  reactivateUser(email:string){
    this.AdminService.reactivateUser(email).subscribe(review => {
      console.log(review)
    });
  }
  updatePolicy(policy:string, policyName: string){
    console.log(policyName)
    this.AdminService.updatePolicy(policy, policyName).subscribe(policy => {
      console.log(policy)
    });
  }


}
