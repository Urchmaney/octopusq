import { BlockNoteEditor, BlockNoteSchema, defaultBlockSpecs, InlineContentSchema, insertOrUpdateBlock, StyleSchema } from "@blocknote/core";
import { Cement, CementRulesSpec } from "./cement";
import { Link } from "lucide-react";

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    cementRules: CementRulesSpec,
    cement: Cement
  },
});

export const insertCementItem = 
(editor: BlockNoteEditor<typeof schema.blockSchema, InlineContentSchema, StyleSchema>,
  documentId: string
) => ({
  title: "Cement",
  onItemClick: () =>
    insertOrUpdateBlock(editor, {
      type: "cement",
      content: "",
      props: {
        documentId
      }
    }),
  aliases: ["cement", "ce"],
  icon: <Link size={18} />,
  subtext: "Used to insert a block with for cement.",
});