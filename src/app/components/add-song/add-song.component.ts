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

  showYoutubeisOpen:boolean = false
  showImportLoading:boolean = false

  importTypeToggle = true // true is youtube 2 mp3

  findSongForm = new FormGroup({
    muteConfig: new FormControl(true),
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

  clearForms(){
    this.importMp3Form.reset()
  }

  submitImport(){
    var self = this
    self.showImportLoading = true
    this.mediator.importMp3(
      this.importMp3Form.get('importpath').value,
    ).subscribe((r:any)=>{
      if(r.error){
        console.error(r.error)
        self.showImportLoading = false
      }else{
        this.clearForms()
        self.showImportLoading = false
      }
    })
  }
  
  openYoutube(){
    var self = this
    if(self.showYoutubeisOpen){
      return 
    }
    self.showYoutubeisOpen = true
    this.mediator.searchyoutube(
      this.findSongForm.get('muteConfig').value,
    ).subscribe((r:any)=>{
      if(r.error){
        console.error(r.error)
        self.showYoutubeisOpen = false
      }else{
        self.showYoutubeisOpen = false
      }
    })
  }

}
