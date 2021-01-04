import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable,throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PrivacyService {
  getPoliciesURL: string = '/UA/getPolicies';
  constructor(private http:HttpClient) {
    
   }
    getPolicies():Observable<any[]>{
    return this.http.get<string[]>(`${this.getPoliciesURL}`)
    .pipe(
      catchError(this.handleError)
    );
  }
  
  handleError(error) {
    let errorMessage = '';
    console.log(error)
    window.alert(error.error);
    return throwError(errorMessage);
  }
}
