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

  refreshDB(){
    return this.http.get(this.serverURL+'/refreshDb')
  }

  getSong(songId:string){
    return this.http.get(this.serverURL+'/song/'+songId)
  }

  addSong(youtubeLink:string,name:string,artist:string,album:string){
    var encodedUrl = encodeURIComponent(youtubeLink)
    var params = `?ytlink=${encodedUrl}&name=${name}&artist=${artist}&album=${album}`
    return this.http.get(this.serverURL+'/newsong'+params)
  }

}
