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

    projectLists.addEventListener("click", (e) => {
        const target = e.target;
        const inputFolder = document.querySelector(".input-folder");

        // to only select just the list without selcting any of the inside elements
        const liElement = e.target.closest("li.project-lists-list");
        if (liElement) {
            console.log(liElement);
            const id = Number.parseInt(liElement.dataset.id);
            const value = filterStorage(id);
            // console.log(value);
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
            renderProject();
        }

        if (target.classList.contains("edit-folder")) {
            // const inputBtn = document.querySelector("edit-input");
            const dataId = target.parentElement.parentElement.dataset.id;
            const [value] = filterStorage(dataId);
            // console.log(value);
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
            // console.log(target);
            const inputBtn = document.querySelector(".edit-input");
            const dataId = inputBtn.dataset.id;
            const id = Number.parseInt(dataId);
            const [value] = filterStorage(id);
            value.projectName = inputBtn.value;
            renderProject();
        }
    });
})();
