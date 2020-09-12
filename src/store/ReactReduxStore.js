import {createStore,applyMiddleware, combineReducer} from '../KReducer/createStore'
import isPromise from 'is-promise'
import { isFSA } from "flux-standard-action";
// import logger from "redux-logger";
// import thunk from "redux-thunk";
// import reduxPromise from "redux-promise";
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
const counterReducer2 = (state = 0, action) => {
  switch (action.type) {
   case 'add2':
    return state + 1
   case 'minus2':
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



// function reduxPromise({dispatch,getState}){
//   return next=>action=>{
//     return isPromise(action)?action.then(dispatch):next(action)
//   }
// }
function reduxPromise({dispatch,getState}){
  return next=>action=>{
    if(!isFSA(action)){
    return isPromise(action)?action.then(dispatch):next(action)
    }
    return isPromise(action.payload)?action.payload.then(result=>dispatch({...action,payload:result}))
    .catch(error => {
      dispatch({ ...action, payload: error, error: true });
      return Promise.reject(error);
    }):next(action)
  }
}





const store = createStore(combineReducer({count:counterReducer}),applyMiddleware(thunk,reduxPromise,logger))
export default store