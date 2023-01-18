import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';

import { song, SongQueue } from '../types/types';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  self$ = new BehaviorSubject(this);

  firstRefresh = true


  constructor() { }
  
  triggerLibraryRefresh(){
    this.firstRefresh = false
    this.self$.next(this)
  }

}
