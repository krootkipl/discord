"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAtlasElements = exports.addAtlasElement = exports.Keys = void 0;
const typesafe_actions_1 = require("typesafe-actions");
var Keys;
(function (Keys) {
    Keys["ADD_ATLAS_ELEMENT"] = "[ATLAS] Add atlas element";
    Keys["ADD_ATLAS_ELEMENTS"] = "[ATLAS] Add atlas elementS";
})(Keys = exports.Keys || (exports.Keys = {}));
exports.addAtlasElement = typesafe_actions_1.createCustomAction(Keys.ADD_ATLAS_ELEMENT, (element) => ({ value: element }));
exports.addAtlasElements = typesafe_actions_1.createCustomAction(Keys.ADD_ATLAS_ELEMENTS, (elements) => ({ value: elements }));
//# sourceMappingURL=atlasActions.js.map