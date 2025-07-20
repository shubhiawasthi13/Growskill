import React from "react";
import MDEditor from "@uiw/react-md-editor";

const RichTextEditor = ({ value, onChange }) => {
  return (
    <div data-color-mode="light">
      <MDEditor value={value} onChange={onChange} />
    </div>
  );
};

export default RichTextEditor;
