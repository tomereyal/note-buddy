//---------REACT-AND-HOOKS-IMPORTS----------------------//
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useDispatch } from "react-redux";
//---------SLATE-EDITOR-IMPORTS----------------------//
import { createEditor, Editor, Transforms, Range } from "slate";
// Import the Slate components and React plugin.
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
//Import the actual editor and its methods..
import { withHistory } from "slate-history";
import { EditorPlugins } from "./EditorPlugins";
//---------MY-COMPONENTS-IMPORTS------------------------//
import EditorHoverToolbar, {
  Portal,
} from "./sections/EditorToolBar/EditorHoverToolbar";
import EditorMainToolbar from "./sections/EditorToolBar/EditorMainToolBar";
import { mathConfig } from "./sections/math_Config";

//--------SERVER-RELATED-IMPORTS-----------------------//
import axios from "axios";
import {
  editNote,
  saveNewNoteTags,
  saveExistingNoteTags,
} from "../../_actions/card_actions";
import { getCards } from "../../api/index";
//------MY-SLATE-ELEMENTS-------------------------//
import {
  DefaultElement,
  Leaf,
  Image,
  Mention,
  CodeElement,
  QuoteBlock,
  H2Block,
  BulletList,
  NumberList,
  ListItem,
  H1Block,
  StepsList,
  StepNode,
  EditableVoid,
  MathBlock,
  ConditionBlock,
  CardHeader,
  CardToolbar,
} from "./sections/EditorElements";
import TitleEditor from "./TitleEditor/TitleEditor";
//-----------------------------------------------------//

export default function SlateEditor(props) {
  const { card, order, bgc } = props;
  const { location, _id } = card;
  const { post, section, list } = location;
  const cardData = {
    postId: post,
    sectionId: section,
    listId: list,
    cardId: _id,
  };

  const defaultBgc = "#FFFFFF";
  let initContent =
    card.content && card.content.length > 0
      ? card.content
      : [
          {
            type: "paragraph",
            backgroundColor: defaultBgc,
            children: [{ text: "" }],
          },
        ];

  const {
    withCardData,
    withMentions,
    withImages,
    withSteps,
    withEditableVoids,
    getNodes,
    withTitledCardLayout,
    withMathBlock,
    withFractionMathBlock,
    withCardHeader,
    withConditions,
  } = EditorPlugins;
  const ref = useRef();

  const { title, titleColor, titleBgc, titleFont } = card;
  const [cardTitle, setCardTitle] = useState({
    text: title,
    color: titleColor,
    bgc: titleBgc,
    fontStyle: titleFont,
  });

  const [value, setValue] = useState(initContent);
  // const writersTags = useSelector((state) => card.tags);
  const [userTags, setUserTags] = useState();
  const [fetchedIcons, setFetchedIcons] = useState([]);
  const [target, setTarget] = useState();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [previousMathEl, setPreviousMathEl] = useState("");

  const dispatch = useDispatch();
  const withCustomLayout = withTitledCardLayout; //make a switch case, switch(props.cardType)
  const editor = useMemo(
    () =>
      withMathBlock(
        // withCustomLayout(
        withEditableVoids(
          withConditions(
            withMentions(
              withSteps(
                withImages(
                  withCardHeader(
                    withCardData(
                      withHistory(withReact(createEditor())),
                      cardData
                    )
                  )
                )
              )
              // )
            )
          )
        )
      ),
    []
  );

  const chars =
    userTags && userTags.length > 0
      ? userTags
          .filter((tag) =>
            tag.name.toLowerCase().startsWith(search.toLowerCase())
          )
          .slice(0, 10)
      : [];

  useEffect(() => {
    if (target && chars.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      el.style.left = `${rect.left + window.pageXOffset}px`;
    }

    //removing props dependency made component NOT rerender 6 time on every saveNote
    //removing previous math dependency made component Not rerender on every delete
  }, [chars.length, editor, index, search, target]);

  const renderElement = useCallback((props) => {
    const { children, attributes, element } = props;
    switch (element.type) {
      case "image":
        return <Image {...props} />;
      case "code":
        return <CodeElement {...props} />;
      case "steps":
        return <StepsList {...props} />;
      case "step":
        return <StepNode {...props} />;
      case "editable-void":
        return <EditableVoid {...props} />;
      case "mention":
        return <Mention {...props} />;
      case "block-quote":
        return <QuoteBlock {...props} />;
      case "heading-one":
        return <H1Block {...props} />;
      case "heading-two":
        return <H2Block {...props} />;
      case "bulleted-list":
        return <BulletList {...props} />;
      case "numbered-list":
        return <NumberList {...props} />;
      case "list-item":
        return <ListItem {...props} />;
      case "math-block":
        return <MathBlock {...props} />;
      case "card-header":
        return <CardHeader {...props} />;
      case "card-toolbar":
        return <CardToolbar {...props} />;
      case "condition":
        return <ConditionBlock {...props} />;
      case "span":
        return <span {...attributes}>{children}</span>;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // Define a leaf rendering function that is memoized with `useCallback`.
  // For every format you add, Slate will break up the text content into "leaves",
  // and you need to tell Slate how to read it, just like for elements.
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  /////////////EVENTS/////////////////

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === "@") {
        getIconsFromDB();
      }

      if (target) {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            const prevIndex = index >= chars.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case "ArrowUp":
            event.preventDefault();
            const nextIndex = index <= 0 ? chars.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case "Tab":
          case "Enter":
            event.preventDefault();
            Transforms.select(editor, target);

            if (!chars[index]) {
              //if the tag doesnt exist..

              const randomIcon =
                fetchedIcons.length > 0
                  ? fetchedIcons[
                      Math.floor(Math.random() * fetchedIcons.length)
                    ].svg
                  : "";
              EditorPlugins.insertMention(editor, search, randomIcon);
              //saveNonExisitingTagToNote()
              saveNewTags(randomIcon);
            } else {
              EditorPlugins.insertMention(
                editor,
                chars[index].name,
                chars[index].image
              );
              // saveExistingTags();
              // const mentionArr = getNodes(editor, "mention");
              // const cardHasTag =
              //   mentionArr.findIndex(
              //     (mention) => mention.character == chars[index]
              //   ) == -1
              //     ? false
              //     : true;
              // console.log(`cardHasTag`, cardHasTag);
              // if (chars[index] && !cardHasTag) {
              //for example if a card in another blog has this tag
              //find the tag and copy the tag info to this card
            }

            setTarget(null);
            break;
          case "Escape":
            event.preventDefault();
            setTarget(null);
            break;
        }
      }
      if (event.key === "`") {
        event.preventDefault();
        EditorPlugins.insertMathBlock(editor);
      }

      if (event.ctrlKey) {
        const { division, root } = mathConfig.operator;
        switch (event.key) {
          case division.keydownShortcut: {
            event.preventDefault();
            EditorPlugins.insertMathChar(editor, division.tex);
            break;
          }

          case root.keydownShortcut: {
            event.preventDefault();
            EditorPlugins.insertMathChar(editor, root.tex);
            break;
          }
          case "`": {
            event.preventDefault();
            EditorPlugins.toggleCodeBlock(editor);
            break;
          }

          case "b": {
            event.preventDefault();
            EditorPlugins.toggleFormat(editor, "bold");
            break;
          }
          case "i": {
            event.preventDefault();
            EditorPlugins.toggleFormat(editor, "italic");
            break;
          }
          case "u": {
            event.preventDefault();
            EditorPlugins.toggleFormat(editor, "underlined");
            break;
          }

          case "1": {
            event.preventDefault();
            EditorPlugins.insertEditableVoid(editor);
          }
          case "2": {
            event.preventDefault();
            EditorPlugins.insertSelector(editor);
          }
        }
      }
    },
    [index, search, target, previousMathEl]
  );
  ////////////////////
  const saveNewTags = async (randomIcon) => {
    const currentTags = getNodes(editor, "mention").map((tag) => tag.character);

    const filteredTags = currentTags.reduce((prev, tag) => {
      console.log(`prev`, prev);
      if (!prev.includes(tag)) {
        return prev.concat(tag);
      }
      return prev;
    }, []);

    const variables = {
      cardId: card._id,
      tags: filteredTags,
      image: randomIcon,
    };

    dispatch(saveNewNoteTags(variables));
  };
  const saveExistingTags = async () => {
    const currentNameTags = getNodes(editor, "mention").map(
      (tag) => tag.character
    );
    const filteredNameTags = currentNameTags.reduce((prev, tag) => {
      if (!prev.includes(tag)) {
        return prev.concat(tag);
      }
      return prev;
    }, []);
    const mappedFilteredTags = filteredNameTags((filteredTag) => {
      const tagFromAllTags = userTags.find(
        (tag) => tag.name === filteredTag.name
      );
      return tagFromAllTags;
    });
    const variables = {
      cardId: card._id,
      tags: mappedFilteredTags,
    };

    dispatch(saveExistingNoteTags(variables));
  };

  const saveNote = () => {
    if (!value) return;
    const updates = {
      content: value,
      title: cardTitle.text,
      titleColor: cardTitle.color,
      titleBgc: cardTitle.bgc,
      titleFont: cardTitle.fontStyle,
    };
    const variables = { id: card._id, updates };
    dispatch(editNote(variables));
  };

  async function getCardTagNamesFromServer() {
    const { data } = await getCards();
    const cards = data.cards;

    const allTags = cards
      .reduce((prev, card) => {
        return prev.concat(card.tags);
      }, [])
      .reduce((prev, tag) => {
        if (!prev.map((obj) => obj.name).includes(tag.name)) {
          return prev.concat(tag);
        }
        return prev;
      }, []);
    setUserTags(allTags);
    return;
  }

  ////////////////////
  async function getIconsFromDB() {
    const { data } = await axios.get("/api/external/fetchIconsInDb");
    console.log(`fetchedIcons`, data.doc.icons);
    setFetchedIcons(data.doc.icons);
    return;
  }

  ///////////////////////

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={async (value) => {
        setValue(value);
        console.log(`value`, value);
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection);
          const wordBefore = Editor.before(editor, start, { unit: "word" });
          const before = wordBefore && Editor.before(editor, wordBefore);
          const beforeRange = before && Editor.range(editor, before, start);
          const beforeText = beforeRange && Editor.string(editor, beforeRange);
          const beforeMatch =
            beforeText &&
            beforeText.match(/^@([a-zA-Z0-9_*\u0590-\u05fe\u200f\u200e]+)$/);
          const after = Editor.after(editor, start);
          const afterRange = Editor.range(editor, start, after);
          const afterText = Editor.string(editor, afterRange);
          const afterMatch = afterText.match(/^(\s|$)/);
          if (beforeMatch && afterMatch) {
            setTarget(beforeRange);
            setSearch(beforeMatch[1]);
            setIndex(0);
            getCardTagNamesFromServer();

            return;
          }
        }

        setTarget(null);
      }}
    >
      {" "}
      <EditorHoverToolbar />
      <div
        style={{
          position: "absolute",
          right: 0,
          zIndex: 10,
          height: "100%",
          backgroundColor: "#DAE4FF",
          opacity: props.isCardHovered ? 1 : 0,
          width: props.isCardHovered ? "40px" : "0",
          transition: "linear 0.1s",
        }}
      >
        <EditorMainToolbar cardData={cardData} />
      </div>
      <TitleEditor
        title={cardTitle}
        setTitle={setCardTitle}
        bgc={"#ffffff"}
        darkenBgc={true}
        size={4}
      />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        readOnly={props.isReadOnly}
        placeholder="Note..."
        spellCheck
        onBlur={(e) => saveNote()}
        onDOMBeforeInput={(event) => {
          //Make sure you place the event.preventDefault() inside each case,
          //Else you will disable editing of the note.
          switch (event.inputType) {
            case "formatBold":
              event.preventDefault();
              return EditorPlugins.toggleFormat(editor, "bold");
            case "formatItalic":
              event.preventDefault();
              return EditorPlugins.toggleFormat(editor, "italic");
            case "formatUnderline":
              event.preventDefault();
              return EditorPlugins.toggleFormat(editor, "underlined");
          }
        }}
        onKeyDown={onKeyDown}
      />{" "}
      {target && (
        <Portal>
          <div
            ref={ref}
            style={{
              top: "-9999px",
              left: "-9999px",
              position: "absolute",
              zIndex: 1,
              padding: "3px",
              background: "white",
              borderRadius: "4px",
              boxShadow: "0 1px 5px rgba(0,0,0,.2)",
            }}
          >
            {chars.length > 0 ? (
              chars.map((tag, i) => (
                <div
                  key={tag.name}
                  onClick={() => {
                    console.log(`tag.name`, tag.name);
                  }}
                  style={{
                    padding: "1px 3px",
                    borderRadius: "3px",
                    background: i === index ? "#B4D5FF" : "transparent",
                  }}
                >
                  {tag.name}
                  {/* <Button>{tag.name}</Button> */}
                </div>
              ))
            ) : (
              <div
                key={search}
                style={{
                  padding: "1px 3px",
                  borderRadius: "3px",
                  background: 0 === index ? "#B4D5FF" : "transparent",
                }}
              >
                {search}
              </div>
            )}
          </div>
        </Portal>
      )}
    </Slate>
  );
}
