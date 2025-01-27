import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibraryComponent } from './components/library/library.component';


const routes: Routes = [
  { path: 'library', component: LibraryComponent, pathMatch: 'full' },
  { path: '', redirectTo: 'library', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
