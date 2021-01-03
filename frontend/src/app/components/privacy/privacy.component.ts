import { Component, OnInit } from '@angular/core';
import { PrivacyService } from 'src/app/services/privacy.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  constructor(private PrivacyService: PrivacyService) { }
  privacy = null
  DMCA = null;
  aup = null
  admin = null
  ngOnInit(): void {
    this.admin = localStorage.getItem("admin")
    this.init()
  }
  init(){
    console.log("hello")
    this.PrivacyService.getPolicies().subscribe(policies => {
      for(let i = 0; i < policies.length; i++){
        if(policies[i].policyName.toUpperCase() == "SECURITY")  this.privacy = policies[i].policy
        if(policies[i].policyName.toUpperCase() == "DMCA")  this.DMCA = policies[i].policy
        if(policies[i].policyName.toUpperCase() == "AUP")  this.aup = policies[i].policy
      }
    });
  }
}
