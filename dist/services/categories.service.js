"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CategoryService", {
    enumerable: true,
    get: function() {
        return CategoryService;
    }
});
const _typedi = require("typedi");
const _dblazy = require("../database/db-lazy");
const _HttpException = require("../exceptions/HttpException");
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
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CategoryService = class CategoryService {
    async getCategories() {
        return await (await (0, _dblazy.getDB)()).Categories.findAll({
            attributes: {
                exclude: [
                    "pk"
                ]
            }
        });
    }
    async createCategory(data) {
        const category = await (await (0, _dblazy.getDB)()).Categories.create(_object_spread({}, data));
        delete category.dataValues.pk;
        return category;
    }
    async updateCategory(category_id, data) {
        const updatedData = {};
        if (data.name) updatedData.name = data.name;
        if (data.description) updatedData.description = data.description;
        if (Object.keys(updatedData).length === 0) {
            throw new _HttpException.HttpException(false, 400, "Some field is required");
        }
        const [_, [category]] = await (await (0, _dblazy.getDB)()).Categories.update(updatedData, {
            where: {
                uuid: category_id
            },
            returning: true
        });
        delete category.dataValues.pk;
        return category;
    }
    async deleteCategory(category_id) {
        const category = await (await (0, _dblazy.getDB)()).Categories.findOne({
            where: {
                uuid: category_id
            }
        });
        if (!category) {
            throw new _HttpException.HttpException(false, 400, "Category is not found");
        }
        await category.destroy();
        return true;
    }
};
CategoryService = _ts_decorate([
    (0, _typedi.Service)()
], CategoryService);

//# sourceMappingURL=categories.service.js.map