import { Component } from '@angular/core';
import * as _ from 'lodash';
import { MediatorService } from './services/mediator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mp3 Player';

  constructor(private mediator: MediatorService) { }

  ngOnInit(): void {
    this.mediator.refreshDB().subscribe(r=>{})
  }

}
