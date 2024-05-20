import { Parser } from 'htmlparser2';
import { DomHandler, Element, Text, ChildNode } from 'domhandler';
import { default as serialize } from 'dom-serializer';
import { BionicReading } from './BionicReading';

/**
 * Class responsible for processing HTML content from an epub file.
 */
export class HtmlProcessor {
    /**
     * Tags that should be excluded from processing.
     */
    private readonly excludedTags = [
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

    /**
     * Tags with specific classes that should be excluded from processing.
     * @remarks These tags are probably very specific to each eBook and therefore not suitable for every one.
     */
    private readonly excludedTagsWithClasses: { [tag: string]: string[] } = {
        p: ['caption', 'parttext'],
        span: ['bold'],
        div: ['listing'],
    };

    /**
     * Regular expression to match various parts of text, including:
     * - Sequences of letters and numbers (\p{L}\p{N})
     * - Non-whitespace, non-letter, non-number characters ([^\s\p{L}\p{N}])
     * - Sequences of whitespace characters (\s+)
     * - Decimal and hexadecimal character entities (&#\d+;|&#x[a-fA-F0-9]+;)
     * @remarks This regex uses Unicode property escapes (\p{L}, \p{N}) to match letters and numbers from any language.
     */
    private readonly textRegex =
        /[\p{L}\p{N}]+|[^\s\p{L}\p{N}]+|\s+|&#\d+;|&#x[a-fA-F0-9]+;/gu;

    /**
     * Regular expression to match sequences of whitespace characters.
     * @remarks This regex uses Unicode mode (u flag) to ensure it correctly matches Unicode whitespace characters.
     */
    private readonly spaceRegex = /\s+/u;

    /**
     * Regular expression to match decimal and hexadecimal character entities in HTML.
     * - Decimal entities: &#\d+;
     * - Hexadecimal entities: &#x[a-fA-F0-9]+;
     * @remarks This regex is useful for identifying encoded characters in HTML content.
     */
    private readonly unicodeEntityRegex = /&#\d+;|&#x[a-fA-F0-9]+;/u;

    /**
     * Regular expression to match any character that is not a letter or number.
     * @remarks This regex uses Unicode property escapes (\p{L}, \p{N}) to match non-alphanumeric characters from any language.
     */
    private readonly nonAlphanumericRegex = /[^\p{L}\p{N}]/u;

    /**
     * Processes the given HTML content by parsing it, applying modifications, and serializing it back to HTML.
     * @param html - The HTML content to process.
     * @returns The processed HTML content.
     */
    process(html: string): string {
        const document = this.parseHtml(html);
        this.boldText(document);
        return this.serializeHtml(document);
    }

    /**
     * Parses the given HTML content into a DOM structure.
     * @param html - The HTML content to parse.
     * @returns The DOM structure.
     */
    private parseHtml(html: string): ChildNode[] {
        const handler = new DomHandler(undefined, {
            withStartIndices: false,
            withEndIndices: false,
        });
        const parser = new Parser(handler, {
            decodeEntities: true,
            xmlMode: false,
        });
        parser.write(html);
        parser.end();
        return handler.dom as ChildNode[];
    }

    /**
     * Serializes the given DOM structure back to HTML.
     * @param document - The DOM structure to serialize.
     * @returns The serialized HTML content.
     */
    private serializeHtml(document: ChildNode[]): string {
        return serialize(document, { decodeEntities: true, xmlMode: true });
    }

    /**
     * Recursively applies bold formatting to text nodes within the given array of child nodes,
     * but skips specific tags and tags with specific classes.
     * @param nodes - The array of child nodes to process.
     */
    private boldText(nodes: ChildNode[]): void {
        nodes.forEach((node) => {
            if (node.type === 'text') {
                this.processTextNode(node as Text);
            } else if (node.type === 'tag') {
                this.processElementNode(node as Element);
            }
        });
    }

    /**
     * Processes a text node to apply bold formatting.
     * @param textNode - The text node to process.
     */
    private processTextNode(textNode: Text): void {
        const newNodes: ChildNode[] = this.createBoldOrMixedNodes(
            textNode.data
        );
        if (newNodes.length > 0) {
            const parent = textNode.parent as Element;
            if (parent) {
                const index = parent.children.indexOf(textNode);
                parent.children.splice(index, 1, ...newNodes);
            }
        }
    }

    /**
     * Processes an element node to recursively apply bold formatting to its child nodes.
     * Skips specific tags and tags with specific classes.
     * @param elementNode - The element node to process.
     */
    private processElementNode(elementNode: Element): void {
        const tagName = elementNode.name;
        const classList = elementNode.attribs?.class?.split(' ') || [];

        if (this.shouldSkipElement(tagName, classList)) {
            return;
        }

        if (elementNode.children) {
            this.boldText(elementNode.children);
        }
    }

    /**
     * Determines whether an element should be skipped based on its tag name and classes.
     * @param tagName - The tag name of the element.
     * @param classList - The list of classes of the element.
     * @returns True if the element should be skipped, false otherwise.
     */
    private shouldSkipElement(tagName: string, classList: string[]): boolean {
        return (
            this.excludedTags.includes(tagName) ||
            (tagName in this.excludedTagsWithClasses &&
                classList.some((cls) =>
                    this.excludedTagsWithClasses[tagName].includes(cls)
                ))
        );
    }

    /**
     * Creates an array of child nodes with bold formatting based on the given text.
     * Handles Unicode characters correctly.
     * @param text - The text to format.
     * @returns An array of child nodes with bold formatting.
     */
    private createBoldNodes(text: string): ChildNode[] {
        const parts = text.match(this.textRegex) || [];
        const nodes: ChildNode[] = [];

        parts.forEach((part) => {
            if (
                this.spaceRegex.test(part) ||
                this.unicodeEntityRegex.test(part)
            ) {
                nodes.push(new Text(part));
            } else if (this.nonAlphanumericRegex.test(part)) {
                nodes.push(new Text(part));
            } else {
                nodes.push(...this.createBoldOrMixedNodes(part));
            }
        });

        return nodes;
    }

    /**
     * Creates an array of child nodes with bold formatting based on the given text.
     * Handles Unicode characters correctly.
     * @param text - The text to format.
     * @returns An array of child nodes with bold formatting.
     */
    private createBoldOrMixedNodes(text: string): ChildNode[] {
        const parts = text.match(this.textRegex) || [];
        const nodes: ChildNode[] = [];

        parts.forEach((part) => {
            if (
                this.spaceRegex.test(part) ||
                this.unicodeEntityRegex.test(part)
            ) {
                nodes.push(new Text(part));
            } else if (this.nonAlphanumericRegex.test(part)) {
                nodes.push(new Text(part));
            } else {
                const boldPoint = BionicReading.getBoldPoint(part.length);
                nodes.push(this.createBoldNode(part.slice(0, boldPoint)));
                nodes.push(new Text(part.slice(boldPoint)));
            }
        });

        return nodes;
    }

    /**
     * Creates a bold element with the given text.
     * @param text - The text to wrap in a bold element.
     * @returns A bold element containing the text.
     */
    private createBoldNode(text: string): Element {
        const boldElement = new Element('b', {});
        boldElement.children.push(new Text(text));
        return boldElement;
    }
}
