import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediatorService } from '../../services/mediator.service';
import { RefreshService } from 'src/app/services/refresh-service';

import * as _ from 'lodash';

import { song, playlist } from '../../types/types';

// TODO
// Edit song - add a artist album name album image
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

  constructor(private mediator: MediatorService, private router: Router, private refreshService: RefreshService) { }

  dataLoading = true
  songs:song[] = []
  currentSonglist:song[] = []
  playlists:playlist[] = []
  currentPlaylist:playlist
  centerViewType = 0 // 0-songs,1-album,2-artists

  
  ngOnInit(): void {
    this.refreshService.self$.subscribe((x) => {
      this.refresh(x)
    });
  }

  refresh(x:any){
    this.currentSonglist = []
    this.dataLoading = true
    this.mediator.refreshDB().subscribe((resp:any)=>{
      this.mediator.getDB().subscribe((data:any)=>{
        this.songs = []
        this.setUpSongs(data.library)
        this.playlists = []
        this.setUpPlayLists(data.playlists)
        this.currentSonglist = this.currentPlaylist.songs
        this.dataLoading = false
      })
    })
  }

  setUpSongs(libObj:any){
    _.forEach(libObj, (song:any,key:string)=>{
      const obj = _.assign({id:key}, song)
      this.songs.push(obj)
    })
  }

  getSong(songId:string){
    for(var i=0;i<this.songs.length;i++){
      if(this.songs[i].id == songId){
        return this.songs[i]
      }
    }
    return {}
  }

  setUpPlayLists(playlistObject){
    var keys = Object.keys(playlistObject)
    if(keys.length === 0){
      return
    }
    this.playlists.push({
      id:'-1',
      name: 'Songs',
      songs: this.songs,
      canBeHovered: false,
      isHovered: false
    })
    this.playlists.push({
      id:'-2',
      name: 'Artists',
      songs: this.songs,
      canBeHovered: false,
      isHovered: false
    })
    this.playlists.push({
      id:'-3',
      name: 'Albums',
      songs: this.songs,
      canBeHovered: false,
      isHovered: false
    })
    keys.forEach((plId) => {
      this.playlists.push({
        id: plId,
        name: playlistObject[plId].name,
        songs: playlistObject[plId].songs.map((s)=>{
          return this.getSong(s)
        }),
        canBeHovered: true,
        isHovered: false
      })
    })
    if(!this.currentPlaylist){
      this.currentPlaylist = this.playlists[0]
    }else{
      var foundFlag = false
      for(var i=0;i<this.playlists.length;i++){
        if(this.currentPlaylist.id === this.playlists[i].id){
          this.currentPlaylist = this.playlists[i]
          foundFlag = true
        }
      }
      if(!foundFlag){
        this.currentPlaylist = this.playlists[0]
      }
    }
  }

  switchPlaylist(playList:playlist){
    if(playList.id === '-2'){
      this.centerViewType = 2
    }else if(playList.id === '-3'){
      this.centerViewType = 1
    }else{
      this.centerViewType = 0
    }
    this.currentPlaylist = playList
    this.currentSonglist = playList.songs
  }

  addSongClicked(){
    this.router.navigate(['add']);
  }

}
