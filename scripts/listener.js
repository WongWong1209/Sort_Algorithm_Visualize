const reset_btn = document.querySelector(".reset-btn");
reset_btn.addEventListener("click", () => {
    resetArr();
    draw();
});

const bubble_sort_btn = document.querySelector(".bubble-sort-btn");
bubble_sort_btn.addEventListener("click", () => {
    bubble_sort();
});

const merge_sort_btn = document.querySelector(".merge-sort-btn");
merge_sort_btn.addEventListener("click", () => {
    merge_sort();
});

const quick_sort_btn = document.querySelector(".quick-sort-btn");
quick_sort_btn.addEventListener("click", () => {
    quick_sort(0, arr.length - 1);
});

const sleep_time_text = document.querySelector(".sleep-time-text");
sleep_time_text.addEventListener("change", e => {
    sleepTime = e.currentTarget.value;
});