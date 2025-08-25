import { BlockNoteEditor, BlockNoteSchema, createBlockSpecFromStronglyTypedTiptapNode, defaultBlockSpecs, defaultProps, InlineContentSchema, StyleSchema } from "@blocknote/core";
import { Cement, CementRulesSpec, createCementKey, DocumentSpec } from "./cement";
import { Link } from "lucide-react";
import { Plugin, PluginKey } from "prosemirror-state";
import { AbsoluteBlock } from "./result";

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    doc: DocumentSpec,
    ...defaultBlockSpecs,
    // absoluteBlock: AbsoluteBlock,
    cementRules: CementRulesSpec,
    cement: Cement,
    oparagraph: createBlockSpecFromStronglyTypedTiptapNode(
      defaultBlockSpecs.paragraph.implementation.node.extend({
        name: "oparagraph",
        atom: true,
        addProseMirrorPlugins() {
          return [
            new Plugin({
              // Filter transactions for all display blocks
              filterTransaction(tr) {
                const { selection } = tr;
                if (selection.anchor == selection.head && selection.$anchor.node().type.name === "oparagraph") {
                  return false;
                }

                return true; // Block edits
              }
            })
          ]
        }
      }),
      { ...defaultProps }
    )
  },
});

export const insertCementItem =
  (editor: BlockNoteEditor<typeof schema.blockSchema, InlineContentSchema, StyleSchema>,
    documentId: string
  ) => ({
    title: "Cement",
    onItemClick: () => {
      return editor.transact((tr) => {
        tr.setMeta(createCementKey, documentId);
      })
    },
    group: "Question",
    key: "cement_01",
    aliases: [],
    icon: <Link size={18} />,
    subtext: "Insert a block with for cement.",
  });