import { Component, OnInit,Input,Output,EventEmitter,AfterViewInit, OnChanges } from '@angular/core';

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

  constructor() { }

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

}
