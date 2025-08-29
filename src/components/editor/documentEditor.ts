import { Block, BlockNoteEditor, BlocksChanged, BlockSchemaFromSpecs, BlockSpecs, InlineContentSchema, PartialBlock, StyleSchema } from "@blocknote/core";
import { debounce } from "../../utils";
import { resultSchema, schema } from "./schema";
import { DocumentAPI, firebaseDocumentAPI, TDocument, TDocumentResult } from "../../services/documentApi";

export class DocumentEditor {
  private documentApi: DocumentAPI = firebaseDocumentAPI;
  private _blocknoteEditor: BlockNoteEditor<any, any, any>;
  private _resultEditor: BlockNoteEditor<any, any, any>;
  private excludedBlocksId: Set<string> = new Set<string>();

  private _document: TDocument | null = null;
  private _documentResult: TDocumentResult | null = null;

  constructor(initialContent: PartialBlock[], private documentId: string, private documentResultId: string) {
    if (!Array.isArray(initialContent) || initialContent.length === 0) initialContent = [{ type: "paragraph", content: '' }];
    this._blocknoteEditor = BlockNoteEditor.create({ initialContent, schema: schema(this) });
    this._resultEditor = BlockNoteEditor.create({ schema: resultSchema, initialContent: [{ type: 'paragraph', content: '' }] });

    this.updateDocument = this.updateDocument.bind(this);
    const debounceUpdateDocument = debounce(this.updateDocument, 1500);
    this._blocknoteEditor.onChange((editor) => debounceUpdateDocument(editor.document));

    this.updateDocumentResult = this.updateDocumentResult.bind(this);
    const debounceUpdateResultDocument = debounce(this.updateDocumentResult, 1500);
    this.resultEditor.onChange((editor) => debounceUpdateResultDocument(editor.document));
  }

  sanitizedDocument(document: Block[]) {
    return document.filter(block => !this.excludedBlocksId.has(block.id))
  }

  async updateDocument(document: any) {
    await this.documentApi.updateDocument(this.documentId, { content: JSON.stringify(this.sanitizedDocument(document)) });
  }

  async updateDocumentResult(document: any) {
    await this.documentApi.updateDocumentResult(this.documentResultId, JSON.stringify(document))
  }

  cementToParagraphWithoutAttr(editor: BlockNoteEditor<any, any, any>, { getChanges }: { getChanges: () => BlocksChanged<BlockSchemaFromSpecs<BlockSpecs>, InlineContentSchema, StyleSchema> }) {
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

  get resultEditor() {
    return this._resultEditor;
  }

  get document() {
    if (this.documentId === this._document?.id) return this._document;

    const result = async () => {
      const doc = await this.documentApi.getDocument(this.documentId);
      this._document = doc;
      return this._document;
    }
    return result();
  }

  get resultDocument() {
    if (this._documentResult?.id === this.documentResultId) return this._documentResult;

    const result = async () => {
      const resultDoc = await this.documentApi.getDocumentResult(this.documentResultId);
      this._documentResult = resultDoc;
      return this._documentResult;
    }
    return result();
  }

  async changeDocument(documentId: string) {
    this.documentId = documentId;
    this._blocknoteEditor.replaceBlocks(this._blocknoteEditor.document, JSON.parse((await this.document)?.content || '[]'));
    this.documentResultId = (await this.document)?.resultId || '';
    this._resultEditor.replaceBlocks(this._resultEditor.document, JSON.parse((await this.resultDocument)?.content || '[]'));
  }

  addExcludedBlocksId(...ids: string[]) {
    ids.forEach(id => this.excludedBlocksId.add(id));
  }
}