import { marked } from 'marked';

/**
 * Configuration class for the Bionic Reading EPUB Converter application.
 *
 * The `Config` class contains static properties and methods that provide configuration
 * settings for the application, such as version, title, description, and author information.
 * It also includes a method to update the HTML content of the application's index page.
 */
export default class Config {
    public static readonly version = '0.8.0';
    public static readonly title = 'Bionic Reading EPUB Converter';
    public static readonly description = 'Convert EPUB to Bionic Reading EPUB.';
    public static readonly author = 'M. Passarello';
    public static readonly githubProfile = 'https://github.com/PxaMMaxP';
    public static readonly githubRepository =
        'https://github.com/PxaMMaxP/bionic-reading-epub-converter-webapp';
    public static readonly longDescription = `This webapp allows you to convert an EPUB file to a Bionic Reading EPUB file.

With this tool, you can enhance your reading experience by applying Bionic Reading principles to your EPUB files. Bionic Reading focuses on guiding the eyes through text with artificial fixation points, making it easier and faster to read.

### Key Features:
- **EPUB to Bionic Reading Conversion**: Upload your EPUB file, and the app will process the text to add Bionic Reading enhancements.
- **User Privacy**: All processing is done locally on your device. Your EPUB file never leaves your computer, ensuring your privacy and data security.
- **Ease of Use**: Simple and intuitive interface to upload your file and download the converted version.

### Important Notes:
1. **Keep the Original File**: Always keep a copy of your original EPUB file. While the conversion process aims to maintain the integrity of your file, there is no guarantee of success for every EPUB file due to variations in formatting and structure.
2. **No Success Guarantee**: The app does its best to convert your file accurately, but due to the diverse nature of EPUB files, some may not convert perfectly or at all.
3. **Local Processing**: All file processing happens on your computer, which means your data is not uploaded to any server. This enhances privacy but also means that the app's performance depends on your device's capabilities.

Enjoy a more efficient and pleasant reading experience with your newly converted Bionic Reading EPUB file!`;

    public static readonly successMessage = 'File successfully converted!';

    private static readonly ELEMENT_IDS = {
        headTitle: 'head-title',
        headDescription: 'head-description',
        appTitle: 'app-title',
        appDescription: 'app-description',
        githubCornerLink: 'github-corner-link',
        footerAuthor: 'footer-author',
        githubProfile: 'github-profile',
        footerVersion: 'footer-version',
        successMessage: 'success-message-text',
    };

    /**
     * Replaces content in the index.html document with configuration values.
     * @param document - The HTML document to update.
     */
    public static async replaceInIndexHtml(document: Document): Promise<void> {
        Config.updateTitle(document);
        Config.updateMetaDescription(document);
        await Config.updateAppContent(document);
        Config.updateSuccessMessage(document);
        Config.updateFooterContent(document);
    }

    /**
     * Updates the title of the document.
     * @param document - The HTML document to update.
     */
    private static updateTitle(document: Document): void {
        document.title = Config.title;
        document.getElementById(Config.ELEMENT_IDS.headTitle)!.innerText =
            Config.title;
    }

    /**
     * Updates the meta description of the document.
     * @param document - The HTML document to update.
     */
    private static updateMetaDescription(document: Document): void {
        document
            .getElementById(Config.ELEMENT_IDS.headDescription)!
            .setAttribute('content', Config.description);
    }

    /**
     * Updates the application content in the document.
     * @param document - The HTML document to update.
     */
    private static async updateAppContent(document: Document): Promise<void> {
        document.getElementById(Config.ELEMENT_IDS.appTitle)!.innerText =
            Config.title;
        const htmlContent = await marked(Config.longDescription);
        document.getElementById(Config.ELEMENT_IDS.appDescription)!.innerHTML =
            htmlContent;
        document
            .getElementById(Config.ELEMENT_IDS.githubCornerLink)!
            .setAttribute('href', Config.githubRepository);
    }

    /**
     * Updates the footer content in the document.
     * @param document - The HTML document to update.
     */
    private static updateFooterContent(document: Document): void {
        document.getElementById(Config.ELEMENT_IDS.footerAuthor)!.innerText =
            Config.author;
        document
            .getElementById(Config.ELEMENT_IDS.githubProfile)!
            .setAttribute('href', Config.githubProfile);
        document.getElementById(
            Config.ELEMENT_IDS.footerVersion
        )!.innerText = `App Version: ${Config.version}`;
    }

    /**
     * Updates the success message in the document.
     * @param document - The HTML document to update.
     */
    private static updateSuccessMessage(document: Document): void {
        document.getElementById(Config.ELEMENT_IDS.successMessage)!.innerText =
            Config.successMessage;
    }
}
