import {AfterViewInit, Component, ViewChild, Input, OnInit, OnChanges,ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { MediatorService } from 'src/app/services/mediator.service';
import { RefreshService } from 'src/app/services/refresh-service';
import { AddSongComponent } from '../../components/add-song/add-song.component';
import { song } from '../../types/types';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit,AfterViewInit, OnChanges {
  displayedColumns: string[] = ['','id', 'name', 'artist', 'album'];
  sortCol = 'id'
  sortDirection = true
  @Input() songs:song[]
  filteredSongs:song[]
  @ViewChild('SongInfoDialog') songInfoDialog: ElementRef;
  @ViewChild('AddSongDialog') addSongDialog: ElementRef;
  songInfoSong:song
  songInfoAlbumArtPath:string
  songInfoArtisArtPath : string
  updateSongForm = new FormGroup({
    songName: new FormControl('', Validators.required),
    songArtist: new FormControl('', Validators.required),
    songAlbum: new FormControl('', Validators.required),
  });

  constructor( private player: PlayerService, private mediator: MediatorService, private refreshService: RefreshService ) {}

  ngOnInit() {
    if(this.songs){
      this.filteredSongs = this.songs.slice()
    }else{
      this.filteredSongs = []
    }
  }

  ngAfterViewInit() {
   
  }

  ngOnChanges(changes: any){
    if(this.songs){
      this.filteredSongs = this.songs.slice()
    }else{
      this.filteredSongs = []
    }
  }

  songClicked(songClicked:song){
    var songListIndex = -1
    for(var i=0;i<this.filteredSongs.length;i++){
      if(this.filteredSongs[i].id === songClicked.id){
        songListIndex = i
      }
    }
    if(songListIndex !== -1){
      var afterSongSongList = this.filteredSongs.slice(songListIndex+1)
      var beforeSongSonglist = this.filteredSongs.slice(0,songListIndex)
      var passSongList = afterSongSongList.concat(beforeSongSonglist)
      this.player.playNew(songClicked, passSongList)
    }
  }

  sortColumnClicked(col){
    if(col === '') return
    if(col === this.sortCol){
      this.sortDirection = !this.sortDirection
      this.sortSongs(col, this.sortDirection)
    }else{
      this.sortDirection = true
      this.sortSongs(col, this.sortDirection)
    }
  }

  sortSongs(col, sortDirection){
    this.sortCol = col
    if(sortDirection){
      this.filteredSongs.sort((a:song, b:song)=>{
        let na:any = JSON.parse(JSON.stringify(a))
        let nb:any = JSON.parse(JSON.stringify(b))
        if(this.sortCol === 'id'){
          na.id = parseInt(a.id)
          nb.id = parseInt(b.id)
        }else{
          na[this.sortCol] = a[this.sortCol].toLowerCase()
          nb[this.sortCol] = b[this.sortCol].toLowerCase()
        }
        if(na[this.sortCol] < nb[this.sortCol]){
          return -1
        }else if(na[this.sortCol] > nb[this.sortCol]){
          return 1
        }else{
          return 0
        } 
      })
      this.songs.sort((a:song, b:song)=>{
        let na:any = JSON.parse(JSON.stringify(a))
        let nb:any = JSON.parse(JSON.stringify(b))
        if(this.sortCol === 'id'){
          na.id = parseInt(a.id)
          nb.id = parseInt(b.id)
        }else{
          na[this.sortCol] = a[this.sortCol].toLowerCase()
          nb[this.sortCol] = b[this.sortCol].toLowerCase()
        }
        if(na[this.sortCol] < nb[this.sortCol]){
          return -1
        }else if(na[this.sortCol] > nb[this.sortCol]){
          return 1
        }else{
          return 0
        } 
      })
    }else{
      this.filteredSongs.sort((a:song, b:song)=>{
        let na:any = JSON.parse(JSON.stringify(a))
        let nb:any = JSON.parse(JSON.stringify(b))
        if(this.sortCol === 'id'){
          na.id = parseInt(a.id)
          nb.id = parseInt(b.id)
        }else{
          na[this.sortCol] = a[this.sortCol].toLowerCase()
          nb[this.sortCol] = b[this.sortCol].toLowerCase()
        }
        if(na[this.sortCol] < nb[this.sortCol]){
          return 1
        }else if(na[this.sortCol] > nb[this.sortCol]){
          return -1
        }else{
          return 0
        } 
      })
      this.songs.sort((a:song, b:song)=>{
        let na:any = JSON.parse(JSON.stringify(a))
        let nb:any = JSON.parse(JSON.stringify(b))
        if(this.sortCol === 'id'){
          na.id = parseInt(a.id)
          nb.id = parseInt(b.id)
        }else{
          na[this.sortCol] = a[this.sortCol].toLowerCase()
          nb[this.sortCol] = b[this.sortCol].toLowerCase()
        }
        if(na[this.sortCol] < nb[this.sortCol]){
          return 1
        }else if(na[this.sortCol] > nb[this.sortCol]){
          return -1
        }else{
          return 0
        } 
      })
    }
  }
  
  toggleAddSong(){
    if(!this.addSongDialog.nativeElement.open){
      this.addSongDialog.nativeElement.show()
    }else{
      this.refreshService.triggerLibraryRefresh()
      this.addSongDialog.nativeElement.close()
    }
  }

  toggleSongInfo(passedSong:song){
    if(!this.songInfoDialog.nativeElement.open){
      this.songInfoSong = passedSong
      this.songInfoAlbumArtPath =  this.getAlbumArtistPath(passedSong, true)
      this.songInfoArtisArtPath =  this.getAlbumArtistPath(passedSong, false)
      this.fillInSongInfoDialogForm(passedSong)
      this.songInfoDialog.nativeElement.show()
    }else{
      this.refreshService.triggerLibraryRefresh()
      this.songInfoSong = undefined
      this.songInfoDialog.nativeElement.close()
    }
  }

  songDragStart($event, song:song) {
    var songString = JSON.stringify(song);
    $event.dataTransfer.setData("song", songString);
  }

  fillInSongInfoDialogForm(song:song){
    this.updateSongForm.patchValue({songName:song.name})
    this.updateSongForm.patchValue({songArtist:song.artist})
    this.updateSongForm.patchValue({songAlbum:song.album})
  }

  updateSong(passedSong:song){
    this.mediator.updateSong(
      passedSong,
      this.updateSongForm.get('songName').value,
      this.updateSongForm.get('songArtist').value,
      this.updateSongForm.get('songAlbum').value
    ).subscribe((resp)=>{
      this.refreshService.triggerLibraryRefresh()
      this.toggleSongInfo(this.songInfoSong)
    })
  }

  searchChanged($event){
    this.filterSongs($event.srcElement.value)
  }

  filterSongs(filterTerm){
    this.filteredSongs = []
    for(var i=0;i<this.songs.length;i++){
      if(this.songs[i].name.toLowerCase().startsWith(filterTerm.toLowerCase())){
        this.filteredSongs.push(this.songs[i])
      }
    }
  }

  getAlbumArtistPath(passedSong:song, album:boolean){
    var entity = album ? passedSong.album : passedSong.artist
    var assetsPath = album ? 'assets/albums/' : 'assets/artists/'
    var imgPath = assetsPath + entity + '.jpg'
    return imgPath
  }

}
