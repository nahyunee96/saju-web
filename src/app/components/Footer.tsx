// app/components/Footer.tsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="p-6 md:p-8 text-center">
      <p className="text-xs md:text-sm">
        &copy; {new Date().getFullYear()} Hwarim96. All rights reserved.
      </p>
    </footer>
  );
}
