import {MatTableDataSource} from '@angular/material/table';

export class song {
    id:string;
    name:string;
    artist:string;
    album:string;
    filePath:string


    constructor(_id: string,_name: string,_artist: string,_album: string,_filePath:string) {
        this.id = _id;
        this.name = _name;
        this.artist = _artist;
        this.album = _album;
        this.filePath = _filePath;
      }
};

export class playlist {
  id:string;
  name:string;
  songs:song[]


  constructor(_id: string,_name: string,_songs: song[]) {
      this.id = _id;
      this.name = _name;
      this.songs = _songs;
    }
};

export class SongQueue{
  queue:song[]

  constructor() {
    this.queue = []
  }

  add(song:song){
    this.queue.push(song)
  }

  addNext(song:song){
    this.queue.unshift(song)
  }

  pop(){
    let ret = this.queue[0]
    this.queue.splice(0,1)
    return ret
  }

  clear(){
    this.queue = []
  }

  empty(){
    return this.queue.length === 0
  }

  remove(index){
    this.queue.splice(index,1)
  }

  shuffleQueue(){
    let currentIndex = this.queue.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [this.queue[currentIndex], this.queue[randomIndex]] = [
        this.queue[randomIndex], this.queue[currentIndex]];
    }
  }

};
