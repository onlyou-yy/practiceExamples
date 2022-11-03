function App(){
  let [num,setNum] = useState(0)
  let [age,setAge] = useState(0)
  userEffect(()=>{
    setTimeout(()=>{
      
    },1000)
  },[age]);

  let data = useMemo(()=>({age}),[age])
  let changeChild = useCallback(()=>{setAge(age + 1),[age]})

  return {
    
  }
}