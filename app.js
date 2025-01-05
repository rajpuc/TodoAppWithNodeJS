const http = require("http");
const fs = require("fs");
const path = require("path");
let todos = [
    {id:1, text: "Learn Node.js", completed:false},
    {id:2, text: "Build a Project", completed:false},
    {id:3, text: "Hello Lucifer", completed:false}
];

const server = http.createServer((req,res)=>{
    if(req.url === '/' && req.method === 'GET'){
        serverStaticFile(res,"./public/index.html","text/html");
    }else if(req.url === '/api/todos' && req.method === 'GET'){
        res.writeHead(200,{"content-type":"application/json"});
        res.end(JSON.stringify(todos));
    }else if(req.url === '/api/todos' && req.method === 'POST'){
        handlePostRequest(req,res);
    }else{
        serverStaticFile(res,"./public/index.html","text/html");
    }
});

function serverStaticFile(res,filePath, contentType){
    const fullPath = path.join(__dirname,filePath);
    fs.readFile(fullPath,(err,data)=>{
        if(err){
            res.writeHead(500);
            res.end("Error Loading File");
        }else{
            res.writeHead(200,{"content-type": contentType});
            res.end(data);
        }
    });
}
function handlePostRequest(req,res){
    let body = "";
    req.on("data",(chunk) =>{
        body +=chunk.toString();
    });
    req.on("end",()=>{
        const newTodo = JSON.parse(body);
        newTodo.id = todos.length +1;
        todos.push(newTodo);

        res.writeHead(201, {"Content-Type" : "application/json"});
        res.end(JSON.stringify(newTodo));
    });
}

server.listen(3000,()=>{
    console.log("Server running at http://localhost:3000")
})