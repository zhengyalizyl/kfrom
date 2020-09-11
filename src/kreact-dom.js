import { initVNode } from "./kvdom";

function render(vnode,container){
    // container.innerHTML=`<pre>${JSON.stringify(vnode,2,null)}</pre>`
   container.appendChild(initVNode(vnode))
}
export default{render}