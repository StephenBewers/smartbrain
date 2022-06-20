import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onImageSubmit }) => {
  return (
    <div className="container black">
      <p className="f4 ma4">
        SmartBrain detects faces in your pictures. Paste the web address of a
        picture into the box below to find faces.
      </p>
      <div className="image-form center pa4 br3 mv4 shadow-5">
        <input type="text" className="f5 pa2 w-70" onChange={onInputChange} />
        <button className="w-30 f5 link ph3 pv2 b dib white bg-blue grow" onClick={onImageSubmit}>
          Detect faces
        </button>
      </div>
    </div>
  );
};

export default ImageLinkForm;
