"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CategoryRoute", {
    enumerable: true,
    get: function() {
        return CategoryRoute;
    }
});
const _express = require("express");
const _authmiddleware = require("../middlewares/auth.middleware");
const _validationmiddleware = require("../middlewares/validation.middleware");
const _categorycontroller = require("../controllers/category.controller");
const _categoriesdto = require("../dtos/categories.dto");
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
let CategoryRoute = class CategoryRoute {
    initializeRoutes() {
        this.router.get(`/v1/${this.path}`, this.controller.getCategories);
        this.router.post(`/v1/${this.path}`, _authmiddleware.AuthMiddleware, (0, _validationmiddleware.ValidationMiddleware)(_categoriesdto.CreateCategoryDto), this.controller.createCategory);
        this.router.put(`/v1/${this.path}/:category_id`, _authmiddleware.AuthMiddleware, (0, _validationmiddleware.ValidationMiddleware)(_categoriesdto.UpdateCategoryDto), this.controller.updateCategory);
        this.router.delete(`/v1/${this.path}/:category_id`, _authmiddleware.AuthMiddleware, this.controller.deleteCategory);
    }
    constructor(){
        _define_property(this, "path", "categories");
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "controller", new _categorycontroller.CategoryController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=categories.routes.js.map