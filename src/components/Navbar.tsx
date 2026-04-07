import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const NAV_ITEMS = [
  { title: 'Home', url: '/' },
  {
    title: 'About',
    children: [
      { title: 'Our Team', url: '/team' },
      { title: 'Competition', url: '/competition' },
      { title: 'Gallery', url: '/gallery' },
    ],
  },
  {
    title: 'Support',
    children: [
      { title: 'Sponsors', url: '/sponsors' },
    ],
  },
  { title: 'Contact Us', url: '/contact-us' },
];


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (url?: string, children?: { url: string }[]) => {
    if (url) return router.asPath === url;
    if (children) return children.some((c) => router.asPath === c.url);
    return false;
  };

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [router.asPath]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* Jellyfish decoration */}
      <svg className="absolute right-4 top-0 opacity-10 pointer-events-none" width="38" height="64" viewBox="0 0 80 130" fill="none">
        <path d="M5 38 C5 14, 65 14, 65 38 C65 48, 35 52, 5 38Z" fill="#00A99D" />
        <path d="M11 34 C16 20, 54 20, 59 34" stroke="#187A72" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M14 50 C11 64, 16 74, 12 88 C9 100, 14 108, 10 122" stroke="#00A99D" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M24 52 C22 68, 28 78, 24 94 C20 108, 26 116, 22 130" stroke="#187A72" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M35 53 C35 70, 35 82, 33 98" stroke="#00A99D" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M46 52 C48 68, 42 78, 46 94 C50 108, 44 116, 48 130" stroke="#187A72" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M56 50 C59 64, 54 74, 58 88 C61 100, 56 108, 60 122" stroke="#00A99D" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8" style={{ paddingTop: '18px', paddingBottom: '18px' }}>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image src="/assets/branding/Copy of logo_color.svg" alt="Kelpie Robotics" width={80} height={80} />
        </Link>

        {/* Desktop nav (centered via spacer on right) */}
        <nav ref={dropdownRef} className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.url, item.children);

            if (item.children) {
              return (
                <div
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.title)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className="flex items-center gap-1 py-1 text-base font-medium transition-colors duration-200 focus:outline-none"
                    style={{ color: active ? '#00A99D' : '#374151' }}
                    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = '#00A99D'; }}
                    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = '#374151'; }}
                  >
                    {item.title}
                    <svg
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                      className={`transition-transform duration-200 ${openDropdown === item.title ? 'rotate-180' : ''}`}
                    >
                      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300 ease-out ${active ? 'w-full' : 'w-0'}`}
                    style={{ backgroundColor: '#00A99D' }}
                  />

                  {/* Dropdown — pt-3 bridges the gap so hover isn't lost on mouse move */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-48 transition-all duration-200 origin-top ${
                      openDropdown === item.title ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 relative">
                      {/* small arrow tip */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45" />
                      {item.children.map((child) => (
                        <Link
                          key={child.url}
                          href={child.url}
                          className="block px-4 py-2.5 text-sm font-medium transition-colors duration-150 mx-1 rounded-lg hover:bg-teal-50"
                          style={{ color: router.asPath === child.url ? '#00A99D' : '#374151' }}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link key={item.url} href={item.url!} className="relative group py-1">
                <span
                  className="text-base font-medium transition-colors duration-200 group-hover:text-emerald-500"
                  style={{ color: active ? '#00A99D' : '#374151' }}
                >
                  {item.title}
                </span>
                <span
                  className={`absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300 ease-out ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}
                  style={{ backgroundColor: '#00A99D' }}
                />
              </Link>
            );
          })}
        </nav>


        {/* Spacer to balance logo and keep nav centered */}
        <div className="hidden md:block" style={{ width: 80 }} />

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-700"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden overflow-y-auto">
          <div className="flex flex-col min-h-full">

            {/* Header row */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                <Image src="/assets/branding/Copy of logo_color.svg" alt="Kelpie Robotics" width={60} height={60} />
              </Link>
              <button onClick={() => setMenuOpen(false)} className="p-2 text-gray-600" aria-label="Close menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col px-6 pt-6 gap-1 flex-1">
              {NAV_ITEMS.map((item) => {
                if (item.children) {
                  const expanded = mobileExpanded === item.title;
                  return (
                    <div key={item.title}>
                      <button
                        className="flex items-center justify-between w-full px-3 py-3.5 rounded-xl text-left text-lg font-medium transition-colors"
                        style={{ color: isActive(undefined, item.children) ? '#00A99D' : '#374151' }}
                        onClick={() => setMobileExpanded(expanded ? null : item.title)}
                      >
                        {item.title}
                        <svg
                          width="16" height="16" viewBox="0 0 12 12" fill="none"
                          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                        >
                          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      {expanded && (
                        <div className="ml-4 mb-1 flex flex-col gap-0.5">
                          {item.children.map((child) => (
                            <Link
                              key={child.url}
                              href={child.url}
                              onClick={() => setMenuOpen(false)}
                              className="px-3 py-3 rounded-xl text-base font-medium transition-colors"
                              style={{ color: router.asPath === child.url ? '#00A99D' : '#6B7280' }}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.url}
                    href={item.url!}
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-3.5 rounded-xl text-lg font-medium transition-colors"
                    style={{ color: router.asPath === item.url ? '#00A99D' : '#374151' }}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>


          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
