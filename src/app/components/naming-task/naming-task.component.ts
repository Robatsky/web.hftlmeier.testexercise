import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-naming-task',
	templateUrl: './naming-task.component.html',
})
export class NamingTaskComponent {

	// booleans to toggle button states
	private taskCompleted: boolean = false;
	private evaluatedTask: boolean = false;

	// model attributes containing important information
	// about this task
	private id: number;
	private title: string;
	private question: string;
	private data: any;


	// points the user has collected
	private points: number;

	// input-values
	private userInputs = [{ value: '' }];
	private hints = [{ styleClass: "", text: "" }];


	constructor(private router: ActivatedRoute,
		private route: Router) {
		this.id = router.snapshot.data[0].id;
		this.title = router.snapshot.data[0].name;
		this.data = router.snapshot.data[0].data;
		this.question = router.snapshot.data[0].question;
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
	private addInputField(): void {
		this.userInputs.push({ value: '' });
	}

	/**
	 * Jumpes to the next task.
	 * The next task has the id {@code this.id+2} due to the fact,
	 * that the task ids start with 0 and the first task is at
	 * the second page.
	 */
	private nextTask(): void {
		this.route.navigateByUrl(this.route.config[this.id + 2].path);
	}

	private reset(): void {
		this.hints = [];
		this.userInputs = [{ value: '' }];
		this.taskCompleted = false;
		this.evaluatedTask = false;
		this.points = 0;
	}

	/**
	 * Evaluates the inputs from the user.
	 * If there are empty input fields there is no further evaluation.	
	 */
	private evaluateInput(): void {
		this.hints = [];

		if (this.hasEmptyInputs()) {
			this.hints.push({ styleClass: "badge-danger", text: "Es darf keine leeren Antworten geben!" });
			return;
		}

		this.evaluatedTask = true;
		this.points = 0;

		this.userInputs
			.map(val => val.value)
			.forEach(val => {
				const lowerCaseAnswers = this.data.answers.map(val => val.toLocaleLowerCase());
				if (this.arrayContains(lowerCaseAnswers, val.toLocaleLowerCase())) {
					this.points++;
					this.hints.push(
						{
							styleClass: "badge-success",
							text: "Richtig! " + val + " ist ein wichtiger Bestandteil"
						}
					);
				} else {
					this.hints.push(
						{
							styleClass: "badge-danger",
							text: "Falsch! " + val + " ist kein Bestandteil!"
						}
					);
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

	/**
	 * Checks whether the given {@code arr} has the element {@code val} in its collection.
	 * @param arr the collection to be checked
	 * @param val the value to be checked whether it its in the collection or not
	 * @return {@code true} if the collection has at least one element equal to {@code val}, {@code false} otherwise.
	 */
	private arrayContains<T>(arr: T[], val: T): boolean {
		return arr.indexOf(val) != -1;
	}
}