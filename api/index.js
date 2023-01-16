const express=require('express');
const app=express();
const ytdl=require('ytdl-core');
const cors=require('cors');
const http=require('http').createServer(app);
const io=require("socket.io")(http,{
    cors:{
        origin:"http://localhost:3000"
    }
});
const port=4000;

var clientGlob=null;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.post('/',(req,res)=>{
    console.log("heeer");
    getAudio(req.body.url,res);
})

io.on("connection",(client)=>{
    clientGlob=client;
    console.log("User connected");
});

http.listen(port,()=>{
    console.log(`listening at port: ${port}`);
});


getAudio=(videoURL,res)=>{
    console.log(videoURL)
    var stream=ytdl(videoURL,{
        quality:"highestaudio",
        filter:"audioonly"
    })
    .on("progress",(chunkSize,downloadedChunk,totalChunk)=>{
        clientGlob.emit("progressEventSocket",[
            (downloadedChunk*100)/totalChunk
        ]);

        clientGlob.emit("downloadCompletedServer",[downloadedChunk])

        if(downloadedChunk==totalChunk){
            console.log("Downloaded");
        }
    })
    .pipe(res);

    ytdl.getInfo(videoURL).then((info)=>{
        console.log("title:",info.videoDetails.title);
        // console.log("rating:",info.player_response.videoDetails.averageRating);
        console.log("uploaded by:",info.videoDetails.author.name);

        clientGlob.emit("videoDetails",[
            info.videoDetails.title,
            info.videoDetails.author.name
        ]);
    })
}

