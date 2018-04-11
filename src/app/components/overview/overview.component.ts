import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  nextTask() {
    this.router.navigateByUrl(this.router.config[1].path);
  }

}
