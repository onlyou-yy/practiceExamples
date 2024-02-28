self.onmessage = function (event) {
  console.log("worker", event);

  fetch("https://picsum.photos/200/300")
    .then((res) => res.blob())
    .then((res) => {
      console.log("worker fetch", res);
    });
};

self.postMessage("worker message");
