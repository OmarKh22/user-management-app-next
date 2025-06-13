'use client';

import { useEffect, useState } from 'react';
import { addUser } from './actions';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  async function fetchUsers() {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  }

  async function deleteUser(id: string) {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  }

  async function updateUser(id: string) {
    if (!editName || !editEmail) return;

    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, email: editEmail }),
    });

    setEditId(null);
    setEditName('');
    setEditEmail('');
    fetchUsers();
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>


      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          await addUser(formData);
          fetchUsers();
          e.currentTarget.reset();
        }}
        className="my-4 flex flex-col gap-2 max-w-sm"
      >
        <input type="text" name="name" placeholder="Name" required className="border p-2" />
        <input type="email" name="email" placeholder="Email" required className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white p-2">Add User</button>
      </form>

      {/* List of users */}
      <ul className="space-y-4">
        {users.map((user: any) => (
          <li key={user._id} className="border p-4 rounded flex flex-col gap-2">
            {editId === user._id ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await updateUser(user._id);
                }}
                className="flex flex-col gap-2"
              >
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border p-1"
                />
                <input
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="border p-1"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <strong>{user.name}</strong> - {user.email}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditId(user._id);
                      setEditName(user.name);
                      setEditEmail(user.email);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
