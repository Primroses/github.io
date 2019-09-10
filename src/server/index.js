const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const ReactDOMServer = require("react-dom/server");

const port = process.env.PORT || 1221;

const isPro = process.env.NODE_ENV == "production";

let readyPromise, HTMLTemplate, ServerApp;

if (isPro) {
  HTMLTemplate = fs.readFileSync(
    path.join(__dirname, "../../dist/index.html"),
    "utf8"
  );
  ServerApp = require(path.join(__dirname, "../../dist/js/serverApp"));
} else {
  readyPromise = require("./setup-dev-server")(app, (entry, htmlTemplate) => {
    ServerApp = entry;
    HTMLTemplate = htmlTemplate;
  });
}

const render = (req, res) => {
  let html = ReactDOMServer.renderToString(ServerApp.default);
  let htmlStr = HTMLTemplate.replace(
    "<!-- app -->",
    `<div id='app'>${html}</div>`
  );
  // 将渲染后的html字符串发送给客户端
  res.send(htmlStr);
};

app.get(
  "*",
  isPro
    ? render
    : (req, res) => {
        // 等待客户端和服务端打包完成后进行render
        readyPromise.then(() => render(req, res));
      }
);

// 引用静态资源
app.use("/public", express.static(path.join(__dirname, "../../dist/")));

app.listen(port, () => {
  console.log("开始了喔兄嘚");
});
