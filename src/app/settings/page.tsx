"use client";

import { useData } from "@/contexts/DataContext";
import { useState } from "react";

export default function Page() {
  const [busy, setBusy] = useState(false);

  const [schema, setSchema] = useState("");
  const [resolver, setResolver] = useState(
    "0x0000000000000000000000000000000000000000"
  );

  const { createSchema } = useData();

  const handleCreateSchema = async () => {
    setBusy(true);
    try {
      await createSchema(schema, resolver, true);
    } catch (error) {
      console.log(error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="flex flex-col justify-center items-center bg-gray-900 p-4 rounded-xl w-full max-w-md gap-4">
        <p>Create Schema</p>
        <input
          placeholder="(uint256 field1, string field2)"
          disabled={busy}
          className="w-full flex-grow text-sm bg-black text-white border border-gray-200 rounded-xl py-2 px-3 leading-tight focus:outline-none focus:border-indigo-400 disabled:opacity-50"
          id="message-text"
          type="text"
          spellCheck={false}
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
        />
        <input
          placeholder="0x"
          disabled={busy}
          className="w-full flex-grow text-sm bg-black text-white border border-gray-200 rounded-xl py-2 px-3 leading-tight focus:outline-none focus:border-indigo-400 disabled:opacity-50"
          id="message-text"
          type="text"
          spellCheck={false}
          value={resolver}
          onChange={(e) => setResolver(e.target.value)}
        />
        <button
          className="w-34 h-8 bg-indigo-400 rounded-lg py-1 px-3 hover:opacity-80 disabled:opacity-50 text-xs font-bold"
          onClick={handleCreateSchema}
        >
          Create
        </button>
      </div>
    </div>
  );
}
