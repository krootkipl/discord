"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toolkit_1 = require("@reduxjs/toolkit");
const atlas_reducer_1 = require("../reducers/atlas-reducer");
const reducers = toolkit_1.combineReducers({
    atlasData: atlas_reducer_1.default,
});
module.exports = toolkit_1.configureStore({
    reducer: reducers,
    devTools: false,
});
//# sourceMappingURL=store.js.map