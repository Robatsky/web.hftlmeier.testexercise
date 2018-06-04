import { Injectable } from '@angular/core';
import { BasicTask } from '../model/task/BasicTask';
import { log } from 'util';

@Injectable()
export class TaskService {

	private readonly INITIAL_RESULT_VALUE = -1;

	private arr: TaskEntry[];
	private entries: any[];

	constructor() {
		this.arr = [];
	}

	/**
	 * Overrides the current entries array which contains the 
	 * references to the navbar items.
	 * @param entries new navbar entries
	 */
	public setNavbarEntries(entries: any[]):void {
		this.entries = entries;
	}

	/**
	 * Enables the item at the given {@code idx}
	 * @param idx the index of the item will be enabled
	 */
	public enableNavbarTaskEntryAt(idx: number): void {
		if(idx < this.entries.length) {
			this.entries[idx].active = true;
		}
	}

	/**
	 * Registeres the given component to the TaskService.
	 * Each Component can only be registered once. Two components are considered
	 * to be equal if and only if there ID attribute is the same.
	 * @param comp the TaskComponent to be registered
	 * @return {@code true} if the component was registered, {@code false} otherwise.
	 */
	public registerTaskComponent(comp: BasicTask): boolean {
		if (!this.arr.find(e => e.id == comp.getID())) {
			this.arr.push(this.taskComponentToTaskEntry(comp));
			return true;
		}
		return false;
	}

	/**
	 * Takes an id and the amount of points and updates the
	 * point array of the corresponding task.
	 * @param id the id of the task to be updated
	 * @param points the points to push into the points array
	 */
	public updateTaskPoints(id: number, points: number): void {
		const entry = this.arr.find(element => element.id == id);
		if(entry.results.firstResult == this.INITIAL_RESULT_VALUE) {
			entry.results.firstResult = points;
		}
		entry.results.currResult = points;
		
	}

	/**
	 * Stores/overwrites the given information (results and data) for the task
	 * with the corresponding id.
	 * @param id the id of the task to store the data
	 * @param results the result data to store
	 * @param data the new data (such as userinput) to store
	 */
	public storeTaskData(id: number, results: ResultSet, data: any): void {
		let entry = this.arr.find(element => element.id == id);
		entry.data = data;
		entry.results = results == null ? entry.results : results;
	}

	/**
	 * Finds the task with the corresponding id and return its data.
	 * The data is the entire TaskEntry object.
	 * @param id the id of the task to restore the data
	 * @return the TaskEntry object of the task
	 */
	public restoreTaskData(id: number): TaskEntry {
		let entry = this.arr.find(element => element.id == id);
		return entry;
	}

	/**
	 * Takes a component as parameter and converts it into a valid TaskEntry object.
	 * @param comp the component to convert
	 * @return the component as a TaskEntry object
	 */
	private taskComponentToTaskEntry(comp: BasicTask): TaskEntry {
		return { id: comp.getID(), title: comp.getTitle(), results: { firstResult: this.INITIAL_RESULT_VALUE, currResult: this.INITIAL_RESULT_VALUE }, data: null };
	}

	/**
	 * Returns the current total amount of points that the user reached at this task.
	 * @return total amount of points
	 */
	private getTotalTaskPoints(): number {
		return this.arr.map(e => e.results.currResult).reduce((acc, value) => acc + value);
	}

	/**
	 * Returns the amount of points that the user reached at his first try.
	 * @return points at first try
	 */
	private getFirstTryTaskPoints(): number {
		return this.arr.map(e => e.results.firstResult).reduce((acc, value) => acc + value);
	}

	/**
	 * Sends the task results to the ilias server
	 */
	public sendResultsToIlias(): void {
		if(!this.allTaskFinished()) {
			console.log("Es wurden noch nicht alle Aufgaben bestanden!");
			return;
		}
		console.log("First: " + this.getFirstTryTaskPoints());
		console.log("Total: " + this.getTotalTaskPoints());
	}

	/**
	 * Checkes whether all tasks have been passed.
	 * @return {@code true} if all tasks have been passed, {@code false} otherwise.
	 */
	public allTaskFinished(): boolean {
		return this.entries.filter(e => !e.active).length == 0;
	}
}

interface TaskEntry {
	id: number,
	title:string,
	results: ResultSet,
	data: any
}

interface ResultSet {
	firstResult,
	currResult
}
