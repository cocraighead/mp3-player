import {AfterViewInit, Component, ViewChild, Input, OnInit, OnChanges,ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { MediatorService } from 'src/app/services/mediator.service';

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
  @ViewChild('SongInfoDialog') songInfoDialog: ElementRef;
  songInfoSong:song
  updateSongForm = new FormGroup({
    songName: new FormControl('', Validators.required),
    songArtist: new FormControl('', Validators.required),
    songAlbum: new FormControl('', Validators.required),
  });

  constructor( private player: PlayerService, private mediator: MediatorService ) {}

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

  
  toggleSongInfo(passedSong:song){
    if(!this.songInfoDialog.nativeElement.open){
      this.songInfoSong = passedSong
      this.fillInSongInfoDialogForm(passedSong)
      this.songInfoDialog.nativeElement.show()
    }else{
      this.songInfoDialog.nativeElement.close()
      this.songInfoSong = undefined
    }
  }

  songDragStart($event, song:song) {
    var songString = JSON.stringify(song);
    $event.dataTransfer.setData("song", songString);
  }

  fillInSongInfoDialogForm(song:song){
    this.updateSongForm.patchValue({songName:song.name})
    this.updateSongForm.patchValue({songArtist:song.artist})
    this.updateSongForm.patchValue({songAlbum:song.album})
  }

  updateSong(passedSong:song){
    this.mediator.updateSong(
      passedSong,
      this.updateSongForm.get('songName').value,
      this.updateSongForm.get('songArtist').value,
      this.updateSongForm.get('songAlbum').value
    ).subscribe((resp)=>{
      this.toggleSongInfo(this.songInfoSong)
    })
  }



}
