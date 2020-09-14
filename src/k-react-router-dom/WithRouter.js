import { RouterContext } from "./Context";
import React from "react";

export   const WithRouter=WarppedComponent=>props=>{
  return (<RouterContext.Consumer>
     {context=>{
       return <WarppedComponent {...props} {...context}/>
     }}
  </RouterContext.Consumer>)
}