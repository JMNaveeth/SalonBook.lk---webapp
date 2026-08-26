import React from 'react';
import { MapPin, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';
import Badge from '../common/Badge';

const ShopApprovalCard = ({ shop, onApprove, onReject }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-display font-bold text-base text-neutral-900">{shop.name}</h4>
          <p className="text-xs text-neutral-500">Owner: {shop.owner_name} ({shop.owner_email})</p>
        </div>
        <Badge status={shop.status} />
      </div>

      <div className="text-xs text-neutral-600 space-y-1">
        <div className="flex items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-primary-500" />
          <span>{shop.address}, {shop.city}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Phone className="w-3.5 h-3.5 text-neutral-400" />
          <span>{shop.phone}</span>
        </div>
      </div>

      {shop.description && (
        <p className="text-xs text-neutral-500 line-clamp-2 bg-neutral-50 p-2.5 rounded-lg">
          {shop.description}
        </p>
      )}

      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-100">
        <button
          onClick={() => onReject(shop)}
          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg flex items-center space-x-1 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Reject</span>
        </button>
        <button
          onClick={() => onApprove(shop.id)}
          className="px-4 py-1.5 bg-secondary-500 hover:bg-secondary-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1 transition-colors"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Approve Salon</span>
        </button>
      </div>
    </div>
  );
};

export default ShopApprovalCard;
