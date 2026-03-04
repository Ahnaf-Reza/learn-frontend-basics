/**
 * 1. Parse JWT
 * Decode the payload (2nd part) of a JWT.
 */
function parseJWT(token) {
  const base64Url = token.split(".")[1];

  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  return JSON.parse(atob(base64));
}

/**
 * 2. CSRF Manager
 */
class CsrfManager {
  constructor() {
    this.token = "initial-secret";
  }

  refresh() {
    this.token = "new-secret-" + Math.random();
  }

  inject(request) {
    request.headers = request.headers || {};

    request.headers["X-CSRF-Token"] = this.token;
  }
}

/**
 * 3. RBAC Logic
 */
const POLICIES = {
  comment: {
    create: ["editor", "admin"],
    delete: ["admin"],
  },
};

function hasPermission(user, resource, action) {
  if (user.roles.includes("admin")) return true;

  const allowedRoles = POLICIES[resource] && POLICIES[resource][action];

  if (!allowedRoles) return false;

  return user.roles.some((role) => allowedRoles.includes(role));
}

module.exports = { parseJWT, CsrfManager, hasPermission, POLICIES };
