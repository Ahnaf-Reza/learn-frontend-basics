

/**
 * 1. Hyperscript
 * Returns { tag, props, children }
 */
function h(tag, props, children) {
  const normalizedChildren = Array.isArray(children)
    ? children
    : children === undefined || children === null
      ? []
      : [children];

  return {
    tag,
    props: props || {},
    children: normalizedChildren,
  };
}



/**
 * 2. Render
 * Turns VDOM -> RealDOM
 */
function render(vnode, container) {
  if (typeof vnode === "string") {
    const textNode = document.createTextNode(vnode);
    container.appendChild(textNode);
    return textNode;
  }
  const el = document.createElement(vnode.tag);


  for (const [key, value] of Object.entries(vnode.props)) {
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, value);
    } else {
      el.setAttribute(key, value);
    }
  }
  
  vnode.children.forEach(child => {render(child, el);
    }
  );

  container.appendChild(el);
  return el;
}

/**
 * 3. Diff (Reconciliation) - BONUS / Advanced
 * Updates an existing DOM node based on changes
 */
function patch(domNode, oldVNode, newVNode) {
 if (oldVNode.tag !== newVNode.tag) {
    const newDomNode = render(newVNode, domNode.parentNode);
    domNode.remove();
    return newDomNode;
  }

  //update props
  for (const [key, value] of Object.entries(newVNode.props)) {
    domNode.setAttribute(key, value);
  }

  //patch children
  const oldChildren = oldVNode.children;
  const newChildren = newVNode.children;
  const commonLength = Math.min(oldChildren.length, newChildren.length);

  for (let i = 0; i < commonLength; i++) {
    patch(domNode.childNodes[i], oldChildren[i], newChildren[i]);
  }

  if (newChildren.length > oldChildren.length) {
    for (let i = commonLength; i < newChildren.length; i++) {
      render(newChildren[i], domNode);
    }
  }

  if (oldChildren.length > newChildren.length) {
    for (let i = commonLength; i < oldChildren.length; i++) {
      domNode.childNodes[commonLength].remove();
    }
  }

  const el = domNode;


  return el;
}

module.exports = { h, render };
