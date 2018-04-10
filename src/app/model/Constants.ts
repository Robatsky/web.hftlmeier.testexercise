export class Constants {
    public static NUMBER_TO_TASK = new Map([
        [0, "Nenne-Aufgabe"],
        [1, "Ordne-Zu-Aufgabe"]
    ]);

    /**
     * Tries to get the corresponding element to the given {@code key}.
     * @param key the key of the element to be returned
     * @return either the corresponding element or {@code undefined}
     */
    public static get(key : number) : String {
        return this.NUMBER_TO_TASK.get(key);
    }
}