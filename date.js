export default function dateFunc() {
    // console.log("date");
    const date = new Date();
    const todayDate =
        date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const currMonth = getMonth(date.getMonth());
    const currYear = date.getFullYear();
    const fullDate = `${todayDate} ${currMonth}, ${currYear}`;

    function getMonth(num) {
        let month = null;
        switch (num) {
            case 0:
                month = "January";
                break;
            case 1:
                month = "February";
                break;
            case 2:
                month = "March";
                break;
            case 3:
                month = "April";
                break;
            case 4:
                month = "May";
                break;
            case 5:
                month = "June";
                break;
            case 6:
                month = "July";
                break;
            case 7:
                month = "August";
                break;
            case 8:
                month = "September";
                break;
            case 9:
                month = "October";
                break;
            case 10:
                month = "November";
                break;
            case 11:
                month = "December";
                break;
            default:
                month = "January";
        }
        return month;
    }

    return fullDate;
}
