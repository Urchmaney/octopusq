import { BlockInfo, createBlockSpecFromStronglyTypedTiptapNode, defaultProps, getBlockInfoFromSelection, updateBlockCommand } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Menu } from "@mantine/core";
import { Node } from "@tiptap/core";


import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { MdArrowDropDown, MdCancel, MdCheckCircle, MdError } from "react-icons/md";

// import "./styles.css";
const cements = [
  { name: "Look", icon: MdError }, { name: 'bold', icon: MdCancel }, { name: "gold", icon: MdCheckCircle }
]

export const Cement = createReactBlockSpec(
  {
    type: "cement",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      question: {
        default: "",
      },
      show: {
        default: false
      }
    },
    content: "inline",
  },
  {
    render: (props) => {
      const toggleCement = () => {
        const show = props.block.props.show;
        props.editor.updateBlock(props.block.id, { props: { show: !show } } as any);
      }
      return (
        <div className={"cement relative py-2"}>
          <div>
            {
              props.block.props.show ?
                <div className="flex items-center gap-2">
                  <Menu withinPortal={false}>
                    <Menu.Target>
                      <div className={"border border-gray-400 inline-block px-4 text-[13px] rounded-b-2xl rounded-t-md cursor-pointer"} contentEditable={false}>
                        <p className="flex items-center gap-5">{props.block.props.question} <MdArrowDropDown className="text-lg" /></p>
                      </div>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>Alert Type</Menu.Label>
                      <Menu.Divider />
                      {cements.map((type) => {
                        return (
                          <Menu.Item
                            key={type.name}
                          >
                            {type.name}
                          </Menu.Item>
                        );
                      })}
                    </Menu.Dropdown>
                  </Menu>

                  <MdCancel className="cursor-pointer" onClick={toggleCement} />
                </div>
                : <button className="cursor-pointer" onClick={toggleCement}>show</button>
            }
          </div>

          <div>
            <div className={"inline-content"} ref={props.contentRef} onInput={(event) => console.log(event.target)} />
          </div>

        </div>
      );
    },
  },
);


declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    cementRules: {
      /**
       * Toggle a cement
       * @example editor.commands.toggleCement()
       */
      toggleCement: () => ReturnType
    }
  }
}

export const cementPlugin = new Plugin({
  state: {
    init() { return true },
    apply(tr, value) {
      if (tr.getMeta(cementPlugin)) {
        return !value;
      }
      return value
    }
  }
})

const specklePlugin: Plugin<DecorationSet> = new Plugin({
  state: {
    init(_, { doc }) {
      // return DecorationSet.create(doc, [Decoration.inline(1, 5, {style: "background: yellow"})]);
      return DecorationSet.create(doc, []);

    },
    apply(tr, _, __, newState) {
      const blockInfo: BlockInfo = getBlockInfoFromSelection(newState);
      if (
        !blockInfo.isBlockContainer ||
        blockInfo.blockContent.node.type.spec.content !== "inline*"
        || blockInfo.blockNoteType !== "cement"
      ) {
        return DecorationSet.create(newState.doc, []);
      }
      if (!blockInfo.blockContent.node.content.size && !blockInfo.blockContent.node.attrs.question) {
        return DecorationSet.create(newState.doc, [
          Decoration.widget(blockInfo.blockContent.beforePos, (view, getPos) => {
            const div = document.createElement("div");
            const form = document.createElement("form");

            const input = document.createElement("input");
            const button = document.createElement("button");
            // button.addEventListener("click", () => {
            //   console.log("click")
            // })
            div.appendChild(input)
            div.appendChild(button);
            form.appendChild(div);
            button.textContent = "submit"
            button.type = "submit";
            input.name = "questionInput"
            input.type = "text";
            input.placeholder = "question";
            input.className = "question-input";
            input.style.padding = "4px";
            input.style.margin = "0 4px";
            input.style.border = "1px solid #ccc";
            input.style.borderRadius = "4px";

            form.addEventListener("submit", (event: SubmitEvent) => {
              event.preventDefault();
              if (event) {
                tr.setNodeAttribute(getPos()!, 'question', input.value);
                tr.setNodeAttribute(getPos()!, 'show', true);

                // // console.log(node, newState.doc.resolve(getPos()!).nodeAfter)

                // const blockId = node.attrs.id;

                // const block = getBlockInfo({ posBeforeNode: getPos()!, node });

                // console.log(view, getPos())

                view.dispatch(tr);
              }

            })
            return form;
          },
            {
              side: 0,
              stopEvent(_) {
                return true;
              },
            })
        ])
      }
      return DecorationSet.create(newState.doc, []);

    }
  },
  props: {
    decorations(state) { return specklePlugin.getState(state) }
  }
})



export const CementRulesSpec = createBlockSpecFromStronglyTypedTiptapNode(
  Node.create({
    name: "cementRules",
    content: "",
    addCommands() {
      return {
        toggleCement: () => ({ editor }) => {
          const blockInfo = getBlockInfoFromSelection(editor.state);
          if (
            !blockInfo.isBlockContainer ||
            blockInfo.blockContent.node.type.spec.content !== "inline*"
            || blockInfo.blockNoteType !== "cement"
          ) {
            return true;
          }
          const attrs = blockInfo.blockContent.node.attrs;

          return this.editor.commands.command(
            updateBlockCommand(blockInfo.bnBlock.beforePos, {
              props: {
                show: !attrs.show
              } as any
            }),
          );
        }
      }
    },
    addKeyboardShortcuts() {
      return {
        'Ctrl-y': () => {
          try {
            return this.editor.commands.toggleCement();
          } catch (_) {
            return true
          }

        }
      }
    },
    addProseMirrorPlugins() {
      return [cementPlugin, specklePlugin]
    }
  }),
  {}
)