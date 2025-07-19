import { BlockInfo, createBlockSpecFromStronglyTypedTiptapNode, defaultProps, getBlockInfoFromSelection, updateBlockCommand } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Menu } from "@mantine/core";
import { Node } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { MdAdd, MdArrowDropDown, MdCancel, MdFilePresent } from "react-icons/md";
import { firebaseDocumentAPI, Question, TDocument } from "../services/documentApi";
import { Input, SecondaryButton } from "../components";
import { FormEventHandler, useState } from "react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useActiveDocument } from "../contexts/activeDocumentContext";

// import "./styles.css";

export const Cement = createReactBlockSpec(
  {
    type: "cement",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      question: {
        default: "",
      },
      questionId: {
        default: ""
      },
      show: {
        default: false
      },
      documentId: {
        default: "",
      }
    },
    content: "inline",
  },
  {
    render: (props) => {
      const [fwdDocs, setFwdDocs] = useState<TDocument[]>([]);
      const [fetchedDocs, setFetchedDocs] = useState(false);
      const [creatingDoc, setCreatingDoc] = useState(false);
      const [question, setQuestion] = useState<Question | null>(null);
      const { setActiveDocument: setActiveDocumentId } = useActiveDocument();
      const toggleCement = () => {
        const show = props.block.props.show;
        props.editor.updateBlock(props.block.id, { props: { show: !show } } as any);
      }

      const fetchFwdDocs = async () => {
        if (fetchedDocs) return;
        const docs = await firebaseDocumentAPI.getQuestionDocuments(props.block.props.questionId);
        const question = await firebaseDocumentAPI.getQuestion(props.block.props.questionId);
        setQuestion(question);
        setFwdDocs(docs);
        setFetchedDocs(true);
      };

      const openDocument = (documentId: string) => {
        const document = fwdDocs.find(x=> x.id === documentId);
        if (!document) return;

        setActiveDocumentId(document.id);
      }

      const createNewFwdDoc: FormEventHandler<HTMLFormElement> = async (event) => {
        try {
          event.preventDefault();
          setCreatingDoc(true);
          const form = event.target as HTMLFormElement;
          const formData = new FormData(form);
          const doc = await firebaseDocumentAPI.createNewDoc(formData.get("docName")?.toString() || "Untitled", props.block.props.questionId);
          setFwdDocs([doc, ...fwdDocs]);
          form.reset();
        } catch (err) {
          throw err
        } finally {
          setCreatingDoc(false);
        }
      }
      return (
        <div className={"cement relative py-2"}>
          <div>
            {
              props.block.props.show ?
                <div className="flex items-center gap-2 z-20">
                  <Menu withinPortal={false} onOpen={fetchFwdDocs}>
                    <Menu.Target>
                      <div className={"border border-gray-400 inline-block px-4 text-[13px] rounded-b-2xl rounded-t-md cursor-pointer"} contentEditable={false}>
                        <p className="flex items-center gap-5">{props.block.props.question} <MdArrowDropDown className="text-lg" /></p>
                      </div>
                    </Menu.Target>
                    <Menu.Dropdown className="w-full">
                      <Menu.Label className="">
                        <form className="flex justify-center items-center gap-1" onSubmit={createNewFwdDoc}>
                          <Input name="docName" placeholder="Document Name" className="py-4 h-8 focus-visible:ring-offset-0 focus-visible:ring-0"></Input><SecondaryButton className="w-5 h-4 py-4">
                            {creatingDoc ? <Loader2 /> : <MdAdd />}
                          </SecondaryButton>
                        </form>
                      </Menu.Label>
                      <Menu.Divider />
                      {
                        fetchedDocs ? fwdDocs.map((doc) => (
                          <Menu.Item
                            key={doc.id}
                            component="div"
                            leftSection={<MdFilePresent />}
                            closeMenuOnClick={false}
                          >
                            <div className="flex justify-between">
                              <div className="flex gap-1 items-center">
                                {doc.name}
                              </div>

                              <div className="flex gap-2">
                                {
                                  question?.activeFwdDocumentId !== doc.id &&
                                  <Link to="" className="cursor-pointer text-green-300">Activate</Link>
                                }

                                <Link to="" onClick={() => openDocument(doc.id)} className="cursor-pointer">Open</Link>
                              </div>
                            </div>
                          </Menu.Item>
                        )
                        ) :
                          <div className="flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                          </div>
                      }
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

        </div >
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
              button.textContent = "submitting..."
              firebaseDocumentAPI.addQuestion(blockInfo.blockContent.node.attrs.documentId, {
                content: input.value,
                activeFwdDocumentId: "",
                documentId: blockInfo.blockContent.node.attrs.documentId
              }).then(x => {
                tr.setNodeAttribute(getPos()!, 'question', x.content);
                tr.setNodeAttribute(getPos()!, 'questionId', x.id);
                tr.setNodeAttribute(getPos()!, 'show', true);
                view.dispatch(tr);
              }).catch((err) => console.log("error creating question", err))
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