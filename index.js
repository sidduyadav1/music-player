//GLOBAL VARIABLES
let currentsong=new Audio();
let playid=document.querySelector("#playid");
let songs;
let currentFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder){
    currentFolder=folder;
    let data= await fetch(`http://127.0.0.1:5500/${currentFolder}/`);
    data=await data.text();
    let div=document.createElement("div");
    div.innerHTML=data;
    let links=div.getElementsByTagName("a");
    songs=[];
    for(let index=0;index<links.length;index++){
        let ele=links[index];
        if(ele.href.endsWith(".mp3")){
            songs.push(ele.href.split(`/${currentFolder}/`)[1]);
        }
    }
    

    let songul=document.querySelector(".songslist").getElementsByTagName("ul")[0];
    songul.innerHTML=""
for(const song of songs){
    songul.innerHTML=songul.innerHTML+`<li>
                  <img src="img/audio-tune-icon.svg" alt="" class="img" data-file="${song}">
                <span class="text">${song.replaceAll("%20"," ")}</span> 
                </li>`;
}

Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(element => {
    
    element.addEventListener("click",()=>{
        const span = element.querySelector(".text");
        // console.log(document.querySelector(".text").innerHTML);
        play(span.innerHTML);

    })
});

}

const play=(track,pause=false)=>{
    currentsong.src=`/${currentFolder}/`+track;

    if(!pause){
        currentsong.play();
         playid.src="img/play.svg"
    }


    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}

async function createAlbums() {
   
    let data=await fetch("http://127.0.0.1:5500/songs/");
    data= await data.text()
    div=document.createElement("div");
    div.innerHTML=data;
    let anchors=div.getElementsByTagName("a");


    let array= Array.from(anchors);
    for(let index=0;index<array.length;index++){

        let e= array[index];
        let cardContainer=document.querySelector(".cardContainer");
        let folder;
        if(e.href.includes("/songs/")){
            // console.log(e.href)

            folder=e.href.split("/songs/")[1];
       
            let data= await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            data= await data.json()
           
            cardContainer.innerHTML=cardContainer.innerHTML+` <div class="card" data-folder="${folder}">
            <div class="Playlist-background">
              <div class="play-btn">
                <img src="img/play-button-green-icon copy.svg" alt="home" />
              </div>
              <img src="songs/${folder}/cover.jpg" alt="" />
              <h4>${data.title}</h4>
              <p>${data.description}</p>
            </div>
          </div> `

        }
    }

      Array.from(document.getElementsByClassName("card")).forEach(e=>{
            e.addEventListener("click",async item=>{
                // console.log(e);       
                await getsongs(`songs/${item.currentTarget.dataset.folder}`);
                play(songs[0],true);
            })
        })
    }



async function main(){
await getsongs("songs/englishsongs");
play(songs[0],true);

createAlbums();


playid.addEventListener("click",()=>{
    if(currentsong.paused){
        currentsong.play();
        playid.src="img/play.svg";
    }
    else{
        currentsong.pause();
        playid.src="img/pause.svg";
    }
})

currentsong.addEventListener("timeupdate",()=>{
    // console.log(currentsong.duration,currentsong.currentTime)
    document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%";
})

document.querySelector(".seekbar").addEventListener("click",(e)=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left=percent+"%";
    currentsong.currentTime=((currentsong.duration)*percent)/100
})

document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left=0;
})
document.querySelector(".cross-icon").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-100%";
})

document.querySelector("#previousid").addEventListener("click",()=>{
    console.log("clicked previous");
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    // let index=songs.indexOf(currentsong.src);
    console.log(songs[index-1])
    if(index-1>=0){
        play(songs[index-1]);
    }
})

document.querySelector("#nextid").addEventListener("click",()=>{
    console.log("clicked next");
    let index=songs.indexOf(currentsong.src.split("/").slice(-1) [0]);
    console.log(songs[index+1])
    if(index+1<songs.length){
        play(songs[index+1]);
    }
})

document.querySelector(".custom-slider").addEventListener("change",(e)=>{
    console.log(e.target.value/100)
    currentsong.volume=e.target.value/100;
})

document.querySelector(".volume-icon>img").addEventListener("click",(e)=>{
    // volumeImg.src="img/mute.svg"
    console.log(e.target.src)

    if(e.target.src.includes("img/volume_up_32dp_E8EAED_FILL0_wght400_GRAD0_opsz40.svg")){
        e.target.src=e.target.src.replace("img/volume_up_32dp_E8EAED_FILL0_wght400_GRAD0_opsz40.svg","img/mute.svg")
        currentsong.volume=0;
        document.querySelector(".custom-slider").value=0;
    }

   else if(e.target.src.includes("img/mute.svg")){
        e.target.src= e.target.src.replace("img/mute.svg","img/volume_up_32dp_E8EAED_FILL0_wght400_GRAD0_opsz40.svg")
        currentsong.volume=.5;
        document.querySelector(".custom-slider").value=50;
    }
    
 
})




}
main()