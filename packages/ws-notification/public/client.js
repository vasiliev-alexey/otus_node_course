const myWorker = new Worker("worker.js");

myWorker.onmessage = function (e) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Проверка разрешения на отправку уведомлений
  else if (Notification.permission === "granted") {
    // Если разрешено, то создаём уведомление
    new Notification("Вам пришло сообщение с сервера", {
      body: e.data,
    });
  }

  // В противном случае, запрашиваем разрешение
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      // Если пользователь разрешил, то создаём уведомление
      if (permission === "granted") {
        new Notification("Вам пришло сообщение с сервера", {
          body: e.data,
        });
      }
    });
  }
};

const btnSubscribe = document.querySelector("#subscribe_btn");
const btnUnSubscribe = document.querySelector("#unsubscribe_btn");

btnSubscribe.addEventListener("click", () => {
  myWorker.postMessage("subscribe");
});

btnUnSubscribe.addEventListener("click", () => {
  myWorker.postMessage("unsubscribe");
});
