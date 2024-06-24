import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

interface NavMobileProps {
}

export default function NavMobile ({
}: NavMobileProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
    <nav className="lg:hidden fixed top-0 left-0 p-4 flex items-center justify-between w-full bg-black text-white">
      <a className="" href="/">
        <span className="logo-g h-8 w-8"></span>
      </a>
      <button
        className="flex flex-col items-center justify-center h-8 w-8"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={isOpen ? 'toggle-cross' : 'toggle'}></span>
      </button>
    </nav>
    {isOpen && (
      <div className="mt-16 fixed top-0 left-0 w-full h-full bg-black text-white z-50">
        <section className="py-6 flex flex-col">
          <a className="px-6 py-4 flex items-center border-t" href="/dashboard" title="Home">
            <span
              className="mr-4 inline-block h-6 w-6 icon-shop-window-fill"
            ></span>
            Home
          </a>
          <a className="px-6 py-4 flex items-center border-t border-b border-slate-100" href="/products" title="Products">
            <span className="mr-4 inline-block h-6 w-6 icon-archive-fill"></span>
            Products
          </a>
        </section>
      </div>
    )}
    </>
  )
}

const domNode = document.getElementById('nav-mobile-react');
const root = createRoot(domNode);
root.render(<NavMobile />);