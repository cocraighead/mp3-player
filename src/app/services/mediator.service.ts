import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { playlist, song } from '../types/types';

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

  updateSong(song:song, newName:string, newArtist:string, newAlbum:string){
    var oldFFullName = `${song.id},${song.artist},${song.album},${song.name}`
    var newFullName = `${song.id},${newArtist},${newAlbum},${newName}`
    var params = `?newfullname=${newFullName}&oldfullname=${oldFFullName}`
    return this.http.get(this.serverURL+'/updatesong'+params)
  }

  addSongToPlaylist(song:song, playlist:playlist){
    var params = `?songid=${song.id}&playlistid=${playlist.id}`
    return this.http.get(this.serverURL+'/addsongtoplaylist'+params)
  }

}
