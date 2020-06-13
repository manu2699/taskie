let obj = new Date();

let date = ("0" + obj.getDate()).slice(-2);
let month = ("0" + (obj.getMonth() + 1)).slice(-2);
let year = obj.getFullYear();

let hours = obj.getHours();
let minutes = obj.getMinutes();
let seconds = obj.getSeconds();

let DateString = `${year}-${month}-${date} ${hours}:${minutes}`
module.exports = DateString;