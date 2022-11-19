import React from "react";

import Button from "@mui/material/Button";
import { positions } from "@mui/system";

interface MainProps {}

interface MainState {
  lat: Number;
  long: Number;
}

export class Main extends React.Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props);
    this.state = {
      long: 0,
      lat: 0,
    };
  }

  componentDidMount() {
    this.test();
  }

  getPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve) =>
      navigator.geolocation.getCurrentPosition(resolve)
    );
  }

  test() {
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
    return (
      <>
        <p>Welcome </p>
        <Button size="large" variant="contained">
          CONNECT
        </Button>
        <h1>{`${this.state.lat}`}</h1>
        <h1>{`${this.state.long}`}</h1>
      </>
    );
  }
}
