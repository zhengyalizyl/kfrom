import {createStore,applyMiddleware} from '../KReducer/createStore'
// import logger from "redux-logger";
// import thunk from "redux-thunk";
const counterReducer = (state = 0, action) => {
  switch (action.type) {
   case 'add':
    return state + 1
   case 'minus':
    return state - 1
   default:
    return state
 }
}

function thunk({dispatch,getState}){
  return next=>action=>{
    if(typeof action==='function'){
        return action(dispatch,getState)
    }
    return next(action)
  }
}

function logger({dispatch,getState}){
  return next=>action=>{
    const prevState=getState();
    console.log('pre state',prevState)

    const returnValue=next(action);
    const nextState=getState();
    console.log('next state',nextState)

    return returnValue
  }
}



const store = createStore(counterReducer,applyMiddleware(thunk,logger))
export default store