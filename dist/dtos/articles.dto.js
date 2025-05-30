"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CreateArticleDto () {
        return CreateArticleDto;
    },
    get UpdateArticleDto () {
        return UpdateArticleDto;
    }
});
const _classvalidator = require("class-validator");
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
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateArticleDto = class CreateArticleDto {
    constructor(){
        _define_property(this, "title", void 0);
        _define_property(this, "description", void 0);
        _define_property(this, "content", void 0);
        _define_property(this, "thumbnail", void 0);
        _define_property(this, "categories", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateArticleDto.prototype, "title", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.MinLength)(4),
    _ts_metadata("design:type", String)
], CreateArticleDto.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.MinLength)(4),
    _ts_metadata("design:type", String)
], CreateArticleDto.prototype, "content", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.MinLength)(36),
    _ts_metadata("design:type", Object)
], CreateArticleDto.prototype, "thumbnail", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsUUID)("4", {
        each: true
    }),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Array)
], CreateArticleDto.prototype, "categories", void 0);
let UpdateArticleDto = class UpdateArticleDto {
    constructor(){
        _define_property(this, "title", void 0);
        _define_property(this, "description", void 0);
        _define_property(this, "content", void 0);
        _define_property(this, "thumbnail", void 0);
        _define_property(this, "categories", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateArticleDto.prototype, "title", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(4),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateArticleDto.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(4),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateArticleDto.prototype, "content", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(36),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Object)
], UpdateArticleDto.prototype, "thumbnail", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsUUID)("4", {
        each: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], UpdateArticleDto.prototype, "categories", void 0);

//# sourceMappingURL=articles.dto.js.map