import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-namingtask',
  templateUrl: './namingtask.component.html',
})
export class NamingtaskComponent implements OnInit {

  private model : NamingtaskModel;
  private userInputs = [{value: ''}];

  constructor(private route: ActivatedRoute) {
    this.model = this.route.snapshot.data[0].model;
  }

  ngOnInit() : void{
  }

  addInputField() {
    this.userInputs.push({value:''});
  }

}

interface NamingtaskModel {
  idx: number,
  type: number,
  name: string,
  data: NamingtaskData
}

interface NamingtaskData {
  maxpoints: number,
  requiredPoints: number,
  answers: string[]
}