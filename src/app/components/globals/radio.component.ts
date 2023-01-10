import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';

import { PlayerService } from '../../services/player.service';

import { song, SongQueue } from '../../types/types';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css']
})
export class RadioComponent implements OnInit {
  @ViewChild('QueueDialog') queueDialog: ElementRef;
  currentSong?:song

  constructor(public player:PlayerService) { }

  ngOnInit(): void {
    this.player.self$.subscribe((x) => {
      this.setCurrentSong(x.currentSong)
    });
  }

  playClicked(){
    this.player.play()
  }

  pauseClicked(){
    this.player.pause()
  }

  nextClicked(){
    this.player.playNext()
  }

  previousClicked(){
    if(!this.player.getHistory().empty()){
      if(this.player.currentSong) this.player.getQueue().addNext(this.player.currentSong)
      this.player.startPlaying(this.player.getHistory().pop())
    }
  }

  setNewVolume(event:any){
    this.player.setVolume(event.value)  
  }

  setCurrentSong(setSong:song){
    this.currentSong = setSong
  }

  toggleQueue(){
    if(!this.queueDialog.nativeElement.open){
      this.queueDialog.nativeElement.show()
    }else{
      this.queueDialog.nativeElement.close()
    }
  }

  removeFromQueue(index){
    this.player.getQueue().remove(index)
  }

  clearQueue(){
    this.player.getQueue().clear()
  }

}
