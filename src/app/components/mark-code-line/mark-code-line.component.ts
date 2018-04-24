import { Component, OnInit, ViewChild } from '@angular/core';
import { BasicTask, Hints } from '../../model/task/BasicTask';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import 'brace/theme/eclipse';
import 'brace/mode/java';
import { ArrayUtil } from '../../util/ArrayUtil';

@Component({
	selector: 'app-mark-code-line',
	templateUrl: './mark-code-line.component.html'
})
export class MarkCodeLineComponent extends BasicTask {

	public code: string = "";
	private codeLines: number;

	public correctLines: number[];
	public input: string = "";

	public options: any = {
		maxLines: 1000,
		printMargin: false,
		fontSize: 18
	};

	constructor(route: ActivatedRoute, router: Router, taskService: TaskService) {
		super(route, router, taskService);
		this.code = this.data.code;
		this.correctLines = this.data.correctLines;
		this.codeLines = this.countLines(this.code);
	}

	/**
	 * Counts the number of lines in the given string
	 * @param str string to count the lines
	 * @return number of lines in the given string
	 */
	private countLines(str: string): number {
		return str.split("\n").length;
	}

	/**
	 * Evaluates the inputs from the user.
	 * If there is no user input there is no further evaluation.	
	 */
	public evaluateInput(): void {
		super.reset();

		const inputParts = this.input.split(",");
		const lineNumbers = inputParts.filter(this.numberFilter).map(e => parseInt(e));

		if (ArrayUtil.isEmpty(lineNumbers)) {
			super.addHint(Hints.Wrong, "Wählen Sie mindestens eine Antwort aus!");
			return;
		}

		if (Math.max.apply(lineNumbers) > this.codeLines) {
			super.addHint(Hints.Wrong, "Es darf keine Zeile angegeben werden, die größer ist als " + this.codeLines);
			return;
		}

		this.evaluatedTask = true;

		const correctAnswers = lineNumbers.filter(e => this.correctLines.includes(e));
		const wrongAnswers = lineNumbers.filter(e => !this.correctLines.includes(e));

		const points = Math.max(0, correctAnswers.length - (wrongAnswers.length * 0.5));

		if (!ArrayUtil.isEmpty(correctAnswers)) {
			super.addHint(Hints.Correct, "Die Zeile(n) " + correctAnswers + " sind richtig");
		}

		if (!ArrayUtil.isEmpty(wrongAnswers)) {
			super.addHint(Hints.Wrong, "Die Zeile(n) " + wrongAnswers + " sind falsch");
		}

		super.increasePoints(points);
		super.savePoints();
	}

	/**
	 * Resets the attributes of the current task to its default values.
	 */
	public reset(): void {
		super.reset();
		this.evaluatedTask = false;
		this.input = "";
	}

	/**
	 * Method to test whether the given string is a number or not
	 * @param e the argument to be tested
	 * @return {@code true} if {@code e} is a number, {@code false} otherwise.
	 */
	private numberFilter(e: string): boolean {
		const regex = new RegExp(/^\d+$/);
		return regex.test(e);
	}

    /**
     * Stores the current state of the component.
     */
	public storeInputValues(): void {
		const data = {
			input: this.input,
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
			this.input = task.data.input;
			this.hints = ArrayUtil.copyOf(task.data.hints);
		}
	}
}
