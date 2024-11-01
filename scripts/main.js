import { bubble_sort } from './sort_algorithms/bubble_sort.js';
import { cocktail_sort } from './sort_algorithms/cocktail_sort.js';
import { counting_sort } from './sort_algorithms/counting_sort.js';
import { merge_sort } from './sort_algorithms/merge_sort.js';
import { quick_sort } from './sort_algorithms/quick_sort.js';
import { radix_sort } from './sort_algorithms/radix_sort.js';

let sleepTime = 5;
let data = new Dataset("all");;
let default_arr = [];
const canvas = document.querySelector("canvas");

resetArr();
data.arr = default_arr;
data.draw();

function resetArr() {
    default_arr = new Array(100).fill(0);
    for(let i = 1; i <= 100; i++) {
        do {
            let index = Math.floor(Math.random() * 100);
            if(!default_arr[index]) {
                default_arr[index] = i;
                break;
            }
        } while(true);
    }
}

const reset_btn = document.querySelector(".reset-btn");
reset_btn.addEventListener("click", () => {
    resetArr();
    data.arr = default_arr;
    data.draw();
});

const bubble_sort_btn = document.querySelector(".bubble-sort-btn");
bubble_sort_btn.addEventListener("click", () => {
    data = new Dataset("bubble");
    data.arr = default_arr;
    canvas.id = "bubble-canvas";
    bubble_sort(data, sleepTime);
});

const merge_sort_btn = document.querySelector(".merge-sort-btn");
merge_sort_btn.addEventListener("click", () => {
    data = new Dataset("merge");
    data.arr = default_arr;
    canvas.id = "merge-canvas";
    merge_sort(data, sleepTime);
});

const quick_sort_btn = document.querySelector(".quick-sort-btn");
quick_sort_btn.addEventListener("click", () => {
    data = new Dataset("quick");
    data.arr = default_arr;
    canvas.id = "quick-canvas";
    quick_sort(data, 0, default_arr.length - 1, sleepTime);
});

const counting_sort_btn = document.querySelector(".counting-sort-btn");
counting_sort_btn.addEventListener("click", () => {
    data = new Dataset("counting");
    data.arr = default_arr;
    canvas.id = "counting-canvas";
    counting_sort(data, sleepTime);
});

const radix_sort_btn = document.querySelector(".radix-sort-btn");
radix_sort_btn.addEventListener("click", () => {
    data = new Dataset("radix");
    data.arr = default_arr;
    canvas.id = "radix-canvas";
    radix_sort(data, sleepTime);
});

const cocktail_sort_btn = document.querySelector(".cocktail-sort-btn");
cocktail_sort_btn.addEventListener("click", () => {
    data = new Dataset("cocktail");
    data.arr = default_arr;
    canvas.id = "cocktail-canvas";
    cocktail_sort(data, sleepTime);
});


const sleep_time_text = document.querySelector(".sleep-time-text");
sleep_time_text.value = sleepTime;
sleep_time_text.addEventListener("change", e => {
    sleepTime = e.currentTarget.value;
});