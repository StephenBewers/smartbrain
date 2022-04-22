import "./App.css";
import Header from "./components/Header/Header";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Component } from "react";
import Clarifai from "clarifai";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

window.process = {
  env: {
    NODE_ENV: "development",
  },
};

const app = new Clarifai.App({
  apiKey: "104040363f844777b45a1f1eab832eab",
});

const particlesInit = async (main) => {
  // Particles are initialised
  await loadFull(main);
};

const particlesLoaded = (container) => {
  // Particles are loaded
};

const particlesOptions = {
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 100,
        duration: 0.8,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.35,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 0.7,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 50,
    },
    opacity: {
      value: 0.35,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
  detectRetina: true,
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      boundingBoxes: {},
      route: "signIn",
      isSignedIn: false,
    };
  }

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
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onBtnSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    console.log(this.state.input);
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) =>
        this.displayFaceBoxes(this.calculateFaceLocations(response))
      )
      .catch((error) => console.error(error));
  };

  onRouteChange = (route) => {
    if(route === "home") {
      this.setState({isSignedIn: true})
    } else {
      this.setState({isSignedIn: false})
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, boundingBoxes } = this.state;

    return (
      <div className="App">
        <Particles
          id="tsparticles"
          className="particles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={particlesOptions}
        />
        <Header isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === "home" ? (
          <>
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onBtnSubmit={this.onBtnSubmit}
            />
            <FaceRecognition
              imageUrl={imageUrl}
              boundingBoxes={boundingBoxes}
            />
          </>
        ) : route === "signIn" ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
