export default function mobileFunctionalities() {
    console.log("from mobile.js");
    const closeProjectBtnMobile = document.querySelector(
        ".close-project-section"
    );

    const menuTabletOpenBtn = document.querySelector(".medium-screen-menu-btn");

    const projectSection = document.querySelector(".project-section");
    const notesSection = document.querySelector(".notes-section");
    const displayNoteSection = document.querySelector(".display-note-section");
    const displaySectionWrapper = document.querySelector(
        ".display-section-wrapper"
    );

    const overlayModal = document.querySelector(".overlay-modal");
    const overlayModal2 = document.querySelector(".overlay-modal2");
    const menu = document.querySelector(".menu-btn");
    const rightArrow = document.querySelector(".right-arrow");
    const displayLeftArrow = document.querySelector(".display-left-btn");

    displaySectionWrapper.classList.add("move-right");
    overlayModal2.classList.add("move-right");
    projectSection.classList.add("move-left");
    overlayModal.classList.add("move-left");

    overlayModal.classList.add("move-left-tablet");
    projectSection.classList.add("move-left-tablet");

    closeProjectBtnMobile.addEventListener("click", (e) => {
        if (
            !projectSection.classList.contains("move-left") ||
            !projectSection.classList.contains("move-left-tablet")
        ) {
            projectSection.classList.add("move-left");
            overlayModal.classList.add("move-left");
            projectSection.classList.add("move-left-tablet");
            overlayModal.classList.add("move-left-tablet");
        }
    });

    menu.addEventListener("click", (e) => {
        if (
            projectSection.classList.contains("move-left") ||
            projectSection.classList.contains("move-left-tablet")
        ) {
            projectSection.classList.remove("move-left");
            projectSection.classList.remove("move-left-tablet");
            overlayModal.classList.remove("move-left");
            overlayModal.classList.remove("move-left-tablet");
        }
    });

    menuTabletOpenBtn.addEventListener("click", (e) => {
        if (
            projectSection.classList.contains("move-left-tablet") ||
            projectSection.classList.contains("move-left")
        ) {
            projectSection.classList.remove("move-left-tablet");
            overlayModal.classList.remove("move-left-tablet");
            projectSection.classList.remove("move-left");
            overlayModal.classList.remove("move-left");
        }
    });

    displayLeftArrow.addEventListener("click", (e) => {
        console.log(e.target);
        if (!displaySectionWrapper.classList.contains("move-right")) {
            displaySectionWrapper.classList.add("move-right");
            overlayModal2.classList.add("move-right");
        }
    });

    rightArrow.addEventListener("click", (e) => {
        console.log(e.target);
        if (displaySectionWrapper.classList.contains("move-right")) {
            displaySectionWrapper.classList.remove("move-right");
            overlayModal2.classList.remove("move-right");
        }
    });
}
