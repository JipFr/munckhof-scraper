"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// Import modules
var node_fetch_1 = require("node-fetch");
// Import types
var types_1 = require("./types");
var RideConverter = /** @class */ (function (_super) {
    __extends(RideConverter, _super);
    function RideConverter(current) {
        var _this = _super.call(this) || this;
        _this.id = current.Oid;
        _this.from = _this.toLocation(current, "Aanvang");
        _this.to = _this.toLocation(current, "Eind");
        _this.state = _this.getState(current.StatusWeergave);
        return _this;
    }
    RideConverter.prototype.getState = function (apiState) {
        switch (apiState) {
            case "Moet nog verreden worden":
                return "planned";
            default:
                console.log(apiState);
                return "unknown";
        }
    };
    /** Extract location variables from ride */
    RideConverter.prototype.toLocation = function (ride, key) {
        if (key === void 0) { key = "Aanvang"; }
        // @ts-ignore TypeScript has not yet implemented fromEntries
        var locationValues = Object.fromEntries(Object.entries(ride)
            .filter(function (keyValue) { return keyValue[0].startsWith(key); })
            .map(function (keyValue) { return [keyValue[0].slice(key.length), keyValue[1]]; }));
        var locationObject = {
            locationName: locationValues.RelatieNaam,
            address: locationValues.Plaats + ", " + locationValues.Straat,
            atTime: locationValues.DatumTijd
        };
        return locationObject;
    };
    return RideConverter;
}(types_1.Ride));
var Munckhof = /** @class */ (function () {
    function Munckhof(options) {
        // Set default values
        options = __assign({ username: null, password: null }, options);
        if (!options.username || !options.password)
            throw this.Error("Missing username or password for Munckhof instance");
        // Store username and passwords
        this.username = options.username;
        this.password = options.password;
        // Munckhof API urls
        this.APIROOT = "https://mmapi.munckhof.nl/api";
        this.LOGINURL = this.APIROOT + "/Login";
        this.RIDESURL = this.APIROOT + "/DagPlanningRitOpdracht";
    }
    /** Update token field, thus refreshing the session */
    Munckhof.prototype.updateToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loginRes, loginData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1["default"](this.LOGINURL, {
                            method: "POST",
                            headers: __assign(__assign({}, this.headers()), { "content-type": "application/json" }),
                            body: JSON.stringify({
                                "Password": this.password,
                                "Username": this.username,
                                "Vervoerder": "Munckhof",
                                "Taal": 0
                            })
                        })];
                    case 1:
                        loginRes = _a.sent();
                        // Munckhof actually provides proper HTTP errors.
                        // Thank fuck.
                        if (!loginRes.ok)
                            throw this.Error("HTTP " + loginRes.status + ": " + loginRes.statusText);
                        return [4 /*yield*/, loginRes.json()];
                    case 2:
                        loginData = _a.sent();
                        this.session = loginData;
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Get scheduled */
    Munckhof.prototype.getRides = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rideRes, rideData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1["default"](this.RIDESURL, {
                            method: "GET",
                            headers: this.headers()
                        })];
                    case 1:
                        rideRes = _a.sent();
                        // Error handling
                        if (!rideRes.ok)
                            throw this.Error("HTTP " + rideRes.status + ": " + rideRes.statusText);
                        return [4 /*yield*/, rideRes.json()];
                    case 2:
                        rideData = _a.sent();
                        return [2 /*return*/, rideData.map(function (ride) { return new RideConverter(ride); })];
                }
            });
        });
    };
    // PRIVATE METHODS
    /** Generate headers for each request */
    Munckhof.prototype.headers = function () {
        var _a;
        var headers = {
            "User-Agent": "Munckhof.MobileApp/30.2",
            "accept-language": "en-gb"
        };
        if ((_a = this === null || this === void 0 ? void 0 : this.session) === null || _a === void 0 ? void 0 : _a.Token)
            headers["Authorization"] = "Bearer " + this.session.Token;
        return headers;
    };
    /**
     * Generate error class
     * @param error A message describing the error
     */
    Munckhof.prototype.Error = function (error) {
        return new Error("Munckhof error: " + error);
    };
    return Munckhof;
}());
exports["default"] = Munckhof;
