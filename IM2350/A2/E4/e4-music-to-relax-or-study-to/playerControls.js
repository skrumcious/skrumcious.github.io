/* DEFINITIONS & SETUP */

// first let's retrieve references to all the elements we'll need to use
// this is the audio itself
let audioElement = document.getElementById("audioElement");
// the buttons for the controls
let playButton = document.getElementById("playButton");
let stopButton = document.getElementById("stopButton");
// the progress element
let progressBar = document.getElementById("progressBar");
// the hero image
let heroImage = document.getElementById("heroImage");
let muteButton = document.getElementById("muteButton");
let litButton = document.getElementById("litButton");
let bgLayer = document.getElementById("bgLayer");
let normSpeedText = document.getElementById("1.0x");
let speedText = document.getElementById("1.25x");
let fastSpeedText = document.getElementById("1.5x");

// next we remove the controls attribute - we do this with JS rather than just not including it in the HTML tag as a fallback
// this way if the JS doesn't load for whatever reason the player will have the default built in controls
audioElement.removeAttribute("controls");
// then if the default controls are removed we can show our custom controls - we want to do this via JS so that if the JS doesn't
// load then they won't show
document.getElementById("controlsWrapper").style.display = "flex";

// then we listen for the loadedmetadata event to fire which means we'll be able to access exactly how long the piece of media is
// i'm using an arrow function here that updates the progress element's max attribute with the duration of the media
// this way when it comes to setting the progress bars value the number matches a percentage of the total duration
audioElement.addEventListener('loadedmetadata', () => {
  progressBar.setAttribute('max', audioElement.duration);
});

// some mobile devices won't fire a loadedmetadata event so we need a fallback to make sure the attribute is set in these cases - we 
// can do this by also running a check whenever playback starts by using the playing event
audioElement.addEventListener("playing", () => {
  // we can then double check if the attribute has already been set - if not then set it here - ! inside of an if statement flips the 
  // truth of what we're checking for - so (progressBar.getAttribute('max')) would check if there's a value and 
  // (!progressBar.getAttribute('max')) checks if there is no value - ie false
  if (!progressBar.getAttribute('max')){
    progressBar.setAttribute('max', audioElement.duration);
  }
});

/* LOADING */

// here we're adding some feedback to indicate when the audio is loading - this is pretty similar to our last experiement in that we're 
// applying an animation via a class. the real difference here is when that class gets added - by listening for the waiting event which 
// fires when the media is waiting to load we can add the animation to the timeline via the .classList.add() method. when we want to 
// stop the animation we listen for the canplay event which fires when the media player has buffered enough data to be able to playback the 
// media then we use the .classList.remove() method - if we instead wanted to wait until it has actually loaded the whole file we could 
// use the canplaythrough event
audioElement.addEventListener("waiting", () => {
  progressBar.classList.add("timeline-loading");
});
audioElement.addEventListener("canplay", () => {
  progressBar.classList.remove("timeline-loading");
});

/* MEDIA FINSIHED */

// when the media finishes we want to make sure that play icon switches back over from pause to indicate that the user can restart playback
audioElement.addEventListener("ended", () => {
  playButton.style.backgroundImage = "url('./icons/play.svg')";
});

/* PLAY/PAUSE */
litButton.style.display = "none"; // initially hiding various items that will appear and disappear.


// we can use the .play() and .pause() methods on our media element to play and pause playback - because I want this to be triggered by 
// two different events (see below) i'm going to write it as a seperate function 
// by combining play and pause into the same function i'm able to make sure it does what i want - if the media is already playing i only 
// ever want use .pause() (as pausing an already paused audio doesn't really make sense) 
// the same goes if the media is paused or stopped i only want use .play()
function playPause()
{
  if (audioElement.paused || audioElement.ended) {
    audioElement.play();
    playButton.style.backgroundImage = "url('./icons/pause.svg')";
    litButton.style.display = "block";
    litButton.style.filter = "saturate(100%)";
    document.querySelectorAll('.textOverlays h span').forEach(function (span) {
      span.classList.add('animated');
    }); //pressing play adds the animation to each letter of each word, linking the animation to the text.
    if (audioElement.playbackRate === 1.0) {
      normSpeedText.style.display = "block";
      speedText.style.display = "none";
      fastSpeedText.style.display = "none";
    } else if (audioElement.playbackRate === 1.25) {
      normSpeedText.style.display = "none";
      speedText.style.display = "block";
      fastSpeedText.style.display = "none";
    } else if (audioElement.playbackRate === 1.5) {
      normSpeedText.style.display = "none";
      speedText.style.display = "none";
      fastSpeedText.style.display = "block";
    }

 // Check and set saturation of heroImage
  if (heroImage !== null) {
  console.log("Current Filter:", heroImage.style.filter);

  if (!heroImage.style.filter || heroImage.style.filter === 'none' || heroImage.style.filter === 'saturate(0%)') {
    heroImage.style.filter = 'saturate(100%)';
    console.log("Filter changed to 100%");
  }
 
}
  // using strict equality opperator the following codeblock setting filter to 100% will only occur when style.filter is none. 
  // ChatGPT helped me differentiate =, ==, and ===. It's helped me understand/remind me that = is an asssignment operation rather than a comparison, makes a lot of sense now.
  }else {
    audioElement.pause();
    playButton.style.backgroundImage = "url('./icons/play.svg')";
    litButton.style.filter = "saturate(0%)";
    fastSpeedText.style.display = "none";
    speedText.style.display = "none";
    normSpeedText.style.display = "none";


   document.querySelectorAll('.textOverlays h span').forEach(function (span) {
      span.classList.remove('animated'); //removes the text animation when the audio is paused by looking for .textoverlays h span and applies classlist remove to each letter.
    });

    }
}

/* MUTE/UNMUTE */ 
function muteUnmute() {
  console.log("mute/unmute is working");

  if (audioElement.muted) {
    audioElement.muted = false;
    muteButton.style.backgroundImage = "url('./icons/mute.svg')";
  } else {
    audioElement.muted = true;
    muteButton.style.backgroundImage = "url('./icons/unmute.svg')";
  }
}

/* LIT/UNLIT */

// Now thinking I will change the music to Panthalassa by Nihilore, licensed under CC BY-NC 4.0. Playing this song 
// at 1.5 may be a little bit too fast for some. I want to cater to a wider range of listeners, and a wide range of moods; 
// so i'm going to include the option to play at 1.25 aswell as 1.5// I don't want a drop down menu, so the button will remain 
// the same, it will now include x1.25 in the cycle of clicks. The effect of this is that the user is forced to listen to 
// all the different playback speeds, opening their mind. Obvious ISSUE: User will likely presume that clicking a button a second time 
// will turn it back to original speed. SOLUTION: Feedback, there will be visible feedback else where on the screen; e.g. 3 icons somewhere
// 1.0 1.25 and 1.50, only the setting in use will have vibrant font colour while the other two remain dulled. could also play around with font size
// to increase in tandem with the colour change.

function speedUpAudio () {
if (!audioElement.paused) {
  if (audioElement.playbackRate === 1.0) {
    audioElement.playbackRate = 1.25; 
    bgLayer.style.backgroundImage = "url('images/imgplacehold.png')";
    heroImage.src = "images/imgplacehold.png";
    speedText.style.display = "block";
    normSpeedText.style.display = "none";
    fastSpeedText.style.display = "none";
    speedText.style.filter = "saturate(100%)";


  } else if (audioElement.playbackRate === 1.25) {
    audioElement.playbackRate = 1.5;
    heroImage.style.filter = "saturate(200%)";
    bgLayer.style.filter = "saturate(200%)";
    fastSpeedText.style.display = "block";
    normSpeedText.style.display = "none";
    speedText.style.display = "none";
    fastSpeedText.style.filter = "saturate(400%)";
  } else {
    audioElement.playbackRate = 1.0;
    bgLayer.style.backgroundImage = "url('images/dullimg.png')";
    heroImage.src = "images/dullimg.png";
    heroImage.style.filter = "saturate(100%)";
    bgLayer.style.filter = "saturate(100%)";
    normSpeedText.style.display = "block";
    fastSpeedText.style.display = "none";
    speedText.style.display = "none"

  }
  }
}
// "if"'s condition is playback rate 1.0. As thats the default, the condition is met at the time the first click occurs, allowing the "if" operation to be executed.
// now the condition of "else if" is met so it can excecute audioElement.playbackRate = 1.5 upon the second click, and in turn the else block is skipped. 
// When neither of the two conditions are met (when it's 1.5), "else" can be executed, being the third click resetting the playback rate to 1.0.

//SOLUTION FOUND(background layer): I initially had my background image as a property of body but i finally realised that filter affects more than just background-image,
// which now seems obvious because filter is literally its own property. So i tried using body::before and put all the background image related properties in there but then 
// realised that you can't manipulate pseudo elements in javascript the way I want to, if at all. Thus, I created the div bgLayer, and simply changed the id in CSS from body::before to bgLayer.
//Now, finally, the above function affects the hero image and the bg image at the same time. 

// Next idea is to make my lit button only appear once the music has started playing, otherwise users may try to click it as soon as they open the page.

  litButton.addEventListener('click', speedUpAudio);

  muteButton.addEventListener('click', muteUnmute);


// now we have our function we need to attach it to two seperate events, the first is probably obvious - clicking on the play button
playButton.addEventListener('click', playPause);

// the second event we want is clicking on the hero image, a feature popularised by youtube that is now ubiquitous in online media players
heroImage.addEventListener('click', playPause);

// this feature is unfinished in my code - while it works it has no signifiers to let users know they can do this by clicking the audio
// there is already an element appropriately placed as a signifier, the <img> with the id of audioPlayerOverlay however its CSS is currently
// set to display: none - try to complete this feature by doing the following 
// first you'll need to remove display: none from its css ruleset
// then you'll need to add two new statements to the playPause() function above - each will need to first find the correct element using the 
// document.getElementById() and then update that element's .style.display property to equal either "block" or "none" depending on the context
// if done correctly the play overlay will only appear over the audio if paused, otherwise it should disappear when playing


/* TIMELINE */

// there's two different things we want to do with our timeline - update the progress bar to display how much has already played and let the user 
// click the progress bar to scrub the audio to a specific place in the audio
// to update the progress bar we need to listen for the timeupdate event which is fired everytime the current audio time is updated - when the audio 
// is playing this repeatedly fires at a constant rate
audioElement.addEventListener('timeupdate', () => {
  // this statement is simple - we update the progress bar's value attribute with the currentTime property of the audio, because timeupdate runs everytime
  // currentTime is changed it'll update both as the audio plays and if we were to skip or stop the audio
  progressBar.value = audioElement.currentTime;
});

// the simplest version of scrubbing would be to update the audio's currentTime when the user clicks the timeline - however due to the interaction pattern 
// established by youtube we should also account for a slightly different expression of user agency. the code below will work with a simple click on the 
// timeline but will also allow for a user to drag their mouse on the timeline to continuously update currentTime and only end scrubbing when they release the 
// mouse button. implementing this will take some more complex use of event listeners but i'll do my best to explain the design and technical implementation

// first thing we want to do is write a function that will take the current position of the the mouse in relation to the timeline and use it to change the 
// currentTime property of the audio element. each time this runs we'll need to know the position of the mouse so which we'll do using the event passed to it 
// by the eventlistener - to access this we need to set it as a parameter, i've used the name e but it can be called whatever you like
function scrubToTime(e){
  // this statement has a lot going on so let's step through each part:
  // the first thing we want to work out is the distance between the left side of the progress bar and the mouses current position - if we were just building 
  // an interaction to work when the mouse is over the bar we could take this from the event, however as we want this to also work when we've held the mouse 
  // down and moved it somewhere else on the page we need to work this out manually
  // e.clientX is the cursors current distance from the left edge of the page
  // we then want to minus (progressBar.getBoundingClientRect().left + window.scrollX) from this distance to account for any gap between the left edge of the 
  // page and the start of the progress bar
  // audioElement.currentTime is the current position in the media file - we are setting it here to change the playback time
  // we then need to find a normalised 0-1 value based on how far along the bar the cursor is - the idea is that if i click the left most side it should return 0
  // and if i click the right most side it should return 1 - we get this value by dividing x by the total width of the progressBar
  // the value is then fed into our clampZeroOne() function - this is accounting for if our mouse is further left or further right than the ends of the progress bar
  // it works by essentially making the value always equal 1 if it is over 1 or always making it 0 if under 0 - this is commonly called a clamp, we're only allowing
  // a value to be in a certain range
  // finally we're using this clamped value to multiply with total duration of our audio thus working out where we should scrub to
  let x = e.clientX - (progressBar.getBoundingClientRect().left + window.scrollX);
  audioElement.currentTime = clampZeroOne(x / progressBar.offsetWidth) * audioElement.duration;
}

// the click event fires only if the user presses the mouse down and then releases it on the same element. we can allow for a wider range of interactions by
// further breaking this down this into its discrete parts and listening to both the mousedown and mouseup events seperately

progressBar.addEventListener('mousedown', scrubToTime);
progressBar.addEventListener('mousedown', (e) => {
  // the behaviour here is to listen to the mousemove event (fired when the user moves their mouse) when the click is held down but then to stop listening to that 
  // event when the mouse click is released
  window.addEventListener('mousemove', scrubToTime);
  window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', scrubToTime);
  });
});






/* HELPER FUNCTIONS */

function clampZeroOne(input){
  return Math.min(Math.max(input, 0), 1);
}

function logEvent(e){
  console.log(e);
}

/* Sources:
CodingLabYT(2023) Neon Glowing Button Hover Animation in HTML CSS. Available at: https://www.youtube.com/shorts/FYIX7Kc5JRo (Accessed 22.09.2023).
Online Tutorials(2018) Glowing Text Animation Effects 2 | Html CSS Animation. Available at: https://www.youtube.com/watch?v=1B3FgFXn274 (Accessed 20.09.2023).
Name of person posting video (Year video posted) Title of film or programme. Available at: URL (Accessed Day Month Year).
Nihilore. (2018) 'Panthalassa', Last Refuge. Available at: www.nihilore.com (Accessed 10.09.2023).
*/
