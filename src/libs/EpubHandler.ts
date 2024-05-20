/**
 * Represents a handler for EPUB files.
 */
import JSZip from 'jszip';
import { File } from './File';

export class EpubHandler {
    private zip: JSZip;
    private files: { [key: string]: File };

    /**
     * Creates an instance of EpubHandler.
     */
    constructor() {
        this.zip = new JSZip();
        this.files = {};
    }

    /**
     * Loads the EPUB file asynchronously.
     * @param epubData - The EPUB file data as an ArrayBuffer.
     * @returns A promise that resolves when the EPUB file is loaded.
     */
    async load(epubData: ArrayBuffer): Promise<void> {
        this.zip = await JSZip.loadAsync(epubData);
        const filePromises = Object.keys(this.zip.files).map(async (path) => {
            const file = this.zip.files[path];
            if (!file.dir) {
                const content = await file.async('arraybuffer');
                this.files[path] = new File(path, content);
            }
        });
        await Promise.all(filePromises);
    }

    /**
     * Gets the file with the specified path.
     * @param path - The path of the file.
     * @returns The file with the specified path, or null if not found.
     */
    getFile(path: string): File | null {
        return this.files[path] || null;
    }

    /**
     * Sets the content of the file with the specified path.
     * If the file does not exist, it creates a new file.
     * @param path - The path of the file.
     * @param content - The content of the file as a string or ArrayBuffer.
     */
    setFile(path: string, content: string | ArrayBuffer): void {
        if (this.files[path]) {
            this.files[path].setContent(content);
        } else {
            this.files[path] = new File(path, content);
        }
    }

    /**
     * Gets an array of all file paths in the EPUB.
     * @returns An array of file paths.
     */
    getFilePaths(): string[] {
        return Object.keys(this.files);
    }

    /**
     * Gets an array of all files in the EPUB.
     * @param extension - Optional. Filters the files by extension.
     * @returns An array of files.
     */
    getFiles(extension?: string): File[] {
        if (extension) {
            return Object.values(this.files).filter((file) =>
                file.getPath().endsWith(extension)
            );
        }
        return Object.values(this.files);
    }

    /**
     * Packs the EPUB files into a Blob.
     * @returns A promise that resolves with the packed EPUB as a Blob.
     */
    async pack(): Promise<Blob> {
        const newZip = new JSZip();
        Object.keys(this.files).forEach((path) => {
            const file = this.files[path];
            const content = file.getContent();
            if (typeof content === 'string') {
                newZip.file(path, content);
            } else {
                newZip.file(path, content);
            }
        });
        return await newZip.generateAsync({ type: 'blob' });
    }
}
