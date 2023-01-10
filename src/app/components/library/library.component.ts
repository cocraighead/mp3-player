import { Component, OnInit } from '@angular/core';
import { MediatorService } from '../../services/mediator.service';

import * as _ from 'lodash';

import { song } from '../../types/types';

// TODO
// song meta data - songs data like image ect displays
// history - history to queue
// playlists - to db
// search
// artists/albums view
// refresh db 
// add new songs from youtube using yt to mp3
// different song list styles - medium table, large grid
// copy itunes features - settings/custiomization for the user, drag and drop, left right click, 

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  constructor(private mediator: MediatorService) { }

  dataLoading = false
  songs:song[] = []
  currentSonglist:song[] = []
  playlists:any = {}
  playlistNames = []
  currentPlaylistName = 'Songs'

  
  ngOnInit(): void {
    this.dataLoading = true
    this.mediator.getDB().subscribe((data:any)=>{
      this.setUpSongs(data.library)
      this.setUpPlayLists()
      this.currentSonglist = this.songs
    })
  
  }

  setUpSongs(libObj:any){
    _.forEach(libObj, (song:any,key:string)=>{
      const obj = _.assign({id:key}, song)
      this.songs.push(obj)
    })
  }

  setUpPlayLists(){
    this.playlistNames = ['Songs','Playlist 1','Playlist 2']
    this.playlistNames.forEach(pl => {
      if(pl === 'Songs'){
        this.playlists[pl] = this.songs
      }else if(pl === 'Playlist 1'){
        this.playlists[pl] = this.songs.slice(0,15)
      }else{
        this.playlists[pl] = this.songs.slice(16,35)
      }
    })
  }

  switchPlaylist(name){
    this.currentSonglist = this.playlists[name]
  }

}
