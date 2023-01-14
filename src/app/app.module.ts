import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table'
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LibraryComponent } from './components/library/library.component';
import { SongListComponent } from './components/song-list/song-list.component';
import { RadioComponent } from './components/globals/radio.component';
import {AddSongComponent} from './components/add-song/add-song.component'
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SideMenuComponent } from './components/side-menu/side-menu.component';


@NgModule({
  declarations: [
    AppComponent,
    LibraryComponent,
    SongListComponent,
    RadioComponent,
    SideMenuComponent,
    AddSongComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatSliderModule,
    MatTableModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
