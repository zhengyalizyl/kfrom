import React, { Component } from 'react'
import { RouterContext } from './Context';

export default class Route extends Component {
  static contextType=RouterContext;
  render() {
    const {component,path}=this.props;

    const match=path?this.context.location.pathname===path:this.context.match;
    return (
     match?React.createElement(component):null
    )
  }
}
