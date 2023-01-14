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
  shuffleOn:boolean = false
  loopOn:boolean = false
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

  stop(){
    this.mainPlayer.src = ''
    this.state = States.ST
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

  playNew(newSong:song, songList:song[]){
    this.startPlaying(newSong)
    if(this.songQueue.empty()){
      songList.forEach(song => {
        this.songQueue.add(song)
      })
    }
  }

  playNext(){
    if(this.currentSong) this.songHistory.addNext(this.currentSong)
    if(!this.songQueue.empty()){
      let nextSong = this.songQueue.pop()
      this.startPlaying(nextSong)
    }else if(this.loopOn){
      // TODO test more with more songs
      this.songQueue.queue = this.songHistory.queue.slice().reverse();
      let nextSong = this.songQueue.pop()
      this.startPlaying(nextSong)
    }else{
      this.currentSong = null
      this.stop()
    }
  }

  playPrevious(){
    if(!this.songHistory.empty()){
      if(this.currentSong){
        this.songQueue.addNext(this.currentSong)
      }
      this.startPlaying(this.songHistory.pop())
    }
  }

  getQueue(){
    return this.songQueue
  }

  getHistory(){
    return this.songHistory
  }

  toggleShuffle(){
    this.shuffleOn = !this.shuffleOn
    if(this.shuffleOn){
      this.songQueue.shuffleQueue()
    }
  }

  toggleLoop(){
    this.loopOn = !this.loopOn
  }

}
