module.exports = function (client){
    client.connect();
    client.on("connect", () => {
      console.log("Redis Connected");
    });
    client.on("error", (err) => console.log("Redis Client Error", err));
}