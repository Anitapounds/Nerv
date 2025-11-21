'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'
import ProfileImage from "../../public/avatar/profile.jpg";


export default function TipModal({ onClose, onSend }: { onClose: () => void; onSend: (amount: number) => void }) {
  const [amount, setAmount] = useState<number | "">("");

  return (
    <div className="fixed inset-0 bg-gray-400/40 flex items-center justify-center z-50">
      <div className="bg-black p-10 rounded-xl w-90">
        <button onClick={onClose} className="text-gray-400 hover:text-white ml-60">
          <X size={20} />
        </button>
        <div className='h-15 bg-gray-800 rounded-md'>
          <div className='text-sm flex m-2 p-2 py-3 gap-1'>
            <Image
              src={ProfileImage}
              alt="Profile"
              className="w-9 h-9 rounded-full bg-white p-1"
            />
            <div className='text-xs'>
              <p>Gamer God</p>
              <p>@gamergod</p>
            </div>
          </div>
        </div>
        <h2 className="text-md my-4 text-center">Send a Tip</h2>
        <input
          type="number"
          placeholder="Amount in $oct"
          value={amount as any}
          onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
          className="w-full bg-gray-800 p-2 rounded mb-4"
        />
        <button onClick={() => {
            if (amount === "" || Number(amount) <= 0) return;
            onSend(Number(amount));
            onClose();
          }} className="w-full bg-indigo-600 py-2 rounded my-5">Send Tip</button>
      </div>
    </div>
  )
}
