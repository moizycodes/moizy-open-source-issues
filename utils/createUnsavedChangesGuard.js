/**
 * Creates a guard that asks the browser to confirm before leaving a page with
 * unsaved changes.
 *
 * @param {Pick<Window, 'addEventListener' | 'removeEventListener'>} [target]
 *   Event target to attach the beforeunload listener to. Defaults to window
 *   when it is available. Passing a target also makes the utility testable.
 * @returns {{ markDirty: Function, markClean: Function, isDirty: Function, destroy: Function }}
 */
function createUnsavedChangesGuard(
  target = typeof window !== 'undefined' ? window : null
) {
  if (
    (arguments.length > 0 && target === null) ||
    (target !== null &&
      (!target ||
        typeof target.addEventListener !== 'function' ||
        typeof target.removeEventListener !== 'function'))
  ) {
    throw new TypeError('target must support addEventListener and removeEventListener');
  }

  let dirty = false;
  let destroyed = false;
  let listenerRegistered = false;

  const handleBeforeUnload = (event) => {
    if (!dirty) return;

    event.preventDefault();
    event.returnValue = '';
  };

  const markDirty = () => {
    if (destroyed) {
      throw new Error('Cannot mark changes dirty after the guard has been destroyed');
    }

    dirty = true;

    if (target && !listenerRegistered) {
      target.addEventListener('beforeunload', handleBeforeUnload);
      listenerRegistered = true;
    }
  };

  const markClean = () => {
    dirty = false;

    if (target && listenerRegistered) {
      target.removeEventListener('beforeunload', handleBeforeUnload);
      listenerRegistered = false;
    }
  };

  const isDirty = () => dirty;

  const destroy = () => {
    if (destroyed) return;

    markClean();
    destroyed = true;
  };

  return { markDirty, markClean, isDirty, destroy };
}

module.exports = { createUnsavedChangesGuard };
