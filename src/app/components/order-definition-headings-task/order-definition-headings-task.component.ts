import { Component, OnInit, ViewChildren } from '@angular/core';
import { BasicTask, Hints } from '../../model/task/BasicTask';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ArrayUtil } from '../../util/ArrayUtil';

@Component({
	selector: 'app-order-definition-headings-task',
	templateUrl: './order-definition-headings-task.component.html'
})
export class OrderDefinitionHeadingsTaskComponent extends BasicTask {

	@ViewChildren('examplenumberinput') inputs;

	public definitions: string[];
	public headings: string[];
	private definitionsMap: any[];

	private tempAnswers : any[] = [];
	private NUMBER_REGEX: RegExp = new RegExp(/^\d+$/);
		 

	constructor(route: ActivatedRoute, router: Router, taskService: TaskService) {
		super(route, router, taskService);
		this.definitionsMap = route.snapshot.data[0].data.definitions;
		this.definitions = this.extract(this.definitionsMap, e => e.definition);
		this.headings = ArrayUtil.shuffle(this.extract(this.definitionsMap, e => e.heading));
	}

	/**
	 * Extracts either the key or the value from the given map, based on the given mapper
	 * @param map the map to extract the keys from
	 * @param mapper the mapper for extracting
	 * @return an string array containing the values to be extracted.
	 */
	private extract(map: any[], mapper: any): string[] {
		return map.map(mapper);
	}

	/**
	 * Evaluates the inputs from the user.
	 * If there are empty input fields there is no further evaluation.	
	 */
	public evaluateInput(): void {
		super.reset();

		let answers = this.mapAnswersToId();
		if (this.hasEmptyFields(answers)) {
			super.addHint(Hints.Wrong, "Es dürfen nur positive Ganzzahlen größer 0 in die Felder eingetragen werden!");
			return;
		}

		answers = answers.filter(e => this.NUMBER_REGEX.test(e.value));
		const maxNumber = ArrayUtil.max(answers.map(e => e.value));
		const minNumber = ArrayUtil.min(answers.map(e => e.value));

		if (maxNumber > (this.headings.length + 1) || minNumber <= 0) {
			super.addHint(Hints.Wrong, "Einige Angaben referenzieren keine gültige Überschriften.");
			return;
		}

		answers = this.checkAndRemoveDuplicates(answers);

		this.evaluatedTask = true;
		let points = 0;
		let correctAnswers = [];
		let wrongAnswers = [];

		answers.forEach(answer => {
			if (this.definitionsMap[answer.id].heading === this.headings[answer.value - 1]) {
				correctAnswers.push(answer.value);
				points += 1;
			} else {
				wrongAnswers.push(answer.value);
				points -= 0.5;
			}
		});

		if (correctAnswers.length > 0) {
			super.addHint(Hints.Correct, correctAnswers + " sind richtig zugeordnet!");
		}
		if (wrongAnswers.length > 0) {
			super.addHint(Hints.Wrong, wrongAnswers + " sind falsch zugeordnet!");
		}

		super.increasePoints(Math.max(0, points));
		super.savePoints();
	}

	/**
	 * Maps the pubic answers array with its index to an object array.
	 * @return the object array
	 */
	private mapAnswersToId(): any[] {
		let answers = [];
		const tempAnswers = this.inputs._results.map(e => e.nativeElement.value);
		tempAnswers.forEach((e, index) => answers.push({ id: index, value: e }));
		return answers;
	}

	/**
	 * Checks if the given array contains empty entries. An entry is considered to be empty
	 * whenever it is not a number.
	 * @param answers the array to be checked
	 * @return {@code true} if the array contains empty fields, {@code false} otherwise.
	 */
	private hasEmptyFields(answers: any[]): boolean {
		return answers.filter(e => !this.NUMBER_REGEX.test(e.value)).length > 0;
	}

	/**
	 * Checks the given array, containing an object with the following structure
	 * {@code {id: identificationnr, value: valuenumber}}
	 * for duplicated entries based on their value.
	 * @param answers the answers array to be checked
	*  @return an array containing unique object elements.
	 */
	private checkAndRemoveDuplicates(answers: any[]): any[] {
		if (ArrayUtil.hasDuplicates(answers.map(e => e.value))) {
			super.addHint(Hints.Info, "Duplikate wurden ignoriert!");
		}
		return answers.filter((e, pos, arr) => arr.map(x => x.value).indexOf(e.value) === pos);
	}

	/**
	 * Resets the attributes of the current task to its default values.
	 */
	public reset(): void {
		super.reset();
		this.inputs._results.forEach(e => e.nativeElement.value = "");
	}

    /**
     * Stores the current state of the component.
     */
	public storeInputValues(): void {
		let answers = [];
		this.inputs._results.forEach((e,index) => {
			answers.push({id: index, value: e.nativeElement.value});
		})
		const data = {
			answers: answers,
			hints: this.hints
		};

		this.taskService.storeTaskData(this.id, null, data);
	}


	/**
     * Restores the most recent state of the component.
     */
	public restoreInputValues(): void {
		const task = this.taskService.restoreTaskData(this.id);
		if(task != null && task.data != null) {
			this.hints = ArrayUtil.copyOf(task.data.hints);
			this.tempAnswers = ArrayUtil.copyOf(task.data.answers);
		}
	}

	public ngAfterViewInit(): void {
		this.tempAnswers.forEach(e => {
			this.inputs._results[e.id].nativeElement.value = e.value;
		})
	}

}
