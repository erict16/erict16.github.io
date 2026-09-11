export type Action = {
  name: string;
  shortcut?: string[];
  keywords?: string;
  href?: string;
  section: 'Navigation' | 'Socials' | 'Themes';
  subtitle?: string;
  color?: string;
  iconColor?: string;
};

export const actions: Action[] = [
  {
    name: 'Home',
    keywords: 'home',
    href: '/',
    section: 'Navigation',
    color: '#EC605A',
    iconColor: '#5D0F07',
  },
  {
    name: 'GitHub',
    keywords: 'github',
    href: 'https://github.com/erict16',
    section: 'Socials',
    color: '#61C167',
    iconColor: '#0D2805',
  },
  {
    name: 'Light',
    keywords: 'light',
    section: 'Themes',
    color: '#EC79F9',
    iconColor: '#5C0E63',
  },
  {
    name: 'Dark',
    keywords: 'dark',
    section: 'Themes',
    color: '#EC79F9',
    iconColor: '#5C0E63',
  },
  {
    name: 'System',
    keywords: 'system',
    section: 'Themes',
    color: '#FF7F50',
    iconColor: '#9f3e1b',
  },
];
