import React, { Component } from "react";
import { connect } from "react-redux";
import {bindActionCreators} from "redux";

@connect(
  state=>{
    return {count:state.count}
  },
  {
    add:()=>({type:'add'}),
    minus:()=>({type: "minus"})
  }

  // dispatch=>{
  //   let creators={
  //     add:()=>({type:'add'}),
  //     minus:()=>({type: "minus"})
  //   };
  //   creators=bindActionCreators(creators,dispatch);
  //   return {dispatch,...creators}
  // }
)
 class ReduxPage extends Component {
  render() {
console.log(this.props,"+++++++++++++")
    return (
      <div>
            <h1>ReduxPage</h1>
            <p>{this.props.count}</p>
            <button onClick={this.props.add}>add</button>
            <button onClick={this.props.minus}>minus</button>
            
      </div>
    );
  }
}


export default ReduxPage;