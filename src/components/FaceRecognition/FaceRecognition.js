import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, boundingBoxes }) => {
  const displayBoundingBoxes = (boundingBoxes) => {
    let boundingBoxesHtml = [];

    if (boundingBoxes.length) {
      let i = 0;
      boundingBoxes.forEach((box) => {
        i++;
        boundingBoxesHtml.push(
          <div
            key={`box-${i}`}
            className="bounding-box"
            style={{
              top: box.topRow,
              right: box.rightCol,
              bottom: box.bottomRow,
              left: box.leftCol,
            }}
          ></div>
        );
      });
    }

    return boundingBoxesHtml;
  };

  return (
    <div className="center ma pb4">
      <div className="absolute mt2">
        <img
          src={imageUrl}
          id="input-image"
          alt=""
          width="500px"
          height="auto"
        />
        {displayBoundingBoxes(boundingBoxes)}
      </div>
    </div>
  );
};

export default FaceRecognition;
