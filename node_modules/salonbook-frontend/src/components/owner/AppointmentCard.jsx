import React from 'react';
import Badge from '../common/Badge';
import { formatDate, formatTime } from '../../utils/formatDate';
import { formatLKR } from '../../utils/formatCurrency';
import { User, Phone, Calendar, Clock, CheckCircle, XCircle, RefreshCw, UserCheck, AlertOctagon } from 'lucide-react';

const AppointmentCard = ({ booking, onAccept, onReject, onReschedule, onReassign, onComplete, onNoShow }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm hover:shadow transition-shadow space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center space-x-2">
          <Badge status={booking.status} />
          <span className="text-xs text-neutral-400 font-mono">#{booking.id?.substring(0, 8)}</span>
        </div>
        <span className="font-mono font-bold text-sm text-neutral-900">{formatLKR(booking.service_price)}</span>
      </div>

      {/* Booking Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <p className="font-semibold text-neutral-900 text-sm">{booking.service_name}</p>
          <div className="flex items-center text-neutral-600 space-x-1.5">
            <User className="w-3.5 h-3.5 text-primary-500" />
            <span className="font-medium">{booking.customer_name}</span>
          </div>
          <div className="flex items-center text-neutral-500 space-x-1.5">
            <Phone className="w-3.5 h-3.5 text-neutral-400" />
            <span>{booking.customer_phone || booking.customer_email}</span>
          </div>
        </div>

        <div className="space-y-1 sm:text-right">
          <div className="flex items-center sm:justify-end text-neutral-700 space-x-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-secondary-500" />
            <span>{formatDate(booking.booking_date)}</span>
          </div>
          <div className="flex items-center sm:justify-end text-neutral-600 space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>{formatTime(booking.booking_time)}</span>
          </div>
          {booking.staff_name && (
            <p className="text-neutral-500">Staff: <span className="font-medium text-neutral-700">{booking.staff_name}</span></p>
          )}
        </div>
      </div>

      {booking.customer_note && (
        <div className="p-2.5 bg-neutral-50 rounded-lg text-xs text-neutral-600 border border-neutral-100">
          <span className="font-semibold text-neutral-800">Customer Note: </span>
          {booking.customer_note}
        </div>
      )}

      {/* Action Buttons based on status */}
      <div className="pt-2 border-t border-neutral-100 flex flex-wrap gap-2 justify-end">
        {booking.status === 'pending' && (
          <>
            <button
              onClick={() => onAccept(booking)}
              className="bg-secondary-500 hover:bg-secondary-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => onReject(booking)}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
            <button
              onClick={() => onReschedule(booking)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reschedule</span>
            </button>
          </>
        )}

        {booking.status === 'accepted' && (
          <>
            <button
              onClick={() => onComplete(booking)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mark Complete</span>
            </button>
            <button
              onClick={() => onNoShow(booking)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Mark No-Show</span>
            </button>
            <button
              onClick={() => onReassign(booking)}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Reassign Staff</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
