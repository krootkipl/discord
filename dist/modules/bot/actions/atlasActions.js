"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAtlasElement = exports.Keys = void 0;
const typesafe_actions_1 = require("typesafe-actions");
var Keys;
(function (Keys) {
    Keys["ADD_ATLAS_ELEMENT"] = "[ATLAS] Add atlas element";
})(Keys = exports.Keys || (exports.Keys = {}));
exports.addAtlasElement = typesafe_actions_1.createCustomAction(Keys.ADD_ATLAS_ELEMENT, (element) => ({ value: element }));
//# sourceMappingURL=atlasActions.js.map