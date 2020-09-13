import React, { Component } from "react";
import logo from "./logo.png";
import "./App.css";
import { Button } from "antd";
// import Form from "./Form";
import ReduxPage from "./pages/ReactReduxHookPage";
// import { Switch, Link, BrowserRouter, Redirect, Route } from "react-router-dom";
import { Switch, Link, BrowserRouter, Redirect, Route } from "./k-react-router-dom";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";
import _404Page from "./pages/_404Page";
import WelcomPage from "./pages/WelcomPage";

//函数型组件传递props
function Welcome1(props) {
  return <div>Hello,{props.name}</div>;
}

function Product(props) {
    console.log(props)
  const { id } = props.match.params;
  const { url } = props.match;
  return (
    <div>
      Product:{id}
      <Link to={`${url}/detail`}></Link>
      <Route path={`${url}/detail`} component={Detail} />
    </div>
  );
}

function Detail(props) {
  return <div>商品详情</div>;
}

export default class App extends Component {
  //当需要状态时，需要构造函数
  constructor(props) {
    super(props);

    //初始化状态
    this.state = {
      date: new Date(),
      count: 0
    };
  }

  componentDidMount() {
    // this.timer=setInterval(()=>{
    //     //更新状态
    //     this.setState({
    //         // date:new Date(),
    //         count:this.state.count+1
    //     })
    //         //注意1：不能直接改状态
    //         //this.state.date=new Date();//错误
    //         //注意2:setState()异步的
    //         this.setState((prevState,prevProps)=>({
    //                     count:prevState.count+1
    //         }),()=>{
    //             // console.log(this.shouldComponentUpdate.count)
    //         });
    // },1000)
  }
  componentWillUnmount() {
    // clearInterval(this.timer)
  }

  formartName(user) {
    return user.firstName + " " + user.lastName;
  }
  render() {
    const name = "zyl";
    //jsx本身也是表达式
    const jsx = <p>hello,zhengyali</p>;
    return (
      <div>
        <BrowserRouter>
          <nav>
            <Link to="/">首页</Link>
            <Link to="/user">用户中心</Link>
            <Link to="/login">登录</Link>
            {/* <Link to="/product/123">商品</Link> */}
          </nav>
          {/* <Switch> */}
            <Route exact path="/" component={HomePage} />
            <Route path="/user" component={UserPage} />
            <Route path="/login" component={LoginPage} />
            {/* <Route path="/product/:id" component={Product} /> */}
            <Route path="welcome" component={WelcomPage} />
            <Route component={_404Page} />
          {/* </Switch> */}
        </BrowserRouter>
        {/* <ReduxPage /> */}
        {/**antd使用 */}
        {/* <Button type="primary">button</Button> */}
        {/* App组件 */}
        {/**表达式*/}
        {/* <h1>{name}</h1> */}
        {/* <p>{this.formartName({ firstName: "zheng", lastName: "yali" })}</p> */}
        {/**属性 */}
        {/* <img src={logo} style={{ width: "100px" }} className="img" /> */}
        {/**jsx也是表达式 */}
        {/* {jsx} */}
        {/**组件属性传值:传入属性是只读的*/}
        {/* <Welcome1 name="todom"></Welcome1> */}
        {/**使用状态 */}
        {/* <p>{this.state.date.toLocaleTimeString()}</p> */}
      </div>
    );
  }
}
