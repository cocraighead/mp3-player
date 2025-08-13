import {AfterViewInit, Component, ViewChild, Input, OnInit, OnChanges,ElementRef } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { playlist, song } from '../../types/types';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css']
})
export class ArtistListComponent implements OnInit,AfterViewInit, OnChanges {
  @Input() songs:song[]
  @Input() centerViewType:Number
  @Input() currentPlaylist:playlist
  @ViewChild('ArtistInfoDialog') artistInfoDialog: ElementRef;
  artists:any
  filteredArtists:any
  artistInfoArtist:any

  clickcount:number = 0;

  constructor( private player: PlayerService ) {}

  ngOnInit() {
    var artistDic = {}
    for(var i=0;i<this.songs.length;i++){
      // var lowerCaseArtist = this.songs[i].artist.toLowerCase();
      var lowerCaseArtist = this.songs[i].artist
      if(artistDic[lowerCaseArtist]){
        artistDic[lowerCaseArtist].push(this.songs[i])
      }else{
        artistDic[lowerCaseArtist] = []
        artistDic[lowerCaseArtist].push(this.songs[i])
      }
    }
    this.artists = []
    var keys = Object.keys(artistDic)
    for(var i=0;i<keys.length;i++){
      this.artists.push({
        name: keys[i],
        songs: artistDic[keys[i]],
        imgPath: 'assets/artists/' + keys[i] + '.jpg'
      })
    }
    this.artists.sort((a,b)=>{
      if(a.name > b.name){
        return 1
      }else if(a.name < b.name){
        return -1
      }else{
        return 0
      }
    })
    this.filteredArtists = this.artists.slice()
  }
    

  ngAfterViewInit() {
   
  }

  ngOnChanges(changes: any){
  }

  
  toggleArtistInfo(artist:any){
    this.clickcount += 1
    setTimeout(()=>{
      if(this.clickcount === 1){
        if(!this.artistInfoDialog.nativeElement.open){
          this.artistInfoArtist = artist
          this.artistInfoDialog.nativeElement.show()
        }else{
          this.artistInfoDialog.nativeElement.close()
          this.artistInfoArtist = undefined
        }
        this.clickcount = 0
      }
    },250)

  }

  queueArtist(artist:any){
    this.clickcount += 1
    this.player.playNewSongList(artist.songs)
    this.clickcount = 0
  }

  searchChanged($event){
    this.filterArtists($event.srcElement.value)
  }

  filterArtists(filterTerm){
    this.filteredArtists = []
    for(var i=0;i<this.artists.length;i++){
      if(this.artists[i].name.toLowerCase().startsWith(filterTerm.toLowerCase())){
        this.filteredArtists.push(this.artists[i])
      }
    }
  }

}
