export const TEXT='TEXT'
export const PLACEMENT = "PLACEMENT";
export const UPDATE = "UPDATE";
export const DELETION = "DELETION";


function createElement(type, config, ...children) {
  if(config){
    delete config.__source;
    delete config.__self;
  }
  let defaultProps={};
  if(type&&type.defaultProps){
      defaultProps={...type.defaultProps}
  }
  
  //不考虑key和ref
  const props={
    ...defaultProps,
    ...config,
    children:children.map(child=>typeof child==='object'?child:createTextNode(child))//保持结构一致性，将来好便利
  }

  return {
    type,
    props,
  };
}


function createTextNode(text){
  return {
    type:TEXT,
    props:{
      children:[],
      nodeValue:text
    }
  }
}


export const  cloneElement=(element,config,...children)=>{
  const props={...element.props};
  let defaultProps=element.type&&element.type.defaultProps?element.type.defaultProps:{};
  for(let propName in config){
    if(propName!=='key'||propName!=='ref'){
      let  val=config[propName]||defaultProps[propName]
      val&&(props[propName]=val)
    }
  }
  props.children=children.map(child=>typeof child==='object'?child:createTextNode(child))
  return {
    key:element.key||config.key||'',
    type:element.type,
    props,
  };
}



export default { createElement,cloneElement };
