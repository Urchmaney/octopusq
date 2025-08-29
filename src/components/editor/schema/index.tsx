import { BlockNoteSchema, createBlockSpecFromStronglyTypedTiptapNode, defaultBlockSpecs, defaultProps } from "@blocknote/core";
import { cementSpec, CementRulesSpec } from "./cement";
import { DOMNode } from "@tiptap/core";
import { DocumentEditor } from "../documentEditor";


export const schema = (docEditor: DocumentEditor) => BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // absoluteBlock: AbsoluteBlock,
    cementRules: CementRulesSpec,
    cement: cementSpec(docEditor),
    oparagraph: createBlockSpecFromStronglyTypedTiptapNode(
      defaultBlockSpecs["paragraph"].implementation.node.extend({
        name: "oparagraph",
        renderHTML(props) {
          const result = defaultBlockSpecs.paragraph.implementation.node.config.renderHTML?.call({
            name: "paragraph", storage: this.storage, parent: null, options: this.options, editor: this.editor
          }, props) as { dom: DOMNode, contentDOM?: HTMLElement };
          if (result && result.dom) {
            (result.dom as HTMLElement).contentEditable = "false"
          }
          return result
        },
      }),
      { ...defaultProps }
    )
  },
});

export const resultSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
  }
})