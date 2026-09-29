/**
 * Colors used by the auth screens.
 *
 * The brand tokens themselves live in `src/global.css`; these constants exist
 * because `SymbolView` and `ActivityIndicator` only accept hex values, and
 * Tailwind cannot extract a color from a class name built at runtime.
 */

/** Mirrors `--color-brand` from `src/global.css`. */
export const BRAND = '#0077b6';

/** Mirrors Tailwind's `slate-400`, used for muted icons. */
export const SLATE_400 = '#94a3b8';
