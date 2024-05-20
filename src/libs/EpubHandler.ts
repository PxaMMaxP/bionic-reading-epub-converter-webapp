import JSZip from 'jszip';
import { File } from './File';

/**
 * Represents a handler for EPUB files.
 */
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

        // Ensure the mimetype file is the first and not compressed
        if (this.files['mimetype']) {
            newZip.file('mimetype', this.files['mimetype'].getContent(), {
                compression: 'STORE',
            });
        }

        Object.keys(this.files).forEach((path) => {
            if (path !== 'mimetype') {
                const file = this.files[path];
                const content = file.getContent();
                if (typeof content === 'string') {
                    newZip.file(path, content);
                } else {
                    newZip.file(path, content);
                }
            }
        });

        return await newZip.generateAsync({ type: 'blob' });
    }
}
