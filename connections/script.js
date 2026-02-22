const gridContainer = document.getElementById('grid-container');
const gridSize = 4;

const submitButton = document.getElementById('submit');
//const refreshButton = document.getElementById('refresh');

var selectedButtons = 0;

let puzzles = []
let wordsAndCategories = {}
let categoryDescriptions = {}

async function getPuzzles() {
    const response = await fetch("./puzzles.json");
    puzzles = await response.json();
}

function getRandomPuzzle() {
    let idx = Math.floor(Math.random() * puzzles.length);
    return puzzles[idx];
}

function initializeGameData(puzzle) {
    wordsAndCategories = {};
    categoryDescriptions = {};

    for (const cat in puzzle.categories) {
        categoryDescriptions[cat] = puzzle.categories[cat].description;

        puzzle.categories[cat].words.forEach(word => {
            wordsAndCategories[word] = cat;
        });
    }
}

function initializeGrid() {
    var availableWords = Object.keys(wordsAndCategories);

    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const gridCell = document.createElement('button');
        gridCell.classList.add('grid-cell');

        let idx = Math.floor(Math.random() * availableWords.length);
        let randomWord = availableWords[idx];
        availableWords.splice(idx, 1);

        gridCell.textContent = `${randomWord}`;
        gridCell.dataset.category = wordsAndCategories[randomWord];

        gridCell.addEventListener("click", () => {
            if (!gridCell.classList.contains("solved")) {


                if (gridCell.classList.contains("selected")) {
                    gridCell.classList.remove("selected");
                    selectedButtons -= 1;
                } else if (selectedButtons < gridSize) {
                    gridCell.classList.add("selected");
                    selectedButtons += 1;
                }
            }

            updateSelections();
        });

        gridContainer.append(gridCell);
    }
}

function updateSelections() {
    if (selectedButtons != gridSize) {
        submitButton.disabled = true;
    } else {
        submitButton.disabled = false;
    }
}

function resetSelections() {
    selectedButtons = 0;
    submitButton.disabled = true;
}

submitButton.addEventListener("click", () => {
    let selectedCells = gridContainer.querySelectorAll(".grid-cell.selected");
    let category = selectedCells[0].dataset.category;

    let correct = true;

    for (let i = 1; i < selectedCells.length; i++) {
        if (selectedCells[i].dataset.category != category) {
            correct = false;
            break;
        }
    }

    if (correct) {
        let solvedGrid = document.getElementById("grid-container-solved");
        let catergoryContainer = document.getElementById("category-container")

        const categoryCell = document.createElement('div');
        categoryCell.classList.add('category-cell');
        categoryCell.classList.add(category);
        categoryCell.textContent = categoryDescriptions[category];
        catergoryContainer.append(categoryCell);

        for (let i = 0; i < selectedCells.length; i++) {
            selectedCells[i].classList.remove("selected");
            selectedButtons -= 1;
            selectedCells[i].classList.add("solved");

            solvedGrid.append(selectedCells[i]);
        }
    }

    updateSelections();

});

/*refreshButton.addEventListener("click", () => {
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }

    resetSelections();
    startGame();
});*/

async function startGame() {
    await getPuzzles();

    const puzzle = getRandomPuzzle()
    initializeGameData(puzzle);

    initializeGrid();
    resetSelections();
}

startGame();