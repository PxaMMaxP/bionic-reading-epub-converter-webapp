export class File {
    private path: string;
    private content: string | ArrayBuffer;

    constructor(path: string, content: string | ArrayBuffer) {
        this.path = path;
        this.content = content;
    }

    getPath(): string {
        return this.path;
    }

    getContent(): string | ArrayBuffer {
        return this.content;
    }

    getTextContent(): string {
        if (typeof this.content === 'string') {
            return this.content;
        } else {
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(this.content);
        }
    }

    setContent(content: string | ArrayBuffer): void {
        this.content = content;
    }
}
