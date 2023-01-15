import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit, OnChanges } from '@angular/core';
import { MediatorService } from 'src/app/services/mediator.service';

import { playlist, song } from '../../types/types';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit,AfterViewInit, OnChanges {
  @Input() playlists:playlist[]
  @Output() playlistEvent = new EventEmitter<string>();
  currentPlaylist:playlist|any = {id:'-1'}

  constructor(private mediator: MediatorService) { }

  ngOnInit(): void {
    if(this.playlists.length){
      this.currentPlaylist = this.playlists[0]
    }
  }

  ngAfterViewInit() {
   
  }

  ngOnChanges(changes: any){
    if(this.playlists.length){
      this.currentPlaylist = this.playlists[0]
    }
  }

  playlistClicked(playlist:playlist){
    this.currentPlaylist = playlist
    this.playlistEvent.emit(this.currentPlaylist);
  }

  hasSong(playlistP:playlist, song:song){
    for(var i=0;i<playlistP.songs.length;i++){
      if(song.id === playlistP.songs[i].id){
        return true
      }
    }
    return false
  }

  queueButtonDrop($event, playlistH:playlist){
    // get song object from drag and drop // may need to add data to drag event
    var song:song = JSON.parse($event.dataTransfer.getData("song"));
    if(this.hasSong(playlistH, song)){
      return
    }
    // mediator add song to queue
    this.mediator.addSongToPlaylist(song, playlistH).subscribe((resp)=>{
        // in sub turn off hover
        playlistH.isHovered = false
        playlistH.songs.push(song)
    })

  }

  queueButtonDragover($event){
    return false
  }

  queueButtonDragenter($event, playlistH:playlist){
    playlistH.isHovered = true
  }

  queueButtonDragleave($event, playlistH:playlist){
    playlistH.isHovered = false
  }

}
