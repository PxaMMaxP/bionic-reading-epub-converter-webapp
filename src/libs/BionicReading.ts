/**
 * Utility class for Bionic Reading formatting.
 */
export class BionicReading {
    /**
     * The maximum length of a word to be completely bolded.
     */
    private static readonly MAX_BOLD_LENGTH = 3;

    /**
     * Determines how many characters of a word should be bold based on its length.
     * @param length - The length of the word.
     * @returns The number of characters to be bold.
     */
    static getBoldPoint(length: number): number {
        if (length <= this.MAX_BOLD_LENGTH) {
            return length; // Bold the entire word if it is 3 characters or less.
        }
        return this.calculateBoldLength(length);
    }

    /**
     * Calculates the number of characters to be bold for words longer than MAX_BOLD_LENGTH.
     * @param length - The length of the word.
     * @returns The number of characters to be bold.
     */
    private static calculateBoldLength(length: number): number {
        return Math.ceil(Math.log2(length));
    }
}
