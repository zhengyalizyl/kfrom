import React, { Component } from 'react'
import { RouterContext } from './Context';
import LifeCycle from "./LifeCycle";

export default class Redirect extends Component {
  //!.render是要返回uI,也就是当前组件的子节点，如果跳转走了，就没有children了
  render() {
    const {to,children}=this.props;
    return (
      <RouterContext.Consumer>
        {context=>{
          const {to,push=false}=this.props;
          return <LifeCycle onMount={()=>{
            push?context.history.push(to):context.history.replace(to)
          }} >
          </LifeCycle>
        }}
      </RouterContext.Consumer>
    )
  }
}


