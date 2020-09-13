import React, { Component } from "react";
import { RouterContext } from "./Context";
import matchPath from "./matchPath";
import { type } from "os";

export default class Route extends Component {
  static contextType = RouterContext;
  render() {
    const { component, children, render, path } = this.props;

    const match = path
      ? matchPath(this.context.location.pathname, this.props)
      : this.context.match;
    // return match ? React.createElement(component) : null;
    const props = {
      ...this.context,
      match
    };
    return match
      ? children
        ? typeof children === "function"
          ? children(props)
          : children
        : component
        ? React.createElement(component, props)
        : render
        ? render(props)
        : null
      : typeof children === "function"
      ? children(props)
      : null;
  }
}
