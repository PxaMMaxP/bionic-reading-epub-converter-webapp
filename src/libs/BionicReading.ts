/**
 * Utility class for Bionic Reading formatting.
 *
 * The `BionicReading` class provides a method to determine how many characters
 * of a word should be bolded based on the word's length. This is useful for
 * applications implementing Bionic Reading, a technique to improve reading speed
 * and comprehension by highlighting the first few characters of a word.
 *
 * Key Features:
 * - Configurable maximum length for fully bolded words.
 * - Logarithmic calculation for partial bolding of longer words.
 *
 * Example usage:
 * ```typescript
 * const boldPoint = BionicReading.getBoldPoint(word.length);
 * const boldedText = word.slice(0, boldPoint) + word.slice(boldPoint);
 * ```
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
