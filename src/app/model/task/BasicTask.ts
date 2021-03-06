import { ActivatedRoute, Router } from "@angular/router";
import { OnDestroy, OnInit } from "@angular/core";
import { TaskService } from "../../services/task.service";

export abstract class BasicTask implements OnInit, OnDestroy {

    // model attributes containing important information
    // about this task
    protected id: number;
    public title: string;
    public question: string;
    public data: any;

    // points the user has collected
    public points: number;
    public reqpoints: number;
    public maxpoints: number;

    public hints = [{ styleClass: "", text: "" }];

    public evaluatedTask: boolean = false;


    constructor(private route: ActivatedRoute,
        private router: Router,
        protected taskService: TaskService) {
        this.id = route.snapshot.data[0].id;
        this.title = route.snapshot.data[0].name;
        this.data = route.snapshot.data[0].data;
        this.question = route.snapshot.data[0].question;
        this.reqpoints = route.snapshot.data[0].reqpoints;
        this.maxpoints = route.snapshot.data[0].maxpoints;

        taskService.registerTaskComponent(this);
    }

    /**
     * Gets called each time the component loses focus.
     * Calls the {@see storeInputValues()} method.
     */
    public ngOnDestroy(): void {
        this.storeInputValues();
    }

    /**
     * Gets called each time the component is getting the focus.
     * Calls the {@see restoreInputValues()} method.
     */
    public ngOnInit(): void {
        this.restoreInputValues();
    }

	/**
	 * Jumpes to the next task.
	 * The next task has the id {@code this.id+2} due to the fact,
	 * that the task ids start with 0 and the first task is at
	 * the second page.
	 */
    private nextTask(): void {
        this.router.navigateByUrl(this.router.config[(this.id + 2) % this.router.config.length].path);
    }

    public savePoints(): void {
        this.taskService.updateTaskPoints(this.id, this.points);
    }

    /**
	 * Resets the attributes of the current task to its default values.
	 */
    public reset(): void {
        this.hints = [];
        this.points = 0;
    }

    /**
     * Adds a new hint to the hint array which is bound to the corresponding html component.
     * @param styleClass the styleclass that decides how the hint is being displayed
     * @param text the text to display
     */
    public addHint(styleClass: string, text: string): void {
        this.hints.push({ styleClass: styleClass, text: text });
    }

    /**
     * Returns the answers of this task as a string array.
     * @return the answers of this task
     */
    public getAnswers(): string[] {
        return this.data.answers;
    }

    /**
     * Returns the data object of this task.
     * @return the data object
     */
    public getData(): any {
        return this.data;
    }

    /**
     * Increases the points by a certain amount.
     * @param val the amount to be added to the points
     */
    public increasePoints(val: number): void {
        this.points = Math.max(0, this.points + val);
    }

    /**
     * Returns the id of this task.
     * @return the id.
     */
    public getID(): number {
        return this.id;
    }

    /**
     * Returns the title of this task.
     * @return the title.
     */
    public getTitle(): string {
        return this.title;
    }

    /**
	 * Checks and returns whether the task has already been evaluated.
	 * @return {@code true} if the task is already evaluated, {@code false} otherwise.
	 */
    public alreadyEvaluated(): boolean {
        return this.evaluatedTask;
    }


	/**
	 * Evaluates the inputs from the user.
	 * If there are empty input fields there is no further evaluation.	
	 */
    public abstract evaluateInput(): void;

    /**
     * Stores the current state of the component.
     */
    public abstract storeInputValues(): void;

    /**
     * Restores the most recent state of the component.
     */
    public abstract restoreInputValues(): void;
}

export enum Hints {
    Correct = "badge-success",
    Wrong = "badge-danger",
    Info = "badge-warning"
}