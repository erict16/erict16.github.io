export type Project = {
  emoji: string;
  title: string;
  description: string;
  href: string;
};

export const projects: Project[] = [
  {
    emoji: '⌨️',
    title: 'TypeBooks',
    description: 'Practice typing by retyping classic books.',
    href: 'https://typebooks.vercel.app',
  },
  {
    emoji: '⚡',
    title: 'OLTC Selector',
    description: 'Tap-changer type designation.',
    href: 'https://erict16.github.io/oltc-selector/',
  },
  {
    emoji: '📐',
    title: 'Tuyi',
    description: 'Translate text inside DWG and DXF drawings.',
    href: 'https://erict16.github.io/tuyi/',
  },
];
