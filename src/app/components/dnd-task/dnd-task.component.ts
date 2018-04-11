import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-dn-dtask',
	templateUrl: './dnd-task.component.html',
})
export class DnDtaskComponent implements OnInit {

	private answers: string[];
	private possibleAnswers: string[];

	private id: number;
	private title: string;
	private question: string;
	private data: any;

	constructor(private router: ActivatedRoute) {
		this.id = router.snapshot.data[0].id;
		this.title = router.snapshot.data[0].name;
		this.data = router.snapshot.data[0].data;
		this.question = router.snapshot.data[0].question;
		this.answers = this.data.answers;
		this.possibleAnswers = this.data.possibleAnswers;
	}

	public ngOnInit() {
		/*this.dragulaService.dropModel.subscribe(val => {
			this.onDropModel(val.slice(1));
		})*/
	}

	private onDropModel(args): void {
	}

}
