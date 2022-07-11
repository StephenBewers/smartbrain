import "./App.css";
import Header from "./components/Header/Header";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Component } from "react";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

window.process = {
  env: {
    NODE_ENV: "development",
  },
};

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
    fetch("https://still-dusk-95539.herokuapp.com/image-url", {
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
          fetch("https://still-dusk-95539.herokuapp.com/image", {
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
