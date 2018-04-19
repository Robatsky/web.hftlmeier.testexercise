import { Injectable } from '@angular/core';
import { BasicTask } from '../model/task/BasicTask';

@Injectable()
export class TaskService {

	private arr: TaskEntry[];

	constructor() {
		this.arr = [];
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

	public updateTaskPoints(id: number, points: number) {
		const entry = this.arr.find(element => element.id == id);
		entry.results.reachedPoints.push(points);
		console.log("neues Punkte-Array: " + entry.results.reachedPoints);
		
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
		return { id: comp.getID(), title: comp.getTitle(), results: { reachedPoints: [] }, data: null };
	}

	public getAllTasknames(): string[] {
		return this.arr.map(e => e.title);
	}

	public getAllTaskResults(): ResultSet[] {
		return this.arr.map(e => e.results);
	}
}

interface TaskEntry {
	id: number,
	title:string,
	results: ResultSet,
	data: any
}

interface ResultSet {
	reachedPoints: number[],

}
