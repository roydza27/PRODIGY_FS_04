import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center justify-center p-5 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to My App</h1>
        <p className="text-gray-500">Your secure and reliable platform.</p>
      </header>
      
      <main className="max-w-md w-full">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold mb-2">Get Started</h3>
          <p className="text-gray-600 leading-relaxed">
            Explore your dashboard, manage your settings, or reset your authentication files.
          </p>
        </div>
      </main>
    </div>
  );
}