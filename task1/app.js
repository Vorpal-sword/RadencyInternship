const categoryImages = {
    Task: 'img/task.png',
    RandomThought: 'img/randomThought.png',
    Idea: 'img/idea.png',
};

// Function to create a new note row in the table
function createNoteRow(note, index) {
    const notesList = document.getElementById('notes-list');
    const newRow = notesList.insertRow(-1);

    const imageCell = newRow.insertCell(0);
    const categoryImage = document.createElement('img');
    categoryImage.src = categoryImages[note.category];
    imageCell.appendChild(categoryImage);

    const nameCell = newRow.insertCell(1);
    nameCell.textContent = note.name;

    const createdCell = newRow.insertCell(2);
    createdCell.textContent = new Date().toLocaleString();

    const categoryCell = newRow.insertCell(3);
    categoryCell.textContent = note.category;

    const contentCell = newRow.insertCell(4);
    contentCell.textContent = note.content;

    const datesCell = newRow.insertCell(5);
    datesCell.textContent = note.dates.join(', ');

    const actionsCell = newRow.insertCell(6);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editNote(index));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteNote(index));

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('note-actions');
    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);
    actionsCell.appendChild(actionsDiv);
}

// Function to add a new note row to the table
function addNoteRow(note) {
    createNoteRow(note, notes.length - 1);
    saveNotesToLocalStorage();
}

// Function to delete a note row from the table
function deleteNoteRow(index) {
    const notesList = document.getElementById('notes-list');
    notesList.deleteRow(index); 
    saveNotesToLocalStorage();
}

// Function to edit a note row in the table
function editNoteRow(index, updatedNote) {
    const notesList = document.getElementById('notes-list');
    const rowToUpdate = notesList.rows[index];

    rowToUpdate.cells[0].textContent = updatedNote.name;
    rowToUpdate.cells[2].textContent = updatedNote.category;
    rowToUpdate.cells[3].textContent = updatedNote.content;
    rowToUpdate.cells[4].textContent = updatedNote.dates.join(', ');

    saveNotesToLocalStorage();
}

// Function to toggle the visibility of the note container
function toggleNoteContainer() {
    const noteContainer = document.getElementById('note-container');
    noteContainer.classList.toggle('hidden');
}

// Function to add a new note
function addNote() {
    const name = document.getElementById('note-name').value.trim();
    const categorySelect = document.getElementById('note-category');
    const category = categorySelect.value;
    const content = document.getElementById('note-content').value.trim();
    const dateMatches = content.match(/(\d{2}\.\d{2}\.\d{4})/g); // Find all occurrences of dates (dd.mm.yyyy format)
    
    if (name !== '' && category !== '' && content !== '') {
        const note = { name, category, content, dates: [] };
        if (dateMatches) {
            dateMatches.forEach((dateMatch) => {
                const [_, day, month, year] = dateMatch.match(/(\d{2})\.(\d{2})\.(\d{4})/);
                const formattedDate = `${day}/${month}/${year}`;
                note.dates.push(formattedDate);
            });
        }
        notes.push(note);
        addNoteRow(note);
        clearInputFields();
    }
}

// Function to delete a note
function deleteNote(index) {
    notes.splice(index, 1);
    deleteNoteRow(index);
}

// Function to edit a note
function editNote(index) {
    const note = notes[index];
    const updatedName = prompt('Edit name:', note.name);
    const updatedCategory = prompt('Edit category:', note.category);
    const updatedContent = prompt('Edit content:', note.content);
    if (updatedName !== null && updatedCategory !== null && updatedContent !== null) {
        note.name = updatedName.trim();
        note.category = updatedCategory.trim();
        note.content = updatedContent.trim();
        note.dates.push(new Date().toLocaleDateString());
        editNoteRow(index, note);
    }
}

// Helper function to clear input fields after adding a note
function clearInputFields() {
    document.getElementById('note-name').value = '';
    document.getElementById('note-category').value = '';
    document.getElementById('note-content').value = '';
}
function saveNotesToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}
function loadNotesFromLocalStorage() {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        notes = JSON.parse(storedNotes);
        notes.forEach((note, index) => createNoteRow(note, index));
    }
}
// Array to store the notes
let notes = [];

// Load notes from local storage on page load
loadNotesFromLocalStorage();

// Add event listener for the "Add Note" button
document.getElementById('add-btn').addEventListener('click', addNote);

// Add event listener for the "Create Note" button
document.getElementById('toggle-fields-btn').addEventListener('click', () => {
    toggleNoteContainer();
});

// Hide the note container initially
toggleNoteContainer();