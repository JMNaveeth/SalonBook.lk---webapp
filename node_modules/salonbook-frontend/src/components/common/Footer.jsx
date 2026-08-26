import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Heart, Shield, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-12 pb-8 mt-20 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-white font-display font-bold text-xl">
              <div className="bg-primary-500 text-white p-2 rounded-xl">
                <Scissors className="w-5 h-5" />
              </div>
              <span>SalonBook <span className="text-secondary-500">LK</span></span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Sri Lanka's leading multi-salon booking platform. Discover top barbers, hair stylists, bridal dressing lounges, and beauty spas in your city.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/salons" className="hover:text-primary-500 transition-colors">Browse Salons</Link></li>
              <li><Link to="/salons?city=Colombo" className="hover:text-primary-500 transition-colors">Salons in Colombo</Link></li>
              <li><Link to="/salons?city=Kandy" className="hover:text-primary-500 transition-colors">Salons in Kandy</Link></li>
              <li><Link to="/register?role=owner" className="hover:text-primary-500 transition-colors">List Your Salon (Free)</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-display font-semibold mb-4">Support & Trust</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-primary-500 transition-colors">Customer Portal</Link></li>
              <li><span className="text-neutral-400">Pay at Salon Option</span></li>
              <li><span className="text-neutral-400">Verified Reviews</span></li>
              <li><span className="text-neutral-400">Cancellation & Refund Policy</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-display font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary-500" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary-500" />
                <span>support@salonbook.lk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} SalonBook LK. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 md:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>for Sri Lanka</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
