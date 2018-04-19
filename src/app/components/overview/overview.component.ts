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
    // = ['A','B','C']
    /* = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];*/

    this.chartLabels = ["Aufgabe 1", "Aufgabe2", "Aufgabe3"];//this.taskService.getAllTasknames();
    this.taskService.getAllTaskResults().forEach(e => {
        //this.chartData.push({data: e.reachedPoints});
    });
    this.chartData = [{data: [3, 4, 2], label: "Versuch #1"}, {data: [4, 3, 6], label: "Versuch #2"}];
  }

  public nextTask(): void {
    this.router.navigateByUrl(this.router.config[1].path);
  }

}
