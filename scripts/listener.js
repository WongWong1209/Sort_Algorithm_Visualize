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