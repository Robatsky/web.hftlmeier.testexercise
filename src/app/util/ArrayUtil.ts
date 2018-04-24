import { InputMatcher } from "./InputMatcher";

export class ArrayUtil {

    /**
     * Private class in order to prevent this class from
     * being extendet.
     */
    private constructor() {}

    /**
     * Shuffles an array randomly and returns it.
     * @param array the array to be shuffled
     * @return the shuffled array.
     */
    public static shuffle(array: string[]): string[] {
        let counter = array.length;

        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter--;
            this.swap(array, counter, index);
        }
        return array;
    }

    /**
     * Swappes the element at the {@code curr} index with the element
     * at the {@code next} index in the given {@code array}.
     * @param array the array to swap the elements in
     * @param curr the first element to be swapped
     * @param next the second element to be swapped
     */
    private static swap(array: string[], curr: number, next:number) {
        let temp = array[curr];
        array[curr] = array[next];
        array[next] = temp;
    }

    /**
     * Searches in the given array for a specific string.
     * If the minimum computed levenshtein distance is less than 5, the given value
     * is present in the array.
     * @param array the array to be checked
     * @param value the word to be checked
     * @return {@code true} the at least one of the distances is less than 5, {@code false} otherwise
     */
    public static arrayApproxContains(array: string[], value: string): number {
        let min = Number.MAX_SAFE_INTEGER;
        let idx = -1;
        array.forEach((entry,id) => {
            const currentMin = InputMatcher.levenstheinDistance(entry.toLowerCase(), value.toLowerCase());
            if(currentMin < min) {
                min = currentMin;
                idx = id;
            }
        });

        return this.isEvaluationGoodEnough(min) ? idx : -1;
    }

    /**
     * If the given {@code value} is less than or equal to a certain
     * number the evaluation is good enough and {@code true} is being returned.
     * @param val value to be checked
     * @return {@code true} if the evaluation is less than or equal to 5, {@code false} otherwise.
     */
    private static isEvaluationGoodEnough(val: number) {
        return val <= 5;
    }

    /**
     * Takes an string array and returns a copy of the given array.
     * @param array the array to be copied
     * @return an copy of the given array
     */
    public static copyOf(array: string[]): any[] {
        return array.slice(0, array.length);
    }


	/**
	 * Checks whether the given {@code arr} has the element {@code val} in its collection.
	 * @param arr the collection to be checked
	 * @param val the value to be checked whether it its in the collection or not
	 * @return {@code true} if the collection has at least one element equal to {@code val}, {@code false} otherwise.
	 */
    public static arrayContains<T>(arr: T[], val: T): boolean {
        return arr.indexOf(val) != -1;
    }

    public static isEmpty<T>(arr: T[]): boolean {
        return arr.length === 0;
    }
}
