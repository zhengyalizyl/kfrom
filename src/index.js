// import React,{Component} from "react";
// import ReactDOM from "react-dom";
// import App from "./App"
// import store from "./store/ReactReduxStore";
// import Lifecycle from "./Lifecycle"
// import CartSample from "./CartSample"
// import CommentList from "./components/CommentList";
// import Composition from "./components/Composition";
// import Hoc from "./components/Hoc";
// import Context from "./components/Context";
// import AntdTest from "./components/AntdTest";
// import KFormSample from "./components/KFormSample";
// import store from "./store/store"
// import ReduxTest from "./components/ReduxTest";
// import {Provider} from './KReactRedux'
// import { Provider } from "react-redux";

// ReactDOM.render(<h1>React真酷</h1>,document.querySelector("#root"))
// const render=()=>{
//     ReactDOM.render(
//       <App />,
//     document.getElementById('root')
//   );
//   }

//   render();
//   store.subscribe(render);
// console.log(store)
// ReactDOM.render(<Provider store={store}><App/></Provider>,document.getElementById('root'))
// ReactDOM.render(<CommentList/>,document.querySelector("#root"))
// ReactDOM.render(<Composition/>,document.querySelector("#root"))
// ReactDOM.render(<Hoc stage="React" />,document.querySelector("#root"))
// ReactDOM.render(<Context/>,document.querySelector("#root"))
// ReactDOM.render(<AntdTest/>,document.querySelector("#root"))
// ReactDOM.render(<KFormSample/>,document.querySelector("#root"))

// ReactDOM.render(<Lifecycle />,document.querySelector("#root"))
// ReactDOM.render(<CartSample title="React购物车"/>,document.querySelector("#root"))

// //动态渲染
// function tick(){
//     ReactDOM.render(<h2>{new Date().toLocaleTimeString()}</h2>,document.querySelector("#root"))
// }
// setInterval(tick,1000);

// function render(){
//     ReactDOM.render(
//         (
//         <Provider store={store}>
//             <ReduxTest/>
//         </Provider>
// ),document.querySelector("#root"))
// }

// render()
// store.subscribe(
//    render
// )

//1.什么是jsx？为什么需要jsx?怎么用？原理?
//jsx是对js语法的扩展，是我们可以用类似xml方式描述视图
//执行快，类型安全，简单快速
//原理:babel-loader会预编译jsx为React.createElement(type,props,...children)

import React from "./kreact/index";
import Component from "./kreact/Component";
import ReactDOM,{useState} from "./kreact/react-dom";
import "./App.css";
function Comp(props) {
 const  [count, setCount] = useState(0)
  return (<>
  <h1>函数组件，你好{props.name}-{count}</h1>
  <button onClick={()=>setCount(count+1)}>add</button>
  </>);
}

class Comp2 extends Component {
  static defaultProps = {
    color: "pink"
  };
  render() {
    return (
      <div>
        <h2 className={this.props.color}>class组件---{this.props.name}</h2>
        <h3>23333333</h3>
      </div>
    );
  }
}

const jsx = (
  <div id="demo" style={{ color: "red" }} className="box">
    <span>hi</span>
    <div>开可把</div>
    <Comp name="zyl"></Comp>
    <Comp2 name="zyl"></Comp2>
    <>
      <p>1233</p>
      <p>2345</p>
    </>
  </div>
);

ReactDOM.render(jsx, document.querySelector("#root"));

//1.webpack+babel-loader编译时，替换jsx为React.createElement(...)
//2.所有React.createElement(...)执行结束会得到一个js对象树，能够完整描述dom结构，称之为虚拟dom
//3.React-dom.render(vdom,container)可以将vdom转换为dom追加至container中
// 通过遍历vdom树，根据vtype不同，执行不同逻辑：vtype为1生成原生标签；vtype为2实例化class组件并将其render返回的vdom初始化，vtype为3直接执行函数将结果初始化

//diff策略
//1.web ui中dom节点跨层级的移动操作特别少，可以忽略不计
//2.拥有相同类的两个组建将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构
//3.对于同一层级的一组子节点，它们可以通过唯一id进行区分
//基于以上三个前提策略，React分别对tree diff，component diff以及element diff进行算法优化

//1.redux是什么：redux是管理react state的工具
//2.为什么需要reux?
// react中的state在简单的应用逻辑上还是比较容易处理，但是对于过于复杂的应用，数据向下传递的次数多时就很费脑子了，容易出错，修改不容易
//尤其在react的（状态提升）问题计较大。redux把state的统一管理，你可以想象它把所有的state放在了一起，组成一个全局的普遍对象(state),当你需要其中的值时，
//通过key获取即可，比较特别的是当需要更新值时，你必须通过返回一个新的state以覆盖原来的值
//redux的三个部分：
//1.redux=>创建并更新state
//redux是个返回state的函数，由它更新state
// 2.action=>要更新的数据
// action是一个对象，里面存的是要更新的数据，当然你需要指定key去更新哪部分数据
//3.store=>数据库，里面放着state,这部分是核心
//store是一个redux根据reducer生产的数据库对象，主要用来存放数据
//简单理解三者的关系:
//1.通过多个reducer实例化store,并在store里产生初始的state
//2.需要更新state时，调用store的方法传入action即可完成数据更新
//例子:点击按钮输入框值加减-
//假设需要做一个app:
//<div>
//<input type="text" value="0"/>
//<input type="text" value="加1"/>
//<input type="text" value="减1"/>
//</div>
//用react做的思路大概是这个样子:
//1.state控制输入框的显示值，初始值是0
//this.state={
// num:0
// }
// 2.两个按钮分别有一个事件，点击时改变state，这样输入框显示的值也就改变了
// handleClick:function(){
//     this.setState((pre)=>({
//                 num:++pre.num//--pre.num
//     }))
// }
// 现在用redux改造它:值的显示不再由state控制，改为redux store控制：
//1.reudcer,创建store之前需要创建reducer，以获取state
// function reudcer(state,action){//state占位必需的形参，action里存了要更新的数据
//     if(state==undefined){
//         state={num:0}
//         switch(action,type){
//             case '+1':
//             return  {num:++state.num}
//             break
//             case '-1':
//             return  {num:--state.num}
//             break
//         default:
//         return state

//         }
//     }

// }
//2store,初始的state是通过reduce的default获得的
// const store=createStore(reducer);
// 3.获取输入框的数据显示
//store.getState();//{num:0}
//4.添加事件，由它更新store里的state,进而更新ui
// var action={
//     type:'+1'//-1
// }
// StorageEvent.dispatch(action)//这样就完成了数据更新
// 以上基本就完成了redux改造，是不是很简单！还有一些你需要了解的地方：

// > redux 实际也是个组件而已，使用它必须包裹在 redux 组件内部，store提供了函数完成包裹

// store.subscribe(fn) //fn里返回你的组件

// > action可能有很多，可以通过一些函数生成action减少数量，再将这些函数一起在一个单独的文件里

// > reducer可以拆分多个，分别处理不同类的业务，然后通过函数合并成一个
// combineReducers({
//     reducer1,
//     reducer2,
//     ...
// })

//connect()
// React-Redux提供connect方法，用于从ui组件生成容器组件。connect的意思，就是将这两种组件连接起来。
// import {  connect} from "react-redux";
// const VisibleTodoList=connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(TodoList)
// 上面代码中，TodoList是UI组件，VisibleTodoList就是由React-Redux通过connect方法自动生成的容器组件

//<Provider>组件
// connect方法生成容器组件以后，需要让容器组件拿到state对象，才能生成ui组件的参数：
//一种解决方案是将state对象作为参数，传入容器组件。但是这样比较麻烦，尤其是容器组件可能在很深的层级，一级级将state传下去很麻烦
// React-Redux提供Provider组件，可以让容器组件拿到state
// import { Provider } from 'react-redux'
// import { createStore } from 'redux'
// import todoApp from './reducers'
// import App from './components/App'

// let store = createStore(todoApp);

// render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// )
// 它的原理是React组件的context属性，请看源码。
// class Provider extends Component {
//     getChildContext() {
//       return {
//         store: this.props.store
//       };
//     }
//     render() {
//       return this.props.children;
//     }
//   }

//   Provider.childContextTypes = {
//     store: React.PropTypes.object
//   }
// 上面代码中，store放在了上下文对象context上面。然后，子组件就可以从context拿到store，代码大致如下。
// class VisibleTodoList extends Component {
//     componentDidMount() {
//       const { store } = this.context;
//       this.unsubscribe = store.subscribe(() =>
//         this.forceUpdate()
//       );
//     }

//     render() {
//       const props = this.props;
//       const { store } = this.context;
//       const state = store.getState();
//       // ...
//     }
//   }

//   VisibleTodoList.contextTypes = {
//     store: React.PropTypes.object
//   }
