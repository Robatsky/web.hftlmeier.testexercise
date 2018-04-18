import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArrayUtil } from '../../util/ArrayUtil';
import { BasicTask } from '../../model/task/BasicTask';
import { InputMatcher } from '../../util/InputMatcher';

@Component({
	selector: 'app-naming-task',
	templateUrl: './naming-task.component.html',
})
export class NamingTaskComponent extends BasicTask {

	// booleans to toggle button states
	public taskCompleted: boolean = false;
	public evaluatedTask: boolean = false;

	// input-values
	public userInputs = [{ value: '' }];

	constructor(route: ActivatedRoute, router: Router) {
		super(route, router);
		
	}

	/**
	 * Deletes the corresponding array element at the given index.
	 * @param index the index of the inputfield to be deleted
	 */
	private deleteInputField(index: number): void {
		this.userInputs.splice(index, 1);
	}

	/**
	 * Checks and returns whether the task has already been evaluated.
	 * @return {@code true} if the task is already evaluated, {@code false} otherwise.
	 */
	public alreadyEvaluated(): boolean {
		return this.evaluatedTask;
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

		this.userInputs.map(val => val.value)
			.forEach(val => {
				const lowerCaseAnswers = super.getAnswers().map(val => val.toLocaleLowerCase());
				console.log(ArrayUtil.arrayApproxContains(lowerCaseAnswers, val.toLocaleLowerCase()));

				if (ArrayUtil.arrayApproxContains(lowerCaseAnswers, val.toLocaleLowerCase())) {
					this.increatePoints(1);
					this.addHint("badge-success", "Richtig! " + val + " ist ein wichtiger Bestandteil");
				} else {
					this.addHint("badge-danger", "Falsch! " + val + " ist kein Bestandteil!");
				}
			});
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