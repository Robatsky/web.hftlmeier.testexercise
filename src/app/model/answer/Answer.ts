import { AnswerType } from "./AnswerType";

export class Answer {
    private readonly answerType: AnswerType;
    private readonly answerText: string;
    private readonly answerHint: string;

    constructor(answerType: AnswerType, answerText: string, answerHint: string) {
        this.answerType = answerType;
        this.answerText = answerText;
        this.answerHint = answerHint;
    }

    public getType(): AnswerType {
        return this.answerType;
    }

    public getAnswer(): string {
        return this.answerText;
    }

    public getHint(): string {
        return this.answerHint;
    }
}