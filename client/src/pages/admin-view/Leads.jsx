import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi"; // vertical three-dot icon

export default function Leads() {
  const [leads, setLeads] = useState([
    { id: 1, name: "John Doe", status: "New", phone: "1234567890", email: "john@example.com" },
    { id: 2, name: "Jane Smith", status: "Contacted", phone: "9876543210", email: "jane@example.com" },
  ]);

  const [showSidebar, setShowSidebar] = useState(false);
  const [form, setForm] = useState({ name: "", status: "", phone: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null); // stores id of open dropdown

  const handleAddOrEdit = () => {
    if (editId) {
      setLeads(leads.map(l => (l.id === editId ? { ...l, ...form } : l)));
      setEditId(null);
    } else {
      setLeads([...leads, { id: Date.now(), ...form }]);
    }
    setForm({ name: "", status: "", phone: "", email: "" });
    setShowSidebar(false);
  };

  const handleEdit = (lead) => {
    setForm({ name: lead.name, status: lead.status, phone: lead.phone, email: lead.email });
    setEditId(lead.id);
    setShowSidebar(true);
    setDropdownOpen(null);
  };

  const handleDelete = (id) => {
    setLeads(leads.filter(l => l.id !== id));
    setDropdownOpen(null);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leads</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowSidebar(true)}
        >
          Create Lead
        </button>
      </div>

      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left"></th> {/* Empty header for dropdown */}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b hover:bg-gray-50 relative">
              <td className="p-2">{lead.name}</td>
              <td className="p-2">{lead.status}</td>
              <td className="p-2">{lead.phone}</td>
              <td className="p-2">{lead.email}</td>
              <td className="p-2 relative">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === lead.id ? null : lead.id)}
                  className="p-1 rounded hover:bg-gray-200"
                >
                  <HiDotsVertical size={20} />
                </button>
                {dropdownOpen === lead.id && (
                  <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
                    <button
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                      onClick={() => {
                        setDropdownOpen(null);
                        alert(`Viewing ${lead.name}`);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                      onClick={() => handleEdit(lead)}
                    >
                      Edit
                    </button>
                    <button
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                      onClick={() => handleDelete(lead.id)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No leads found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Sidebar Form */}
      {showSidebar && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg p-6 z-20 transition-transform transform translate-x-0">
          <h2 className="text-xl font-bold mb-4">{editId ? "Edit Lead" : "Create Lead"}</h2>
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
              placeholder="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
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
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
