export default class Config {
    public static version = '0.0.1';
    public static title = 'WebApp';
    public static description = 'A simple WebApp template';
    public static author = 'M. Passarello';
    public static githubProfile = 'https://github.com/PxaMMaxP';
    public static githubRepository = 'https://github.com/PxaMMaxP';
    public static longDescription: string = `This is a simple WebApp template.
        You can use this template to create your own WebApp.`;

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
            .getElementById('footer-github')!
            .setAttribute('href', Config.githubProfile);
        document.getElementById(
            'footer-version'
        )!.innerText = `Version: ${Config.version}`;
    }
}
