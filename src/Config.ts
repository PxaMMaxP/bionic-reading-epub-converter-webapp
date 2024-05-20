/**
 * Configuration class for the Bionic Reading EPUB Converter application.
 *
 * The `Config` class contains static properties and methods that provide configuration
 * settings for the application, such as version, title, description, and author information.
 * It also includes a method to update the HTML content of the application's index page.
 */
export default class Config {
    public static readonly version = '0.3.0';
    public static readonly title = 'Bionic Reading EPUB Converter';
    public static readonly description = 'Convert EPUB to Bionic Reading EPUB.';
    public static readonly author = 'M. Passarello';
    public static readonly githubProfile = 'https://github.com/PxaMMaxP';
    public static readonly githubRepository =
        'https://github.com/PxaMMaxP/bionic-reading-epub-converter-webapp';
    public static readonly longDescription = `This webapp allows you to convert an EPUB file to a Bionic Reading EPUB file.`;
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
    public static replaceInIndexHtml(document: Document): void {
        Config.updateTitle(document);
        Config.updateMetaDescription(document);
        Config.updateAppContent(document);
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
    private static updateAppContent(document: Document): void {
        document.getElementById(Config.ELEMENT_IDS.appTitle)!.innerText =
            Config.title;
        document.getElementById(Config.ELEMENT_IDS.appDescription)!.innerHTML =
            Config.longDescription.replace(/\n/g, '<br>');
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
        )!.innerText = `Version: ${Config.version}`;
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
