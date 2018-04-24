import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArrayUtil } from '../../util/ArrayUtil';
import { BasicTask } from '../../model/task/BasicTask';
import { InputMatcher } from '../../util/InputMatcher';
import { TaskService } from '../../services/task.service';

@Component({
	selector: 'app-naming-task',
	templateUrl: './naming-task.component.html',
})
export class NamingTaskComponent extends BasicTask {

	// booleans to toggle button states
	public taskCompleted: boolean = false;

	// input-values
	public userInputs = [{ value: '' }];

	constructor(route: ActivatedRoute, router: Router,
		taskService: TaskService) {
		super(route, router, taskService);

	}

	/**
	 * Deletes the corresponding array element at the given index.
	 * @param index the index of the inputfield to be deleted
	 */
	private deleteInputField(index: number): void {
		this.userInputs.splice(index, 1);
	}

	/**
	 * Adds a new element array in order to observe the corresponding
	 * user input field.
	 */
	public addInputField(): void {
		this.userInputs.push({ value: '' });
	}

	/**
	 * Resets the attributes of the current task to its default values.
	 */
	public reset(): void {
		super.reset();
		this.userInputs = [{ value: '' }];
		this.taskCompleted = false;
		this.evaluatedTask = false;
	}

	/**
	 * Evaluates the inputs from the user.
	 * If there are empty input fields there is no further evaluation.	
	 */
	public evaluateInput(): void {
		super.reset();

		if (this.hasEmptyInputs()) {
			this.addHint("badge-danger", "Es darf keine leeren Antworten geben!");
			return;
		}

		this.evaluatedTask = true;

		const lowerCaseAnswers = super.getAnswers().map(val => val.toLowerCase());
		let removedAnswers = [];

		this.userInputs.map(val => val.value).forEach(val => {

			if (removedAnswers.length > 0) {
				if (ArrayUtil.arrayApproxContains(removedAnswers, val.toLowerCase()) != -1) {
					this.addHint("badge-warning", "Achtung! " + val + " ist bereits vorhanden und wird daher nicht beachtet");
					return;
				}
			}

			const idx = ArrayUtil.arrayApproxContains(lowerCaseAnswers, val.toLowerCase());

			if (idx != -1) {
				removedAnswers.push(lowerCaseAnswers.splice(idx, 1)[0]);
				this.increasePoints(1);
				this.addHint("badge-success", "Richtig! " + val + " ist ein wichtiger Bestandteil");
			} else {
				this.addHint("badge-danger", "Falsch! " + val + " ist kein Bestandteil!");
			}
		});
		super.savePoints();
	}

    /**
     * Stores the current state of the component.
     */
	public storeInputValues(): void {
		const data = {
			userInputs: this.userInputs,
			taskCompleted: this.taskCompleted,
			evaluatedTask: this.evaluatedTask,
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
			this.userInputs = ArrayUtil.copyOf(task.data.userInputs);
			this.hints = ArrayUtil.copyOf(task.data.hints);
			this.taskCompleted = task.data.taskCompleted;
			this.evaluatedTask = task.data.evaluatedTask;
		}
	}



	/**
	 * Checks whether the {@link userInputs} array has empty fields.
	 * An element is considered to be empty if its content length is zero.
	 * @return {@code true} if the array has at least one empty element, {@code false otherwise}
	 */
	private hasEmptyInputs(): boolean {
		return this.userInputs.map(e => e.value).filter(e => e.length == 0).length != 0;
	}
}