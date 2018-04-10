import { BrowserModule } from '@angular/platform-browser';
import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { NamingtaskComponent } from './model/namingtask/namingtask.component';
import { Subscription } from 'rxjs/Subscription';
import { NavigationComponent } from './nav/navigation/navigation.component';

 let appRoutes = [
  {
    path: 'namingtask0',
    component: NamingtaskComponent,
    data: [{model:{idx: 0}}]
  },
  {
    path: 'namingtask1',
    component: NamingtaskComponent,
    data: [{model:{idx: 1}}]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NamingtaskComponent,
    NavigationComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule  {
}
