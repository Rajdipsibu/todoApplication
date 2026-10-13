
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // READ: Fetch all notes
  const fetchAllNotes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_URL}/notes`);
      setNotes(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch notes"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllNotes();
  }, [fetchAllNotes]);

  // CREATE and UPDATE
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setSaving(true);

    try {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
      };

      if (editingId) {
        // UPDATE an existing note
        await axios.put(`${API_URL}/notes/${editingId}`, noteData);
        setSuccess("Note updated successfully!");
      } else {
        // CREATE a new note
        await axios.post(`${API_URL}/notes`, noteData);
        setSuccess("Note created successfully!");
      }

      setTitle("");
      setContent("");
      setEditingId(null);

      await fetchAllNotes();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save note"
      );
    } finally {
      setSaving(false);
    }
  }

  // EDIT: Load selected note into the form
  function handleEdit(note) {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Cancel editing
  function handleCancelEdit() {
    setEditingId(null);
    setTitle("");
    setContent("");
    setError("");
  }

  // DELETE a note
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await axios.delete(`${API_URL}/notes/${id}`);

      // Remove the deleted note from the UI
      setNotes((previousNotes) =>
        previousNotes.filter((note) => note._id !== id)
      );

      if (editingId === id) {
        handleCancelEdit();
      }

      setSuccess("Note deleted successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete note"
      );
    }
  }

  // SEARCH notes by title or content
  const filteredNotes = notes.filter((note) => {
    const query = search.toLowerCase();

    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  return (
    <div className="mx-auto min-h-screen max-w-3xl p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Notes App
      </h1>

      {/* CREATE / UPDATE FORM */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-4 rounded-lg border p-5 shadow-sm"
      >
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Note" : "Create a Note"}
        </h2>

        <input
          type="text"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border p-3"
          required
        />

        <textarea
          placeholder="Enter note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded border p-3"
          rows={4}
          required
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId
              ? "Update Note"
              : "Add Note"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded border px-5 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* SUCCESS AND ERROR MESSAGES */}
      {error && (
        <p className="mb-4 rounded bg-red-100 p-3 text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="mb-4 rounded bg-green-100 p-3 text-green-700">
          {success}
        </p>
      )}

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-5 w-full rounded border p-3"
      />

      {/* READ NOTES */}
      <h2 className="mb-4 text-xl font-semibold">
        All Notes ({filteredNotes.length})
      </h2>

      {loading ? (
        <p>Loading notes...</p>
      ) : filteredNotes.length === 0 ? (
        <p className="text-gray-500">
          {search ? "No matching notes found." : "No notes found."}
        </p>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <div
              key={note._id}
              className="rounded-lg border p-4 shadow-sm"
            >
              <h3 className="mb-2 break-words text-lg font-bold">
                {note.title}
              </h3>

              <p className="whitespace-pre-wrap break-words text-gray-700">
                {note.content}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleEdit(note)}
                  className="rounded bg-amber-100 px-4 py-2 font-semibold text-amber-800 hover:bg-amber-200"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(note._id)}
                  className="rounded bg-red-100 px-4 py-2 font-semibold text-red-700 hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
