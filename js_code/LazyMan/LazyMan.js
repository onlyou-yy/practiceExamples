(function(window){
  let taskList = [];
  
  function subscribe(...args){
    let type = args[0];
    let params = args.slice(1);
    
    if(type == 'sleepFirst'){
      taskList.unshift({type,params});
    }else{
      taskList.push({type,params});
    }
  }

  function publish(){
    if(taskList.length > 0){
      run(taskList.shift());
    }
  }

  function run(task){
    switch(task.type){
      case "lazyMan":lazyMan.apply(null,task.params);break;
      case "eat":eat.apply(null,task.params);break;
      case "sleep":sleep.apply(null,task.params);break;
      case "sleepFirst":sleepFirst.apply(null,task.params);break;
    }
  }

  function lazyMan(p){
    LazyManLog(`Hi! This is ${p}!`);
    publish();
  }
  function eat(p){
    LazyManLog(`Eat ${p}~`);
    publish();
  }
  function sleep(p){
    setTimeout(()=>{
      LazyManLog(`Wake up after ${p}`);
      publish();
    },p)
  }
  function sleepFirst(p){
    setTimeout(()=>{
      LazyManLog(`Wake up after ${p}`);
      publish();
    },p)
  }

  function LazyManLog(msg){
    console.log(msg);
  }
  window.LazyMan = function(something){
    subscribe("lazyMan",something);
    setTimeout(()=>{
      publish();
    },0)
    return new LazyMan();
  };
  function LazyMan(){}
  LazyMan.prototype.eat = function(something){
    subscribe("eat",something);
    return this;
  }
  LazyMan.prototype.sleep = function(time){
    subscribe("sleep",time);
    return this;
  }
  LazyMan.prototype.sleepFirst = function(time){
    subscribe("sleepFirst",time);
    return this;
  }
})(window)