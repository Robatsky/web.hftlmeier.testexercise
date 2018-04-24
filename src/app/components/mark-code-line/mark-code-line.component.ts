import { Component, OnInit, ViewChild } from '@angular/core';
import { BasicTask } from '../../model/task/BasicTask';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import 'brace/theme/eclipse';
import 'brace/mode/java';

@Component({
	selector: 'app-mark-code-line',
	templateUrl: './mark-code-line.component.html'
})
export class MarkCodeLineComponent extends BasicTask {

	public code: string ="";
	public correctLines: number[];

	public options: any = {
		maxLines: 1000, 
		printMargin: false, 
		fontSize: 22
	};

	constructor(route: ActivatedRoute, router: Router, taskService: TaskService) {
		super(route, router, taskService);
		this.code = this.data.code;
		this.correctLines = this.data.correctLines;
	}


	public evaluateInput(): void {
	}
	public storeInputValues(): void {
	}
	public restoreInputValues(): void {
	}
}
