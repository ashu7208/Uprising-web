# Changelog

- Converted the single-file prototype into separate React components, contexts, hooks, data/configuration, and library modules while retaining the source labels, seed data, CSS selectors, and prototype storage keys.
- Replaced imperative HTML string rendering and direct DOM event wiring with controlled React forms, React Router v6, modal state, and React state updates. This is the framework-level change required for the conversion; browser behavior remains local to this prototype.
- No production backend was present in the source prototype. Data and sessions therefore remain browser-local, and demo passwords remain plain text as the prototype explicitly requires.
