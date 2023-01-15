import {AfterViewInit, Component, ViewChild, Input, OnInit, OnChanges,SimpleChanges } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { song } from '../../types/types';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit,AfterViewInit, OnChanges {
  displayedColumns: string[] = ['','id', 'name', 'artist', 'album'];
  sortCol = 'id'
  sortDirection = true
  @Input() songs:song[]

  constructor( private player: PlayerService ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
   
  }

  ngOnChanges(changes: any){
  }

  songClicked(songClicked:song){
    var songListIndex = -1
    for(var i=0;i<this.songs.length;i++){
      if(this.songs[i].id === songClicked.id){
        songListIndex = i
      }
    }
    if(songListIndex !== -1){
      var afterSongSongList = this.songs.slice(songListIndex+1)
      var beforeSongSonglist = this.songs.slice(0,songListIndex)
      var passSongList = afterSongSongList.concat(beforeSongSonglist)
      this.player.playNew(songClicked, passSongList)
    }
  }

  sortColumnClicked(col){
    if(col === '') return
    if(col === this.sortCol){
      this.sortDirection = !this.sortDirection
      this.sortSongs(col, this.sortDirection)
    }else{
      this.sortDirection = true
      this.sortSongs(col, this.sortDirection)
    }
  }

  sortSongs(col, sortDirection){
    this.sortCol = col
    if(sortDirection){
      this.songs.sort((a:song, b:song)=>{
        let na:any = JSON.parse(JSON.stringify(a))
        let nb:any = JSON.parse(JSON.stringify(b))
        if(this.sortCol === 'id'){
          na.id = parseInt(a.id)
          nb.id = parseInt(b.id)
        }else{
          na[this.sortCol] = a[this.sortCol].toLowerCase()
          nb[this.sortCol] = b[this.sortCol].toLowerCase()
        }
        if(na[this.sortCol] < nb[this.sortCol]){
          return -1
        }else if(na[this.sortCol] > nb[this.sortCol]){
          return 1
        }else{
          return 0
        } 
      })
    }else{
      this.songs.sort((a:song, b:song)=>{
        let na:any = JSON.parse(JSON.stringify(a))
        let nb:any = JSON.parse(JSON.stringify(b))
        if(this.sortCol === 'id'){
          na.id = parseInt(a.id)
          nb.id = parseInt(b.id)
        }else{
          na[this.sortCol] = a[this.sortCol].toLowerCase()
          nb[this.sortCol] = b[this.sortCol].toLowerCase()
        }
        if(na[this.sortCol] < nb[this.sortCol]){
          return 1
        }else if(na[this.sortCol] > nb[this.sortCol]){
          return -1
        }else{
          return 0
        } 
      })
    }
  }

  addClicked(song:song) {
    this.player.getQueue().add(song)
  }

  songDragStart($event, song:song) {
    var songString = JSON.stringify(song);
    $event.dataTransfer.setData("song", songString);
  }

}
