import { ActivatedRoute, Router } from "@angular/router";

export abstract class BasicTask {

    // model attributes containing important information
    // about this task
    private id: number;
    private title: string;
    private question: string;
    private data: any;

    // points the user has collected
    private points: number;

    private hints = [{ styleClass: "", text: "" }];

    constructor(private route: ActivatedRoute,
        private router: Router) {
        this.id = route.snapshot.data[0].id;
        this.title = route.snapshot.data[0].name;
        this.data = route.snapshot.data[0].data;
        this.question = route.snapshot.data[0].question;
    }


	/**
	 * Jumpes to the next task.
	 * The next task has the id {@code this.id+2} due to the fact,
	 * that the task ids start with 0 and the first task is at
	 * the second page.
	 */
    private nextTask(): void {
        this.router.navigateByUrl(this.router.config[this.id + 2].path);
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
    public increatePoints(val: number): void {
        this.points += val;
    }

	/**
	 * Evaluates the inputs from the user.
	 * If there are empty input fields there is no further evaluation.	
	 */
    public abstract evaluateInput(): void;

}