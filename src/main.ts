// main.ts
import App from './App';
import Config from './Config';

// Event listener for DOMContentLoaded to initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Loading the WebApp Version ' + Config.version + '...');

    Config.replaceInIndexHtml(document);

    const app = new App();
});
