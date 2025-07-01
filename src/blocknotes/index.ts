import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { Cement, CementRulesSpec } from "./cement";

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    cementRules: CementRulesSpec,
    cement: Cement,

  },
});