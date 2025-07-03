'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (res.ok) {
      router.push('/signin');
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-600 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1">
              <option value="customer">Customer</option>
              <option value="supplier">Supplier</option>
              <option value="store">Store</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center">
          Already have an account? <Link href="/signin" className='text-blue-500'>Sign in</Link>
        </p>
      </div>
    </div>
  );
}