let isMount = true;//是否是挂载阶段，一开始的时候一定是挂载的
let workInProgressHook = null //hook链表指针

//在react中每一个逐渐都有一个fiber来管理它
//因为组件之间是有关系的，形成一个树形结构，所以fiber也是树形的
//fiber树是在diff阶段就生成了
const fiber = {
  //当前管理的组件
  stateNode:App,
  //组件使用了的hooks，这里表现为链表形式，
  //使用了多个hooks就会形成一个有顺序的链表,之后会根据这个链表顺序执行hook,这也是hooks不能用在if中的原因
  memoizedState:null,
}

function useState(initialState){
  let hook;
  if(isMount){
    // 在首次渲染的时候应该创建 hook 链表
    hook = {
      memoizedState:initialState, //当前useState的状态
      next:null,//下一个useState的状态
      queue:{ //状态更新的环状链表
        pending:null
      }
    }
    if(!fiber.memoizedState){
      fiber.memoizedState = hook
      workInProgressHook = hook
    }else{
      workInProgressHook.next = hook
    }
    workInProgressHook = hook
  }else{
    // 更新的时候直接找到当前的 hook,并更新一下 指针即可，
    // 下次在进来的时候就可以快速找到下一个hook
    hook = workInProgressHook;
    workInProgressHook = hook.next
  }

  let baseState = hook.memoizedState;
  if(hook.queue.pending){
    //存在表示有新的update需要被执行
    let firstUpdate = hook.queue.pending.next;
    
    do {
     const action = firstUpdate.action;
     baseState = action(baseState)
     firstUpdate = firstUpdate.next
    } while (firstUpdate !== hook.queue.pending.next);

    hook.queue.pending = null;
  }

  hook.memoizedState = baseState;
  return [baseState,dispatchAction.bind(null,hook.queue)]
}

//在react中用这个函数来执行状态更新，也就是updateNum1中传递的状态
function dispatchAction(queue,action){
  const update = {
    action,
    next:null
  }

  if(queue.pending === null){
    //u0 -> u0 -> u0
    update.next = update;
  }else{
    //u0 -> u1 -> u0 -> u0
    update.next = queue.pending.next
    queue.pending.next = update
  }

  queue.pending = update;
  
  schedule();
}

//调度执行App(),在更新状态的时候通过这个方法来执行组件来重新渲染
function schedule(){
  //在执行更新之前需要先讲 hook 链表的指针重新指向头部
  workInProgressHook = fiber.memoizedState
  const app = fiber.stateNode();
  isMount = false;
  return app
}


//假设这是一个组件,返回的是一个对象
//当我们调用其中的onClick方法时就会重新渲染当前组件（执行App()）
function App(){
  const [num1,updateNum1] = useState(0)
  const [num2,updateNum2] = useState(10)

  console.log("isMount",isMount)
  console.log("num1",num1)
  console.log("num2",num2)

  return {
    onClick(){
      updateNum1(num => {
        return num + 1;
      })
    },
    onFocus(){
      updateNum2(num => num + 10)
    }
  }
}

let app = schedule()
app.onClick()
app.onClick()
app.onFocus()