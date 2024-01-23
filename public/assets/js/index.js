let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

const show = (elem) => {
  elem.style.display = 'inline';
};

const hide = (elem) => {
  elem.style.display = 'none';
};

let activeNote = {};

const getNotes = async () => {
  try {
    const response = await fetch('/api/notes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
};

const saveNote = async (note) => {
  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    return response.json();
  } catch (error) {
    console.error('Error saving note:', error);
    throw error;
  }
};

const deleteNote = async (id) => {
  try {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = async () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };

  try {
    await saveNote(newNote);
    await getAndRenderNotes();
    renderActiveNote();
  } catch (error) {
    console.error('Error handling note save:', error);
  }
};

const handleNoteDelete = async (e) => {
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  try {
    await deleteNote(noteId);
    await getAndRenderNotes();
    renderActiveNote();
  } catch (error) {
    console.error('Error handling note delete:', error);
  }
};

const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  const isTitleTextEmpty = !noteTitle.value.trim();
  const isNoteTextEmpty = !noteText.value.trim();

  if (isTitleTextEmpty || isNoteTextEmpty) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

const renderNoteList = async (notes) => {
  try {
    const listContainer = noteList[0];

    if (notes.length === 0) {
      listContainer.innerHTML = '<li class="list-group-item">No saved Notes</li>';
      return;
    }

    listContainer.innerHTML = notes.map((note) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');

      const spanEl = document.createElement('span');
      spanEl.classList.add('list-item-title');
      spanEl.innerText = note.title;
      spanEl.addEventListener('click', handleNoteView);

      li.append(spanEl);

      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      li.append(delBtnEl);

      li.dataset.note = JSON.stringify(note);

      return li.outerHTML;
    }).join('');
  } catch (error) {
    console.error('Error rendering note list:', error);
  }
};

const getAndRenderNotes = async () => {
  try {
    const notes = await getNotes();
    await renderNoteList(notes);
  } catch (error) {
    console.error('Error getting and rendering notes:', error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');

  if (window.location.pathname === '/notes') {
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    noteTitle.addEventListener('keyup', handleRenderSaveBtn);
    noteText.addEventListener('keyup', handleRenderSaveBtn);
    getAndRenderNotes();
  }
});
