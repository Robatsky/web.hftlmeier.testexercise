export class InputMatcher {
    /**
     * Computes the levensthein distance of 2 strings
     * @param first the first string to be compared
     * @param second the second string to be compared
     * @return an integer which is the levenshtein distance.
     */
    public static levenstheinDistance(first: string, second: string): number {

        // length of both words + 1, due to the empty entry at the beginning
        const lenFirst: number = first.length + 1;
        const lenSec: number = second.length + 1;

        // 2 costs array to swap them. We need two because we have to know the 
        // values before the current value
        let costs: number[] = Array.from(new Array(lenFirst).keys());
        let newCosts: number[] = new Array(lenFirst);

        for (let j = 1; j < lenSec; j++) {
            newCosts[0] = j;

            for (let i = 1; i < lenFirst; i++) {
                // last 2 chars equal?
                const match: number = first.charAt(i - 1) === second.charAt(j - 1) ? 0 : 1;

                const cost_replace: number = costs[i - 1] + match;
                const cost_insert: number = costs[i] + 1;
                const cost_delete: number = newCosts[i - 1] + 1;

                // minimum of the 3 costs
                newCosts[i] = this.min(cost_insert, cost_delete, cost_replace);
            }
            let swap: number[] = costs;
            costs = newCosts;
            newCosts = swap;
        }

        return costs[lenFirst - 1];
    }

    /**
     * Compares 3 numbers and returns the minimum.
     * @param a first number to compare
     * @param b second number to compare
     * @param c third number to compare
     */
    private static min(a: number, b: number, c: number): number {
        return Math.min(Math.min(a, b), c);
    }
}