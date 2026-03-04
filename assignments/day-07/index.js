const MiniReact = (function () {
  let hooks = [];
  let idx = 0;

  function useState(initialValue) {
    const state = hooks[idx] || initialValue;
    const _idx = idx; // freeze index for closures
    const setState = (newVal) => {
      hooks[_idx] = newVal;
    };
    idx++;
    return [state, setState];
  }

  function useEffect(callback, depArray) {
    const hasNoDeps = !depArray;
    const oldHook = hooks[idx];
    const hasChangedDeps = oldHook
      ? !depArray.every((dep, i) => dep === oldHook.deps[i])
      : true;

    if (hasNoDeps || hasChangedDeps) {
      if (oldHook && oldHook.cleanup) oldHook.cleanup();
      const cleanup = callback();
      hooks[idx] = { deps: depArray, cleanup };
    }
    idx++;
  }

  function render(Component) {
    idx = 0;
    const c = Component();
    c.render();
    return c;
  }

  return { useState, useEffect, render };
})();

module.exports = MiniReact;
