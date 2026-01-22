'use client';

import { Icon } from '@iconify/react';
import TransitionLink from './transition-link';

export default function WhatsAppButton() {
  // WhatsApp number with country code (no + or spaces)
  const phoneNumber = '9779801016633';
  const message = 'Hello! I would like to inquire about your products.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <TransitionLink
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="lg:hidden fixed bottom-16 right-4  z-50 bg-green-500 hover:bg-green-600 text-white rounded-full size-10 flex justify-center items-center shadow-lg transition-all duration-300 hover:scale-110  hover:animate-none"
      aria-label="Chat on WhatsApp"
    >
      <Icon icon={"ic:sharp-whatsapp"} className="w-6 h-6" />
    </TransitionLink>
  );
}
