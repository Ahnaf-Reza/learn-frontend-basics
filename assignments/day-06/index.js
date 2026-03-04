const MiniReact = (function () {
  let hooks = [];
  let idx = 0;
  let currentComponent = null;

  function useState(initialValue) {
    
    // 1. Get current state or Init
    const _idx = idx;
    if (hooks[_idx] === undefined) {
      hooks[_idx] = initialValue;
    }
    // 2. Create setter (setState)
    const setState = (newValue) => {
      hooks[_idx] =
        typeof newValue === "function" ? newValue(hooks[_idx]) : newValue;
      render(currentComponent);
       // Re-render the component
    };
  
    // 3. Move idx++
    idx++;
    // 4. Return [val, set]
    return [hooks[_idx], setState];
  }

  function render(Component) {
    if (Component !== currentComponent) {
      hooks = [];
    }
    currentComponent = Component;
    idx = 0; // Reset index for next render
    const c = Component();
    c.render();
    return c;
  }

  return { useState, render };
})();

module.exports = MiniReact;
