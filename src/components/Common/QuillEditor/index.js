import React from 'react';
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./QuillEditor.scss";

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

function QuillEditor({ placeholder, className, value, onChange }) {
  return (
    <ReactQuill
      className={className}
      theme="snow"
      modules={QUILL_MODULES}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default QuillEditor;
