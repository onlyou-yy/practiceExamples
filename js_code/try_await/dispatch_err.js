function wrapperDev(func) {
  function handleWindowError(error) {
    // 收集错误交给Error Boundary处理
  }
  
  function callCallback() {
    fakeNode.removeEventListener(evtType, callCallback, false); 
    func();
    console.log("222")
  }
  
  const event = document.createEvent('Event');
  const fakeNode = document.createElement('fake');
  const evtType = 'fake-event';

  window.addEventListener('error', handleWindowError);
  fakeNode.addEventListener(evtType, callCallback, false);

  event.initEvent(evtType, false, false);
  

  fakeNode.dispatchEvent(event);
  
  window.removeEventListener('error', handleWindowError);
}

wrapperDev(() => {throw Error(123)})
console.log("123")