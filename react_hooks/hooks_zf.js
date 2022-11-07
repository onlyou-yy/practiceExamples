//https://www.bilibili.com/video/BV1ed4y1A74J/?spm_id_from=333.337.search-card.all.click&vd_source=41ed998ac767425fb616fd9071ce9682

//在react中每个组件都会有一个 fiber 来管理状态
let hookIndex = 0;//hook索引
let hookStates = [];//hook状态缓存。react中实际上是使用 链表来管理的

function useState(initialState){
  hookStates[hookIndex] = hookStates[hookIndex] || initialState

  let currentIndex = hookIndex;
  function setState(newState){
    let lastState = hookStates[currentIndex]
    hookStates[currentIndex] = newState(lastState);
    render()
  }
  return [hookStates[hookIndex++],setState];
}

function useMemo(factory,dependencies){
  if(hookStates[hookIndex]){
    let [lastMemo,lastDependencies] = hookStates[hookIndex];
    let same = lastDependencies.every((item,index) => item === dependencies[index])
    if(same){
      hookIndex++;
      return lastMemo;
    }
    let newMemo = factory()
    hookStates[hookIndex++] = [newMemo,dependencies]
    return newMemo
  }else{
    let newMemo = factory();
    hookStates[hookIndex++] = [newMemo,dependencies];
    return newMemo
  }
}

function useCallback(callback,dependencies){
  if(hookStates[hookIndex]){
    let [lastCallback,lastDependencies] = hookStates[hookIndex];
    let same = lastDependencies.every((item,index) => item === dependencies[index])
    if(same){
      hookIndex++;
      return lastCallback;
    }
    hookStates[hookIndex++] = [newMemo,dependencies]
    return callback
  }else{
    hookStates[hookIndex++] = [callback,dependencies];
    return callback
  }
}


function useEffect(callback,dependencies){
  if(hookStates[hookIndex]){
    let [lastDestory,lastDependencies] = hookStates[hookIndex];
    let same = false
    if(lastDependencies){
      same = lastDependencies.every((item,index) => item === dependencies[index])
    }
    if(same){
      hookIndex++;
    }else{
      lastDestory && lastDestory();
      let arr = [,dependencies]
      setTimeout(()=>{
        arr[0] = callback();
      })
      hookStates[hookIndex++] = arr;
    }
  }else{
    let arr = [,dependencies]
    setTimeout(()=>{
      arr[0] = callback();
    })
    hookStates[hookIndex++] = arr;
  }
}

//---------------------------- useState example ----------------------------
function StateApp(){
  let [num1,setNum1] = useState(0)
  let [num2,setNum2] = useState(10)
  
  console.log("num1",num1);
  console.log("num2",num2);
  console.log("------------------------------")

  return {
    //现在的实现只支持函数形式，因为在render之后，
    //state改变重新render app的没有改变，还是指向原来的对象
    //react内部会替换app实例,拿到最新的对象
    onClick1(){
      setNum1(num => num + 1);
    },
    onClick2(){
      setNum2(num => num + 1)
    } 
  }
}

// function render(){
//   hookIndex = 0
//   return StateApp();
// }

// const app = render();
// app.onClick1()
// app.onClick2()
// app.onClick1()

//------------------------------ useMemo -----------------------------
let memoIndex = 0;
let memoDatas = [];
function memo(fn){
  return function(props){
    if(memoDatas[memoIndex]){
      let [lastProps,lastRes] = memoDatas[memoIndex];
      for(let key in lastProps){
        if(lastProps[key] !== props[key]){
          let res = fn(props)
          memoDatas[memoIndex++] = [props,res];
          return res;
        }
      }
      memoIndex++
      return lastRes;
    }else{
      let res = fn(props)
      memoDatas[memoIndex++] = [props,res];
      return res;
    }
  }
}
function Child({data,changeParentAge}){
  let [name,setName] = useState("children")
  console.log("children active",name)
  console.log("-------------------------------------")
  return {
    changeChildName(){
      setName(name => name + 1)
    },
    changeParentAge(){
      changeParentAge()
    }
  }
}
Child = memo(Child);


function MemoApp(){
  let [age,setAge] = useState(0);
  let [name,setName] = useState("parent")

  let data = useMemo(()=>age,[age]);
  let changeParentAge = useCallback(()=>setAge(num => num + 1),[age]);

  console.log("parent active",name,age);
  console.log("++++++++++")
  let child = Child({data,changeParentAge})
  return {
    changeAge(){
      setAge(num => num + 1)
    },
    changeParentName(){
      setName(name => name + age)
    },
    child
  }
}

function render(){
  hookIndex = 0
  memoIndex = 0
  return MemoApp();
}
const app1 = render();
app1.changeParentName();
app1.child.changeChildName();
