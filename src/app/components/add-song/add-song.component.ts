import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MediatorService } from '../../services/mediator.service';
import { RefreshService } from 'src/app/services/refresh-service';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.css']
})
export class AddSongComponent implements OnInit {

  constructor(private mediator: MediatorService, private router: Router, private refreshService: RefreshService) { }

  loading:boolean = false

  importTypeToggle = true // true is youtube 2 mp3

  newSongForm = new FormGroup({
    youtubeLink: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    artist: new FormControl('', Validators.required),
    album: new FormControl('', Validators.required),
  });
  importMp3Form = new FormGroup({
    importpath: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
  }

  changeForm(setTo){
    this.clearForms()
    this.importTypeToggle = setTo
  }

  submitNewSong(){
    var self = this
    if(this.newSongForm.valid){
      this.loading = true
      this.mediator.addSong(
        this.newSongForm.get('youtubeLink').value,
        this.newSongForm.get('name').value,
        this.newSongForm.get('artist').value,
        this.newSongForm.get('album').value
      ).subscribe((r:any)=>{
        if(r.error){
          console.error(r.error)
          self.loading = false
        }else{
          this.clearForms()
          this.refreshService.triggerLibraryRefresh()
          self.loading = false
        }
      })
    }
  }

  clearForms(){
    this.newSongForm.reset()
    this.importMp3Form.reset()
  }

  submitImport(){
    var self = this
    this.mediator.importMp3(
      this.importMp3Form.get('importpath').value,
    ).subscribe((r:any)=>{
      if(r.error){
        console.error(r.error)
        self.loading = false
      }else{
        this.clearForms()
        this.refreshService.triggerLibraryRefresh()
        self.loading = false
      }
    })
  }

  backToLibrary(){
    this.router.navigate(['library']);
  }
  
  openYoutube(){
    var self = this
    this.mediator.searchyoutube().subscribe((r:any)=>{
      if(r.error){
        console.error(r.error)
      }else{
        if(r.ytUrl){
          this.newSongForm.get('youtubeLink').setValue(r.ytUrl);
        }
        if(r.videoTitle){
          this.newSongForm.get('name').setValue(r.videoTitle);
          this.newSongForm.get('artist').setValue('art');
          this.newSongForm.get('album').setValue('alb');
        }
      }
    })
  }

}
