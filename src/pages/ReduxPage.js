import React, { Component } from "react";
import store from "../store/ReduxStore";

export default class ReduxPage extends Component {
  componentDidMount() {
    this.unsubcribe=store.subscribe(() => {
      console.log("subscribe");
      this.forceUpdate(); //this.setState({});
    });
  }

  componentWillUnmount(){
    if(this.unsubcribe){
      this.unsubcribe();
    }
  }


  add = () => {
    store.dispatch({ type: "add" });
  };
  minus = () => {
    store.dispatch({ type: "minus" });
  };
  stayStatic = () => {
    store.dispatch({ type: "others" });
  };
  asyAdd = () => {
      store.dispatch(dispatch => {
       setTimeout(() => {
        dispatch({ type: "add" });
      }, 1000);
     });
    };
  render() {
    console.log("store", store,store.getState);
    return (
      <div>
            <h1>ReduxPage</h1>
            <p>{store.getState()}</p>
            <button onClick={this.add}>add</button>
            <button onClick={this.minus}>minus</button>
            <button onClick={this.asyAdd}>异步</button>
      </div>
    );
  }
}