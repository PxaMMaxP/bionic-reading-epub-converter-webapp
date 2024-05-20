import { Parser } from 'htmlparser2';
import { DomHandler, Element, Text, ChildNode } from 'domhandler';
import { default as serialize } from 'dom-serializer';

/**
 * Class responsible for processing HTML content.
 */
export class HtmlProcessor {
    private excludedTags = [
        'a',
        'meta',
        'title',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'link',
        'script',
        'style',
    ];
    private excludedTagsWithClasses: { [tag: string]: string[] } = {
        p: ['caption', 'parttext'],
        span: ['bold'],
        div: ['listing'],
    };

    /**
     * Processes the given HTML content by parsing it, applying modifications, and serializing it back to HTML.
     * @param html - The HTML content to process.
     * @returns The processed HTML content.
     */
    process(html: string): string {
        const handler = new DomHandler(undefined, {
            withStartIndices: false,
            withEndIndices: false,
        });
        // For epub validation, we need to set xmlMode to false on read
        const parser = new Parser(handler, {
            decodeEntities: true,
            xmlMode: false,
        });
        parser.write(html);
        parser.end();

        const document = handler.dom;
        this.boldText(document);

        // For epub validation, we need to set xmlMode to true on write
        const serializedDocument = serialize(document, {
            decodeEntities: true,
            xmlMode: true,
        });
        return serializedDocument;
    }

    /**
     * Recursively applies bold formatting to text nodes within the given array of child nodes,
     * but skips specific tags and tags with specific classes.
     * @param nodes - The array of child nodes to process.
     */
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
                const tagName = elementNode.name;
                const classList = elementNode.attribs?.class?.split(' ') || [];

                // Skip the entire subtree if the current element is excluded
                if (
                    this.excludedTags.includes(tagName) ||
                    (tagName in this.excludedTagsWithClasses &&
                        classList.some((cls) =>
                            this.excludedTagsWithClasses[tagName].includes(cls)
                        ))
                ) {
                    return;
                }

                // Process child nodes recursively
                if (elementNode.children) {
                    this.boldText(elementNode.children);
                }
            }
        });
    }

    /**
     * Creates an array of child nodes with bold formatting based on the given text.
     * Handles Unicode characters correctly.
     * @param text - The text to format.
     * @returns An array of child nodes with bold formatting.
     */
    private createBoldNodes(text: string): ChildNode[] {
        const parts = text.match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]+|\s+/gu) || [];
        const nodes: ChildNode[] = [];
        parts.forEach((part) => {
            if (part.match(/\s+/u)) {
                nodes.push(new Text(part));
            } else if (part.match(/[^\p{L}\p{N}]/u)) {
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
