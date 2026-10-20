import { bubble_sort } from "./sort_algorithms/bubble_sort.js";
import { cocktail_sort } from "./sort_algorithms/cocktail_sort.js";
import { counting_sort } from "./sort_algorithms/counting_sort.js";
import { merge_sort } from "./sort_algorithms/merge_sort.js";
import { quick_sort } from "./sort_algorithms/quick_sort.js";
import { radix_sort } from "./sort_algorithms/radix_sort.js";
import { createArray } from "./data_generator.js";

const sizeSelect = document.querySelector("#array-size");
const patternSelect = document.querySelector("#array-pattern");
const delaySlider = document.querySelector("#sleep-time");
const delayValue = document.querySelector("#delay-value");
const canvas = document.querySelector("canvas");
const startButton = document.querySelector("#start-btn");
const pauseButton = document.querySelector(".pause-btn");
const stepButton = document.querySelector(".step-btn");
const timeOutput = document.querySelector("#single-time");

let arraySize = Number(sizeSelect.value);
let arrayPattern = patternSelect.value;
let sleepTime = Number(delaySlider.value);
let selectedAlgorithm = "bubble";
let defaultArray = createArray(arraySize, arrayPattern);
let data;

const lessons = {
  bubble: {
    name: "Bubble Sort",
    concept:
      "Compare neighboring values and move the larger one to the right. Each pass fixes one more value at the end.",
    complexity: "O(n²)",
  },
  merge: {
    name: "Merge Sort",
    concept:
      "Split the array into smaller runs, then combine two sorted runs into one. The highlighted range is the run being merged.",
    complexity: "O(n log n)",
  },
  quick: {
    name: "Quick Sort",
    concept:
      "Choose a pivot, move smaller values to its left, then sort the two partitions separately.",
    complexity: "Average O(n log n) · worst O(n²)",
  },
  counting: {
    name: "Counting Sort",
    concept:
      "Count how often each value appears, use cumulative counts to find positions, then write the values back in order.",
    complexity: "O(n + k)",
  },
  radix: {
    name: "Radix Sort",
    concept:
      "Group values by ones, tens, then hundreds. Each pass preserves the order established by earlier digits.",
    complexity: "O(d(n + k))",
  },
  cocktail: {
    name: "Cocktail Sort",
    concept:
      "Sweep in both directions. Large values move right on the forward pass; small values move left on the return pass.",
    complexity: "O(n²)",
  },
};

function explainStep(type, message) {
  if (message === "Sorted")
    return ["Complete", "Every bar is now in ascending order."];
  if (message === "Ready")
    return ["Ready to run", "Press Start to see the first decision."];
  if (type === "bubble" || type === "cocktail")
    return message.includes("swap")
      ? [
          "Swap neighbors",
          "The left value is larger, so these two positions exchange values. Orange marks the pair being compared.",
        ]
      : [
          "Compare neighbors",
          "The pair is already in order. Leave both values in place and move to the next pair.",
        ];
  if (type === "quick")
    return message.startsWith("Pivot")
      ? [
          "Fix the pivot",
          "The pivot reached its final position. The next steps work on the partitions around it.",
        ]
      : [
          "Partition around a pivot",
          "Gold marks the pivot. Orange marks the value being checked; the muted bars show the working range.",
        ];
  if (type === "merge")
    return [
      "Merge two runs",
      "Take the next value from one of the sorted runs and write it to the orange position.",
    ];
  if (type === "counting")
    return message.startsWith("Count")
      ? [
          "Count a value",
          "Record one more occurrence of this value. The array itself has not moved yet.",
        ]
      : message.startsWith("Prefix")
        ? [
            "Build cumulative counts",
            "Count how many values are at or below this threshold to determine their final region.",
          ]
        : [
            "Write the result",
            "Copy the next value into the displayed array. Completed positions are marked green.",
          ];
  return message.includes("bucket")
    ? [
        "Sort by one digit",
        "Read the current digit and place this value in its 0–9 bucket. Gold marks earlier values in the same bucket.",
      ]
    : [
        "Write this pass",
        "Write the buckets back in order before moving to the next digit.",
      ];
}

function makeDataset(type = "all") {
  const next = new Dataset(type);
  next.arr = [...defaultArray];
  next.onDraw = renderLesson;
  return next;
}

function renderLesson(current) {
  if (current !== data) return;
  const ready = current.type === "all";
  const type = ready ? selectedAlgorithm : current.type;
  const lesson = lessons[type];
  const message = ready ? "Ready" : current.visual.message;
  const [phase, explanation] = explainStep(type, message);

  document.querySelector("#visual-title").textContent = lesson.name;
  document.querySelector("#lesson-concept").textContent = lesson.concept;
  document.querySelector("#lesson-complexity strong").textContent =
    lesson.complexity;
  document.querySelector("#step-phase").textContent = phase;
  document.querySelector("#single-status").textContent = ready
    ? "Press Start to see the first decision."
    : message === "Sorted"
      ? "Sorting complete"
      : message;
  document.querySelector("#step-explanation").textContent = ready
    ? "Each move will be explained here as it happens."
    : explanation;
  document.querySelector("#scale-max").textContent = current.arr.length;

  const visual = current.visual;
  const active =
    visual.active
      .map((index) => `${index + 1} (${current.arr[index]})`)
      .join(", ") || "—";
  const reference =
    visual.reference.length === 1
      ? `${visual.reference[0] + 1} (${current.arr[visual.reference[0]]})`
      : visual.reference.length > 1
        ? `${visual.reference.length} positions`
        : "—";
  const range = visual.range
    ? `${visual.range[0] + 1}–${visual.range[1] + 1}`
    : "—";
  document.querySelector("#lesson-variables").innerHTML =
    `<div><dt>Items</dt><dd>${current.arr.length}</dd></div><div><dt>Current position (value)</dt><dd>${active}</dd></div><div><dt>Reference position (value)</dt><dd>${reference}</dd></div><div><dt>Working range</dt><dd>${range}</dd></div>`;

  const state = ready
    ? "ready"
    : current.finished
      ? "finished"
      : current.paused
        ? "paused"
        : "running";
  document.querySelector("#run-state").dataset.state = state;
  document.querySelector(".run-state-text").textContent = {
    ready: "Ready",
    running: "Running",
    paused: "Paused",
    finished: "Complete",
  }[state];
}

function updatePlaybackControls() {
  const active = data.playbackStarted && !data.cancelled && !data.finished;
  pauseButton.disabled = !active;
  stepButton.disabled = !active;
  pauseButton.textContent = active && data.paused ? "Resume" : "Pause";
  startButton.querySelector(".start-label").textContent = active
    ? "Restart run"
    : data.finished
      ? "Run again"
      : "Start sorting";
  renderLesson(data);
}

function showReadyArray({ generate = false } = {}) {
  if (data) data.cancel();
  if (generate) defaultArray = createArray(arraySize, arrayPattern);
  data = makeDataset();
  canvas.id = "all-canvas";
  data.draw();
  timeOutput.textContent = "0 s";
  updatePlaybackControls();
}

function startSorting() {
  data.cancel();
  data = makeDataset(selectedAlgorithm);
  canvas.id = `${selectedAlgorithm}-canvas`;
  data.playbackStarted = true;
  data.onComplete = updatePlaybackControls;
  data.draw();
  timeOutput.textContent = "0 s";
  updatePlaybackControls();

  const delay = () => sleepTime;
  const runs = {
    bubble: () => bubble_sort(data, delay),
    merge: () => merge_sort(data, delay),
    quick: () => quick_sort(data, 0, defaultArray.length - 1, delay),
    counting: () => counting_sort(data, delay),
    radix: () => radix_sort(data, delay),
    cocktail: () => cocktail_sort(data, delay),
  };
  runs[selectedAlgorithm]();
}

document.querySelector(".btns-container").addEventListener("click", (event) => {
  const button = event.target.closest(".algorithm-btn");
  if (!button) return;
  selectedAlgorithm = button.dataset.algorithm;
  document
    .querySelectorAll(".algorithm-btn")
    .forEach((item) =>
      item.setAttribute("aria-pressed", String(item === button)),
    );
  showReadyArray();
});

startButton.addEventListener("click", startSorting);
pauseButton.addEventListener("click", () => {
  if (data.paused) data.resume();
  else data.pause();
  updatePlaybackControls();
});
stepButton.addEventListener("click", () => {
  data.step();
  updatePlaybackControls();
});
document
  .querySelector(".reset-btn")
  .addEventListener("click", () => showReadyArray({ generate: true }));

sizeSelect.addEventListener("change", (event) => {
  arraySize = Number(event.currentTarget.value);
  showReadyArray({ generate: true });
});
patternSelect.addEventListener("change", (event) => {
  arrayPattern = event.currentTarget.value;
  showReadyArray({ generate: true });
});
delaySlider.addEventListener("input", (event) => {
  sleepTime = Number(event.currentTarget.value);
  delayValue.textContent = `${sleepTime} ms`;
});

window.addEventListener("pageshow", () => {
  const visibleSize = Number(sizeSelect.value);
  const visiblePattern = patternSelect.value;
  sleepTime = Number(delaySlider.value);
  delayValue.textContent = `${sleepTime} ms`;
  if (visibleSize === arraySize && visiblePattern === arrayPattern) return;
  arraySize = visibleSize;
  arrayPattern = visiblePattern;
  showReadyArray({ generate: true });
});

showReadyArray();
