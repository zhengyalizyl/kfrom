import React, { Component } from 'react'

export default class LifeCycle extends Component {
  componentDidMount(){
    this.props.onMount&&this.props.onMount.call(this,this)
  }
  render() {
    return null;
  }
}
