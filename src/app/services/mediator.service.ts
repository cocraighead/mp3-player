import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MediatorService {

  constructor(private http: HttpClient) { }

  serverURL = 'http://localhost:3000'

  getDB(){
    return this.http.get(this.serverURL+'/db')
  }

  getSong(songId:string){
    return this.http.get(this.serverURL+'/song/'+songId)
  }

}
