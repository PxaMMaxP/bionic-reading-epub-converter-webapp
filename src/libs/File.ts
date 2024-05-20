/**
 * Represents a file with its path and content.
 */
export class File {
    private path: string;
    private content: string | ArrayBuffer;

    /**
     * Creates a new File instance.
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
        if (typeof this.content === 'string') {
            return this.content;
        } else {
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(this.content);
        }
    }

    /**
     * Sets the content of the file.
     * @param content - The new content of the file.
     */
    setContent(content: string | ArrayBuffer): void {
        this.content = content;
    }
}
