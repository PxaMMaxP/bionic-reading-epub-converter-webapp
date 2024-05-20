import JSZip from 'jszip';
import { Parser } from 'htmlparser2';
import { DomHandler, Element, Node } from 'domhandler';
import { selectAll } from 'css-select';
import { DomUtils } from 'htmlparser2';
import { saveAs } from 'file-saver';
import { DataNode } from 'domhandler'; // Import the missing DataNode type
import { EpubHandler } from './libs/EpubHandler';
import { HtmlProcessor } from './libs/HtmlProcessor';

/**
 * Represents the main application class.
 */
export default class App {
    private _epubHandler: EpubHandler;

    /**
     * Initializes a new instance of the App class.
     */
    constructor() {
        console.log('App initialized');
        this.addEventListeners();

        this._epubHandler = new EpubHandler();
    }

    /**
     * Adds event listeners to the necessary elements.
     */
    private addEventListeners() {
        console.log('Adding event listeners');
        document
            .getElementById('fileInput')
            ?.addEventListener('change', this.handleFileUpload.bind(this));
    }

    /**
     * Handles the file upload event.
     * @param event - The file upload event.
     */
    private async handleFileUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = async (e) => {
                if (e.target) {
                    const arrayBuffer = e.target.result as ArrayBuffer;
                    await this._epubHandler.load(arrayBuffer);

                    const htmlProcessor = new HtmlProcessor();
                    const htmlFiles = this._epubHandler.getFiles('.html');
                    htmlFiles.forEach((file) => {
                        const htmlContent = file.getTextContent() as string;
                        const processedContent =
                            htmlProcessor.process(htmlContent);
                        file.setContent(processedContent);
                    });

                    const newEpub = await this._epubHandler.pack();
                    saveAs(newEpub, 'modified.epub');
                }
            };

            reader.readAsArrayBuffer(file);
        }
    }
}
