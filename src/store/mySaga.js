//redux-saga是一个用于管理应用程序的副作用库，类比redux-thunk
//调用异步操作
//状态更新(dispatch)
//监听
import { call,put,takeEvery  } from "redux-saga/effects";

//work saga
function *loginHandle(action){
    // const res=yield call
}

//watch saga
function *mySaga(props){
 yield takeEvery('login',loginHandle)
}