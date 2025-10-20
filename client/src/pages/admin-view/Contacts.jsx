import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";

export default function Contacts() {
  const [contacts, setContacts] = useState([
    { id: 1, name: "Alice Johnson", phone: "1234567890", email: "alice@example.com" },
    { id: 2, name: "Bob Brown", phone: "9876543210", email: "bob@example.com" },
  ]);

  const [showSidebar, setShowSidebar] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const handleAddOrEdit = () => {
    if (editId) {
      setContacts(contacts.map(c => (c.id === editId ? { ...c, ...form } : c)));
      setEditId(null);
    } else {
      setContacts([...contacts, { id: Date.now(), ...form }]);
    }
    setForm({ name: "", phone: "", email: "" });
    setShowSidebar(false);
  };

  const handleEdit = (contact) => {
    setForm({ name: contact.name, phone: contact.phone, email: contact.email });
    setEditId(contact.id);
    setShowSidebar(true);
    setDropdownOpen(null);
  };

  const handleDelete = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
    setDropdownOpen(null);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => setShowSidebar(true)}
        >
          Create Contact
        </button>
      </div>

      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-green-500 text-white">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left"></th> {/* empty for icon */}
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id} className="border-b hover:bg-gray-50 relative">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.phone}</td>
              <td className="p-2">{c.email}</td>
              <td className="p-2 relative">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === c.id ? null : c.id)}
                  className="p-1 rounded hover:bg-gray-200"
                >
                  <HiDotsVertical size={20} />
                </button>
                {dropdownOpen === c.id && (
                  <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
                    <button
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                      onClick={() => {
                        setDropdownOpen(null);
                        alert(`Viewing ${c.name}`);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                      onClick={() => handleEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                      onClick={() => handleDelete(c.id)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {contacts.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No contacts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Sidebar Form */}
      {showSidebar && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg p-6 z-20 transition-transform transform translate-x-0">
          <h2 className="text-xl font-bold mb-4">{editId ? "Edit Contact" : "Create Contact"}</h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="p-2 border rounded"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowSidebar(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleAddOrEdit}
              >
                {editId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}
