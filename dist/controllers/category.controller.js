"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CategoryController", {
    enumerable: true,
    get: function() {
        return CategoryController;
    }
});
const _expressasynchandler = /*#__PURE__*/ _interop_require_default(require("express-async-handler"));
const _typedi = require("typedi");
const _categoriesservice = require("../services/categories.service");
const _apiResponse = require("../utils/apiResponse");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let CategoryController = class CategoryController {
    constructor(){
        _define_property(this, "category", _typedi.Container.get(_categoriesservice.CategoryService));
        _define_property(this, "getCategories", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const response = await this.category.getCategories();
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Get Category Success", response));
        }));
        _define_property(this, "createCategory", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const data = req.body;
            const response = await this.category.createCategory(data);
            res.status(201).json((0, _apiResponse.apiResponse)(201, "OK", "Create Category Success", response));
        }));
        _define_property(this, "updateCategory", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { category_id } = req.params;
            const data = req.body;
            const response = await this.category.updateCategory(category_id, data);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Update Category Success", response));
        }));
        _define_property(this, "deleteCategory", (0, _expressasynchandler.default)(async (req, res, next)=>{
            const { category_id } = req.params;
            await this.category.deleteCategory(category_id);
            res.status(200).json((0, _apiResponse.apiResponse)(200, "OK", "Delete Category Success", {}));
        }));
    }
};

//# sourceMappingURL=category.controller.js.map