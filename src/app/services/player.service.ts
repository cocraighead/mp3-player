import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';

import { song, SongQueue } from '../types/types';


enum States {
  PL,
  PU,
  ST,
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  self$ = new BehaviorSubject(this);
  songQueue:SongQueue = new SongQueue
  songHistory:SongQueue = new SongQueue
  mainPlayer:any
  currentSong?:song
  currentVolume:number = 0.5
  state:States = States.ST

  constructor(@Inject(DOCUMENT) private document: Document) { 
    this.mainPlayer = this.document.getElementById("AudioTag")
    this.mainPlayer.addEventListener('ended', (event) => {
      this.playNext()
    })
  }

  startPlaying(song:song|undefined){
    this.mainPlayer.src = 'http://localhost:3000/mp3/'+song?.id
    this.currentSong = song
    this.mainPlayer.volume = this.currentVolume
    this.mainPlayer.play()
    this.state = States.PL
    this.self$.next(this)
  }
  
  pause(){
    this.mainPlayer.pause()
    this.state = States.PU
    this.self$.next(this)
  }

  play(){
    if(this.state !== States.PL && this.state !== States.ST){
      this.mainPlayer.play()
      this.state = States.PL
      this.self$.next(this)
    }
  }

  setVolume(value:number){
    this.currentVolume = value
    if(this.state!==States.ST) this.mainPlayer.volume = value
  }

  playNext(){
    if(this.currentSong) this.songHistory.addNext(this.currentSong)
    if(!this.songQueue.empty()){
      let nextSong = this.songQueue.pop()
      this.startPlaying(nextSong)
    }
  }

  getQueue(){
    return this.songQueue
  }

  getHistory(){
    return this.songHistory
  }
}
