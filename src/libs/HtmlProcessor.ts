import { Parser } from 'htmlparser2';
import { DomHandler, Element, Text, Node, ChildNode } from 'domhandler';
import { default as serialize } from 'dom-serializer';

export class HtmlProcessor {
    process(html: string): string {
        const handler = new DomHandler();
        const parser = new Parser(handler);
        parser.write(html);
        parser.end();

        const document = handler.dom;
        this.boldText(document);

        const serializedDocument = serialize(document, {
            decodeEntities: false,
            xmlMode: true,
        });
        return serializedDocument;
    }

    private boldText(nodes: ChildNode[]) {
        nodes.forEach((node) => {
            if (node.type === 'text') {
                const textNode = node as Text;
                const newNodes = this.createBoldNodes(textNode.data);
                if (newNodes.length > 0) {
                    const parent = textNode.parent as Element;
                    if (parent) {
                        const index = parent.children.indexOf(textNode);
                        parent.children.splice(index, 1, ...newNodes);
                    }
                }
            } else if (node.type === 'tag') {
                const elementNode = node as Element;
                if (elementNode.children) {
                    this.boldText(elementNode.children);
                }
            }
        });
    }

    private createBoldNodes(text: string): ChildNode[] {
        const parts = text.match(/\w+|[^\s\w]+|\s+/g) || [];
        const nodes: ChildNode[] = [];
        parts.forEach((part) => {
            if (part.match(/\s+/)) {
                nodes.push(new Text(part));
            } else if (part.match(/[^\w]/)) {
                nodes.push(new Text(part));
            } else if (part.length <= 3) {
                const boldElement = new Element('b', {});
                boldElement.children.push(new Text(part));
                nodes.push(boldElement);
            } else {
                const point = Math.ceil(Math.log2(part.length));
                const boldElement = new Element('b', {});
                boldElement.children.push(new Text(part.slice(0, point)));
                nodes.push(boldElement);
                nodes.push(new Text(part.slice(point)));
            }
        });
        return nodes;
    }
}
