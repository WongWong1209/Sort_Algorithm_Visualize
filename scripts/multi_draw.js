import { bubble_sort } from './sort_algorithms/bubble_sort.js';
import { cocktail_sort } from './sort_algorithms/cocktail_sort.js';
import { counting_sort } from './sort_algorithms/counting_sort.js';
import { merge_sort } from './sort_algorithms/merge_sort.js';
import { quick_sort } from './sort_algorithms/quick_sort.js';
import { radix_sort } from './sort_algorithms/radix_sort.js';

let sleepTime = 5;
let default_arr = [];
let data_arr = [];

resetArr();
draw();

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

    data_arr.forEach(e => {
        e.arr = [...default_arr];
    });
}

function draw() {
    data_arr.forEach(e => e.draw());
}

const sleep_time_text = document.querySelector(".sleep-time-text");
sleep_time_text.addEventListener("change", e => {
    sleepTime = e.currentTarget.value;
});

const start_btn = document.querySelector("#start-btn");
start_btn.addEventListener("click", () => {
    data_arr.forEach(d => {
        switch(d.type) {
            case "bubble":
                bubble_sort(d, sleepTime);
                break;
            case "merge":
                merge_sort(d, sleepTime);
                break;
            case "quick":
                quick_sort(d, 0, default_arr.length - 1, sleepTime);
                break;
            case "counting":
                counting_sort(d, sleepTime);
                break;
            case "cocktail":
                cocktail_sort(d, sleepTime);
                break;
            case "radix":
                radix_sort(d, sleepTime);
                break;
        }
    });
});

Array.prototype.removeType = function(type) {
    let index = -1;
    
    this.forEach((e, i) => {
        if(e.type == type) index = i;
    })

    if(index != -1) {
        let rest = this.slice(index + 1);
        this.length = index;
        return this.push.apply(this, rest);
    }
    else {
        return this;
    }
};

const sort_checkboxes = document.querySelectorAll(".sort-checkboxes");
sort_checkboxes.forEach(checkbox => {
    checkbox.checked = false;
    checkbox.addEventListener("change", e => {
        const id = e.currentTarget.id.split("-")[0];

        if(e.currentTarget.checked) {
            const canvases_container = document.querySelector(".canvases-container");
            const new_canvas = document.createElement("div");

            new_canvas.id = `${id}-div`;
            new_canvas.innerHTML = `<label>${id} sort</label><canvas id="${id}-canvas" width="800" height="800"></canvas>`;

            canvases_container.appendChild(new_canvas);

            let new_data = new Dataset(id)
            new_data.arr = [...default_arr];
            new_data.draw();
            data_arr.push(new_data);
        }
        else {
            const deleted_canvas = document.querySelector(`#${id}-div`);
            deleted_canvas.remove();
            data_arr.removeType(id);
        }
    });
});

const reset_btn = document.querySelector("#reset-btn");
reset_btn.addEventListener("click", () => {
    resetArr();
    draw();
});