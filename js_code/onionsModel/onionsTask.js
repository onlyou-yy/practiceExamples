// 洋葱模型任务调度
class OnionsTask {
  constructor() {
    this.tasks = [];
    this.runningIndex = 0;
    this.isRunning = false;
  }
  addTask(task) {
    this.tasks.push(task);
  }
  async run() {
    if (this.isRunning) return;
    this.isRunning = true;
    await this.runTask();
  }
  async runTask() {
    if (this.runningIndex >= this.tasks.length) {
      this.runningIndex = 0;
      this.isRunning = false;
      this.tasks = [];
      return;
    }
    const preIndex = this.runningIndex;
    const task = this.tasks[this.runningIndex];
    await task(this.next.bind(this));
    const curIndex = this.runningIndex;
    if (preIndex === curIndex) {
      await this.next();
    }
  }
  async next() {
    this.runningIndex++;
    await this.runTask();
  }
}

const t = new OnionsTask();
t.addTask(async (next) => {
  console.log("1");
  await next();
  console.log("2");
});
t.addTask(() => {
  console.log("3");
});
t.addTask(async (next) => {
  console.log("4");
  setTimeout(async () => {
    await next();
  }, 3000);
  // await next();
  console.log("5");
});
t.addTask(() => {
  console.log("6");
});
t.run(); // 1,3,4,6,2,5
