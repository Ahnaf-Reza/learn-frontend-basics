const MiniReact = (function () {
  let hooks = [];
  let idx = 0;

  // ... insert previous hooks (useState/useEffect) if needed,
  // but for this assignment we focus on useMemo.

  function useMemo(factory, deps) {
    const oldHook = hooks[idx];

    const hasNoChange =
      oldHook &&
      deps.every((dep, i) => dep === oldHook.deps[i]);

    if (hasNoChange) {
      idx++;
      return oldHook.value;
    }

    const value = factory();
    hooks[idx] = { value, deps };
    idx++;

    return value;
  }

  function render(Component) {
    idx = 0;
    const c = Component();
    c.render();
    return c;
  }

  return { useMemo, render };
})();

module.exports = MiniReact;
