import { BlockNoteSchema, createBlockSpecFromStronglyTypedTiptapNode, defaultBlockSpecs, defaultProps } from "@blocknote/core";
import { cementSpec, CementRulesSpec } from "./cement";
import { DOMNode, NodeConfig, NodeViewRendererProps } from "@tiptap/core";
import { DocumentEditor } from "../documentEditor";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;
const blockContents = ["paragraph", "audio", "codeBlock", "file", "bulletListItem", "heading", "checkListItem", "numberedListItem", "toggleListItem", "quote", "table", "video"] as const

export const schema = (docEditor: DocumentEditor) => BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    cementRules: CementRulesSpec(docEditor),
    cement: cementSpec(docEditor),
    ...(Object.fromEntries(blockContents.map(blockName => {
      const name = `o_${blockName}`;
      const extendedProps: Partial<NodeConfig<any, any>>  = {
        name,

        addOptions() {
          return {
            editor: docEditor.blocknoteEditor,
            ...(blockName === "heading" && {level: [1, 2, 3]}),
          }
        },
        renderHTML(props) {
          const result = defaultBlockSpecs[blockName].implementation.node.config.renderHTML?.call({
            name, storage: this.storage, parent: null, options: this.options, editor: this.editor
          }, props) as { dom: DOMNode, contentDOM?: HTMLElement };
          if (result && result.dom) {
            (result.dom as HTMLElement).contentEditable = "false"
          }
          return result
        },

        addKeyboardShortcuts() { return {} },
        addInputRules() { return [] },
        addProseMirrorPlugins() { return [] },
        ...(defaultBlockSpecs[blockName].implementation.node.config.addNodeView && {
          addNodeView() {
            return (props: NodeViewRendererProps) => {
              const result = defaultBlockSpecs[blockName].implementation.node.config.addNodeView!.call({
                name, type: this.type, storage: this.storage, parent: null, options: this.options, editor: this.editor
              });
              const val = result(props);
              if (val?.dom) {
                (val.dom as HTMLElement).contentEditable = "false";
                return val;
              }
              return val;
            }
          }
        })
      }

      return [`o_${blockName}`, createBlockSpecFromStronglyTypedTiptapNode(
        defaultBlockSpecs[blockName].implementation.node.extend(extendedProps),
        {
          ...(blockName === "heading" ? {
            level: { default: 1, values: HEADING_LEVELS },
            isToggleable: { default: false },
            ...defaultProps
          } : defaultProps)
        }
      )]
    })))

  },
});

export const resultSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
  }
})

