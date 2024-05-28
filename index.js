const noteApp = (function () {
    const addProjectBtn = document.querySelector(".add-project-btn");
    const projectLists = document.querySelector(".project-lists");
    // const projectListsList = document.querySelector(".project-lists-list");
    const addNewNotes = document.querySelector(".add-notes-btn");
    const displayNoteSection = document.querySelector(".display-note-section");
    const noteHeader = document.querySelector(".note-header");
    const noteCards = document.querySelector(".note-cards");

    const storageArray = [];

    function createFolder(projectName) {
        return {
            projectName: projectName,
            id: Date.now(),
            contents: [
                {
                    noteTitle: "Animals",
                    noteContent: "I love animals they are awesome",
                    id: Date.now() + 1,
                },
                {
                    noteTitle: "Animals",
                    noteContent: "I love animals they are awesome",
                    id: Date.now() + 1,
                },
            ],
        };
    }
    function listCard(text, id) {
        return `
        <li class="project-lists-list" data-id="${id}">
        <span class="text">${text}</span>
        <div class="edit-and-delete">
        <span class="material-symbols-outlined edit-folder">
            edit
        </span>
        <span
            class="material-symbols-outlined delete-folder"
        >
            delete
        </span>
    </div>
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
    function loadInputField(
        confirm,
        cancel,
        inputClass,
        editOrConfirm = "Confirm",
        value = "",
        id = ""
    ) {
        projectLists.innerHTML = "";
        const inputFieldHtml = `
        <div class="input-field">
        <input type="text" class="uni-input ${inputClass}" data-id="${id}" placeholder="Add New Folder" value="${value}">
        <div class="input-field-btn">
            <button class="uni-btn ${confirm}">${editOrConfirm}</button>
            <button class="uni-btn ${cancel}">Cancel</button>
        </div>
        </div>

        `;
        projectLists.innerHTML = inputFieldHtml;
    }

    addProjectBtn.addEventListener("click", (e) => {
        loadInputField("confirm-btn", "cancel-btn", "input-folder");
    });

    function selectItem(list) {
        list.forEach((listItem) => {
            if (listItem.classList.contains("select-project")) {
                listItem.classList.remove("select-project");
            }
        });
    }

    function displayNoteCards(note) {
        return `
        <div class="note-card">
        <h3 class="date-made">20 Apr</h3>
        <h2 class="card-heading">${note.noteTitle}</h2>
        <p class="card-para">
            ${note.noteContent}
        </p>
        <div class="tags">
            <button class="college-tag">College</button>
            <button class="design-tag">Design</button>
        </div>
    </div>
        
        `;
    }
    function displayProject(project) {
        noteHeader.textContent = `${project.projectName}`;
        noteCards.innerHTML = "";

        project.contents.forEach((contents) => {
            noteCards.innerHTML += displayNoteCards(contents);
        });
        // console.log(project);
    }
    projectLists.addEventListener("click", (e) => {
        const target = e.target;
        const inputFolder = document.querySelector(".input-folder");

        // to only select just the list without selecting any of the inside elements
        const liElement = e.target.closest("li.project-lists-list");
        if (liElement) {
            const list = document.querySelectorAll(".project-lists-list");
            const id = Number.parseInt(liElement.dataset.id);
            const [value] = filterStorage(id);
            selectItem(list);
            liElement.classList.add("select-project");

            if (liElement.classList.contains("select-project")) {
                displayProject(value);
            }
            console.log(value);
            console.log(liElement);
        }

        // confirm adding new project
        if (target.classList.contains("confirm-btn")) {
            if (inputFolder.value == "") return;
            const value = createFolder(inputFolder.value);
            storageArray.push(value);
            inputFolder.value = "";
            renderProject();
        }

        // cancel adding new folder
        if (target.classList.contains("cancel-btn")) {
            renderProject();
        }

        // start editing
        if (target.classList.contains("edit-folder")) {
            const dataId = target.parentElement.parentElement.dataset.id;
            const [value] = filterStorage(dataId);
            loadInputField(
                "input-edit-btn",
                "input-cancel-edit-btn",
                "edit-input",
                "Confirm edit",
                value.projectName,
                value.id
            );
        }

        // confirm edit button
        if (target.classList.contains("input-edit-btn")) {
            const inputBtn = document.querySelector(".edit-input");
            const dataId = inputBtn.dataset.id;
            const id = Number.parseInt(dataId);
            const [value] = filterStorage(id);
            value.projectName = inputBtn.value;
            renderProject();
        }

        // cancel edit
        if (target.classList.contains("input-cancel-edit-btn")) {
            renderProject();
        }

        // delete projects
        if (target.classList.contains("delete-folder")) {
            const dataId = target.parentElement.parentElement.dataset.id;
            const [value] = filterStorage(dataId);
            const index = storageArray.indexOf(value);
            storageArray.splice(index, 1);
            renderProject();
        }
    });

    function loadNotesTextArea() {
        displayNoteSection.innerHTML = "";
        const html = `
        <div class="tags"></div>
        <div class="display-note">
            <textarea
                class="note-text"
                name="note"
                id=""
                value=""
            ></textarea>
        </div>
        <div class="display-btns">
            <button class="save-note">Save Note</button>
            <button class="cancel-note">Cancel</button>
        </div>
        
        `;
        displayNoteSection.innerHTML = html;
    }

    addNewNotes.addEventListener("click", (e) => {
        console.log(e.target);
        loadNotesTextArea();
    });

    displayNoteSection.addEventListener("click", (e) => {});
})();
