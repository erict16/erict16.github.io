# Eric Tan

Personal site. Live at [erict16.github.io](https://erict16.github.io/).

```bash
pnpm install
pnpm dev
```

## What is where

- `app/page.tsx` is the page: hero, Ragdoll Mail, more work, contact.
- `app/globals.css` holds all the styles.
- `data/projects.ts` holds the project names, texts and links.
- `ui/Particles.tsx` draws the points behind the page with WebGL. They build the Ragdoll cat from `public/static/home/cat.png`, drift apart on scroll and gather into a sphere at the foot.
- `ui/Terminal.tsx`, `ui/SearchDemo.tsx`, `ui/UndoSend.tsx`, `ui/TypeCode.tsx` and `ui/TypingBook.tsx` are the small live demos in the cards.
- `ui/Effects.tsx` does reveal on scroll, the tilt of the demo window and the light that follows the pointer.

## Publish

GitHub Pages cannot run a Node server, so this app uses `output: 'export'`. Push `main` and the workflow builds and publishes `out/`.
