export default function mobileFunctionalities() {
    const closeProjectBtnMobile = document.querySelector(
        ".close-project-section"
    );

    const menuTabletOpenBtn = document.querySelector(".medium-screen-menu-btn");

    const projectSection = document.querySelector(".project-section");
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

    function removeClass() {
        if (
            projectSection.classList.contains("move-left") ||
            projectSection.classList.contains("move-left-tablet")
        ) {
            projectSection.classList.remove("move-left");
            projectSection.classList.remove("move-left-tablet");

            overlayModal.classList.remove("move-left");
            overlayModal.classList.remove("move-left-tablet");
        }
    }
    function displayLeftArrowFunc() {
        if (!displaySectionWrapper.classList.contains("move-right")) {
            displaySectionWrapper.classList.add("move-right");
            overlayModal2.classList.add("move-right");
        }
    }
    function displayRightArrowFunc() {
        if (displaySectionWrapper.classList.contains("move-right")) {
            displaySectionWrapper.classList.remove("move-right");
            overlayModal2.classList.remove("move-right");
        }
    }

    menu.addEventListener("click", (e) => {
        removeClass();
    });

    menuTabletOpenBtn.addEventListener("click", (e) => {
        removeClass();
    });

    displayLeftArrow.addEventListener("click", (e) => {
        displayLeftArrowFunc();
    });

    rightArrow.addEventListener("click", (e) => {
        displayRightArrowFunc();
    });

    return {
        removeClass,
        displayLeftArrowFunc,
        displayRightArrowFunc,
    };
}
