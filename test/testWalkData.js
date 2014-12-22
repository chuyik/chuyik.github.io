// /usr/local/lib/node_modules/harp/node_modules/terraform/lib/helpers/raw.js
// var obj = {"_contents":["404.html","CNAME","README.html","about.html","archive.html","feed.xml","index.html","nav.html","sitemap.html"],"_data":{"feed":{"layout":false},"sitemap":{"layout":false}},"articles":{"_contents":["css-hack-collection.html","hack-collection.html","hello-brazil.html","hello-world.html","html-hack-collection.html","js-hack-collection.html"],"_data":{"hello-world":{"title":"Hello World","date":"2014-12-10"},"hello-brazil":{"title":"Hello Brazil","date":"2014-12-10"},"hack-collection":{"title":"Hack Collection","date":"2014-12-14","draft":true}},"hack-collection":{"_data":{"hack-collection":{"title":"Hack Collection","date":"2014-12-14","draft":true}},"p":{"_contents":["1.html"],"_data":{"1":{"title":"Page 1","date":"2014-12-14"}}}}},"assets":{"_contents":["bundle.js","main.css"],"images":{"_contents":["edc.jpg"]}}}
var obj = {
  "_contents": ["index.html", "404.html", "about.html", "feed.xml"],
  "_data": {
    "feed": {
      "layout": false
    }
  },
  "articles": {
    "_contents": ["hello-world.html", "hack-collection.html"],
    "_data": {
      "hello-world": {
        "title": "Hello World",
        "date": "2014-12-10"
      },
      "hack-collection": {
        "title": "Hack Collection",
        "date": "2014-12-14"
      }
    },
    "hack-collection": {
      "p": {
        "_contents": ["1.html"],
        "_data": {
          "1": {
            "title": "Page 1",
            "date": "2014-12-14"
          }
        }
      }
    }
  }
};

function walkData(tail, obj){
  var tail = tail.slice(0)  // clone array.
  var head = tail.length > 1 ? tail.shift() : tail[0];

  if(obj.hasOwnProperty(head)){
    if(tail.length === 1){
      if(obj.hasOwnProperty("_data")){
        return obj["_data"][head] || walkData(tail, obj[head])
      }
    }
    return walkData(tail, obj[head])
  }else if(obj.hasOwnProperty("_data")){
    return obj["_data"][head]
      ? obj["_data"][head]
      : null

  }else{
    return null
  }
}

console.log(walkData(["articles", "hack-collection"], obj));
console.log(walkData(["articles", "hello-world"], obj));
console.log(walkData(["articles", "hack-collection", "p", "1"], obj));
