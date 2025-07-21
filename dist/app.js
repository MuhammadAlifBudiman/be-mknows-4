"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "App", {
    enumerable: true,
    get: function() {
        return App;
    }
});
require("reflect-metadata");
const _compression = /*#__PURE__*/ _interop_require_default(require("compression"));
const _cookieparser = /*#__PURE__*/ _interop_require_default(require("cookie-parser"));
const _cors = /*#__PURE__*/ _interop_require_default(require("cors"));
const _express = /*#__PURE__*/ _interop_require_default(require("express"));
const _helmet = /*#__PURE__*/ _interop_require_default(require("helmet"));
const _hpp = /*#__PURE__*/ _interop_require_default(require("hpp"));
const _morgan = /*#__PURE__*/ _interop_require_default(require("morgan"));
const _expressuseragent = /*#__PURE__*/ _interop_require_default(require("express-useragent"));
const _requestip = /*#__PURE__*/ _interop_require_default(require("request-ip"));
const _index = require("./config/index");
const _errormiddleware = require("./middlewares/error.middleware");
const _ratelimittermiddleware = /*#__PURE__*/ _interop_require_default(require("./middlewares/rate-limitter.middleware"));
const _logger = require("./utils/logger");
const _dblazy = require("./database/db-lazy");
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
let App = class App {
    listen() {
        this.app.listen(this.port, ()=>{
            _logger.logger.info("=================================");
            _logger.logger.info(`======= ENV: ${this.env} =======`);
            _logger.logger.info(`🚀 App listening on the port ${this.port}`);
        });
    }
    getServer() {
        return this.app;
    }
    initializeMiddlewares() {
        this.app.use((0, _morgan.default)(_index.LOG_FORMAT, {
            stream: _logger.stream
        }));
        this.app.use((0, _cors.default)({
            origin: _index.ORIGIN,
            credentials: _index.CREDENTIALS
        }));
        this.app.use((0, _hpp.default)());
        this.app.use((0, _helmet.default)());
        this.app.use((0, _compression.default)());
        this.app.use(_express.default.json({
            limit: "200mb",
            type: "application/json"
        }));
        this.app.use(_express.default.urlencoded({
            extended: true
        }));
        this.app.use((0, _cookieparser.default)());
        this.app.use(_requestip.default.mw());
        this.app.use(_expressuseragent.default.express());
    }
    initializeRoutes(routes) {
        routes.forEach((route)=>{
            this.app.use("/", route.router);
        });
    }
    initializeErrorHandling() {
        this.app.use(_errormiddleware.ErrorMiddleware);
    }
    initializeRateLimitter() {
        this.app.use(this.limit.default());
    }
    constructor(routes){
        _define_property(this, "app", void 0);
        _define_property(this, "limit", new _ratelimittermiddleware.default());
        _define_property(this, "env", void 0);
        _define_property(this, "port", void 0);
        _define_property(this, "_dbSynced", false);
        this.app = (0, _express.default)();
        this.env = _index.NODE_ENV || "development";
        this.port = _index.PORT || 3000;
        this.app.use(async (req, res, next)=>{
            try {
                const db = await (0, _dblazy.getDB)();
                if (this.env === 'development' || this.env === 'test') {
                    if (!this._dbSynced) {
                        await db.sequelize.sync({
                            alter: true,
                            force: true
                        });
                        _logger.logger.info('Database synced with force: true (all tables dropped and recreated)');
                        const roleSeeder = require('./database/seeders/01-insert-role.js');
                        await roleSeeder.up(db.sequelize.getQueryInterface(), db.sequelize.constructor);
                        _logger.logger.info('Role seeder executed');
                        this._dbSynced = true;
                    }
                }
                next();
            } catch (err) {
                _logger.logger.error("DB initialization failed: " + err.message);
                res.status(500).json({
                    message: "Database initialization failed"
                });
            }
        });
        this.initializeRateLimitter();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }
};

//# sourceMappingURL=app.js.map