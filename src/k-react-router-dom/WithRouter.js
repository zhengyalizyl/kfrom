import { RouterContext } from "./Context";

export   const WithRouter=WarppedComponent=>props=>{
  return (<RouterContext.Consumer>
     {context=>{
       return <WarppedComponent {...props} {...context}/>
     }}
  </RouterContext.Consumer>)
}