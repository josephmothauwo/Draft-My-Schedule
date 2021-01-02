import { Component, OnInit } from '@angular/core';
import { AuthenticatedService } from 'src/app/services/authenticated.service';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.css']
})
export class AuthenticatedComponent implements OnInit {
  scheduleSummary : string[]
  confirmDeleteTrigger = false
  confirmReviewTrigger = false
  constructor(private AuthenticatedService:AuthenticatedService) { }

  ngOnInit(): void {
  }
  putScheduleName(name:string, description:string, isPublic:string){
    if(isPublic.toLocaleUpperCase() != "YES"){
      isPublic = "False"
    }
    console.log(isPublic)
    this.AuthenticatedService.putScheduleName(name, description, isPublic,localStorage.getItem('currentToken')).subscribe(schedule => {
      console.log(schedule);
    });
  }
  deleteSchedule(deleteName:string){
    this.AuthenticatedService.deleteSchedule(deleteName).subscribe(schedule => {
      console.log(schedule);
    });
    this.confirmDeleteTrigger = false
  }
  confirmDelete(){
    this.confirmDeleteTrigger = true
  }
  declineDelete(){
    this.confirmDeleteTrigger = false
  }
  getAllSchedules(){
    this.AuthenticatedService.getallSchedules(localStorage.getItem('currentToken')).subscribe(schedule => {
      this.scheduleSummary = schedule
    });
  }
  resetSummary(){
    this.scheduleSummary = []
  }
  editSchedule(name, newName, description, isPublic, addCourse, deleteCourse){
    console.log(name)
    this.AuthenticatedService.editSchedule(name, newName, description, isPublic, addCourse, deleteCourse).subscribe(schedule => {
    });
    
  }
  addReview(courseName, review){
    this.AuthenticatedService.addReview(courseName, review).subscribe(newReview => {
    });
    this.confirmReviewTrigger = false
  }
  confirmReview(){
    this.confirmReviewTrigger = true
  }
  declineReview(){
    this.confirmReviewTrigger = false
  }

}
