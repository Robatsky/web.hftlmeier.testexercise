import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {

  public name: string;
  public description: string;
  public taskamount: number;

  public chartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          steps: 1,
          stepValue: 0.5,
          max: 10,
          min: 0
        }
      }]
    }
  };

  public chartLabels: string[];
  public chartType: string = 'bar';
  public chartLegend: boolean = true;
  public chartData: any[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService) {
    this.name = route.snapshot.data[0].name;
    this.description = route.snapshot.data[0].description;
    this.taskamount = route.snapshot.data[0].taskamount;
  }

  ngOnInit() {
    const taskNames = this.taskService.getAllTasknames();
    
    let maxTries = 0;
    this.taskService.getAllTaskResults().forEach((e,idx) => {
        this.chartData.push({data: e.reachedPoints, label:  taskNames[idx]});      
        maxTries = Math.max(maxTries, e.reachedPoints.length);
    });

    this.chartLabels = Array.from(new Array(maxTries).keys()).map(e => "#" + e);
  }

  public nextTask(): void {
    this.router.navigateByUrl(this.router.config[1].path);
  }

}
