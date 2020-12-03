"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutability_helper_1 = require("immutability-helper");
const AtlasActions = require("../modules/bot/actions/atlasActions");
const INIT_STATE = {
    atlas: [],
};
function default_1(state = INIT_STATE, action) {
    switch (action.type) {
        case AtlasActions.Keys.ADD_ATLAS_ELEMENT:
            return immutability_helper_1.default(state, { atlas: { $push: [action.value] } });
        default:
            return state;
    }
}
exports.default = default_1;
//# sourceMappingURL=atlas-reducer.js.map