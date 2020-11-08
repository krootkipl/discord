"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfHasRoleByID = exports.checkPermission = void 0;
exports.checkPermission = (member, permission) => member.hasPermission(permission);
exports.checkIfHasRoleByID = (member, id) => !!member.roles.cache.find((v) => v.id === id);
//# sourceMappingURL=helpers.js.map