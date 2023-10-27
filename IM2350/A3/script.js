 const videos = document.querySelectorAll(".video")

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        entry.target.classList.toggle("show", entry.isIntersecting)
        console.log(`Observed video: ${entry.target.src}, isIntersecting: ${entry.isIntersecting}`);

    })
}, 
{ //playing around with the threshold here just to get an idea of when i want
  // my animation bringing the videos on and off the screen to play.
threshold: .3,

//rootMargin: "+100px",
})
//alternately, rootmargin seems to be a good way to have intersection observer work while
// while effectively loading images in in advance, so that by the time you're actually scrolling to them they've fully loaded
//However, the threshold .1 makes the animation look nice and noticable no matter how fast the user is scrolling. 

const lastVideoObserver = new IntersectionObserver(entries => {
    const lastVideo = entries[0]
    if (!lastVideo.isIntersecting) return
    loadNewVideos()
    lastVideoObserver.unobserve(lastVideo.target)
    lastVideoObserver.observe(document.querySelector(".video:last-child"))
}, {
    rootMargin: "100px"
})

lastVideoObserver.observe(document.querySelector(".video:last-child"))

videos.forEach(video => {
    observer.observe(video)
})


const videoSources = [
    "video/River darknes loop final.mov",
    "video/trainstationedit.mov",
    "video/placeholder2.mp4",
    "video/placeholder1.mov"
];

let currentSourceIndex = 0;


const videoContainer = document.querySelector("#videocontainer")
function loadNewVideos() {
for (let i = 0; i < 10; i++) {
    const video = document.createElement("video")
    video.src = videoSources[currentSourceIndex];
    video.classList.add("video")
    observer.observe(video)
    videoContainer.append(video)
    currentSourceIndex = (currentSourceIndex + 1) % videoSources.length;
    console.log(`Observed new video: ${video.src}`);

    }
}
//Finally i got this interaction observer infinite scroll to work


const videoElements = document.querySelectorAll(".video");

videoElements.forEach(video => {
    video.addEventListener("click", () => {
        video.controls = !video.controls;
        if (video.controls) {
            video.style.cursor = "default";
        } else {
            video.style.cursor = "pointer";
        }
    });
});



