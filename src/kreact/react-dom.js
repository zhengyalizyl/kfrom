import { TEXT, PLACEMENT } from "./index";

//fiber的结构:
// type:标记当前节点的类型;
// props:属性
// key:标记唯一性
// child：第一个子节点
// sibling：下一个兄弟节点
// return:指向父节点
// node:真实的dom节点
// base:记录一下当前的节点

//下一个要执行的fiber,数据结构就是fiber
let nextUnitOfWork = null;

//work in propgress正在进行中的结构类型fiber
let wipRoot = null;

function render(vnode, container) {
  wipRoot = {
    node: container,
    props: {
      children: [vnode]
    },
    base: null
  };
  nextUnitOfWork = wipRoot;

  // vnode=>node
  const node = createNode(vnode);
  container.appendChild(node);
}

function createNode(vnode) {
  let node = null;
  const { type, props } = vnode;

  if (type === TEXT) {
    node = document.createTextNode("");
  } else if (typeof type === "string") {
    node = document.createElement(type);
  }
  //  else if(typeof type==='function'){

  //     node=type.isReactComponet?updateClassComponent(vnode):updateFunComponent(vnode)
  // }else {
  //   node=document.createDocumentFragment();
  // }

  // reconcileChildren(props.children,node);
  updateNode(node, props);
  return node;
}

// function reconcileChildren(children,node){
//   for(let i=0;i<children.length;i++){
//     let child=children[i];
//     //child是虚拟dom,要把虚拟dom变成真实dom，然后插入父节点node中
//     render(child,node)
//   }
// }

function updateNode(node, nextVal) {
  Object.keys(nextVal)
    .filter(k => k !== "children")
    .forEach(k => {
      node[k] = nextVal[k];
    });
}

function updateClassComponent(fiber) {
  // const { type, props } = vnode;
  // const newType = new type(props);
  // const vvnode = newType.render();
  // return createNode(vvnode);
  const {type,props}=fiber;
  const newType=new type(props);
  const children=[newType.render()];
  reconcileChildren(fiber,children);
}

function updateFunComponent(fiber) {
  // const { type, props } = vnode;
  // const vvnode = type(props);
  // return createNode(vvnode);
const {type,props}=fiber;
const children=[type(props)]
reconcileChildren(fiber,children)
}

function commitRoot() {
  commitWorker(wipRoot.child);
  wipRoot = null;
}

function commitWorker(fiber) {
  if (!fiber) {
    return;
  }

  //parenNode是离fiber的离得最近的dom父或祖先节点，不一定是fiber.return
  //   <Provider store={store}>
  // <APP/>
  //   </Provider>
  let parentNodeFiber=fiber.return;
  while(!parentNodeFiber.node){
    parentNodeFiber=parentNodeFiber.return;
  }
  const parentNode = parentNodeFiber.node;
  //fiber有node节点
  if (fiber.effectTag === PLACEMENT && fiber.node !== null) {
    parentNode.appendChild(fiber.node);
  }

  commitWorker(fiber.child);
  commitWorker(fiber.sibling);
}

function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    //执行更新当前fiber,并且返回下一个要执行的fiber
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (!nextUnitOfWork && wipRoot) {
    //没有下一个任务，执行提交
    commitRoot();
  }
  window.requestIdleCallback(workLoop);
}

//协调子节点
//1.给workInProgress添加一个子节点，就是chidren的第一个子节点形成的fiber
//2.形成fiber架构，就是children里节点遍历一下，形成fiber链表状
function reconcileChildren(workInProgress, children) {
  let prevSibling = null;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    //初次渲染
    let newFiber = {
      type: child.type,
      props: child.props,
      node: null,
      base: null,
      return: workInProgress,
      effectTag: PLACEMENT
    };
    if (i === 0) {
      workInProgress.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
  }
}

function updateHostComponent(fiber) {
  if (!fiber.node) {
    fiber.node = createNode(fiber);
  }

  const { children } = fiber.props;
  reconcileChildren(fiber, children);
  console.log("updateHostComponent", fiber);
}

function performUnitOfWork(fiber) {
  //执行后当前fiber
  const { type } = fiber;
  if (typeof type === "function") {

    type.isReactComponet?updateClassComponent(fiber):updateFunComponent(fiber)
  } else {
    //原生标签的
    updateHostComponent(fiber);
  }
  //并且返回下一个要执行的fiber
  //原则：先看一下有没有子节点
  if (fiber.child) {
    return fiber.child;
  }
  //如果没有子节点，找兄弟
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}
window.requestIdleCallback(workLoop);

export default {
  render
};
