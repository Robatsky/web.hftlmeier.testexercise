import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import { ArrayUtil } from '../../util/ArrayUtil';
import { BasicTask } from '../../model/task/BasicTask';

@Component({
	selector: 'app-dn-dtask',
	templateUrl: './dnd-task.component.html',
})
export class DnDtaskComponent extends BasicTask {

	public evaluatedTask: boolean = false;

	public answers: string[] = [];
	public possibleAnswers: string[];

	constructor(route: ActivatedRoute, router: Router,
		private dragulaService: DragulaService) {
		super(route, router);

		this.possibleAnswers = ArrayUtil.shuffle(
			ArrayUtil.copyOf(super.getData().possibleAnswers));

	}

	/**
	 * Evaluates the inputs from the user.
	 * If there is no user input there is no further evaluation.	
	 */
	public evaluateInput(): void {
		super.reset();

		if (this.answers.length === 0) {
			super.addHint("badge-danger", "Wählen Sie mindestens eine Antwort aus!");
			return;
		}

		this.evaluatedTask = true;
		this.answers.forEach(answer => {
			if (ArrayUtil.arrayContains(super.getAnswers(), answer)) {
				super.increatePoints(1);
				this.addHint("badge-success", "Richtig! \"" + answer + "\" ist eine richtige Antwort.");
			} else {
				super.increatePoints(-.5);
				this.addHint("badge-danger", "Falsch! \"" + answer + "\" ist keine richtige Antwort");
			}
		});
	}

	/**
	 * Resets the attributes of the current task to its default values.
	 */
	public reset(): void {
		this.evaluatedTask = false;
		this.answers = [];
		this.possibleAnswers = [];
		this.possibleAnswers = ArrayUtil.shuffle(
			ArrayUtil.copyOf(super.getData().possibleAnswers));

	}

		/**
	 * Checks and returns whether the task has already been evaluated.
	 * @return {@code true} if the task is already evaluated, {@code false} otherwise.
	 */
	public alreadyEvaluated(): boolean {
		return this.evaluatedTask;
	}

}
