import {  createBlockSpecFromStronglyTypedTiptapNode, defaultProps, getBlockInfoFromSelection, updateBlockCommand } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Menu } from "@mantine/core";
import { Node } from "@tiptap/core";

import { Plugin } from "prosemirror-state";
import { MdArrowDropDown, MdCancel, MdCheckCircle, MdError, MdInfo } from "react-icons/md";

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
        default: "what is breqqs?",
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
        props.editor.updateBlock(props.block.id, { props: { show: !show } } as any)
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
            <div className={"inline-content"} ref={props.contentRef} />
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
      return [cementPlugin]
    }
  }),
  {}
)