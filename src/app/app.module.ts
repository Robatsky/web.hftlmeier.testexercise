import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';

import { NamingTaskComponent } from './components/naming-task/naming-task.component';
import { DnDtaskComponent } from './components/dnd-task/dnd-task.component';
import { OverviewComponent } from './components/overview/overview.component';
import { DragulaModule } from 'ng2-dragula';


@NgModule({
  declarations: [
    AppComponent,
    AppRoutingModule,
    NamingTaskComponent,
    DnDtaskComponent,
    OverviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DragulaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
