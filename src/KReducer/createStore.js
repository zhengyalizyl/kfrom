 export const createStore= (reducer, enhancer) => {
  if (enhancer) {
    //增强了createStore的dispatch
    return enhancer(createStore)(reducer);
  }
  let currentState;
  let listeners = [];
  //保存状态
  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return ()=>{
      listeners=listeners.filter(item=>item!==listener)
    }
  }
  function dispatch(action) {
    currentState = reducer(currentState, action);
    listeners.forEach(v => v());
    return action
  }
  dispatch({ type: "@@initData" });
  return { getState, subscribe, dispatch };
};

function compose(...fn) {
  if (fn.length === 0) {
    return (args) => args;
  }
  if (fn.length === 1) {
      return fn[0]
  }
  return fn.reduce((f1, f2) => (...args) => f1(f2(...args)));
}

export const applyMiddleware = (...middlewares) => {
  //返回强化后的函数
  return createStore => (...args) => {
    const store = createStore(...args);
    let dispatch = store.dispatch;

    const midApi = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    };
    // 使中间件可以获取状态值、派发action
    const middlewareChain = middlewares.map(middleware => middleware(midApi));
    // compose可以middlewareChain函数数组合并成一个函数
    dispatch = compose(...middlewareChain)(store.dispatch);
    return {
      ...store,
      dispatch
    };
  };
};


export const combineReducer=(reducers)=>{
  return (state={},action)=>{
    let nextState={};
    let hasChanged=false;
    for(let key in reducers){
      nextState[key]=reducers[key](state[key],action);
      hasChanged=hasChanged||(nextState[key]!==state[key])
    }
  //{a:1,b:2}
  //{a:1}
  // debugger
    hasChanged=hasChanged||Object.key(nextState).length!==Object.key(state).length
    return hasChanged?nextState:state;
  }
}