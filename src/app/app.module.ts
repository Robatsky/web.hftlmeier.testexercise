import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routing';
import { ChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { AceEditorModule } from 'ng2-ace-editor';

import { NamingTaskComponent } from './components/naming-task/naming-task.component';
import { DnDtaskComponent } from './components/dnd-task/dnd-task.component';
import { OverviewComponent } from './components/overview/overview.component';
import { DragulaModule } from 'ng2-dragula';
import { TaskService } from './services/task.service';
import { MarkCodeLineComponent } from './components/mark-code-line/mark-code-line.component';
import { OrderDefinitionHeadingsTaskComponent } from './components/order-definition-headings-task/order-definition-headings-task.component';



@NgModule({
  declarations: [
    AppComponent,
    AppRoutingModule,
    NamingTaskComponent,
    DnDtaskComponent,
    OverviewComponent,
    MarkCodeLineComponent,
    OrderDefinitionHeadingsTaskComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DragulaModule,
    ChartsModule,
    AceEditorModule
  ],
  providers: [TaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
