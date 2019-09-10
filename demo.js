const obj = {
  mode: "development",
  devtool: "#cheap-module-source-map",
  entry: { app: "E:\\othercode\\myblog\\src\\client\\index.js" },
  resolve: { extensions: [".js", ".jsx", ".json"] },
  output: {
    filename: "js/client.js",
    path: "E:\\othercode\\myblog\\dist",
    publicPath: "/public/",
    library: "commonjs"
  },
  module: { rules: [[Object], [Object], [Object]] }
};



console.log(Object.assign(obj,{output:{...obj.output,target:"node"}}))