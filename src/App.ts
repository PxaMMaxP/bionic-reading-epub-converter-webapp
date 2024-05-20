import { saveAs } from 'file-saver';
import { EpubHandler } from './libs/EpubHandler';
import { HtmlProcessor } from './libs/HtmlProcessor';
import { EpubFile } from './libs/EpubFile';

/**
 * Represents the main application class.
 *
 * The `App` class serves as the main entry point for the application. It handles the initialization,
 * user interactions, and the processing of EPUB files. The class leverages `EpubHandler` for handling
 * EPUB files, `HtmlProcessor` for processing HTML content, and `file-saver` for saving the processed
 * files.
 *
 * Key Features:
 * - Initialize the application and set up event listeners.
 * - Handle file uploads and read the content of EPUB files.
 * - Process the HTML files within the EPUB using `HtmlProcessor`.
 * - Save the processed EPUB file with a new name.
 *
 * Example usage:
 * ```typescript
 * const app = new App();
 * ```
 */
export default class App {
    private _epubHandler: EpubHandler;

    /**
     * Initializes a new instance of the App class.
     */
    constructor() {
        console.log('App initialized');
        this._epubHandler = new EpubHandler();
        this.addEventListeners();
    }

    /**
     * Adds event listeners to the necessary elements.
     */
    private addEventListeners(): void {
        console.log('Adding event listeners');
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener(
                'change',
                this.handleFileUpload.bind(this)
            );
        }
    }

    /**
     * Handles the file upload event.
     * @param event - The file upload event.
     */
    private async handleFileUpload(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            await this.processFile(file);
        }
    }

    /**
     * Processes the uploaded file.
     * @param file - The uploaded file.
     */
    private async processFile(file: File): Promise<void> {
        const arrayBuffer = await this.readFileAsArrayBuffer(file);
        await this._epubHandler.load(arrayBuffer);

        const htmlProcessor = new HtmlProcessor();
        const htmlFiles = this._epubHandler.getFiles('html'); // Get all (x)HTML files
        this.processHtmlFiles(htmlProcessor, htmlFiles);

        const newEpub = await this._epubHandler.pack();
        this.saveProcessedEpub(newEpub, file.name);
    }

    /**
     * Reads the file as an ArrayBuffer.
     * @param file - The file to read.
     * @returns A promise that resolves with the ArrayBuffer of the file.
     */
    private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    resolve(e.target.result as ArrayBuffer);
                } else {
                    reject(new Error('File reading failed'));
                }
            };
            reader.onerror = (e) => {
                reject(new Error('File reading error'));
            };
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Processes the HTML files in the EPUB.
     * @param htmlProcessor - The HtmlProcessor instance.
     * @param htmlFiles - The array of HTML files to process.
     */
    private processHtmlFiles(
        htmlProcessor: HtmlProcessor,
        htmlFiles: EpubFile[]
    ): void {
        htmlFiles.forEach((file) => {
            const htmlContent = file.getTextContent() as string;
            const processedContent = htmlProcessor.process(htmlContent);
            file.setContent(processedContent);
        });
    }

    /**
     * Saves the processed EPUB file.
     * @param newEpub - The processed EPUB file as a Blob.
     * @param originalFileName - The original file name of the uploaded EPUB.
     */
    private saveProcessedEpub(newEpub: Blob, originalFileName: string): void {
        const newFileName = this.generateNewFileName(originalFileName);
        saveAs(newEpub, newFileName);
    }

    /**
     * Generates a new file name for the processed EPUB.
     * @param originalFileName - The original file name of the uploaded EPUB.
     * @returns The new file name for the processed EPUB.
     */
    private generateNewFileName(originalFileName: string): string {
        return originalFileName.replace(/\.epub$/, '') + '_bionic.epub';
    }
}
