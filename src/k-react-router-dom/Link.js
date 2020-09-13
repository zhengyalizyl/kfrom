import React, { Component } from 'react'
import { RouterContext } from './Context';

export default class Link extends Component {
  static contextType=RouterContext;
  render() {
    const {children,to,...resProps}=this.props;
    return (
     <a href={to} {...resProps} onClick={(e)=>{
        e.preventDefault();
       this.context.history.push(to)
     }}>
       {children}
     </a>
    )
  }
}
