import { archivedNotes, notes } from "./main.js";

export function updateSummaryTable() {
    const summaryList = document.getElementById('summary-list');
    summaryList.innerHTML = '';
    const categoryCounts = {};
    notes.map((note) => note.category).forEach((category) => {
        if (categoryCounts[category]) {
            categoryCounts[category].active++;
        } else {
            categoryCounts[category] = { active: 1, archived: 0 };
        }
    });
    archivedNotes.map((note) => note.category).forEach((category) => {
        if (categoryCounts[category]) {
            categoryCounts[category].archived++;
        } else {
            categoryCounts[category] = { active: 0, archived: 1 };
        }
    });
    for (const category in categoryCounts) {
        const row = summaryList.insertRow();
        const categoryCell = row.insertCell(0);
        const activeCell = row.insertCell(1);
        const archivedCell = row.insertCell(2);

        categoryCell.textContent = category;
        activeCell.textContent = categoryCounts[category].active;
        archivedCell.textContent = categoryCounts[category].archived;
    }
}
