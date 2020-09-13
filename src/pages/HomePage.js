import React, { Component } from 'react'
import { Redirect } from '../k-react-router-dom';

export default class HomePage extends Component {
  render() {
    return (
      <div>
        {/* <Redirect to={{pathname:'/welcome'}}></Redirect> */}
        HomePage
      </div>
    )
  }
}
