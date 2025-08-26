import { BlockNoteEditor, BlockNoteSchema, createBlockSpecFromStronglyTypedTiptapNode, defaultBlockSpecs, defaultProps, InlineContentSchema, StyleSchema } from "@blocknote/core";
import { Cement, CementRulesSpec, createCementKey } from "./cement";

import { Plugin } from "prosemirror-state";
import { DOMNode } from "@tiptap/core";


export const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // absoluteBlock: AbsoluteBlock,
    cementRules: CementRulesSpec,
    cement: Cement,
    oparagraph: createBlockSpecFromStronglyTypedTiptapNode(
      defaultBlockSpecs["paragraph"].implementation.node.extend({
        name: "oparagraph",
        renderHTML(props) {
          const result = defaultBlockSpecs.paragraph.implementation.node.config.renderHTML?.call({
            name: "paragraph", storage: this.storage, parent: null, options: this.options, editor: this.editor
          }, props) as {dom: DOMNode, contentDOM?: HTMLElement};
          if(result && result.dom) {
            (result.dom as HTMLElement).contentEditable = "false"
          } 
          return result
        },
      }),
      { ...defaultProps }
    )
  },
});
