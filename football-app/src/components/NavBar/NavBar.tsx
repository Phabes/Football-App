import React, { Component } from "react";
import "./NavBar.css";

class NavBar extends Component {
  componentDidMount(): void {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("http://localhost:5000/test", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }
  render() {
    return <nav>NavBar</nav>;
  }
}

export default NavBar;
