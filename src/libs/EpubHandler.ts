import JSZip from 'jszip';
import { EpubFile } from './EpubFile';

/**
 * Class representing a handler for EPUB files.
 *
 * The `EpubHandler` class provides functionalities to load, manipulate, and pack EPUB files.
 * It utilizes the `JSZip` library to handle the underlying ZIP structure of EPUB files and
 * manages the individual files within the EPUB archive.
 *
 * Key Features:
 * - Asynchronously load EPUB files from an `ArrayBuffer`.
 * - Access and filter files within the EPUB by their paths or extensions.
 * - Pack the EPUB files back into a `Blob` for downloading or further processing.
 *
 * Example usage:
 * ```typescript
 * const epubHandler = new EpubHandler();
 * await epubHandler.load(epubData);
 * const filePaths = epubHandler.getFilePaths();
 * const htmlFiles = epubHandler.getFiles('.html');
 * const packedEpub = await epubHandler.pack();
 * ```
 */
export class EpubHandler {
    private _zip: JSZip;
    private _files: { [key: string]: EpubFile };

    /**
     * Creates an instance of EpubHandler.
     */
    constructor() {
        this._zip = new JSZip();
        this._files = {};
    }

    /**
     * Loads the EPUB file asynchronously.
     * @param epubData - The EPUB file data as an ArrayBuffer.
     * @returns A promise that resolves when the EPUB file is loaded.
     */
    async load(epubData: ArrayBuffer): Promise<void> {
        this._zip = await JSZip.loadAsync(epubData);
        await this.loadFiles();
    }

    /**
     * Loads files from the zip object into the files dictionary.
     */
    private async loadFiles(): Promise<void> {
        const filePromises = Object.keys(this._zip.files).map(async (path) => {
            const file = this._zip.files[path];

            if (!file.dir) {
                const content = await file.async('arraybuffer');
                this._files[path] = new EpubFile(path, content);
            }
        });
        await Promise.all(filePromises);
    }

    /**
     * Gets an array of all file paths in the EPUB.
     * @returns An array of file paths.
     */
    getFilePaths(): string[] {
        return Object.keys(this._files);
    }

    /**
     * Gets an array of all files in the EPUB.
     * @param extension - Optional. Filters the files by extension.
     * @returns An array of files.
     */
    getFiles(extension?: string): EpubFile[] {
        return extension
            ? this.filterFilesByExtension(extension)
            : Object.values(this._files);
    }

    /**
     * Filters the files by a given extension.
     * @param extension - The file extension to filter by.
     * @returns An array of files with the given extension.
     */
    private filterFilesByExtension(extension: string): EpubFile[] {
        return Object.values(this._files).filter((file) =>
            file.getPath().endsWith(extension),
        );
    }

    /**
     * Packs the EPUB files into a Blob.
     * @returns A promise that resolves with the packed EPUB as a Blob.
     */
    async pack(): Promise<Blob> {
        const newZip = new JSZip();
        this.addMimeTypeToZip(newZip);
        this.addFilesToZip(newZip);

        return await newZip.generateAsync({ type: 'blob' });
    }

    /**
     * Adds the mimetype file to the zip, ensuring it is the first and not compressed.
     * @param newZip - The JSZip instance to add the mimetype file to.
     */
    private addMimeTypeToZip(newZip: JSZip): void {
        if (this._files['mimetype']) {
            newZip.file('mimetype', this._files['mimetype'].getContent(), {
                compression: 'STORE',
            });
        }
    }

    /**
     * Adds all files, except the mimetype, to the zip.
     * @param newZip - The JSZip instance to add files to.
     */
    private addFilesToZip(newZip: JSZip): void {
        Object.keys(this._files).forEach((path) => {
            if (path !== 'mimetype') {
                const file = this._files[path];
                const content = file.getContent();
                newZip.file(path, content);
            }
        });
    }
}
