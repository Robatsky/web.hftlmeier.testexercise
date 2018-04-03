import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-namingtask',
  templateUrl: './namingtask.component.html',
})
export class NamingtaskComponent implements OnInit {

  private model : NamingtaskModel;

  constructor(private route: ActivatedRoute) {
    this.model = this.route.snapshot.data[0].model;
    console.log(this.model);
   }

  ngOnInit() {
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