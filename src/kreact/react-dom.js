import { TEXT } from "./index";

function render(vnode,container) {
  // vnode=>node
  const node=createNode(vnode);
  container.appendChild(node)
}

function createNode(vnode){
  let node=null;
  const {type,props}=vnode;

  if(type===TEXT){
    node=document.createTextNode('')
  }else if(typeof type==='string'){
    node=document.createElement(type)
  }else if(typeof type==='function'){

      node=type.isReactComponet?updateClassComponent(vnode):updateFunComponent(vnode)
  }else {
    node=document.createDocumentFragment();
  }

  reconcileChildren(props.children,node);
  updateNode(node,props)
  return node;
}


function reconcileChildren(children,node){
  for(let i=0;i<children.length;i++){
    let child=children[i];
    //child是虚拟dom,要把虚拟dom变成真实dom，然后插入父节点node中
    render(child,node)
  }
}

function updateNode(node,nextVal){
  Object.keys(nextVal).filter(k=>k!=='children').forEach(k=>{
    node[k]=nextVal[k]
  })
}


function updateClassComponent(vnode){
  const {type,props}=vnode;
  const newType=new type(props);
  const vvnode= newType.render();
  return createNode(vvnode)
}

function updateFunComponent(vnode){
  const {type,props}=vnode;
  const vvnode=type(props);
  return createNode(vvnode)
}

export default {
  render
};
