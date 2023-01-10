import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

import { song } from '../../types/types';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  @Input() playlists:any
  @Output() playlistEvent = new EventEmitter<string>();
  currentPlaylist = 'Songs'

  constructor() { }

  ngOnInit(): void {

  }

  playlistClicked(name:string){
    this.currentPlaylist=name
    this.playlistEvent.emit(name);
  }

}
