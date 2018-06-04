import { InputMatcher } from "./InputMatcher";
import { log } from "util";

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
    public static shuffle<T>(array: T[]): T[] {
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
    private static swap<T>(array: T[], curr: number, next:number) {
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
        console.log(array);
        
        array.forEach((entry,id) => {
            const currentMin = InputMatcher.levenstheinDistance(entry.toLowerCase(), value.toLowerCase());
            console.log("antwort: " + value + "  current: " + entry + "   " + currentMin);
            
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
    public static copyOf<T>(array: T[]): T[] {
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

    /**
     * Checks whether the given array is empty or not.
     * @param arr the array to be checked
     * @return {@code true} if the given array is empty, {@code false} otherwise.
     */
    public static isEmpty<T>(arr: T[]): boolean {
        return arr.length === 0;
    }
    
    /**
     * Checks whether the given array has duplicated values or not.
     * @param arr the array to be checked.
     * @return {@code true} if the array has duplicates, {@code false} otherwise.
     */
    public static hasDuplicates<T>(arr: T[]): boolean {
        return arr.length != new Set(arr).size;
    }
    
    
    /**
     * Returns the maximum element in the given array
     * @param array array to find the maximum number
     * @return the maximum element in the array
     */
    public static max<T>(array: T[]): T {
        return array.reduce((prev,curr) => (prev > curr) ? prev : curr);
    }

    public static min<T>(array: T[]): T {
        return array.reduce((prev, curr) => (prev < curr) ? prev : curr);
    }

    /**
     * Removes all non-numeric elements from the given array and returns a new array
     * containing only numeric elements.
     * @param array the array to be filtered
     * @return a new array containing the numeric elements of the given array.
     */
    public static filterNonNumeric(array: string[]): number[] {
        return array.filter(this.numberFilter).map(e => parseInt(e));
    }

	/**
	 * Method to test whether the given string is a number or not
	 * @param e the argument to be tested
	 * @return {@code true} if {@code e} is a number, {@code false} otherwise.
	 */
	private static numberFilter(e: string): boolean {
		const regex = new RegExp(/^\d+$/);
		return regex.test(e);
    }

    /**
     * Removes all duplicates from the given array and returns a new array
     * containing only the unique elements.
     * @param array the array to be filtered
     * @return an array containing the unique elements.
     */
    public static removeDuplicates<T>(array: T[]): T[] {
        return array.filter(this.distinctFilter);
    }
    
    /**
     * Checks whether the given element is unique in the array or not.
     * @param elem the element to be tested if there are duplicates
     * @param pos the position of the element to be tested
     * @param arr the array to be tested
     * @return {@code true} if element is not unique, {@code false} otherwise.
     */
	public static distinctFilter<T>(elem: T, pos: number, arr: T[]): boolean {
		return arr.indexOf(elem) === pos;
    }


}
