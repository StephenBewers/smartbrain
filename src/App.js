import "./App.css";
import Header from "./components/Header/Header";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import ParticlesBg from 'particles-bg'
import { Component } from "react";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

window.process = {
  env: {
    NODE_ENV: "development",
  },
};

const initialState = {
  input: "",
  imageUrl: "",
  validImageUrl: true,
  boundingBoxes: {},
  route: "signIn",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocations = (data) => {
    const clarifaiFaces = data.outputs[0].data.regions;
    const image = document.getElementById("input-image");
    const width = Number(image.width);
    const height = Number(image.height);

    let boundingBoxes = [];

    if (clarifaiFaces.length) {
      clarifaiFaces.forEach((region) => {
        const face = region.region_info.bounding_box;

        let box = {};
        box.leftCol = face.left_col * width;
        box.topRow = face.top_row * height;
        box.rightCol = width - face.right_col * width;
        box.bottomRow = height - face.bottom_row * height;

        boundingBoxes.push(box);
      });
    }

    return boundingBoxes;
  };

  displayFaceBoxes = (boundingBoxes) => {
    this.setState({ boundingBoxes: boundingBoxes });
    return boundingBoxes.length;
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  submitImageToClarifai = (imageUrl) => {
    this.setState({ imageUrl: imageUrl, validImageUrl: true, boundingBoxes: {} });
    fetch(`${process.env.REACT_APP_API_URL}/image-url`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: imageUrl,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
        if (response) {
          const faces = this.displayFaceBoxes(
            this.calculateFaceLocations(response)
          );
          fetch(`${process.env.REACT_APP_API_URL}/image`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
              faces: faces,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch((error) => console.error(error));
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          validImageUrl: false,
          imageUrl: "",
          boundingBoxes: {},
        });
      });
  };

  onImageSubmit = () => {
    if (
      this.state.input.includes(".jpg") ||
      this.state.input.includes(".jpeg") ||
      this.state.input.includes(".png")
    ) {
      const imageUrl = this.state.input.split(/[?#]/)[0];
      this.submitImageToClarifai(imageUrl);
    } else if (this.state.input === "") {
      this.submitImageToClarifai(
        "https://smartbrain.stephenbewers.com/example.jpg"
      );
    } else {
      this.setState({ validImageUrl: false, imageUrl: "", boundingBoxes: {} });
    }
  };

  onRouteChange = (route) => {
    if (route === "signOut") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, boundingBoxes, user } = this.state;

    return (
      <div className="App">
        <ParticlesBg
          type="cobweb"
          color="#ffffff"
          bg={true}
        />
        <Header isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === "home" ? (
          <>
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onImageSubmit={this.onImageSubmit}
              validImageUrl={this.state.validImageUrl}
            />
            <FaceRecognition
              imageUrl={imageUrl}
              boundingBoxes={boundingBoxes}
            />
          </>
        ) : route === "register" ? (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        ) : (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
