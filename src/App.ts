import { saveAs } from 'file-saver';
import { EpubFile } from './libs/EpubFile';
import { EpubHandler } from './libs/EpubHandler';
import { HtmlProcessor } from './libs/HtmlProcessor';

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
                this.handleFileUpload.bind(this),
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
            this.hideFileInput();
            this.showLoadingSpinner();

            const startTime = performance.now(); // Start time measurement
            await this.processFile(file);
            const endTime = performance.now(); // End time measurement

            this.hideLoadingSpinner();
            this.showSuccessMessage(this.showFileInput.bind(this));
            input.value = ''; // Clear the input field
            this._epubHandler = new EpubHandler(); // Reset the EPUB handler

            const processingTime = (endTime - startTime) / 1000;
            const seconds = Math.floor(processingTime);
            const milliseconds = Math.floor((processingTime - seconds) * 1000);

            console.info(
                `File processing time: ${seconds} seconds and ${milliseconds} milliseconds`,
            );
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
        htmlFiles: EpubFile[],
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

    /**
     * Shows the loading spinner and hides the file input.
     */
    private showLoadingSpinner(): void {
        const spinner = document.getElementById('loading-spinner');

        if (spinner) {
            spinner.style.display = 'block';
        }
    }

    /**
     * Hides the loading spinner and shows the file input.
     */
    private hideLoadingSpinner(): void {
        const spinner = document.getElementById('loading-spinner');

        if (spinner) {
            spinner.style.display = 'none';
        }
    }

    /**
     * Hides the file input.
     */
    private hideFileInput(): void {
        const fileInput = document.getElementById('fileInput');

        if (fileInput) {
            fileInput.style.display = 'none';
        }
    }

    /**
     * Shows the file input.
     */
    private showFileInput(): void {
        const fileInput = document.getElementById('fileInput');

        if (fileInput) {
            fileInput.style.display = 'block';
        }
    }

    /**
     * Shows the success message.
     * @param callback The optional callback function to execute after showing the message.
     */
    private showSuccessMessage(callback?: () => void): void {
        const successMessage = document.getElementById('success-message');

        if (successMessage) {
            successMessage.style.display = 'block';

            setTimeout(() => {
                successMessage.style.display = 'none';

                if (callback) {
                    callback();
                }
            }, 3000); // Display the success message for 3 seconds
        }
    }
}
