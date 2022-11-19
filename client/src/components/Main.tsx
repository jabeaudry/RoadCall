import React from "react";
import "../style/App.scss";
//import {NotificationContainer, NotificationManager} from 'react-notifications';
import "react-notifications/lib/notifications.css";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";

interface MainProps {}

interface MainState {
  lat: Number;
  long: Number;
  connected: Boolean;
  connectWithSomeone: Boolean;
  locationFailed: Boolean;
}

export class Main extends React.Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props);
    this.state = {
      long: 0,
      lat: 0,
      connected: false,
      connectWithSomeone: false,
      locationFailed: false,
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

  createConnection = async () => {
    if (this.state.lat != 0 && this.state.long != 0) {
      const data = {
        //firstName: "Alexandre",
        lat: this.state.lat,
        long: this.state.long,
      };
      try {
        const response = await fetch("http://localhost:3000/createUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        this.setState({ locationFailed: false });
      } catch (error) {
        // NotificationManager.error('UNEXPECTED ERROR', 'Click me!', 5000, () => {
        //     alert('callback');
        //   });
        this.setState({ locationFailed: true });
      }
    } else {
      // NotificationManager.error('Error message', 'Click me!', 5000, () => {
      //     alert('callback');
      //   });
      this.setState({ locationFailed: true });
    }
  };

  render() {
    if (this.state.connected && this.state.connectWithSomeone) {
      //connected with someone
      return (
        <div className="main-container connected-container">
          <div className="app-logo-container">
            <img className="app-logo" src="phone.png"></img>
            <h1 className="app-title">RoadCall</h1>
            <Button
              size="large"
              className="app-button"
              variant="contained"
              onClick={() => {
                this.setState({ connected: false });
              }}
            >
              DISCONNECT
            </Button>
          </div>
          <h2 className="app-bottom-text">
            YOU ARE TALKING WITH
            <br />
            <span>ALEXANDRE</span>!
          </h2>
          {/* <h1>{`${this.state.lat}`}</h1>
          <h1>{`${this.state.long}`}</h1> */}
        </div>
      );
    } else if (this.state.connected && !this.state.connectWithSomeone) {
      //looking for someone, connected
      return (
        <div className="main-container disconnected-container">
          <div className="app-logo-container">
            <img className="app-logo" src="phone.png"></img>
            <h1 className="app-title">RoadCall</h1>
            <Button
              className="app-button"
              size="large"
              variant="contained"
              onClick={() => {
                this.setState({ connected: false });
              }}
            >
              DISCONNECT
            </Button>
          </div>

          <div className="loading-container">
            <CircularProgress className="loading-circle" />
            <h2 className="loading-text">SEARCHING FOR NEARBY DRIVER...</h2>
          </div>
          {/* <h1>{`${this.state.lat}`}</h1>
          <h1>{`${this.state.long}`}</h1> */}
        </div>
      );
    } else {
      //not connected yet
      return (
        <div className="main-container">
          <div className="app-logo-container">
            <img className="app-logo" src="phone.png"></img>
            <h1 className="app-title">RoadCall</h1>

            <Button
              size="large"
              className="app-button"
              variant="contained"
              onClick={() => {
                this.setState({ connected: true });
                this.createConnection();
              }}
            >
              CONNECT
            </Button>
          </div>

          <h2 className="app-bottom-text">
            CONNECT WHEN VEHICLE <br /> IS AT A STOP!
          </h2>
        </div>
      );
    }
  }
}
