import React from "react";
import "../style/App.scss";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import { positions } from "@mui/system";

interface MainProps {}

interface MainState {
  lat: Number;
  long: Number;
  connected: Boolean;
  connectWithSomeone: Boolean;
}

export class Main extends React.Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props);
    this.state = {
      long: 0,
      lat: 0,
      connected: false,
      connectWithSomeone: true,
    };
  }

  componentDidMount() {
    this.getCurrentLocation();
  }

  getPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve) =>
      navigator.geolocation.getCurrentPosition(resolve)
    );
  }

  getCurrentLocation() {
    this.getPosition()
      .then((position) => {
        console.log(position);
        this.setState({ lat: position.coords.latitude });
        this.setState({ long: position.coords.longitude });
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  render() {
    if (this.state.connected && this.state.connectWithSomeone) {
      return (
        <div className="main-container connected-container">
          <h1>Welcome to RoadCall</h1>
          <h2>
            You are talking with <span>Alexandre</span>!
          </h2>
          <Button
            size="large"
            variant="contained"
            onClick={() => {
              this.setState({ connected: false });
            }}
          >
            DISCONNECT
          </Button>
          <h1>{`${this.state.lat}`}</h1>
          <h1>{`${this.state.long}`}</h1>
        </div>
      );
    } else if (this.state.connected && !this.state.connectWithSomeone) {
      return (
        <div className="main-container disconnected-container">
          <h1>Welcome to RoadCall</h1>
          <>
            <h2>Searching...</h2>
            <CircularProgress />
          </>

          <Button
            size="large"
            variant="contained"
            onClick={() => {
              this.setState({ connected: false });
            }}
          >
            DISCONNECT
          </Button>
          <h1>{`${this.state.lat}`}</h1>
          <h1>{`${this.state.long}`}</h1>
        </div>
      );
    } else {
      return (
        <div className="main-container">
          <h1>Welcome to RoadCall</h1>
          <h2>Connect and start talking</h2>
          <Button
            size="large"
            variant="contained"
            onClick={() => {
              this.setState({ connected: true });
            }}
          >
            CONNECT
          </Button>
          <h1>{"penis"}</h1>
        </div>
      );
    }
  }
}
