import React from "react";
import ReactDOM from "react-dom";
import ReactQuill, { Quill } from "react-quill";
import QuillMention from "quill-mention";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import NoteMentions from "./sections/NoteMentions";

Quill.register("modules/mention", QuillMention);
const atValues = [
  { id: 1, value: "Fredrik Sundqvist" },
  { id: 2, value: "Patrik Sjölin" },
];
const hashValues = [
  { id: 3, value: "Fredrik Sundqvist 2" },
  { id: 4, value: "Patrik Sjölin 2" },
];

const __ISMSIE__ = navigator.userAgent.match(/Trident/i) ? true : false;

const QuillClipboard = Quill.import("modules/clipboard");

const CustomToolbar = ({ id = "toolbar" }) => (
  <div id={id}>
    <select
      className="ql-header"
      defaultValue={""}
      onChange={(e) => e.persist()}
    >
      <option value="1" />
      <option value="2" />
      <option value="" />
    </select>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline" />
    <button className="ql-strike" />
    <button className="ql-insertImage">I</button>
    <button className="ql-insertVideo">V</button>
    <button className="ql-insertFile">F</button>
    <button className="ql-link" />
    <button className="ql-code-block" />
    <button className="ql-video" />
    <button className="ql-blockquote" />
    <button className="ql-clean" />
  </div>
);

class Clipboard extends QuillClipboard {
  getMetaTagElements = (stringContent) => {
    const el = document.createElement("div");
    el.innerHTML = stringContent;
    return el.getElementsByTagName("meta");
  };

  async onPaste(e) {
    let clipboardData = e.clipboardData || window.clipboardData;
    let pastedData = await clipboardData.getData("Text");

    const urlMatches = pastedData.match(/\b(http|https)?:\/\/\S+/gi) || [];
    if (urlMatches.length > 0) {
      e.preventDefault();
      urlMatches.forEach((link) => {
        axios
          .get(link)
          .then((payload) => {
            // let title, image, url, description;
            let title, image, url;
            for (let node of this.getMetaTagElements(payload)) {
              if (node.getAttribute("property") === "og:title") {
                title = node.getAttribute("content");
              }
              if (node.getAttribute("property") === "og:image") {
                image = node.getAttribute("content");
              }
              if (node.getAttribute("property") === "og:url") {
                url = node.getAttribute("content");
              }
              // if (node.getAttribute("property") === "og:description") {
              //     description = node.getAttribute("content");
              // }
            }

            const rendered = `<a href=${url} target="_blank"><div><img src=${image} alt=${title} width="20%"/><span>${title}</span></div></a>`;

            let range = this.quill.getSelection();
            let position = range ? range.index : 0;
            this.quill.pasteHTML(position, rendered, "silent");
            this.quill.setSelection(position + rendered.length);
          })
          .catch((error) => console.error(error));
      });
    } else {
      console.log(`this.quill`, this.quill);
      //console.log('when to use this') 보통 다른 곳에서  paste 한다음에  copy하면 이쪽 걸로 한다.
      super.onPaste(e);
    }
  }
}
Quill.register("modules/clipboard", Clipboard, true);

const BlockEmbed = Quill.import("blots/block/embed");

class ImageBlot extends BlockEmbed {
  static create(value) {
    const imgTag = super.create();
    imgTag.setAttribute("src", value.src);
    imgTag.setAttribute("alt", value.alt);
    imgTag.setAttribute("width", "100%");
    return imgTag;
  }

  static value(node) {
    return { src: node.getAttribute("src"), alt: node.getAttribute("alt") };
  }
}

ImageBlot.blotName = "image";
ImageBlot.tagName = "img";
Quill.register(ImageBlot);

const Inline = Quill.import("blots/inline");

class SpecialBlot extends Inline {
  static create(value) {
    const spanTag = super.create();
    spanTag.innerHTML = value.innerHTML;
    spanTag.style.color = value.color;
    // ReactDOM.render(<NoteMentions />, divTag);

    return spanTag;
  }

  static value(node) {
    return {
      color: node.getAttribute("color"),
      innerHTML: node.getAttribute("innerHTML"),
    };
  }
}

SpecialBlot.blotName = "mention";
SpecialBlot.tagName = "div";
Quill.register(SpecialBlot);

class VideoBlot extends BlockEmbed {
  static create(value) {
    if (value && value.src) {
      const videoTag = super.create();
      videoTag.setAttribute("src", value.src);
      videoTag.setAttribute("title", value.title);
      videoTag.setAttribute("width", "100%");
      videoTag.setAttribute("controls", "");

      return videoTag;
    } else {
      const iframeTag = document.createElement("iframe");
      iframeTag.setAttribute("src", value);
      iframeTag.setAttribute("frameborder", "0");
      iframeTag.setAttribute("allowfullscreen", true);
      iframeTag.setAttribute("width", "100%");
      return iframeTag;
    }
  }

  static value(node) {
    if (node.getAttribute("title")) {
      return { src: node.getAttribute("src"), alt: node.getAttribute("title") };
    } else {
      return node.getAttribute("src");
    }
    // return { src: node.getAttribute('src'), alt: node.getAttribute('title') };
  }
}

VideoBlot.blotName = "video";
VideoBlot.tagName = "video";
Quill.register(VideoBlot);

class FileBlot extends BlockEmbed {
  static create(value) {
    const prefixTag = document.createElement("span");
    prefixTag.innerText = "첨부파일 - ";

    const bTag = document.createElement("b");
    //위에 첨부파일 글자 옆에  파일 이름이 b 태그를 사용해서 나온다.
    bTag.innerText = value;

    const linkTag = document.createElement("a");
    linkTag.setAttribute("href", value);
    linkTag.setAttribute("target", "_blank");
    linkTag.setAttribute("className", "file-link-inner-post");
    linkTag.appendChild(bTag);
    //linkTag 이런식으로 나온다 <a href="btn_editPic@3x.png" target="_blank" classname="file-link-inner-post"><b>btn_editPic@3x.png</b></a>

    const node = super.create();
    node.appendChild(prefixTag);
    node.appendChild(linkTag);

    return node;
  }

  static value(node) {
    const linkTag = node.querySelector("a");
    return linkTag.getAttribute("href");
  }
}

FileBlot.blotName = "file";
FileBlot.tagName = "p";
FileBlot.className = "file-inner-post";
Quill.register(FileBlot);

class PollBlot extends BlockEmbed {
  static create(value) {
    const prefixTag = document.createElement("span");
    prefixTag.innerText = "투표 - ";

    const bTag = document.createElement("b");
    bTag.innerText = value.title;

    const node = super.create();
    node.setAttribute("id", value.id);
    node.appendChild(prefixTag);
    node.appendChild(bTag);

    return node;
  }

  static value(node) {
    const id = node.getAttribute("id");
    const bTag = node.querySelector("b");
    const title = bTag.innerText;
    return { id, title };
  }
}

PollBlot.blotName = "poll";
PollBlot.tagName = "p";
PollBlot.className = "poll-inner-post";
Quill.register(PollBlot);

class QuillEditor extends React.Component {
  bandId;
  placeholder;
  onEditorChange;
  onFilesChange;
  onPollsChange;
  _isMounted;

  constructor(props) {
    super(props);

    const initialValue = props.value ? props.value : "";
    // this.state = {
    //   editorHtml: __ISMSIE__ ? "<p>&nbsp;</p>" : "",
    //   files: [],
    // };
    this.state = {
      editorHtml: initialValue,
      files: [],
      selection: window.getSelection() ? window.getSelection.index : 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.reactQuillRef = null;

    this.inputOpenImageRef = React.createRef();
    this.inputOpenVideoRef = React.createRef();
    this.inputOpenFileRef = React.createRef();
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange = (html) => {
    console.log("html", html);

    // https://youtu.be/BbR-QCoKngE
    // https://www.youtube.com/embed/ZwKhufmMxko
    // https://tv.naver.com/v/9176888
    // renderToStaticMarkup(ReactHtmlParser(html, options));

    this.setState(
      {
        editorHtml: html,
      },
      () => {
        this.props.onEditorChange(this.state.editorHtml);
      }
    );
  };

  static imageHandler() {
    console.log(this);
    // this.inputOpenImageRef.current.click();
  }

  // onKeyDown = (e) => {
  //   if (e.key === "@") {
  //     //load the keywords

  //     let range = this.reactQuillRef.editor.getSelection();
  //     let position = range ? range.index : 0;
  //     //https://quilljs.com/docs/api/#setselection
  //     // this.reactQuillRef.editor.setSelection(position - 1, 10, "a"); ///get back to this
  //     //we will use the insertText function which automatically erases the @ if we selected a keyword
  //     // this.reactQuillRef.editor.insertText(position, "a");
  //     const text = "a";

  //     this.reactQuillRef.editor.insertEmbed(
  //       position,
  //       "mention",
  //       {
  //         value: text,
  //       },
  //       "silent"
  //     );

  //     // console.log(`position`, range);
  //     this.reactQuillRef.editor.setSelection(position, 3, "silent");
  //     // e.preventDefault(); //
  //   }
  // };

  mentionModule = {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
    mentionDenotationChars: ["@", "#"],
    source: function (searchTerm, renderList, mentionChar) {
      let values;

      if (mentionChar === "@") {
        values = atValues;
      } else {
        values = hashValues;
      }

      if (searchTerm.length === 0) {
        renderList(values, searchTerm);
      } else {
        const matches = [];
        for (let i = 0; i < values.length; i++)
          if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase()))
            matches.push(values[i]);
        renderList(matches, searchTerm);
      }
    },
  };

  render() {
    return (
      <div>
        <CustomToolbar id={this.props.toolbarId} />
        <ReactQuill
          ref={(el) => {
            this.reactQuillRef = el;
          }}
          theme={"bubble"}
          onChange={this.handleChange}
          modules={QuillEditor.modules(
            this.props.toolbarId,
            this.mentionModule
          )}
          formats={this.formats}
          value={this.state.editorHtml}
          placeholder={this.props.placeholder}
          onBlur={this.props.onBlur}
          onKeyDown={this.onKeyDown}
        />
        <input
          type="file"
          accept="image/*"
          ref={this.inputOpenImageRef}
          style={{ display: "none" }}
          onChange={this.insertImage}
        />
        <input
          type="file"
          accept="video/*"
          ref={this.inputOpenVideoRef}
          style={{ display: "none" }}
          onChange={this.insertVideo}
        />
        <input
          type="file"
          accept="*"
          ref={this.inputOpenFileRef}
          style={{ display: "none" }}
          onChange={this.insertFile}
        />
      </div>
    );
  }
}

QuillEditor.modules = (toolbarId, mentionModule) => ({
  syntax: true,
  toolbar: {
    container: "#" + toolbarId,
    handlers: {
      insertImage: imageHandler,

      // insertVideo: this.videoHandler,
      // insertFile: this.fileHandler,
      // insertPoll: this.pollHandler,
    },
  },
  mention: mentionModule,
});

QuillEditor.formats = [
  "mention",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "image",
  "video",
  "file",
  "link",
  "code-block",
  "video",
  "blockquote",
  "clean",
];

function imageHandler() {
  console.log(this);
  // this.inputOpenImageRef.current.click();
}

export default QuillEditor;

// // I V F P들을  눌렀을떄 insertImage: this.imageHandler로 가서  거기서 inputOpenImageRef를 클릭 시킨다.

// videoHandler = () => {
//   this.inputOpenVideoRef.current.click();
// };

// fileHandler = () => {
//   this.inputOpenFileRef.current.click();
// };

// insertImage = (e) => {
//   e.stopPropagation();
//   e.preventDefault();

//   if (
//     e.currentTarget &&
//     e.currentTarget.files &&
//     e.currentTarget.files.length > 0
//   ) {
//     const file = e.currentTarget.files[0];

//     let formData = new FormData();
//     const config = {
//       header: { "content-type": "multipart/form-data" },
//     };
//     formData.append("file", file);

//     axios.post("/api/blog/uploadfiles", formData, config).then((response) => {
//       if (response.data.success) {
//         const quill = this.reactQuillRef.getEditor();
//         quill.focus();

//         let range = quill.getSelection();
//         let position = range ? range.index : 0;

//         //먼저 노드 서버에다가 이미지를 넣은 다음에   여기 아래에 src에다가 그걸 넣으면 그게
//         //이미지 블롯으로 가서  크리에이트가 이미지를 형성 하며 그걸 발류에서     src 랑 alt 를 가져간후에  editorHTML에 다가 넣는다.
//         quill.insertEmbed(position, "image", {
//           src: "http://localhost:5000/" + response.data.url,
//           alt: response.data.fileName,
//         });
//         quill.setSelection(position + 1);

//         if (this._isMounted) {
//           this.setState(
//             {
//               files: [...this.state.files, file],
//             },
//             () => {
//               this.props.onFilesChange(this.state.files);
//             }
//           );
//         }
//       } else {
//         return alert("failed to upload file");
//       }
//     });
//   }
// };

// insertVideo = (e) => {
//   e.stopPropagation();
//   e.preventDefault();

//   if (
//     e.currentTarget &&
//     e.currentTarget.files &&
//     e.currentTarget.files.length > 0
//   ) {
//     const file = e.currentTarget.files[0];

//     let formData = new FormData();
//     const config = {
//       header: { "content-type": "multipart/form-data" },
//     };
//     formData.append("file", file);

//     axios.post("/api/blog/uploadfiles", formData, config).then((response) => {
//       if (response.data.success) {
//         const quill = this.reactQuillRef.getEditor();
//         quill.focus();

//         let range = quill.getSelection();
//         let position = range ? range.index : 0;
//         quill.insertEmbed(position, "video", {
//           src: "http://localhost:5000/" + response.data.url,
//           title: response.data.fileName,
//         });
//         quill.setSelection(position + 1);

//         if (this._isMounted) {
//           this.setState(
//             {
//               files: [...this.state.files, file],
//             },
//             () => {
//               this.props.onFilesChange(this.state.files);
//             }
//           );
//         }
//       } else {
//         return alert("failed to upload file");
//       }
//     });
//   }
// };

// insertFile = (e) => {
//   e.stopPropagation();
//   e.preventDefault();

//   if (
//     e.currentTarget &&
//     e.currentTarget.files &&
//     e.currentTarget.files.length > 0
//   ) {
//     const file = e.currentTarget.files[0];
//     console.log(file);

//     let formData = new FormData();
//     const config = {
//       header: { "content-type": "multipart/form-data" },
//     };
//     formData.append("file", file);

//     axios.post("/api/blog/uploadfiles", formData, config).then((response) => {
//       if (response.data.success) {
//         const quill = this.reactQuillRef.getEditor();
//         quill.focus();

//         let range = quill.getSelection();
//         let position = range ? range.index : 0;
//         quill.insertEmbed(position, "file", response.data.fileName);
//         quill.setSelection(position + 1);

//         if (this._isMounted) {
//           this.setState(
//             {
//               files: [...this.state.files, file],
//             },
//             () => {
//               this.props.onFilesChange(this.state.files);
//             }
//           );
//         }
//       }
//     });
//   }
// };
