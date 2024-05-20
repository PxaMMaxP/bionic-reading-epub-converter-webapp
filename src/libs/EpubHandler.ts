import JSZip from 'jszip';
import { File } from './File';

export class EpubHandler {
    private zip: JSZip;
    private files: { [key: string]: File };

    constructor() {
        this.zip = new JSZip();
        this.files = {};
    }

    async load(epubData: ArrayBuffer): Promise<void> {
        this.zip = await JSZip.loadAsync(epubData);
        const filePromises = Object.keys(this.zip.files).map(async (path) => {
            const file = this.zip.files[path];
            if (!file.dir) {
                const content = await file.async('arraybuffer');
                this.files[path] = new File(path, content);
            }
        });
        await Promise.all(filePromises);
    }

    getFile(path: string): File | null {
        return this.files[path] || null;
    }

    setFile(path: string, content: string | ArrayBuffer): void {
        if (this.files[path]) {
            this.files[path].setContent(content);
        } else {
            this.files[path] = new File(path, content);
        }
    }

    getFilePaths(): string[] {
        return Object.keys(this.files);
    }

    getFiles(extension?: string): File[] {
        if (extension) {
            return Object.values(this.files).filter((file) =>
                file.getPath().endsWith(extension)
            );
        }
        return Object.values(this.files);
    }

    async pack(): Promise<Blob> {
        const newZip = new JSZip();
        Object.keys(this.files).forEach((path) => {
            const file = this.files[path];
            const content = file.getContent();
            if (typeof content === 'string') {
                newZip.file(path, content);
            } else {
                newZip.file(path, content);
            }
        });
        return await newZip.generateAsync({ type: 'blob' });
    }
}
