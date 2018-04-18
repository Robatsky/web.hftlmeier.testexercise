import { InputMatcher } from "./InputMatcher";

export class ArrayUtil {

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

            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    }

    /**
     * Searches in the given array for a specific string.
     * If the minimum computed levenshtein distance is less than 5, the given value
     * is present in the array.
     * @param array the array to be checked
     * @param value the word to be checked
     * @return {@code true} the at least one of the distances is less than 5, {@code false} otherwise
     */
    public static arrayApproxContains(array: string[], value: string): boolean {
        let min = Number.MAX_SAFE_INTEGER;

        array.forEach(entry => {
            const currentMin = InputMatcher.levenstheinDistance(entry.toLocaleLowerCase(), value.toLowerCase());
            min = Math.min(currentMin, min);
        });

        return min <= 5;
    }

    /**
     * Takes an string array and returns a copy of the given array.
     * @param array the array to be copied
     * @return an copy of the given array
     */
    public static copyOf(array: string[]): string[] {
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
}
