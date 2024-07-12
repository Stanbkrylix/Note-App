export default function mobileFunctionalities() {
    console.log("from mobile.js");
    const closeProjectBtn = document.querySelector(".close-project-section");
    const projectSection = document.querySelector(".project-section");
    const notesSection = document.querySelector(".notes-section");
    const displayNoteSection = document.querySelector(".display-note-section");

    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");

    projectSection.classList.add("translate-left");
    notesSection.classList.add("translate-left-notes");

    closeProjectBtn.addEventListener("click", (e) => {
        if (!projectSection.classList.contains("translate-left")) {
            projectSection.classList.add("translate-left");
            notesSection.classList.add("translate-left-notes");
        }
    });

    // displayNoteSection.classList.add("hidden");

    leftArrow.addEventListener("click", (e) => {
        if (
            projectSection.classList.contains("hidden") ||
            projectSection.classList.contains("translate-left")
        ) {
            // projectSection.computedStyleMap.display = "block";
            projectSection.classList.remove("hidden");
            projectSection.classList.remove("translate-left");
            notesSection.classList.remove("translate-left-notes");
        }
    });

    rightArrow.addEventListener("click", (e) => {
        console.log(e.target);
        if (displayNoteSection.classList.contains("hidden")) {
            // notesSection.classList.add("translate-right");
            // displayNoteSection.classList.remove("hidden");
            // displayNoteSection.classList.add("translate-left-display-notes");
            // projectSection.classList.add("translate-left");
            // notesSection.classList.add("translate-left-notes");
        }
    });

    // const
}
