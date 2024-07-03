import dateFunc from "/date.js";

const noteApp = (function () {
    const addProjectBtn = document.querySelector(".add-project-btn");
    const projectLists = document.querySelector(".project-lists");
    // const projectListsList = document.querySelector(".project-lists-list");
    const addNewNotes = document.querySelector(".add-notes-btn");
    const displayNoteSection = document.querySelector(".display-note-section");
    const noteHeader = document.querySelector(".note-header");
    const noteCards = document.querySelector(".note-cards");
    const addTagBtn = document.querySelector(".add-tag-btn");

    const local_storage_key = "project_item";
    const local_storage_selected_note_key = "note_item";
    const local_storage_selected_proj_key = "selected_project";

    let storageArray =
        JSON.parse(localStorage.getItem(local_storage_key)) || [];

    let selectProjectId = localStorage.getItem(local_storage_selected_proj_key);
    let selectedNoteID = localStorage.getItem(local_storage_selected_note_key);
    // localStorage.clear();

    let noteObjHasBeenCreated = true;

    function updateUI() {
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
            console.log(noteObjHasBeenCreated);

            // console.log("from project");
            deleteNullNoteFunc();
            disabledAddBtn();
            updateUI();
            selectProjectItem();
            displayProject(value);
            emptyNoteSection();
            render();
        }

        // confirm adding new project
        if (target.classList.contains("confirm-btn")) {
            if (inputFolder.value == "") return;
            const value = createFolder(inputFolder.value);
            storageArray.push(value);
            inputFolder.value = "";
            updateUI();
            render();
        }

        // cancel adding new folder
        if (target.classList.contains("cancel-btn")) {
            render();
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
            // render();
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
            render();
        }

        // cancel edit
        if (target.classList.contains("input-cancel-edit-btn")) {
            updateUI();
            render();
        }

        // delete projects
        if (target.classList.contains("delete-folder")) {
            const dataId = target.parentElement.parentElement.dataset.id;
            const [value] = filterStorage(dataId);
            const index = storageArray.indexOf(value);
            storageArray.splice(index, 1);
            renderProject();
            resetNoteSection();
            selectProjectId = null;
            updateUI();
            render();
        }
    });

    noteCards.addEventListener("click", (e) => {
        // to select note card
        const noteCardElement = e.target.closest("div.note-card");
        if (noteCardElement) {
            const projectId = parseInt(selectProjectId);
            const [projectValue] = filterStorage(projectId);

            // note values
            deleteNullNoteFunc();
            disabledAddBtn();

            const noteId = parseInt(noteCardElement.dataset.id);
            const [noteValue] = filterContent(projectValue.contents, noteId);

            selectedNoteID = noteValue.id;
            updateUI();
            selectedNoteItem();
            displayNoteInfo(noteValue);
            render();
        }
    });

    addNewNotes.addEventListener("click", (e) => {
        // using noteObjHasBeenCreated global variable to create note cards
        // also so if hasBeenCreated== false can't create new notes

        if (selectProjectId == "null") {
            selectProjectId = null;
        }
        if (selectProjectId == null) return;

        const id = parseInt(selectProjectId);
        const [value] = filterStorage(id);
        const noteArray = value.contents;
        const noteObject = createNoteCard(undefined);

        // disable add new folder button
        addProjectBtn.disabled = true;
        addProjectBtn.classList.add("disabled");

        if (noteObjHasBeenCreated) {
            noteArray.push(noteObject);
            selectedNoteID = noteObject.id;

            loadNotesTextArea();
            noteObjHasBeenCreated = false;
        }
    });

    // To loop inside each tags arrays in each book Card
    function protoTag(tag) {
        const holder = document.createElement("div");

        tag.forEach((tag) => {
            const tagButton = document.createElement("button");
            tagButton.innerHTML = tag.tagValue;
            holder.appendChild(tagButton);
        });
        return holder;
    }

    // to render the tags
    function renderTagsBtn() {
        const tagsDiv = document.querySelectorAll(".tags");
        const noteToRender = returnNoteValue();
        console.log(noteToRender == undefined);
        if (noteToRender == undefined) return;
        const noteArray = noteToRender.projValue;

        tagsDiv.forEach((tag, index) => {
            const dataId = parseInt(tag.dataset.id);
            const tagsArray = noteArray.contents[index];
            // if (dataId === tagsArray.id) {
            // }
            tag.appendChild(protoTag(tagsArray.tags));
        });
    }

    displayNoteSection.addEventListener("click", (e) => {
        const target = e.target;

        if (target.classList.contains("save-note")) {
            saveNoteFunc();

            renderTagsBtn();
            // updateUI();
        }

        if (target.classList.contains("cancel-note")) {
            noteObjHasBeenCreated = true;
            deleteNoteFunc();
            // updateUI();
            disabledAddBtn();
            emptyNoteSection();
        }

        if (target.classList.contains("note-delete")) {
            const noteValue = returnNoteValue();

            const projValue = noteValue.projValue.contents;
            const index = projValue.indexOf(noteValue.noteValue);
            projValue.splice(index, 1);
            updateUI();
            displayProject(noteValue.projValue);
            emptyNoteSection();
            render();
        }

        if (target.classList.contains("note-edit")) {
            const noteValue = returnNoteValue();

            const projValue = noteValue.projValue.contents;
            const index = projValue.indexOf(noteValue.noteValue);
            const htmlValue = projValue[index].noteContent;
            loadNotesEditText(htmlValue);
        }

        if (target.classList.contains("confirm-note")) {
            const noteEditText = document.querySelector(".note-edit-text");

            const noteValue = returnNoteValue();
            const projValue = noteValue.projValue.contents;
            const index = projValue.indexOf(noteValue.noteValue);
            if (noteEditText.value === "") return;
            projValue[index].noteContent = noteEditText.value;

            updateUI();
            displayProject(noteValue.projValue);
            selectedNoteItem();
            displayNoteInfo(projValue[index]);
            render();

            console.log(noteValue);
        }

        if (target.classList.contains("cancel-edit-note")) {
            emptyNoteSection();

            const noteValue = returnNoteValue();
            const projValue = noteValue.projValue.contents;
            const index = projValue.indexOf(noteValue.noteValue);
            const htmlValue = projValue[index];
            displayNoteInfo(htmlValue);
        }

        if (
            target.classList.contains("add-tag-btn") ||
            target.closest(".add-tag-btn")
        ) {
            loadTagInputField();
        }

        if (
            target.classList.contains("confirm-tag") ||
            target.closest(".confirm-tag")
        ) {
            const tagInput = document.querySelector(".tag-input");
            const noteValue = returnNoteValue();
            console.log(noteValue);
            const tagArray = noteValue.noteValue.tags;
            if (tagInput.value == "") return;

            console.log(tagInput.value);
            tagArray.push({ id: Date.now(), tagValue: tagInput.value });
            console.log(noteValue.noteValue);
            tagInput.value = "";
            renderTagInput(tagArray);
            // updateUI();
        }

        if (
            target.classList.contains("cancel-tag") ||
            target.closest(".cancel-tag")
        ) {
            const tagInput = document.querySelector(".tag-input");
            const noteValue = returnNoteValue();
            const tagArray = noteValue.noteValue.tags;
            // updateUI();
            renderTagInput(tagArray);
            tagInput.value = "";
        }

        // Delete tags
        if (target.classList.contains("tag")) {
            let check =
                prompt(`Are you sure you want to delete tags? If so type "Y" or "y" if not type "N" or "n".
                `);
            if (check == "n" || check == "N") {
                return;
            } else if (check == "y" || check == "Y") {
                const noteValue = returnNoteValue();
                const tagArray = noteValue.noteValue.tags;
                const id = target.dataset.id;
                const [selectedTag] = filterContent(tagArray, id);
                const index = tagArray.indexOf(selectedTag);
                tagArray.splice(index, 1);
                updateUI();
                renderTagInput(tagArray);

                console.log({ index, selectedTag, id, tagArray });
            }
        }
    });

    // delete all the note with null value as the note contents
    function deleteNullNoteFunc() {
        const value = returnNoteValue();
        const noteArray = value.projValue.contents;
        console.log(noteArray);

        const nullNote = noteArray.filter((note) => {
            return note.noteContent == undefined;
        });

        noteObjHasBeenCreated = true;

        if (nullNote.length === 0) return;

        if (typeof nullNote[0].noteContent === "undefined") {
            const index = noteArray.indexOf(nullNote[0]);
            noteArray.splice(index, 1);
        } else return;
    }

    // delete notes
    function deleteNoteFunc() {
        if (selectedNoteID == null) return;
        const value = returnNoteValue();
        const noteArray = value.projValue.contents;
        const [currentNoteObject] = filterContent(noteArray, selectedNoteID);
        const index = noteArray.indexOf(currentNoteObject);
        noteArray.splice(index, 1);
    }

    // enable addProject button
    function disabledAddBtn() {
        if (addProjectBtn.disabled === true) {
            addProjectBtn.disabled = false;
            addProjectBtn.classList.remove("disabled");
        }
    }

    // render tags input in tag section
    function renderTagInput(tagArray) {
        const tagAnchorsDiv = document.querySelector(".tag-anchors");
        tagAnchorsDiv.innerHTML = "";

        tagArray.forEach((tag) => {
            const anchor = document.createElement("a");
            anchor.href = "#";
            anchor.textContent = tag.tagValue;
            anchor.setAttribute("class", "tag");
            anchor.setAttribute("data-id", `${tag.id}`);
            tagAnchorsDiv.appendChild(anchor);
            // console.log(anchor);
        });
    }

    function loadTagInputField() {
        const tagAnchorsDiv = document.querySelector(".tag-anchors");
        tagAnchorsDiv.innerHTML = "";
        const html = `
            <div class="tag-input-field">
                <input type="text" name="tag input" id="" value="" class="tag-input" placeholder="Tag Name">

                <div class="tag-btns">
                    <button class="tag-btn confirm-tag ">
                        <span class="material-symbols-outlined">
                            check
                        </span>
                    </button>
                    <button class="tag-btn cancel-tag">
                        <span class="material-symbols-outlined">
                            close
                        </span>
                    </button>
                </div>
            </div>
        
        `;
        tagAnchorsDiv.innerHTML = html;
    }

    function displayNoteInfo(note) {
        if (note === undefined) return;
        emptyNoteSection();
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

    function emptyNoteSection() {
        displayNoteSection.innerHTML = "";
    }

    function saveNoteFunc() {
        const noteText = document.querySelector(".note-text");
        const noteInputTitle = document.querySelector(".title-input");

        const id = parseInt(selectProjectId);
        const [value] = filterStorage(id);
        const noteArray = value.contents;
        const [currentNoteObject] = filterContent(noteArray, selectedNoteID);

        if (noteInputTitle.value === "") {
            alert("Note Title Cannot be Empty");
            return;
        }

        if (noteText.value === "") {
            alert("Note Cannot be Empty");
            return;
        }

        if (currentNoteObject.tags.length === 0) {
            alert("Please enter at least a tag");
            return;
        }

        // return;
        currentNoteObject.noteContent = noteText.value;
        currentNoteObject.noteTitle = noteInputTitle.value;

        displayProject(value);

        noteText.value = "";
        emptyNoteSection();
        updateUI();
        noteObjHasBeenCreated = true;
        disabledAddBtn();
        console.log(currentNoteObject);
    }

    // to select notes or add select class
    function selectedNoteItem() {
        let cardNotes = document.querySelectorAll(".note-card");
        cardNotes.forEach((note) => {
            if (note.classList.contains("select-project")) {
                note.classList.remove("select-project");
            }

            if (parseInt(selectedNoteID) == parseInt(note.dataset.id)) {
                note.classList.add("select-project");
            }
        });
    }

    function selectProjectItem() {
        const list = document.querySelectorAll(".project-lists-list");

        list.forEach((listItem) => {
            if (listItem.classList.contains("select-project")) {
                listItem.classList.remove("select-project");
            }

            if (Number(listItem.dataset.id) === Number(selectProjectId)) {
                listItem.classList.add("select-project");
            }
        });
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
            tags: [],
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
        noteCards.innerHTML = "";
        const id = parseInt(selectProjectId);
        const [value] = filterStorage(id);

        projectLists.innerHTML = "";
        // console.log(storageArray);

        storageArray.forEach(function (item) {
            projectLists.innerHTML += listCard(item.projectName, item.id);
        });

        selectProjectItem();
        displayProject(value);
    }

    function returnNoteValue() {
        const projId = parseInt(selectProjectId);
        const [projValue] = filterStorage(projId);
        const noteID = parseInt(selectedNoteID);

        // console.log(projValue == undefined);
        if (projValue == undefined) return;
        const [noteValue] = filterContent(projValue.contents, noteID);
        return { noteValue, projValue };
    }

    function renderNotes() {
        const noteIdNotExist = isNaN(parseInt(selectedNoteID));
        if (noteIdNotExist) return;

        const noteValue = returnNoteValue();
        selectedNoteItem();
        displayNoteInfo(noteValue.noteValue);
    }

    function render() {
        renderProject();
        renderNotes();
        renderTagsBtn();
    }

    function filterStorage(num) {
        const value = storageArray.filter(function (item) {
            return item.id == num;
        });

        return value;
    }

    function filterContent(arrValue, id) {
        id = Number.parseInt(id);

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

        if (note.noteContent == null) return;
        const partOfContent = note.noteContent.slice(0, 100);
        const content =
            note.noteContent.length >= 90
                ? `${partOfContent}...`
                : note.noteContent;

        return `
        <div class="note-card" data-id="${note.id}">
        <h3 class="date-made">${note.noteDate}</h3>
        <h2 class="card-heading">${note.noteTitle}</h2>
        <p class="card-para">
            ${content}
        </p>
        <div class="tags" data-id="${note.id}">
        
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
    }

    function resetNoteSection() {
        noteHeader.textContent = `My Notes`;
        noteCards.innerHTML = "";
    }

    // notes areas
    function loadNotesTextArea() {
        const loadNotesObject = {
            textClass: "note-text",
            btn1Class: "save-note",
            btn2Class: "cancel-note",
            btn1Text: "Save Note",
            btn2Text: "Cancel",
            titleClass: "load-title",
        };
        loadNoteText(loadNotesObject);
    }

    function loadNotesEditText(htmlValue) {
        const loadNotesObject = {
            textClass: "note-edit-text",
            btn1Class: "confirm-note",
            btn2Class: "cancel-edit-note",
            btn1Text: "Confirm Note",
            btn2Text: "Cancel",
            titleClass: "load-edit-title",
        };
        loadNoteText(loadNotesObject, htmlValue);
    }

    function loadNoteText(object, htmlValue = "") {
        displayNoteSection.innerHTML = "";
        const html = `
        <div class="tags-section">
            <p>Tags: </p>
            <div class="tag-anchors">
                
            </div>
            <button class="add-tag-btn">
                <span class="material-symbols-outlined"> add </span>
                <p>
                    Add Tag
                </p>
            </button>
        </div>
        <div class="div-title">
            <input type="text" class="title-input ${object.titleClass}" placeholder="Add Title">
        </div>
        <div class="display-note">
            <textarea
                class="note-textarea ${object.textClass}"
                name="note"
                placeholder="Empty Note"
                id=""
                value=""
            >${htmlValue}</textarea>
        </div>
        <div class="display-btns">
            <button class="${object.btn1Class}">${object.btn1Text}</button>
            <button class="${object.btn2Class}">${object.btn2Text}</button>
        </div>
        
        `;
        displayNoteSection.innerHTML = html;
    }

    return {
        render,
    };
})();

noteApp.render();
