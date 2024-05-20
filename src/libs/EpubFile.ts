/**
 * Represents an EPUB file with its path and content.
 *
 * The `EpubFile` class provides a simple abstraction for an EPUB file, encapsulating its path
 * and content. The content can be either a string or an ArrayBuffer. The class
 * offers methods to get the file path, retrieve the content in its original form,
 * and decode the content to a string if it is stored as an ArrayBuffer.
 *
 * Key Features:
 * - Store and retrieve the path and content of an EPUB file.
 * - Automatically decode ArrayBuffer content to a string using UTF-8 encoding.
 *
 * Example usage:
 * ```typescript
 * const epubFile = new EpubFile('path/to/file.txt', new ArrayBuffer(10));
 * console.log(epubFile.getPath()); // Outputs: 'path/to/file.txt'
 * console.log(epubFile.getContent()); // Outputs: ArrayBuffer(10)
 * console.log(epubFile.getTextContent()); // Outputs: Decoded string content
 * epubFile.setContent('new content');
 * console.log(epubFile.getContent()); // Outputs: 'new content'
 * ```
 */
export class EpubFile {
    private readonly path: string;
    private content: string | ArrayBuffer;

    /**
     * Creates a new EpubFile instance.
     * @param path - The path of the file.
     * @param content - The content of the file.
     */
    constructor(path: string, content: string | ArrayBuffer) {
        this.path = path;
        this.content = content;
    }

    /**
     * Gets the path of the file.
     * @returns The path of the file.
     */
    getPath(): string {
        return this.path;
    }

    /**
     * Gets the content of the file.
     * @returns The content of the file.
     */
    getContent(): string | ArrayBuffer {
        return this.content;
    }

    /**
     * Gets the text content of the file.
     * If the content is an ArrayBuffer, it will be decoded using UTF-8.
     * @returns The text content of the file.
     */
    getTextContent(): string {
        return typeof this.content === 'string'
            ? this.content
            : this.decodeContent(this.content);
    }

    /**
     * Decodes the ArrayBuffer content to a string using UTF-8 encoding.
     * @param content - The ArrayBuffer content to decode.
     * @returns The decoded text content.
     */
    private decodeContent(content: ArrayBuffer): string {
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(content);
    }

    /**
     * Sets the content of the file.
     * @param content - The new content of the file.
     */
    setContent(content: string | ArrayBuffer): void {
        this.content = content;
    }
}
