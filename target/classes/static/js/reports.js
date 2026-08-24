function exportTimetableToCSV(entries) {
    if (!entries || entries.length === 0) {
        alert("No timetable entries to export.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Day,Time Slot,Subject Code,Subject Name,Type,Teacher,Room/Lab,Section,Semester\n";

    entries.forEach(e => {
        let room = e.roomNumber || e.labName || "N/A";
        let row = `"${e.day}","${e.timeSlotLabel}","${e.subjectCode}","${e.subjectName}","${e.subjectType}","${e.teacherName}","${room}","${e.sectionName}","${e.semester}"`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "smart_timetable_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function printTimetableReport() {
    window.print();
}
