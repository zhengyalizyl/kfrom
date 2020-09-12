import React, { useContext } from "react";

export const bindActionCreators = (creators, dispatch) => {
  // let creators={
  //   add:()=>({type:'add'}),
  //   minus:()=>({type: "minus"})
  // };
  // creators=bindActionCreators(creators,dispatch);

  let obj = {};

  for (const key in creators) {
    obj[key] = bindActionCreator(creators[key], dispatch);
  }
  return obj;
};

const bindActionCreator = (creator, dispatch) => {
  return (...args) => dispatch(creator(...args));
};

const Context = React.createContext();
export const Provider = ({ store, children }) => {
  return <Context.Provider value={store}>{children}</Context.Provider>;
};

export const connect = (
  mapStateToProps = state => state,
  mapDispatchToProps
) => WrappedComponent => props => {
  //1.获取state
  const store = useContext(Context);
  const { getState, dispatch, subscribe } = store;
  const stateProps = mapStateToProps(getState());
  //  {
  //   add:()=>({type:'add'}),
  //   minus:()=>({type: "minus"})
  // }
  // dispatch=>{
  //   let creators={
  //     add:()=>({type:'add'}),
  //     minus:()=>({type: "minus"})
  //   };
  //   creators=bindActionCreators(creators,dispatch);
    // return {dispatch,...creators}
console.log(mapDispatchToProps)
let  newMapDispatchToProp={}
if( typeof mapDispatchToProps==='object'){
  newMapDispatchToProp=bindActionCreators(mapDispatchToProps,dispatch)
}else if(typeof mapDispatchToProps==='function'){
  newMapDispatchToProp=mapDispatchToProps(dispatch);
}

  const dispatchProps = {
    dispatch,
    ...newMapDispatchToProp
  };
  const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
  React.useLayoutEffect(() => {
    const unsubscribe=subscribe(() => {
      forceUpdate();
    });
    return ()=>{
      unsubscribe&&unsubscribe();
    }
  },[store]);
  return <WrappedComponent {...props} {...stateProps} {...dispatchProps} />;
};



 export const useSelector=(selector)=>{
  //  const count = useSelector(({count})=>count)
    const store=useContext(Context);
    console.log(store)
    const {getState,subscribe}=store;
    const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
    React.useLayoutEffect(() => {
      const unsubscribe=subscribe(() => {
        forceUpdate();
      });
      return ()=>{
        unsubscribe&&unsubscribe();
      }
    },[store]);
   return selector(getState())
}


export const useDispatch =()=>{
  // const dispatch = useDispatch();
  const store=useContext(Context);
    const {dispatch}=store;
    return dispatch;
}