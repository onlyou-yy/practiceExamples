class EventCenter{
  constructor(){
    this.msgCenter = {}
  }
  addEventListener(type,handle){
    if(!this.msgCenter[type]) this.msgCenter[type] = [];
    if(this.msgCenter[type].includes(handle)) return;
    this.msgCenter[type].push(handle);
  }
  dispatchEvent(type,...args){
    if(!this.msgCenter[type]){
      return new Error("没有这个事件")
    }
    this.msgCenter[type].forEach(handle => {
      handle.apply(null,args);
    })
  }
  removeEvent(type,handle){
    if(!this.msgCenter[type]){
      return new Error("没有这个事件")
    }
    if(!handle){
      delete this.msgCenter[type];
      return;
    }
    let handles = this.msgCenter[type];
    let index = handles.indexOf(handle);
    if(index >= 0) handles.splice(index,1);
    if(handles.length == 0) delete this.msgCenter[type];
  }
}

const sub = new EventCenter();
sub.addEventListener('show',(a)=>console.log('hi' + a))
sub.addEventListener('show',(a)=>console.log('nihao' + a))
const hide = ()=>console.log('hide')
sub.addEventListener('hide',hide)
sub.addEventListener('hide',hide)
const say = ()=>console.log('say')
sub.addEventListener('say',()=>console.log('say'))
sub.addEventListener('say',say)
sub.dispatchEvent('show',1)
sub.dispatchEvent('hide',2)
sub.removeEvent('show')
sub.removeEvent('hide')
sub.removeEvent('say',say)
console.log(sub.msgCenter);