import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState({});
  const [editingNote, setEditingNote] = useState({ index: null, text: '' });

  // Загрузка заметок из localStorage при запуске
  useEffect(() => {
    const savedNotes = localStorage.getItem('dailyCalendarNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Сохранение заметок в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('dailyCalendarNotes', JSON.stringify(notes));
  }, [notes]);

  // Функция для добавления заметки
  const addNote = () => {
    if (noteText.trim() === '') {
      alert('Введите текст заметки!');
      return;
    }

    const dateKey = selectedDate.toISOString().split('T')[0];
    const updatedNotes = {
      ...notes,
      [dateKey]: [...(notes[dateKey] || []), noteText]
    };

    setNotes(updatedNotes);
    setNoteText('');
  };

  // Функция для удаления заметки
  const deleteNote = (index) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const updatedNotesForDate = [...(notes[dateKey] || [])];
    updatedNotesForDate.splice(index, 1);

    const updatedNotes = {
      ...notes,
      [dateKey]: updatedNotesForDate
    };

    if (updatedNotesForDate.length === 0) {
      delete updatedNotes[dateKey];
    }

    setNotes(updatedNotes);
    // Сбрасываем режим редактирования при удалении
    setEditingNote({ index: null, text: '' });
  };

  // Функция для начала редактирования заметки
  const startEditing = (index, text) => {
    setEditingNote({ index, text });
  };

  // Функция для сохранения изменений после редактирования
  const saveEdit = () => {
    if (editingNote.text.trim() === '') {
      alert('Заметка не может быть пустой!');
      return;
    }

    const dateKey = selectedDate.toISOString().split('T')[0];
    const updatedNotesForDate = [...(notes[dateKey] || [])];
    updatedNotesForDate[editingNote.index] = editingNote.text;

    const updatedNotes = {
      ...notes,
      [dateKey]: updatedNotesForDate
    };

    setNotes(updatedNotes);
    setEditingNote({ index: null, text: '' });
  };

  // Функция для отмены редактирования
  const cancelEdit = () => {
    setEditingNote({ index: null, text: '' });
  };

  // Функция для форматирования даты
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
  };

  const dateKey = selectedDate.toISOString().split('T')[0];
  const notesForSelectedDate = notes[dateKey] || [];

  return (
    <div className="app">
      <h1>Мой Календарь Дня</h1>

      <div className="calendar-section">
        <h2>{formatDate(selectedDate)}</h2>
        <div className="date-controls">
          <button onClick={() => setSelectedDate(new Date())}>Сегодня</button>
          <button
            onClick={() => {
              const yesterday = new Date(selectedDate);
              yesterday.setDate(selectedDate.getDate() - 1);
              setSelectedDate(yesterday);
            }}
          >
            Предыдущий день
          </button>
          <button
            onClick={() => {
              const tomorrow = new Date(selectedDate);
              tomorrow.setDate(selectedDate.getDate() + 1);
              setSelectedDate(tomorrow);
            }}
          >
            Следующий день
          </button>
        </div>
      </div>

      <div className="notes-section">
        <h3>Заметки на день:</h3>

        {/* Поле для добавления новой заметки */}
        <div className="note-input">
          <textarea
            rows="3"
            placeholder="Введите вашу заметку здесь..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <button onClick={addNote}>Добавить заметку</button>
        </div>

        {/* Список заметок */}
        <ul className="notes-list">
          {notesForSelectedDate.map((note, index) => (
            <li key={index} className="note-item">
              {editingNote.index === index ? (
                // Режим редактирования
                <div className="edit-mode">
                  <textarea
                    value={editingNote.text}
                    onChange={(e) => setEditingNote({...editingNote, text: e.target.value})}
                    rows="3"
                    className="edit-textarea"
                  />
                  <div className="edit-buttons">
                    <button onClick={saveEdit} className="save-btn">Сохранить</button>
                    <button onClick={cancelEdit} className="cancel-btn">Отмена</button>
                  </div>
                </div>
              ) : (
                // Режим просмотра
                <div className="view-mode">
                  <span>{note}</span>
                  <div className="note-actions">
                    <button
                      onClick={() => startEditing(index, note)}
                      className="edit-btn"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => deleteNote(index)}
                      className="delete-btn"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {notesForSelectedDate.length === 0 && <p>На этот день заметок пока нет.</p>}
      </div>
    </div>
  );
}

export default App;
