class TaskPool {
  constructor(size) {
    this.size = size;
    this.queue = [];
  }
  addTask(fn, ...args) {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, fn, args });
      if (this.size) {
        this.pullTask();
      }
    });
  }
  runTask(fn, args) {
    const result = Promise.resolve(fn(...args));

    const completeHandle = () => {
      this.size++;
      this.pullTask();
    };

    result.then(completeHandle).catch(completeHandle);

    return result;
  }
  pullTask() {
    if (this.queue.length === 0) return;
    if (this.size === 0) return;

    this.size--;
    const { resolve, fn, args } = this.queue.shift();
    resolve(this.runTask(fn, args));
  }
}

const task = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(time);
      console.log(time);
    }, time);
  });
};

async function startConcurrent() {
  console.time("time");
  const pool = new TaskPool(2);
  await Promise.all(
    [3000, 1000, 4000, 2000, 5000].map((time) => {
      return pool.addTask(task, time);
    })
  );
  console.timeEnd("time");
}

startConcurrent();
