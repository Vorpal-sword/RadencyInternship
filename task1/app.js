function updateSummaryTable() {
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

const categoryImages = {
    Task: 'img/task.png',
    RandomThought: 'img/randomThought.png',
    Idea: 'img/idea.png',
};

function createNoteRow(note, index) {
    try {
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
    editButton.innerHTML = '<i class="material-icons">edit</i>';
    editButton.addEventListener('click', () => showEditForm(index));
    
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="material-icons">delete</i>';
    deleteButton.addEventListener('click', () => deleteNote(index));
    
    const archiveButton = document.createElement('button');
    archiveButton.innerHTML = '<i class="material-icons">archive</i>';
    archiveButton.addEventListener('click', () => archiveNote(index));

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('note-actions');
    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(archiveButton);
    actionsDiv.appendChild(deleteButton);
    actionsCell.appendChild(actionsDiv);
    } catch (error) {
    console.error('Error creating note row:', error);
    }
    
}
function showEditForm(index) {
    const editFormContainer = document.getElementById('edit-form-container');
    const note = notes[index];
  
    const editNoteName = document.getElementById('edit-note-name');
    const editNoteCategory = document.getElementById('edit-note-category');
    const editNoteContent = document.getElementById('edit-note-content');
    editNoteName.value = note.name;
    editNoteCategory.value = note.category;
    editNoteContent.value = note.content;
    editIndex = index;

    editFormContainer.classList.remove('hidden');
}
function updateNote() {
    const updatedName = document.getElementById('edit-note-name').value.trim();
    const updatedCategory = document.getElementById('edit-note-category').value;
    const updatedContent = document.getElementById('edit-note-content').value.trim();
  
    if (updatedName !== '' && updatedCategory !== '' && updatedContent !== '') {
      const updatedNote = {
        name: updatedName,
        category: updatedCategory,
        content: updatedContent,
        dates: notes[editIndex].dates,
      };
      notes[editIndex] = updatedNote;
      editNoteRow(editIndex, updatedNote);
      const editFormContainer = document.getElementById('edit-form-container');
      editFormContainer.classList.add('hidden');
      editIndex = -1;
      saveNotesToLocalStorage();
    }
  }
  
function saveEditedNote(index) {
    const editFormContainer = notesList.rows[index].cells[6].querySelector('.edit-form-container');

    const newName = editFormContainer.querySelector('input').value.trim();
    const newCategory = editFormContainer.querySelector('select').value;
    const newContent = editFormContainer.querySelector('textarea').value.trim();

    if (newName !== '' && newCategory !== '' && newContent !== '') {
        const editedNote = {
        name: newName,
        category: newCategory,
        content: newContent,
        dates: notes[index].dates,
        };
        notes[index] = editedNote;
        editNoteRow(index, editedNote);
        saveNotesToLocalStorage();
        updateSummaryTable(); 
    }
}
function addNoteRow(note) {
    try {
        createNoteRow(note, notes.length - 1);
        saveNotesToLocalStorage();
    } catch (error) {
        console.error('Error adding note row:', error);
    }
}

function deleteNoteRow(index) {
    try {
        const notesList = document.getElementById('notes-list');
        notesList.deleteRow(index);
        saveNotesToLocalStorage();
        updateSummaryTable();
    } catch (error) {
        console.error('Error deleting note row:', error);
    }
}

function editNoteRow(index, updatedNote) {
    const notesList = document.getElementById('notes-list');
    const rowToUpdate = notesList.rows[index];
  
    rowToUpdate.cells[0].firstElementChild.src = categoryImages[updatedNote.category];
    rowToUpdate.cells[1].textContent = updatedNote.name;
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
    updateSummaryTable();
  }

  function unarchiveNote(index) {
    const note = archivedNotes[index];
    archivedNotes.splice(index, 1); // Remove from archivedNotes array
    deleteArchivedNoteRow(index); // Delete from archived notes table
    notes.push(note); // Add back to the regular notes array
    addNoteRow(note); // Add to the regular notes table
    saveNotesToLocalStorage(); // Save the changes to localStorage

    updateSummaryTable(); 
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

        updateSummaryTable();
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
    unarchiveButton.innerHTML = '<i class="material-icons">unarchive</i>';
    unarchiveButton.addEventListener('click', () => unarchiveNote(index));

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('note-actions');
    actionsDiv.appendChild(unarchiveButton);
    actionsCell.appendChild(actionsDiv);
}

function deleteNote(index) {
    notes = [...notes.slice(0, index), ...notes.slice(index + 1)];
    deleteNoteRow(index);
}


function clearInputFields() {
    document.getElementById('note-name').value = '';
    document.getElementById('note-category').value = '';
    document.getElementById('note-content').value = '';
}

function saveNotesToLocalStorage() {
    try {
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('archivedNotes', JSON.stringify(archivedNotes));
    } catch (error) {
        console.error('Error saving notes to local storage:', error);
    }
}

function loadNotesFromLocalStorage() {
    try {const storedArchivedNotes = localStorage.getItem('archivedNotes');
    const storedNotes = localStorage.getItem('notes');
  
    if (storedArchivedNotes) {
      archivedNotes = JSON.parse(storedArchivedNotes);
      archivedNotes.forEach((note, index) => createArchivedNoteRow(note, index));
    }
  
    if (storedNotes) {
      notes = JSON.parse(storedNotes);
      notes.forEach((note, index) => createNoteRow(note, index));
    }

    updateSummaryTable();
    } catch (error) {
        console.error('Error loading notes from local storage:', error);
    }
}


let archivedNotes = [];
let notes = [];
let editIndex = -1;

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
document.getElementById('update-btn').addEventListener('click', updateNote);

toggleNoteContainer();