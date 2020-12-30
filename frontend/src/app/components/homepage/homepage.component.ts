import { Component, OnInit } from '@angular/core';
import { HomepageService } from 'src/app/services/homepage.service';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private HomepageService: HomepageService) { }
  allCourseComponents: string[];
  keyWordSearchItems: string[];
  ngOnInit(): void {
  }

  getCourseComponents(subject:string, courseCode:string){
    if(!subject){
      subject = "None"
    }
    var concat = `${subject.toLocaleUpperCase()}/${courseCode.toLocaleUpperCase()}`
    this.HomepageService.getCourseComponents(concat).subscribe(allCourseComponents=> {
      console.log(allCourseComponents)
      this.allCourseComponents = allCourseComponents
    });
  }

  keyWordSearch(keyWord:string){
    keyWord = keyWord.toLocaleUpperCase()
    this.HomepageService.keyWordSearch(keyWord).subscribe(keyWordSearchItems=> {
      console.log(keyWordSearchItems)
      this.keyWordSearchItems = keyWordSearchItems
    });
  }

  resetCoursesSearch(){
    this.allCourseComponents = []
  }
  resetKeywordSearch(){
    this.keyWordSearchItems = []
  }


}
