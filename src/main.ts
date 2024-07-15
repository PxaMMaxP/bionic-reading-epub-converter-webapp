// main.ts
import App from './App';
import Config from './Config';

// Event listener for DOMContentLoaded to initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Loading the WebApp Version ' + Config.version + '...');

    await Config.replaceInIndexHtml(document);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const app = new App();
});
