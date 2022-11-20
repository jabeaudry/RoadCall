import React from "react";
import "../style/App.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import audioCall from "./audioCall.js";

interface MainProps {}

interface MainState {
  lat: Number;
  long: Number;
  connected: Boolean;
  connectWithSomeone: Boolean;
  locationFailed: Boolean;
  userId: Number;
  disconnectedUsers: any[];
  selectedUserId: Number;
}

export class Main extends React.Component<MainProps, MainState> {
  private interval: ReturnType<typeof setInterval>;
  constructor(props: MainProps) {
    super(props);
    this.state = {
      long: 0,
      lat: 0,
      connected: false,
      connectWithSomeone: false, //true means looking to connect
      locationFailed: false,
      userId: 0,
      disconnectedUsers: [],
      selectedUserId: 0,
    };
    this.interval = setInterval(() => {}, 1000);
  }

  componentDidMount() {
    this.getCurrentLocation();
    console.log(this.state.connectWithSomeone);
    this.interval = setInterval(() => {
      if (this.state.connected && this.state.connectWithSomeone) {
        this.getDisconnected();
        if (this.state.disconnectedUsers.length > 0) {
          let selectedUser =
            this.state.disconnectedUsers[
              Math.floor(Math.random() * this.state.disconnectedUsers.length)
            ];
          console.log(selectedUser);
          this.setState({ selectedUserId: selectedUser });
          this.setState({ connectWithSomeone: false });

          audioCall(
            String(this.state.userId),
            String(this.state.selectedUserId)
          );
        }
      }
      if (!this.state.connectWithSomeone) {
        clearInterval(this.interval);
      }
    }, 5000);
  }

  // GEOLOCATION API

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

  // INITIAL POST REQUEST

  createConnection = async () => {
    if (this.state.lat !== 0 && this.state.long !== 0) {
      console.log(this.state.lat);
      const data = {
        //firstName: "Alexandre",
        lat: this.state.lat,
        long: this.state.long,
      };
      try {
        // const response = await fetch("http://localhost:3000/createUser", {
        const response = await fetch("https://road-call.herokuapp.com/createUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        let res = await response
          .json()
          .then((re) => this.setState({ userId: re.userId }));
        this.setState({ locationFailed: false });
        this.setState({ connected: true });
        this.setState({ connectWithSomeone: true });
      } catch (error) {
        this.setState({ locationFailed: true });
        this.notify();
      }
    } else {
      this.setState({ locationFailed: true });
      this.notify();
    }
  };

  // GET DISCONNECTED ID

  getDisconnected = async () => {
    if (this.state.lat !== 0 && this.state.long !== 0) {
      let lat = Math.round((this.state.lat as number) * 10) / 10;
      console.log(lat);
      let long = Math.round((this.state.long as number) * 10) / 10;
      console.log(this.state.long);
      console.log(long);
      try {
        const response = await fetch(
          // `http://localhost:3000/disconnectedUsers?lat=${lat}&long=${long}`,
          `https://road-call.herokuapp.com/disconnectedUsers?lat=${lat}&long=${long}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((out) => {
            console.log(out?.userIds);
            if (out?.userIds) {
              this.setState({ disconnectedUsers: out.userIds });
            }
          });
      } catch (error) {
        console.log("Whoops");
      }
    } else {
      this.setState({ locationFailed: true });
      this.notify();
    }
  };

  // DELETE USER

  deleteConnection = async () => {
    try {
      console.log(this.state.userId);
      const response = await fetch(
        // `http://localhost:3000/deleteUser?userId=${this.state.userId}`,
        `https://road-call.herokuapp.com/deleteUser?userId=${this.state.userId}`,
        {
          method: "DELETE",
        }
      )
        .then((res) => res.text())
        .then((res) => console.log(res));
      this.setState({ connected: false });
      this.setState({ connectWithSomeone: false });
      this.setState({ selectedUserId: 0 });
    } catch (error) {
      console.log("User was not deleted whoops :(");
    }
  };

  // NOTIFICATIONS FOR ERRORS
  notify = () => {
    toast("UNEXPECTED ERROR: Please enable location sharing.", {
      position: toast.POSITION.BOTTOM_RIGHT,
      className: "app-notification",
    });
  };

  render() {
    if (
      this.state.connected &&
      !this.state.connectWithSomeone &&
      !this.state.locationFailed &&
      this.state.selectedUserId != 0
    ) {
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
                this.deleteConnection();
              }}
            >
              DISCONNECT
            </Button>
          </div>
          <h2 className="app-bottom-text">
            YOU ARE TALKING WITH
            <br />
            <span>Alexandre</span>!
          </h2>
          {/* <h1>{`${this.state.lat}`}</h1>
          <h1>{`${this.state.long}`}</h1> */}
        </div>
      );
    } else if (
      this.state.connected &&
      this.state.connectWithSomeone &&
      !this.state.locationFailed
    ) {
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
                this.deleteConnection();
              }}
            >
              DISCONNECT
            </Button>
          </div>

          <div className="loading-container">
            <CircularProgress className="loading-circle" />
            <h2 className="loading-text">SEARCHING FOR NEARBY DRIVER...</h2>
          </div>
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
                this.createConnection();
                this.setState({ connected: true });
                this.setState({ connectWithSomeone: true });
              }}
            >
              CONNECT
            </Button>
          </div>

          <h2 className="app-bottom-text">
            CONNECT WHEN VEHICLE <br /> IS AT A STOP!
          </h2>
          <ToastContainer
            autoClose={3000}
            progressClassName={"notification-progress-bar"}
          />
        </div>
      );
    }
  }
}
