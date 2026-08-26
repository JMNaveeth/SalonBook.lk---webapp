import React from 'react';
import { formatTime } from '../../utils/formatDate';
import { Clock } from 'lucide-react';

const TimeSlotPicker = ({ slots, selectedSlot, onSelectSlot, loading }) => {
  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-neutral-500 animate-pulse">
        Fetching available time slots...
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="p-6 bg-neutral-50 rounded-xl text-center border border-dashed border-neutral-200">
        <Clock className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-neutral-600">No time slots available for this date.</p>
        <p className="text-xs text-neutral-400 mt-1">Please select another date or staff member.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Select Time Slot</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-1">
        {slots.map((slot) => {
          const isSelected = selectedSlot?.id === slot.id;
          const isBooked = slot.is_booked;

          return (
            <button
              key={slot.id}
              type="button"
              disabled={isBooked}
              onClick={() => !isBooked && onSelectSlot(slot)}
              className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all text-center flex flex-col items-center justify-center ${
                isBooked
                  ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed line-through'
                  : isSelected
                  ? 'bg-primary-500 text-white border-primary-500 ring-2 ring-primary-200 shadow-sm'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-primary-400 hover:text-primary-600'
              }`}
            >
              <span>{formatTime(slot.slot_time)}</span>
              {slot.staff_name && (
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-primary-100' : 'text-neutral-400'}`}>
                  {slot.staff_name.split(' ')[0]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
