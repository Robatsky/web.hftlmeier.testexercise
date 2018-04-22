import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import { ArrayUtil } from '../../util/ArrayUtil';
import { BasicTask } from '../../model/task/BasicTask';
import { TaskService } from '../../services/task.service';

@Component({
	selector: 'app-dn-dtask',
	templateUrl: './dnd-task.component.html',
})
export class DnDtaskComponent extends BasicTask {
	public evaluatedTask: boolean = false;

	public answers: string[] = [];
	public possibleAnswers: string[];

	constructor(route: ActivatedRoute, router: Router,
		taskService: TaskService,
		private dragulaService: DragulaService) {
		super(route, router, taskService);
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
		super.savePoints();
	}


    /**
     * Stores the current state of the component.
     */
	public storeInputValues(): void {
		const data = {
			answers: this.answers,
			possibleAnswers: this.possibleAnswers,
			hints: this.hints
		};
		this.taskService.storeTaskData(this.id, null, data);
	}


    /**
     * Restores the most recent state of the component.
     */
	public restoreInputValues(): void {
		let task = this.taskService.restoreTaskData(this.id);
		if (task != null && task.data != null) {
			this.answers = ArrayUtil.copyOf(task.data.answers);
			this.possibleAnswers = ArrayUtil.copyOf(task.data.possibleAnswers);
			this.hints = ArrayUtil.copyOf(task.data.hints);
		}
	}

	/**
	 * Resets the attributes of the current task to its default values.
	 */
	public reset(): void {
		super.reset();
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
