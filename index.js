import dateFunc from "/date.js";

const noteApp = (function () {
    const addProjectBtn = document.querySelector(".add-project-btn");
    const projectLists = document.querySelector(".project-lists");
    // const projectListsList = document.querySelector(".project-lists-list");
    const addNewNotes = document.querySelector(".add-notes-btn");
    const displayNoteSection = document.querySelector(".display-note-section");
    const noteHeader = document.querySelector(".note-header");
    const noteCards = document.querySelector(".note-cards");

    const local_storage_key = "project_item";
    const local_storage_selected_note_key = "note_item";
    const local_storage_selected_proj_key = "selected_project";

    let storageArray =
        JSON.parse(localStorage.getItem(local_storage_key)) || [];

    let selectProjectId = localStorage.getItem(local_storage_selected_proj_key);
    let selectedNoteID = localStorage.getItem(local_storage_selected_note_key);
    // localStorage.clear();

    function updateUI(project) {
        localStorage.setItem(local_storage_key, JSON.stringify(storageArray));
        localStorage.setItem(local_storage_selected_proj_key, selectProjectId);
        localStorage.setItem(local_storage_selected_note_key, selectedNoteID);
    }

    addProjectBtn.addEventListener("click", (e) => {
        loadInputField("confirm-btn", "cancel-btn", "input-folder");
    });

    // project list section
    projectLists.addEventListener("click", (e) => {
        const target = e.target;
        const inputFolder = document.querySelector(".input-folder");

        // to only select just the list without selecting any of the inside elements
        const liElement = e.target.closest("li.project-lists-list");

        if (liElement) {
            const id = Number.parseInt(liElement.dataset.id);
            const [value] = filterStorage(id);
            selectProjectId = id;
            selectedNoteID = null;
            updateUI();
            selectItem();

            console.log("selectedId: ", selectProjectId);
            console.log(liElement);

            displayProject(value);
            emptyNoteSection();

            console.log(value);
        }

        // confirm adding new project
        if (target.classList.contains("confirm-btn")) {
            if (inputFolder.value == "") return;
            const value = createFolder(inputFolder.value);
            storageArray.push(value);
            updateUI();
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

            displayProject(value);
            updateUI();
            renderProject();
        }

        // cancel edit
        if (target.classList.contains("input-cancel-edit-btn")) {
            updateUI();
            renderProject();
        }

        // delete projects
        if (target.classList.contains("delete-folder")) {
            const dataId = target.parentElement.parentElement.dataset.id;
            const [value] = filterStorage(dataId);
            const index = storageArray.indexOf(value);
            storageArray.splice(index, 1);
            updateUI();
            renderProject();
            resetNoteSection();
        }
    });

    noteCards.addEventListener("click", (e) => {
        // console.log(e.target);
        const noteCardElement = e.target.closest("div.note-card");
        if (noteCardElement) {
            const projectId = parseInt(selectProjectId);
            const [projectValue] = filterStorage(projectId);

            // note values
            const noteId = parseInt(noteCardElement.dataset.id);
            const [noteValue] = filterNoteContent(
                projectValue.contents,
                noteId
            );
            selectedNoteID = noteValue.id;
            updateUI();
            selectedNoteItem();
            displayNoteInfo(noteValue);
            // console.log(noteValue);
        }
    });

    addNewNotes.addEventListener("click", (e) => {
        console.log(e.target);
        loadNotesTextArea();
    });

    displayNoteSection.addEventListener("click", (e) => {
        const target = e.target;
        // console.log(target);
        if (target.classList.contains("save-note")) {
            saveNoteFunc();
            updateUI();
        }

        if (target.classList.contains("cancel-note")) {
            emptyNoteSection();
        }
    });

    function displayNoteInfo(note) {
        console.log(note);
        if (note === undefined) return;
        displayNoteSection.innerHTML = " ";
        const noteText = `
        <div class="display-note-container">
        <div class="note-info">${note.noteContent}</div>
        <div class="display-note-btns">
            <button class="note-edit">Edit Note</button>
            <button class="note-delete">Delete Note</button>
        </div>
        </div>
        
        `;
        displayNoteSection.innerHTML = noteText;
    }
    function selectedNoteItem() {
        let cardNotes = document.querySelectorAll(".note-card");
        cardNotes.forEach((note) => {
            if (note.classList.contains("select-project")) {
                note.classList.remove("select-project");
            }

            if (parseInt(selectedNoteID) == parseInt(note.dataset.id)) {
                console.log({ note: note.dataset.id, selectedNoteID });
                note.classList.add("select-project");
            }
        });
    }

    function emptyNoteSection() {
        displayNoteSection.innerHTML = "";
    }

    function saveNoteFunc() {
        const noteText = document.querySelector(".note-text");
        const id = parseInt(selectProjectId);
        const [value] = filterStorage(id);
        const noteArray = value.contents;

        if (noteText.value === "") return;

        const noteObject = createNoteCard(noteText.value);

        noteArray.push(noteObject);
        displayProject(value);
        noteText.value = "";
        emptyNoteSection();

        console.log(value);
    }

    function selectItem() {
        const list = document.querySelectorAll(".project-lists-list");

        list.forEach((listItem) => {
            if (listItem.classList.contains("select-project")) {
                listItem.classList.remove("select-project");
            }

            if (Number(listItem.dataset.id) === Number(selectProjectId)) {
                listItem.classList.add("select-project");
            }
        });
        console.log("from selectItem: ", selectProjectId);
    }

    function createFolder(projectName) {
        return {
            projectName: projectName,
            id: Date.now(),
            contents: [],
        };
    }
    function createNoteCard(noteContent) {
        return {
            noteDate: dateFunc(),
            noteTitle: "Animals",
            noteContent: noteContent,
            id: Date.now(),
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
        const id = parseInt(selectProjectId);
        const [value] = filterStorage(id);

        projectLists.innerHTML = "";
        // console.log(storageArray);

        storageArray.forEach(function (item) {
            projectLists.innerHTML += listCard(item.projectName, item.id);
        });

        selectItem();
        displayProject(value);
    }

    function renderNotes() {
        const projId = parseInt(selectProjectId);
        const [projValue] = filterStorage(projId);
        const noteID = parseInt(selectedNoteID);
        const [noteValue] = filterNoteContent(projValue.contents, noteID);
        selectedNoteItem();
        displayNoteInfo(noteValue);
    }

    function render() {
        renderProject();
        renderNotes();
    }

    function filterStorage(num) {
        const value = storageArray.filter(function (item) {
            return item.id == num;
        });

        return value;
    }

    function filterNoteContent(arrValue, id) {
        const value = arrValue.filter(function (arrVal) {
            return arrVal.id == id;
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

    function displayNoteCards(note) {
        // manipulating note inputs
        const partOfContent = note.noteContent.slice(0, 100);
        const content =
            note.noteContent.length >= 90
                ? `${partOfContent}...`
                : note.noteContent;

        // console.log(note);

        // return inputs
        return `
        <div class="note-card" data-id="${note.id}">
        <h3 class="date-made">${note.noteDate}</h3>
        <h2 class="card-heading">${note.noteTitle}</h2>
        <p class="card-para">
            ${content}
        </p>
        <div class="tags">
            <button class="college-tag">College</button>
            <button class="design-tag">Design</button>
        </div>
    </div>
        
        `;
    }

    function displayProject(project) {
        if (project === undefined) return;

        noteHeader.textContent = `${project.projectName}`;
        noteCards.innerHTML = "";

        project.contents.forEach((contents) => {
            noteCards.innerHTML += displayNoteCards(contents);
        });
        // console.log(project);
    }

    function resetNoteSection() {
        noteHeader.textContent = `My Notes`;
        noteCards.innerHTML = "";
    }

    // notes areas
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

    return {
        render,
    };
})();
noteApp.render();
