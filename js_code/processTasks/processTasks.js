/**
 * 依次顺序执行一系列任务
 * 所有任务全部完成后可以得到每个任务的执行结果
 * 需要返回两个方法，start 用于启动任务，pause 用于暂停任务
 * 每个任务具有原子性，即不可中断，只能在两个任务之间中断
 */
function processTasks(...tasks) {
  let isRunning = false;
  let result = [];
  let index = 0;
  return {
    start() {
      return new Promise(async (resolve, reject) => {
        if (isRunning) return;
        isRunning = true;

        while (index < tasks.length) {
          result.push(await tasks());
          index++;
          if (!isRunning) return;
        }

        isRunning = false;

        resolve(result);
      });
    },
    pause() {
      isRunning = false;
    },
  };
}
