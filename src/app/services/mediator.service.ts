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

  importMp3(importpath:string){
    var body = {folderPath: importpath}
    return this.http.post(this.serverURL+'/mp3import', body)
  }

  searchyoutube(muteConfig){
    var body = {muteConfig:muteConfig}
    return this.http.post(this.serverURL+'/searchyoutube', body)
  }

}
