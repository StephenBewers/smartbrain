import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onImageSubmit, validImageUrl }) => {
  const showErrorMessage = () => {
    if (!validImageUrl) {
      return (
        <p className="f5 ma2 dark-red">
          <strong>Error: URL must be a valid .jpg or .png image file. Please try a different URL.</strong>
        </p>
      );
    }
  };

  return (
    <div className="container black">
      <p className="f4 mt4 mb2 mh4">
        SmartBrain detects faces in your pictures. Paste the URL of an image
        into the box below to detect faces.
      </p>
      
      <div className="image-form center pa4 br3 mv4 shadow-5">
        <input type="text" className="f5 pa2 w-70" onChange={onInputChange} placeholder="e.g. https://smartbrain.stephenbewers.com/example.jpg" />
        <button
          className="w-30 f5 link ph3 pv2 b dib white bg-blue"
          onClick={onImageSubmit}
        >
          Detect
        </button>
      </div>
      {showErrorMessage()}
    </div>
  );
};

export default ImageLinkForm;
