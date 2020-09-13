import React, { Component } from 'react'

export default class LifeCycle extends Component {
  componentDidMount(){
    this.props.onMount&&this.props.onMount.call(this,this)
  }
  componentWillUnmount(){
    this.props.onUnMount&&this.props.onUnMount.call(this,this)
  }
  render() {
    return null;
  }
}
