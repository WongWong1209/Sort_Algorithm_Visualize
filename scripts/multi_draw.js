import { bubble_sort } from './sort_algorithms/bubble_sort.js';
import { cocktail_sort } from './sort_algorithms/cocktail_sort.js';
import { counting_sort } from './sort_algorithms/counting_sort.js';
import { merge_sort } from './sort_algorithms/merge_sort.js';
import { quick_sort } from './sort_algorithms/quick_sort.js';
import { radix_sort } from './sort_algorithms/radix_sort.js';

let sleepTime = 0;
let default_arr = [];
let data_arr = [];

resetArr();
draw();

function resetArr() {
    default_arr = new Array(100).fill(0);
    for (let i = 1; i <= 100; i++) {
        do {
            let index = Math.floor(Math.random() * 100);
            if (!default_arr[index]) {
                default_arr[index] = i;
                break;
            }
        } while (true);
    }

}

function draw() {
    data_arr.forEach(e => e.draw());
}

function rebuildSelected() {
    data_arr = data_arr.map(current => {
        current.cancel();
        const next = new Dataset(current.type);
        next.arr = [...default_arr];
        next.draw();
        document.querySelector(`#${next.type}-time`).textContent = "0 s";
        return next;
    });
    updatePlaybackControls();
}

const pause_btn = document.querySelector("#pause-btn");
const step_btn = document.querySelector("#step-btn");

function activeDatasets() {
    return data_arr.filter(d => d.playbackStarted && !d.cancelled && !d.finished);
}

function updatePlaybackControls() {
    const active = activeDatasets();
    pause_btn.disabled = active.length === 0;
    step_btn.disabled = active.length === 0;
    pause_btn.textContent = active.length > 0 && active.every(d => d.paused) ? "Play" : "Pause";
}

pause_btn.addEventListener("click", () => {
    const active = activeDatasets();
    if (active.every(d => d.paused)) active.forEach(d => d.resume());
    else active.forEach(d => d.pause());
    updatePlaybackControls();
});

step_btn.addEventListener("click", () => {
    activeDatasets().forEach(d => d.step());
    updatePlaybackControls();
});

const sleep_time_text = document.querySelector(".sleep-time-text");
sleep_time_text.value = sleepTime;
sleep_time_text.addEventListener("change", e => {
    sleepTime = e.currentTarget.value;
});

const start_btn = document.querySelector("#start-btn");
start_btn.addEventListener("click", () => {
    rebuildSelected();
    data_arr.forEach(d => {
        d.playbackStarted = true;
        d.onComplete = updatePlaybackControls;
        switch (d.type) {
            case "bubble":
                bubble_sort(d, sleepTime);
                break;
            case "merge":
                merge_sort(d, sleepTime);
                break;
            case "quick":
                d.start_time = new Date().getTime();
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
    updatePlaybackControls();
});

Array.prototype.removeType = function (type) {
    let index = -1;

    this.forEach((e, i) => {
        if (e.type == type) index = i;
    })

    if (index != -1) {
        this[index].cancel();
        let rest = this.slice(index + 1);
        this.length = index;
        return this.push.apply(this, rest);
    }
    else {
        return this;
    }
};

const all_check_checkbox = document.querySelector("#all-btn");
all_check_checkbox.checked = false;
all_check_checkbox.addEventListener("change", e => {
    sort_checkboxes.forEach(checkbox => {
        if(checkbox.checked != e.currentTarget.checked) {
            checkbox.checked = e.currentTarget.checked;

            const id = checkbox.id.split("-")[0]
            if (e.currentTarget.checked) {
                createElement(id);
            }
            else {
                const deleted_canvas = document.querySelector(`#${id}-div`);
                deleted_canvas.remove();
                data_arr.removeType(id);
            }
        }
    });
    updatePlaybackControls();
});

const sort_checkboxes = document.querySelectorAll(".sort-checkboxes");
sort_checkboxes.forEach(checkbox => {
    checkbox.checked = false;
    checkbox.addEventListener("change", e => {
        checkIfAllChecked();
        const id = e.currentTarget.id.split("-")[0];

        if (e.currentTarget.checked) {
            createElement(id);
        }
        else {
            const deleted_canvas = document.querySelector(`#${id}-div`);
            deleted_canvas.remove();
            data_arr.removeType(id);
        }
        updatePlaybackControls();
    });
});

function checkIfAllChecked() {
    if([...sort_checkboxes].every(checkbox => checkbox.checked == true)) {
        all_check_checkbox.checked = true;
    }
    else {
        all_check_checkbox.checked = false;
    }
}

function createElement(id) {
    const canvases_container = document.querySelector(".canvases-container");
    const new_canvas = document.createElement("div");

    new_canvas.id = `${id}-div`;
    new_canvas.innerHTML = `<label>${id} sort</label><label id="${id}-time" class="timer">0 s</label><canvas id="${id}-canvas" width="800" height="800"></canvas>`;

    canvases_container.appendChild(new_canvas);

    let new_data = new Dataset(id)
    new_data.arr = [...default_arr];
    new_data.draw();
    data_arr.push(new_data);
}

const reset_btn = document.querySelector("#reset-btn");
reset_btn.addEventListener("click", () => {
    resetArr();
    rebuildSelected();
});
