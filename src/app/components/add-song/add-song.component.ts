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

  newSongForm = new FormGroup({
    youtubeLink: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    artist: new FormControl('', Validators.required),
    album: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
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
      ).subscribe((r)=>{
        this.clearForm()
        this.refreshService.triggerLibraryRefresh()
        self.loading = false
        }
      )
    }
  }

  clearForm(){
    this.newSongForm.reset()
  }

  backToLibrary(){
    this.router.navigate(['library']);
  }

}
