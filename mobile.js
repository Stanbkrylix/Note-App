export default function mobileFunctionalities() {
    console.log("from mobile.js");
    const closeProjectBtn = document.querySelector(".close-project-section");
    const projectSection = document.querySelector(".project-section");
    const notesSection = document.querySelector(".notes-section");
    const displayNoteSection = document.querySelector(".display-note-section");

    const overlayModal = document.querySelector(".overlay-modal");
    const menu = document.querySelector(".menu-btn");
    const rightArrow = document.querySelector(".right-arrow");
    const displayLeftArrow = document.querySelector(".display-left-btn");

    closeProjectBtn.addEventListener("click", (e) => {
        if (!projectSection.classList.contains("move-left")) {
            projectSection.classList.add("move-left");
            overlayModal.classList.add("move-left");
        }
    });

    menu.addEventListener("click", (e) => {
        if (projectSection.classList.contains("move-left")) {
            projectSection.classList.remove("move-left");
            overlayModal.classList.remove("move-left");
        }
    });
}
