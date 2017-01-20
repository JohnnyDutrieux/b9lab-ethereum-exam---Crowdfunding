module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  rpc: {
    host: "localhost",
    port: 8545
  },
  networks: {
  "development": {
    network_id: "default",
    before_timeout: 200000,          //  <=== NEW
    test_timeout: 300000             //  <=== NEW
  }
}
};
