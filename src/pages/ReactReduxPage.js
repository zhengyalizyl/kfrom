import React, { Component } from "react";
import { connect } from "../KReactRedux";
import {bindActionCreators} from "../KReactRedux";

@connect(
  // mapStateToProps Fucntion
 // !慎重定义ownProps，因为你一旦定义ownProps，那么每当ownProps发生改变的时候，当前的mapStateToProps都会被调用，
 // !这里的state也会被重新计算，容易影响性能
  state=>{
    return {count:state.count}
  },
  // {
  //   add:()=>({type:'add'}),
  //   minus:()=>({type: "minus"})
  // }
// mapDispatchToProps Object Fucntion
 // Object 此时props中没有dispacth，但是有action creators，内部实现dispatch
 // {
 //  add: () => ({type: "ADD"}),
 //  minus: () => ({type: "MINUS"})
 // }
 // Fucntion 参数是dispatch与ownProps
 // !慎重定义ownProps，因为你一旦定义ownProps，那么每当ownProps发生改变的时候，当前的mapStateToProps都会被调用，容易影响性能
  (dispatch,ownProps)=>{
    let creators={
      add:()=>({type:'add'}),
      minus:()=>({type: "minus"})
    };
    creators=bindActionCreators(creators,dispatch);
    return {dispatch,...creators}
  }
)
 class ReduxPage extends Component {
  render() {
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