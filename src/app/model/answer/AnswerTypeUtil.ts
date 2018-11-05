import { AnswerType } from "./AnswerType";

export class AnswerTypeUtil {
    public static answerTypeFromString(name: string): AnswerType {
        switch (name) {
            case "GOOD": return AnswerType.GOOD;
            case "WRONG": return AnswerType.WRONG;
            default: return AnswerType.INFO;
        }
    }

    public static toString(type: AnswerType): string {
        return AnswerType[type];
    }
}