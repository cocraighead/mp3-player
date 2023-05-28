import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { playlist, song } from '../types/types';

@Injectable({
  providedIn: 'root'
})
export class MediatorService {

  constructor(private http: HttpClient) { }

  serverURL = 'http://localhost:4200/api'


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
    var body = {ytlink: encodedUrl, artist: artist, album: album, name: name}
    return this.http.post(this.serverURL+'/newsong', body)
  }

  updateSong(song:song, newName:string, newArtist:string, newAlbum:string){
    var songId = song.id
    var newFullName = `${song.id},${newArtist},${newAlbum},${newName}`
    var body = {newfullname: newFullName, id: songId}
    return this.http.put(this.serverURL+'/updatesong', body)
  }

  addSongToPlaylist(song:song, playlist:playlist){
    var body = {playlistid: playlist.id, songid: song.id}
    return this.http.put(this.serverURL+'/addsongtoplaylist', body)
  }

}
