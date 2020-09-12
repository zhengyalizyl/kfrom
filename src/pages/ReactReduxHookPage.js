import React,{useCallback} from 'react'
import { useSelector,useDispatch } from "../KReactRedux";

export default function ReactReduxHookPage() {
const count = useSelector(({count})=>count)
 const dispatch = useDispatch();
 const add=useCallback(
   () => {
     dispatch({type:'add'})
   },
   []
 )
  return (
    <div>
      ReactReduxHookPage
      <p>{count}</p>
      <button onClick={add}>add</button>
    </div>
  )
}
