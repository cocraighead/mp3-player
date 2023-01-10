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

};
