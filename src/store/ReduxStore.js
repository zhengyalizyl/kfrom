import {createStore,applyMiddleware} from '../KReducer/createStore'
import logger from "redux-logger";
import thunk from "redux-thunk";
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
const store = createStore(counterReducer,applyMiddleware(thunk,logger))
export default store