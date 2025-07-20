import { BlockNoteEditor, BlocksChanged, BlockSchemaFromSpecs, InlineContentSchema, PartialBlock, StyleSchema } from "@blocknote/core";
import { debounce } from "../utils";
import { schema } from "../blocknotes";
import { DocumentAPI, firebaseDocumentAPI, TDocument } from "../services/documentApi";

export class DocumentEditor {
	private documentApi: DocumentAPI = firebaseDocumentAPI;
	private _blocknoteEditor: BlockNoteEditor<any, any, any>;


	constructor(initialContent: PartialBlock[] , private documentId: string) {
    if (!Array.isArray(initialContent) || initialContent.length === 0) initialContent = [{ type: "paragraph", content: '' }];
		this._blocknoteEditor = BlockNoteEditor.create({ initialContent, schema });
		this.updateDocument = this.updateDocument.bind(this);
		const debounceUpdateDocument = debounce(this.updateDocument, 3000);
		this._blocknoteEditor.onChange((editor) => (debounceUpdateDocument(editor.document)));
		this._blocknoteEditor.onChange(this.cementToParagraphWithoutAttr);
	}

	async updateDocument(document: any) {
		await this.documentApi.updateDocument(this.documentId, { content: JSON.stringify(document) });
	}

	cementToParagraphWithoutAttr(editor: BlockNoteEditor<any, any, any>, { getChanges }: { getChanges: () => BlocksChanged<BlockSchemaFromSpecs<typeof schema.blockSpecs>, InlineContentSchema, StyleSchema> }) {
		const changes = getChanges();
      changes.forEach(change => {
        if (change.block.type === "cement" && !(change.block.props as any).question && (change.block?.content as any)?.length || 0 > 0) {
          editor.updateBlock(change.block.id, {
            type: "paragraph",
            content: change.block.content
          } as any)
          editor.setTextCursorPosition(change.block.id, "end")
        }
      });
	}

	get blocknoteEditor() {
		return this._blocknoteEditor;
	}

	async changeDocument(document: TDocument) {
		if(this.documentId) await this.updateDocument(this._blocknoteEditor.document);
		this.documentId = document.id;
		this._blocknoteEditor.replaceBlocks(this._blocknoteEditor.document, JSON.parse(document.content));
	}
}