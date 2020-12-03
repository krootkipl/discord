"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toolkit_1 = require("@reduxjs/toolkit");
const atlas_reducer_1 = require("../reducers/atlas-reducer");
const reducers = toolkit_1.combineReducers({
    atlasData: atlas_reducer_1.default,
});
const store = toolkit_1.configureStore({
    reducer: reducers,
    devTools: false,
});
exports.default = store;
//# sourceMappingURL=store.js.map