import React from 'react';

interface LinkSection {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

const sections: LinkSection[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Solutions', href: '#solutions' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Updates', href: '#' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Press', href: '#' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Help Center', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'Contact', href: '/contact' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Compliance', href: '#' }
    ]
  }
];

const FooterLinks = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>
          <ul className="space-y-2">
            {section.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FooterLinks;