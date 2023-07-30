const categoryImages = {
    Task: 'img/task.png',
    RandomThought: 'img/randomThought.png',
    Idea: 'img/idea.png',
};

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

    const archiveButton = document.createElement("button");
    archiveButton.textContent = "Archive";
    archiveButton.addEventListener("click", () => archiveNote(index));
    actionsDiv.appendChild(archiveButton);
}

function addNoteRow(note) {
    createNoteRow(note, notes.length - 1);
    saveNotesToLocalStorage();
}

function deleteNoteRow(index) {
    const notesList = document.getElementById('notes-list');
    notesList.deleteRow(index); 
    saveNotesToLocalStorage();
}

function editNoteRow(index, updatedNote) {
    const notesList = document.getElementById('notes-list');
    const rowToUpdate = notesList.rows[index];

    rowToUpdate.cells[0].textContent = updatedNote.name;
    rowToUpdate.cells[2].textContent = updatedNote.category;
    rowToUpdate.cells[3].textContent = updatedNote.content;
    rowToUpdate.cells[4].textContent = updatedNote.dates.join(', ');

    saveNotesToLocalStorage();
}

function toggleNoteContainer() {
    const noteContainer = document.getElementById('note-container');
    noteContainer.classList.toggle('hidden');
}

function archiveNote(index) {
    const note = notes[index];
    archivedNotes.push(note);
    deleteNote(index);
    createArchivedNoteRow(note, archivedNotes.length - 1);
    saveNotesToLocalStorage();
  }

  function unarchiveNote(index) {
    const note = archivedNotes[index];
    archivedNotes.splice(index, 1); // Remove from archivedNotes array
    deleteArchivedNoteRow(index); // Delete from archived notes table
    notes.push(note); // Add back to the regular notes array
    addNoteRow(note); // Add to the regular notes table
    saveNotesToLocalStorage(); // Save the changes to localStorage
  }
  function deleteArchivedNoteRow(index) {
    const notesList = document.getElementById('archived-notes-list');
    notesList.deleteRow(index); 
    saveNotesToLocalStorage();
}

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

function createArchivedNoteRow(note, index) {
    const archivedNotesList = document.getElementById('archived-notes-list');
    const newRow = archivedNotesList.insertRow(-1);

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
    const unarchiveButton = document.createElement('button');
    unarchiveButton.textContent = 'Unarchive';
    unarchiveButton.addEventListener('click', () => unarchiveNote(index));

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('note-actions');
    actionsDiv.appendChild(unarchiveButton);
    actionsCell.appendChild(actionsDiv);
}

function deleteNote(index) {
    notes.splice(index, 1);
    deleteNoteRow(index);
}

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

function clearInputFields() {
    document.getElementById('note-name').value = '';
    document.getElementById('note-category').value = '';
    document.getElementById('note-content').value = '';
}

function saveNotesToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('archivedNotes', JSON.stringify(archivedNotes));
}

function loadNotesFromLocalStorage() {
    const storedArchivedNotes = localStorage.getItem('archivedNotes');
    const storedNotes = localStorage.getItem('notes');
  
    if (storedArchivedNotes) {
      archivedNotes = JSON.parse(storedArchivedNotes);
      archivedNotes.forEach((note, index) => createArchivedNoteRow(note, index));
    }
  
    if (storedNotes) {
      notes = JSON.parse(storedNotes);
      notes.forEach((note, index) => createNoteRow(note, index));
    }
  }

let archivedNotes = [];
let notes = [];

loadNotesFromLocalStorage();
function toggleArchivedNotes() {
    const archivedNotesSection = document.getElementById("archived-notes");
    archivedNotesSection.classList.toggle("hidden");
  }
  
document.getElementById("show-archived-notes-btn").addEventListener("click", () => {
toggleArchivedNotes();
});
document.getElementById('add-btn').addEventListener('click', addNote);
document.getElementById('toggle-fields-btn').addEventListener('click', () => {
    toggleNoteContainer();
});

toggleNoteContainer();