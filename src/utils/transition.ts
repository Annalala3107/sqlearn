/**
 * Native View Transitions utility inspired by Vercel React View Transitions.
 * Calls document.startViewTransition if supported by the browser,
 * or gracefully falls back to normal execution.
 */
export function startViewTransition(callback: () => void | Promise<void>) {
  if (typeof document !== 'undefined' && 'startViewTransition' in document) {
    (document as any).startViewTransition(async () => {
      await callback();
    });
  } else {
    callback();
  }
}
