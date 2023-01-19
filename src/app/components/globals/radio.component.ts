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
  currentSongTime
  currentSongLength
  queueButtonHovered:boolean = false;
  queueDragAndDropHovered:boolean = false;
  queueDragAndDropFrontHovered:boolean = false;
  queueDragAndDropbackHovered:boolean = false;


  constructor(public player:PlayerService) { }

  ngOnInit(): void {
    this.player.self$.subscribe((x) => {
      this.setCurrentSong(x.currentSong)
    });
    this.player.mainPlayer.addEventListener("timeupdate", (e)=>{
      this.currentSongTime = Math.round(e.srcElement.currentTime)
    });
    this.player.mainPlayer.addEventListener("durationchange", (e)=>{
      this.currentSongLength = Math.round(e.srcElement.duration)
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
    this.player.playPrevious()
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

  toggleShuffle(){
    this.player.toggleShuffle()
  }

  toggleLoop(){
    this.player.toggleLoop()
  }

  queueButtonDrop($event){
    this.queueButtonHovered = false;
    this.queueDragAndDropHovered = false;
  }

  queueButtonDragover($event){
    return false
  }

  queueButtonDragenter($event){
    this.queueButtonHovered = true;
  }

  queueButtonDragleave($event){
    this.queueButtonHovered = false;
  }

  firstLastDrop($event, dropAreaId){
    this.queueButtonHovered = false;
    this.queueDragAndDropHovered = false;
    // get song object from drag and drop // may need to add data to drag event
    var song:song = JSON.parse($event.dataTransfer.getData("song"));
    // add to front or back of the queue //based on param
    if(dropAreaId === 'front'){
      this.player.getQueue().addNext(song)
    }else{
      this.player.getQueue().add(song)
    }
  }

  firstLastDragover($event){
    return false
  }

  firstLastDragenter($event){
    this.queueDragAndDropHovered = true
  }

  firstLastDragleave($event){
    this.queueDragAndDropHovered = false
  }

  firstLastInnerDragenter($event, dropAreaId){
    if(dropAreaId === 'front'){
      this.queueDragAndDropFrontHovered = true;
    }else{
      this.queueDragAndDropbackHovered = true;
    }
  }

  firstLastInnerDragleave($event, dropAreaId){
    if(dropAreaId === 'front'){
      this.queueDragAndDropFrontHovered = false;
    }else{
      this.queueDragAndDropbackHovered = false;
    }
  }

  timerChanged($e){
    this.player.setTime($e.value)
  }
}
