import React, { Component } from 'react'
import logo from "./logo.png"
import "./App.css"
import {Button} from 'antd'
import Form from "./Form";



//函数型组件传递props
function Welcome1(props) {
    return (
        <div>
            Hello,{props.name}
        </div>
    )
}


export default class App extends Component {

    //当需要状态时，需要构造函数
    constructor(props) {
        super(props);

        //初始化状态
        this.state = {
            date: new Date(),
            count:0
        }
    }

    componentDidMount(){
        this.timer=setInterval(()=>{
            //更新状态
            this.setState({
                date:new Date(),
                count:this.state.count+1
            })
                //注意1：不能直接改状态
                //this.state.date=new Date();//错误
                //注意2:setState()异步的
                this.setState((prevState,prevProps)=>({
                  
                            count:prevState.count+1
                        
                }),()=>{
                    // console.log(this.shouldComponentUpdate.count)
                });

        },1000)
    }
    componentWillUnmount(){
        clearInterval(this.timer)
    }

    formartName(user) {
        return user.firstName + ' ' + user.lastName;
    }
    render() {
        const name = "zyl";
        //jsx本身也是表达式
        const jsx = <p>hello,zhengyali</p>
        return (
            <div>
                <Form/>
                {/**antd使用 */}
                <Button type="primary">button</Button>
                App组件
        {/**表达式*/}
                <h1>{name}</h1>
                <p>{this.formartName({ firstName: 'zheng', lastName: 'yali' })}</p>
                {/**属性 */}
                <img 
                 src={logo}
                 style={{ width: '100px' }} className="img" />
                {/**jsx也是表达式 */}
                {jsx}
                {/**组件属性传值:传入属性是只读的*/}
                <Welcome1 name="todom"></Welcome1>
                {/**使用状态 */}
                <p>{this.state.date.toLocaleTimeString()}</p>
            </div>
        )
    }
}
