import {AfterViewInit, Component, ViewChild, Input, OnInit, OnChanges,ElementRef } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { song, playlist } from '../../types/types';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit,AfterViewInit, OnChanges {
  @Input() songs:song[]
  @Input() centerViewType:Number
  @Input() currentPlaylist:playlist
  @ViewChild('AlbumInfoDialog') albumInfoDialog: ElementRef;
  albums:any
  filteredAlbums:any
  albumInfoAlbum:any

  constructor( private player: PlayerService ) {}

  ngOnInit() {
    var albumDic = {}
    for(var i=0;i<this.songs.length;i++){
      // var lowerCaseAlbum = this.songs[i].album.toLowerCase();
      var lowerCaseAlbum = this.songs[i].album
      if(albumDic[lowerCaseAlbum]){
        albumDic[lowerCaseAlbum].push(this.songs[i])
      }else{
        albumDic[lowerCaseAlbum] = []
        albumDic[lowerCaseAlbum].push(this.songs[i])
      }
    }
    this.albums = []
    var keys = Object.keys(albumDic)
    for(var i=0;i<keys.length;i++){
      this.albums.push({
        name: keys[i],
        songs: albumDic[keys[i]],
        imgPath: 'assets/albums/' + keys[i] + '.jpg'
      })
    }
    this.albums.sort((a,b)=>{
      if(a.name > b.name){
        return 1
      }else if(a.name < b.name){
        return -1
      }else{
        return 0
      }
    })
    this.filteredAlbums = this.albums.slice()
  }
    

  ngAfterViewInit() {
   
  }

  ngOnChanges(changes: any){
  }

  
  toggleAlbumInfo(album:any){
    if(!this.albumInfoDialog.nativeElement.open){
      this.albumInfoAlbum = album
      this.albumInfoDialog.nativeElement.show()
    }else{
      this.albumInfoDialog.nativeElement.close()
      this.albumInfoAlbum = undefined
    }
  }

  searchChanged($event){
    this.filterAlbums($event.srcElement.value)
  }

  filterAlbums(filterTerm){
    this.filteredAlbums = []
    for(var i=0;i<this.albums.length;i++){
      if(this.albums[i].name.toLowerCase().startsWith(filterTerm.toLowerCase())){
        this.filteredAlbums.push(this.albums[i])
      }
    }
  }

}
