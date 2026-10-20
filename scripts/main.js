import { bubble_sort } from './sort_algorithms/bubble_sort.js';
import { cocktail_sort } from './sort_algorithms/cocktail_sort.js';
import { counting_sort } from './sort_algorithms/counting_sort.js';
import { merge_sort } from './sort_algorithms/merge_sort.js';
import { quick_sort } from './sort_algorithms/quick_sort.js';
import { radix_sort } from './sort_algorithms/radix_sort.js';
import { createArray } from './data_generator.js';

let sleepTime = 0;
let data = new Dataset("all");;
let default_arr = [];
const size_select = document.querySelector("#array-size");
const pattern_select = document.querySelector("#array-pattern");
let arraySize = Number(size_select.value);
let arrayPattern = pattern_select.value;
const canvas = document.querySelector("canvas");

resetArr();
data.arr = default_arr;
data.draw();

function resetArr() {
    default_arr = createArray(arraySize, arrayPattern);
}

const reset_btn = document.querySelector(".reset-btn");
const single_time = document.querySelector("#single-time");
const pause_btn = document.querySelector(".pause-btn");
const step_btn = document.querySelector(".step-btn");

function updatePlaybackControls() {
    const active = data.playbackStarted && !data.cancelled && !data.finished;
    pause_btn.disabled = !active;
    step_btn.disabled = !active;
    pause_btn.textContent = active && data.paused ? "Play" : "Pause";
}

function preparePlayback() {
    data.playbackStarted = true;
    data.onComplete = updatePlaybackControls;
    updatePlaybackControls();
}

pause_btn.addEventListener("click", () => {
    if (data.paused) data.resume();
    else data.pause();
    updatePlaybackControls();
});

step_btn.addEventListener("click", () => {
    data.step();
    updatePlaybackControls();
});

document.querySelector(".btns-container").addEventListener("click", e => {
    if (!e.target.closest(".algorithm-btn")) return;
    data.cancel();
    single_time.textContent = "0 s";
    updatePlaybackControls();
}, true);
function resetVisualization() {
    data.cancel();
    resetArr();
    data = new Dataset("all");
    data.arr = [...default_arr];
    canvas.id = "all-canvas";
    data.draw();
    single_time.textContent = "0 s";
    updatePlaybackControls();
}

reset_btn.addEventListener("click", resetVisualization);

size_select.addEventListener("change", event => {
    arraySize = Number(event.currentTarget.value);
    resetVisualization();
});

pattern_select.addEventListener("change", event => {
    arrayPattern = event.currentTarget.value;
    resetVisualization();
});

window.addEventListener("pageshow", () => {
    const visibleSize = Number(size_select.value);
    const visiblePattern = pattern_select.value;
    if (visibleSize === arraySize && visiblePattern === arrayPattern) return;
    arraySize = visibleSize;
    arrayPattern = visiblePattern;
    resetVisualization();
});

const bubble_sort_btn = document.querySelector(".bubble-sort-btn");
bubble_sort_btn.addEventListener("click", () => {
    data = new Dataset("bubble");
    data.arr = [...default_arr];
    canvas.id = "bubble-canvas";
    preparePlayback();
    bubble_sort(data, sleepTime);
});

const merge_sort_btn = document.querySelector(".merge-sort-btn");
merge_sort_btn.addEventListener("click", () => {
    data = new Dataset("merge");
    data.arr = [...default_arr];
    canvas.id = "merge-canvas";
    preparePlayback();
    merge_sort(data, sleepTime);
});

const quick_sort_btn = document.querySelector(".quick-sort-btn");
quick_sort_btn.addEventListener("click", () => {
    data = new Dataset("quick");
    data.arr = [...default_arr];
    canvas.id = "quick-canvas";
    preparePlayback();
    quick_sort(data, 0, default_arr.length - 1, sleepTime);
});

const counting_sort_btn = document.querySelector(".counting-sort-btn");
counting_sort_btn.addEventListener("click", () => {
    data = new Dataset("counting");
    data.arr = [...default_arr];
    canvas.id = "counting-canvas";
    preparePlayback();
    counting_sort(data, sleepTime);
});

const radix_sort_btn = document.querySelector(".radix-sort-btn");
radix_sort_btn.addEventListener("click", () => {
    data = new Dataset("radix");
    data.arr = [...default_arr];
    canvas.id = "radix-canvas";
    preparePlayback();
    radix_sort(data, sleepTime);
});

const cocktail_sort_btn = document.querySelector(".cocktail-sort-btn");
cocktail_sort_btn.addEventListener("click", () => {
    data = new Dataset("cocktail");
    data.arr = [...default_arr];
    canvas.id = "cocktail-canvas";
    preparePlayback();
    cocktail_sort(data, sleepTime);
});


const sleep_time_text = document.querySelector(".sleep-time-text");
sleep_time_text.value = sleepTime;
sleep_time_text.addEventListener("change", e => {
    sleepTime = e.currentTarget.value;
});
