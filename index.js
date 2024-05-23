const noteApp = (function () {
    const addProjectBtn = document.querySelector(".add-project-btn");
    const projectLists = document.querySelector(".project-lists");
    const projectListsList = document.querySelector(".project-lists-list");
    const storageArray = [];

    function createFolder(projectName) {
        return {
            projectName: projectName,
            id: Date.now(),
            contents: {
                noteTitle: "Animals",
                noteContent: "I love animals they are awesome",
                id: Date.now() + 1,
            },
        };
    }
    function listCard(text, id) {
        return `
        <li class="project-lists-list" data-id="${id}">
        <span class="text">${text}</span>
        <span class="material-symbols-outlined">
            more_horiz
        </span>
    </li>
        
        `;
    }
    function renderProject() {
        projectLists.innerHTML = "";

        storageArray.forEach(function (item) {
            projectLists.innerHTML += listCard(item.projectName, item.id);
        });
    }

    function filterStorage(num) {
        const value = storageArray.filter(function (item) {
            return item.id == num;
        });

        return value;
    }
    function loadInputField() {
        projectLists.innerHTML = "";
        const inputFieldHtml = `
        <div class="input-field">
        <input type="text" class="input-folder" placeholder="Add New Folder">
        <div class="input-field-btn">
            <button class="confirm-btn">Confirm</button>
            <button class="cancel-btn">Cancel</button>
        </div>
        </div>

        `;
        projectLists.innerHTML = inputFieldHtml;
    }

    addProjectBtn.addEventListener("click", (e) => {
        loadInputField();
    });

    projectLists.addEventListener("click", (e) => {
        const target = e.target;
        const inputFolder = document.querySelector(".input-folder");

        // to only select just the list without selcting any of the inside elements
        const liElement = e.target.closest("li.project-lists-list");
        if (liElement) {
            console.log(liElement);
            const id = Number.parseInt(liElement.dataset.id);
            const value = filterStorage(id);
            console.log(value);
        }

        if (target.classList.contains("confirm-btn")) {
            if (inputFolder.value == "") return;
            const value = createFolder(inputFolder.value);
            storageArray.push(value);
            inputFolder.value = "";
            renderProject();
            console.log(storageArray);
        }

        if (target.classList.contains("cancel-btn")) {
            // inputFolder.value = "";
            renderProject();
        }
    });
})();
