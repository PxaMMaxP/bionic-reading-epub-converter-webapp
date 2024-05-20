export default class Config {
    public static version = '0.1.1';
    public static title = 'Bionic Reading EPUB Converter';
    public static description = 'Convert EPUB to Bionic Reading EPUB.';
    public static author = 'M. Passarello';
    public static githubProfile = 'https://github.com/PxaMMaxP';
    public static githubRepository =
        'https://github.com/PxaMMaxP/bionic-reading-epub-converter-webapp';
    public static longDescription: string = `This webapp allows you to convert an EPUB file to a Bionic Reading EPUB file.`;

    public static replaceInIndexHtml(document: Document) {
        document.title = Config.title;
        document.getElementById('head-title')!.innerText = Config.title;
        document
            .getElementById('head-description')!
            .setAttribute('content', Config.description);

        document.getElementById('app-title')!.innerText = Config.title;
        document.getElementById('app-description')!.innerHTML =
            Config.longDescription.replace(/\n/g, '<br>');

        document
            .getElementById('github-corner-link')!
            .setAttribute('href', Config.githubRepository);

        document.getElementById('footer-author')!.innerText = Config.author;
        document
            .getElementById('github-profile')!
            .setAttribute('href', Config.githubProfile);
        document.getElementById(
            'footer-version'
        )!.innerText = `Version: ${Config.version}`;
    }
}
