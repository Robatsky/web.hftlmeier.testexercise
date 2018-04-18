import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {

  public name: string;
  public description: string;
  public taskamount: number;

  constructor(private router: Router,
    private route: ActivatedRoute) {
    this.name = route.snapshot.data[0].name;
    this.description = route.snapshot.data[0].description;
    this.taskamount = route.snapshot.data[0].taskamount;
  }

  ngOnInit() {
  }

  nextTask() {
    this.router.navigateByUrl(this.router.config[1].path);
  }

}
