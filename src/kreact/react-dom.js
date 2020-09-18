import { TEXT, PLACEMENT, UPDATE, DELETION } from "./index";

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

//正在工作的fiber
let wipFiber = null;

//当前的fiber
let currentRoot = null;

let deletions=[];
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
 deletions=[];
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
  updateNode(node,{}, props);
  return node;
}

// function reconcileChildren(children,node){
//   for(let i=0;i<children.length;i++){
//     let child=children[i];
//     //child是虚拟dom,要把虚拟dom变成真实dom，然后插入父节点node中
//     render(child,node)
//   }
// }

function updateNode(node,oldVal, nextVal) {
  Object.keys(oldVal)
    .filter(k => k !== "children")
    .forEach(k => {
      if (k.slice(0, 2) === "on") {
        let eventName = k.slice(2).toLowerCase();
        node.addEventListener(eventName, oldVal[k]);
      } else {
        if(!(k in nextVal)){
          node[k]=''
        }
      }
    });
  Object.keys(nextVal)
    .filter(k => k !== "children")
    .forEach(k => {
      if (k.slice(0, 2) === "on") {
        let eventName = k.slice(2).toLowerCase();
        node.addEventListener(eventName, nextVal[k]);
      } else {
        node[k] = nextVal[k];
      }
    });
}

function updateClassComponent(fiber) {
  // const { type, props } = vnode;
  // const newType = new type(props);
  // const vvnode = newType.render();
  // return createNode(vvnode);
  const { type, props } = fiber;
  const newType = new type(props);
  const children = [newType.render()];
  reconcileChildren(fiber, children);
}

function updateFunComponent(fiber) {
  // const { type, props } = vnode;
  // const vvnode = type(props);
  // return createNode(vvnode);

  wipFiber = fiber;
  wipFiber.hooks = [];
  wipFiber.hooksIndex = 0;
  const { type, props } = fiber;
  const children = [type(props)];
  reconcileChildren(fiber, children);
}

function commitRoot() {
  deletions.forEach(commitWorker)
  commitWorker(wipRoot.child);
  currentRoot = wipRoot;
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
  let parentNodeFiber = fiber.return;
  while (!parentNodeFiber.node) {
    parentNodeFiber = parentNodeFiber.return;
  }
  const parentNode = parentNodeFiber.node;
  //fiber有node节点
  if (fiber.effectTag === PLACEMENT && fiber.node !== null) {
    parentNode.appendChild(fiber.node);
  }else if (fiber.effectTag === UPDATE && fiber.node !== null) {
   updateNode(fiber.node,fiber.base.props,fiber.props)
  }else if(fiber.effectTag===DELETION&&fiber.node!==null){
    commitDeletions(fiber,parentNode)
  }

  commitWorker(fiber.child);
  commitWorker(fiber.sibling);
}


function commitDeletions(fiber,parentNode){
   if(fiber.node){
     parentNode.removeChild(fiber.node)
   }else{
     commitDeletions(fiber.child,parentNode)
   }
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
 let oldFiber = workInProgress.base && workInProgress.base.child;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    let newFiber = null;
    //暂时只判断type是否相等，不判断key
    const sameType = child && oldFiber && child.type ===oldFiber.type;
    if (sameType) {
      //节点可以复用
      newFiber = {
        type: child.type,
        props: child.props,
        node: oldFiber.node,
        base: oldFiber,
        return: workInProgress,
        effectTag: UPDATE
      };
    }
    if (!sameType && child) {
      //节点插入
      newFiber = {
        type: child.type,
        props: child.props,
        node: null,
        base: null,
        return: workInProgress,
        effectTag: PLACEMENT
      };
    }

    if(!sameType&&oldFiber){
      //删除
      oldFiber.effectTag=DELETION;
      deletions.push(oldFiber);
    }

    //1 2 3
    //2 3 4
    if(oldFiber){
      oldFiber=oldFiber.sibling;
    }
    if (i === 0) {
      workInProgress.child = newFiber;//第一个的prevsibling为null
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
}

function performUnitOfWork(fiber) {
  //执行后当前fiber
  const { type } = fiber;
  if (typeof type === "function") {
    type.isReactComponet
      ? updateClassComponent(fiber)
      : updateFunComponent(fiber);
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

//fiber里定义hook
// hook={
//   state:状态值,
//   queue:[]
// }
export const useState = init => {
  //上一次的hook(存在的话，证明现在是更新阶段)
  const oldHook =
    wipFiber.base && wipFiber.base.hooks[wipFiber.hooksIndex];
  const hook = {
    state: oldHook ? oldHook.state : init, //存储当前的状态值
    queue: oldHook ? oldHook.queue : [] //存储要更新的值
  };
  //模拟批量更新
  hook.queue.forEach(action => (hook.state = action));
  const setState = action => {
    hook.queue.push(action);
    wipRoot = {
      node: currentRoot.node,
      props: currentRoot.props,
      base: currentRoot
    };
    nextUnitOfWork = wipRoot;
    deletions=[];
  };
  //把定义好的hook存入fiber,指向hook的游标往后移动一位
  wipFiber.hooks.push(hook);
  wipFiber.hooksIndex++;
  return [hook.state, setState];
};




export default {
  render,
};
