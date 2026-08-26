import React from 'react';
import { Scissors } from 'lucide-react';

const Loader = ({ message = 'Loading SalonBook LK...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
        <Scissors className="w-5 h-5 text-primary-500 absolute" />
      </div>
      <p className="text-sm font-medium text-neutral-600 animate-pulse">{message}</p>
    </div>
  );
};

export default Loader;
