/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 2932:
/***/ ((module, __webpack_exports__, __nccwpck_require__) => {

"use strict";
__nccwpck_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__nccwpck_require__.r(__webpack_exports__);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nccwpck_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _aws_sdk_client_apprunner__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(3503);
/* harmony import */ var _aws_sdk_client_apprunner__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nccwpck_require__.n(_aws_sdk_client_apprunner__WEBPACK_IMPORTED_MODULE_1__);



try
{
  //Setup
  const arn = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput(`app-arn`);
  const desiredStatus = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput(`desired-status`).toUpperCase();

  const allowedStatuses = [
    `CREATE_FAILED`,
    `RUNNING`,
    `DELETED`,
    `DELETE_FAILED`,
    `PAUSED`,
    `OPERATION_IN_PROGRESS`,
  ];

  if(!allowedStatuses.includes(desiredStatus))
  {
    throw new Error(`ERROR - 'desired-status' input must be one of the following: '${allowedStatuses.join(`' , '`)}'`);
  }

  const minSleepTime = 5000;
  const sleepTime = Math.min(parseInt(_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput(`timeout`)), minSleepTime);

  const minTimeout = 0;
  const timeout = Math.min(parseInt(_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput(`timeout`)), minTimeout);

  const client = new _aws_sdk_client_apprunner__WEBPACK_IMPORTED_MODULE_1__.AppRunnerClient({
    region: _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput(`aws-region`),
    credentials: {
      accessKeyId: _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput(`aws-access-key-id`),
      secretAccessKey: _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput(`aws-secret-access-key`)
    }
  });

  const command = new _aws_sdk_client_apprunner__WEBPACK_IMPORTED_MODULE_1__.DescribeServiceCommand({ ServiceArn: arn });

  const startTime = Date.now();

  //Run

  let success = false;

  while(timeout === 0 || startTime + timeout < Date.now())
  {
    const response = await client.send(command);
    const responseStatus = response.Service.Status;

    if(responseStatus === desiredStatus)
    {
      console.log(`SUCCESS - Status is desired '${desiredStatus}'`);
      success = true;
      break;
    }
    else
    {
      console.log(`CONTINUE - Status is '${responseStatus}'`);
    }

    await new Promise(resolve => setTimeout(resolve, sleepTime));
  }

  //Outputs

  _actions_core__WEBPACK_IMPORTED_MODULE_0__.setOutput(`timed-out`, !success);
}
catch(err)
{
  _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed(err.message);
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 647:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppRunner = void 0;
const AppRunnerClient_1 = __nccwpck_require__(7178);
const AssociateCustomDomainCommand_1 = __nccwpck_require__(7559);
const CreateAutoScalingConfigurationCommand_1 = __nccwpck_require__(9317);
const CreateConnectionCommand_1 = __nccwpck_require__(9011);
const CreateObservabilityConfigurationCommand_1 = __nccwpck_require__(8262);
const CreateServiceCommand_1 = __nccwpck_require__(4051);
const CreateVpcConnectorCommand_1 = __nccwpck_require__(6640);
const CreateVpcIngressConnectionCommand_1 = __nccwpck_require__(6530);
const DeleteAutoScalingConfigurationCommand_1 = __nccwpck_require__(2870);
const DeleteConnectionCommand_1 = __nccwpck_require__(4353);
const DeleteObservabilityConfigurationCommand_1 = __nccwpck_require__(2646);
const DeleteServiceCommand_1 = __nccwpck_require__(3242);
const DeleteVpcConnectorCommand_1 = __nccwpck_require__(7095);
const DeleteVpcIngressConnectionCommand_1 = __nccwpck_require__(6045);
const DescribeAutoScalingConfigurationCommand_1 = __nccwpck_require__(6963);
const DescribeCustomDomainsCommand_1 = __nccwpck_require__(5901);
const DescribeObservabilityConfigurationCommand_1 = __nccwpck_require__(7324);
const DescribeServiceCommand_1 = __nccwpck_require__(70);
const DescribeVpcConnectorCommand_1 = __nccwpck_require__(8176);
const DescribeVpcIngressConnectionCommand_1 = __nccwpck_require__(9260);
const DisassociateCustomDomainCommand_1 = __nccwpck_require__(1141);
const ListAutoScalingConfigurationsCommand_1 = __nccwpck_require__(5337);
const ListConnectionsCommand_1 = __nccwpck_require__(9495);
const ListObservabilityConfigurationsCommand_1 = __nccwpck_require__(7610);
const ListOperationsCommand_1 = __nccwpck_require__(7643);
const ListServicesCommand_1 = __nccwpck_require__(4070);
const ListTagsForResourceCommand_1 = __nccwpck_require__(9736);
const ListVpcConnectorsCommand_1 = __nccwpck_require__(1924);
const ListVpcIngressConnectionsCommand_1 = __nccwpck_require__(2811);
const PauseServiceCommand_1 = __nccwpck_require__(4929);
const ResumeServiceCommand_1 = __nccwpck_require__(984);
const StartDeploymentCommand_1 = __nccwpck_require__(9025);
const TagResourceCommand_1 = __nccwpck_require__(4027);
const UntagResourceCommand_1 = __nccwpck_require__(4061);
const UpdateServiceCommand_1 = __nccwpck_require__(5562);
const UpdateVpcIngressConnectionCommand_1 = __nccwpck_require__(9456);
class AppRunner extends AppRunnerClient_1.AppRunnerClient {
    associateCustomDomain(args, optionsOrCb, cb) {
        const command = new AssociateCustomDomainCommand_1.AssociateCustomDomainCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    createAutoScalingConfiguration(args, optionsOrCb, cb) {
        const command = new CreateAutoScalingConfigurationCommand_1.CreateAutoScalingConfigurationCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    createConnection(args, optionsOrCb, cb) {
        const command = new CreateConnectionCommand_1.CreateConnectionCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    createObservabilityConfiguration(args, optionsOrCb, cb) {
        const command = new CreateObservabilityConfigurationCommand_1.CreateObservabilityConfigurationCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    createService(args, optionsOrCb, cb) {
        const command = new CreateServiceCommand_1.CreateServiceCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    createVpcConnector(args, optionsOrCb, cb) {
        const command = new CreateVpcConnectorCommand_1.CreateVpcConnectorCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    createVpcIngressConnection(args, optionsOrCb, cb) {
        const command = new CreateVpcIngressConnectionCommand_1.CreateVpcIngressConnectionCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    deleteAutoScalingConfiguration(args, optionsOrCb, cb) {
        const command = new DeleteAutoScalingConfigurationCommand_1.DeleteAutoScalingConfigurationCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    deleteConnection(args, optionsOrCb, cb) {
        const command = new DeleteConnectionCommand_1.DeleteConnectionCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    deleteObservabilityConfiguration(args, optionsOrCb, cb) {
        const command = new DeleteObservabilityConfigurationCommand_1.DeleteObservabilityConfigurationCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    deleteService(args, optionsOrCb, cb) {
        const command = new DeleteServiceCommand_1.DeleteServiceCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    deleteVpcConnector(args, optionsOrCb, cb) {
        const command = new DeleteVpcConnectorCommand_1.DeleteVpcConnectorCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    deleteVpcIngressConnection(args, optionsOrCb, cb) {
        const command = new DeleteVpcIngressConnectionCommand_1.DeleteVpcIngressConnectionCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    describeAutoScalingConfiguration(args, optionsOrCb, cb) {
        const command = new DescribeAutoScalingConfigurationCommand_1.DescribeAutoScalingConfigurationCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    describeCustomDomains(args, optionsOrCb, cb) {
        const command = new DescribeCustomDomainsCommand_1.DescribeCustomDomainsCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    describeObservabilityConfiguration(args, optionsOrCb, cb) {
        const command = new DescribeObservabilityConfigurationCommand_1.DescribeObservabilityConfigurationCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    describeService(args, optionsOrCb, cb) {
        const command = new DescribeServiceCommand_1.DescribeServiceCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    describeVpcConnector(args, optionsOrCb, cb) {
        const command = new DescribeVpcConnectorCommand_1.DescribeVpcConnectorCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    describeVpcIngressConnection(args, optionsOrCb, cb) {
        const command = new DescribeVpcIngressConnectionCommand_1.DescribeVpcIngressConnectionCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    disassociateCustomDomain(args, optionsOrCb, cb) {
        const command = new DisassociateCustomDomainCommand_1.DisassociateCustomDomainCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    listAutoScalingConfigurations(args, optionsOrCb, cb) {
        const command = new ListAutoScalingConfigurationsCommand_1.ListAutoScalingConfigurationsCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    listConnections(args, optionsOrCb, cb) {
        const command = new ListConnectionsCommand_1.ListConnectionsCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    listObservabilityConfigurations(args, optionsOrCb, cb) {
        const command = new ListObservabilityConfigurationsCommand_1.ListObservabilityConfigurationsCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    listOperations(args, optionsOrCb, cb) {
        const command = new ListOperationsCommand_1.ListOperationsCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    listServices(args, optionsOrCb, cb) {
        const command = new ListServicesCommand_1.ListServicesCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    listTagsForResource(args, optionsOrCb, cb) {
        const command = new ListTagsForResourceCommand_1.ListTagsForResourceCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    listVpcConnectors(args, optionsOrCb, cb) {
        const command = new ListVpcConnectorsCommand_1.ListVpcConnectorsCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    listVpcIngressConnections(args, optionsOrCb, cb) {
        const command = new ListVpcIngressConnectionsCommand_1.ListVpcIngressConnectionsCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    pauseService(args, optionsOrCb, cb) {
        const command = new PauseServiceCommand_1.PauseServiceCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    resumeService(args, optionsOrCb, cb) {
        const command = new ResumeServiceCommand_1.ResumeServiceCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    startDeployment(args, optionsOrCb, cb) {
        const command = new StartDeploymentCommand_1.StartDeploymentCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    tagResource(args, optionsOrCb, cb) {
        const command = new TagResourceCommand_1.TagResourceCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    untagResource(args, optionsOrCb, cb) {
        const command = new UntagResourceCommand_1.UntagResourceCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    updateService(args, optionsOrCb, cb) {
        const command = new UpdateServiceCommand_1.UpdateServiceCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    updateVpcIngressConnection(args, optionsOrCb, cb) {
        const command = new UpdateVpcIngressConnectionCommand_1.UpdateVpcIngressConnectionCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
}
exports.AppRunner = AppRunner;


/***/ }),

/***/ 7178:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppRunnerClient = void 0;
const config_resolver_1 = __nccwpck_require__(6153);
const middleware_content_length_1 = __nccwpck_require__(2245);
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_host_header_1 = __nccwpck_require__(2545);
const middleware_logger_1 = __nccwpck_require__(14);
const middleware_recursion_detection_1 = __nccwpck_require__(5525);
const middleware_retry_1 = __nccwpck_require__(6064);
const middleware_signing_1 = __nccwpck_require__(4935);
const middleware_user_agent_1 = __nccwpck_require__(4688);
const smithy_client_1 = __nccwpck_require__(4963);
const EndpointParameters_1 = __nccwpck_require__(5690);
const runtimeConfig_1 = __nccwpck_require__(9930);
class AppRunnerClient extends smithy_client_1.Client {
    constructor(configuration) {
        const _config_0 = (0, runtimeConfig_1.getRuntimeConfig)(configuration);
        const _config_1 = (0, EndpointParameters_1.resolveClientEndpointParameters)(_config_0);
        const _config_2 = (0, config_resolver_1.resolveRegionConfig)(_config_1);
        const _config_3 = (0, middleware_endpoint_1.resolveEndpointConfig)(_config_2);
        const _config_4 = (0, middleware_retry_1.resolveRetryConfig)(_config_3);
        const _config_5 = (0, middleware_host_header_1.resolveHostHeaderConfig)(_config_4);
        const _config_6 = (0, middleware_signing_1.resolveAwsAuthConfig)(_config_5);
        const _config_7 = (0, middleware_user_agent_1.resolveUserAgentConfig)(_config_6);
        super(_config_7);
        this.config = _config_7;
        this.middlewareStack.use((0, middleware_retry_1.getRetryPlugin)(this.config));
        this.middlewareStack.use((0, middleware_content_length_1.getContentLengthPlugin)(this.config));
        this.middlewareStack.use((0, middleware_host_header_1.getHostHeaderPlugin)(this.config));
        this.middlewareStack.use((0, middleware_logger_1.getLoggerPlugin)(this.config));
        this.middlewareStack.use((0, middleware_recursion_detection_1.getRecursionDetectionPlugin)(this.config));
        this.middlewareStack.use((0, middleware_signing_1.getAwsAuthPlugin)(this.config));
        this.middlewareStack.use((0, middleware_user_agent_1.getUserAgentPlugin)(this.config));
    }
    destroy() {
        super.destroy();
    }
}
exports.AppRunnerClient = AppRunnerClient;


/***/ }),

/***/ 7559:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssociateCustomDomainCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class AssociateCustomDomainCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, AssociateCustomDomainCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "AssociateCustomDomainCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_AssociateCustomDomainCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_AssociateCustomDomainCommand)(output, context);
    }
}
exports.AssociateCustomDomainCommand = AssociateCustomDomainCommand;


/***/ }),

/***/ 9317:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAutoScalingConfigurationCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class CreateAutoScalingConfigurationCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, CreateAutoScalingConfigurationCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "CreateAutoScalingConfigurationCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_CreateAutoScalingConfigurationCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_CreateAutoScalingConfigurationCommand)(output, context);
    }
}
exports.CreateAutoScalingConfigurationCommand = CreateAutoScalingConfigurationCommand;


/***/ }),

/***/ 9011:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateConnectionCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class CreateConnectionCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, CreateConnectionCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "CreateConnectionCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_CreateConnectionCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_CreateConnectionCommand)(output, context);
    }
}
exports.CreateConnectionCommand = CreateConnectionCommand;


/***/ }),

/***/ 8262:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateObservabilityConfigurationCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class CreateObservabilityConfigurationCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, CreateObservabilityConfigurationCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "CreateObservabilityConfigurationCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_CreateObservabilityConfigurationCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_CreateObservabilityConfigurationCommand)(output, context);
    }
}
exports.CreateObservabilityConfigurationCommand = CreateObservabilityConfigurationCommand;


/***/ }),

/***/ 4051:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateServiceCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const models_0_1 = __nccwpck_require__(5133);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class CreateServiceCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, CreateServiceCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "CreateServiceCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.CreateServiceRequestFilterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.CreateServiceResponseFilterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_CreateServiceCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_CreateServiceCommand)(output, context);
    }
}
exports.CreateServiceCommand = CreateServiceCommand;


/***/ }),

/***/ 6640:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateVpcConnectorCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class CreateVpcConnectorCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, CreateVpcConnectorCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "CreateVpcConnectorCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_CreateVpcConnectorCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_CreateVpcConnectorCommand)(output, context);
    }
}
exports.CreateVpcConnectorCommand = CreateVpcConnectorCommand;


/***/ }),

/***/ 6530:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateVpcIngressConnectionCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class CreateVpcIngressConnectionCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, CreateVpcIngressConnectionCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "CreateVpcIngressConnectionCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_CreateVpcIngressConnectionCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_CreateVpcIngressConnectionCommand)(output, context);
    }
}
exports.CreateVpcIngressConnectionCommand = CreateVpcIngressConnectionCommand;


/***/ }),

/***/ 2870:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteAutoScalingConfigurationCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class DeleteAutoScalingConfigurationCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, DeleteAutoScalingConfigurationCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "DeleteAutoScalingConfigurationCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_DeleteAutoScalingConfigurationCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_DeleteAutoScalingConfigurationCommand)(output, context);
    }
}
exports.DeleteAutoScalingConfigurationCommand = DeleteAutoScalingConfigurationCommand;


/***/ }),

/***/ 4353:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteConnectionCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class DeleteConnectionCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, DeleteConnectionCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "DeleteConnectionCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_DeleteConnectionCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_DeleteConnectionCommand)(output, context);
    }
}
exports.DeleteConnectionCommand = DeleteConnectionCommand;


/***/ }),

/***/ 2646:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteObservabilityConfigurationCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class DeleteObservabilityConfigurationCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, DeleteObservabilityConfigurationCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "DeleteObservabilityConfigurationCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_DeleteObservabilityConfigurationCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_DeleteObservabilityConfigurationCommand)(output, context);
    }
}
exports.DeleteObservabilityConfigurationCommand = DeleteObservabilityConfigurationCommand;


/***/ }),

/***/ 3242:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteServiceCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const models_0_1 = __nccwpck_require__(5133);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class DeleteServiceCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, DeleteServiceCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "DeleteServiceCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: models_0_1.DeleteServiceResponseFilterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_DeleteServiceCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_DeleteServiceCommand)(output, context);
    }
}
exports.DeleteServiceCommand = DeleteServiceCommand;


/***/ }),

/***/ 7095:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteVpcConnectorCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class DeleteVpcConnectorCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, DeleteVpcConnectorCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "DeleteVpcConnectorCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_DeleteVpcConnectorCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_DeleteVpcConnectorCommand)(output, context);
    }
}
exports.DeleteVpcConnectorCommand = DeleteVpcConnectorCommand;


/***/ }),

/***/ 6045:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteVpcIngressConnectionCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class DeleteVpcIngressConnectionCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, DeleteVpcIngressConnectionCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "DeleteVpcIngressConnectionCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_DeleteVpcIngressConnectionCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_DeleteVpcIngressConnectionCommand)(output, context);
    }
}
exports.DeleteVpcIngressConnectionCommand = DeleteVpcIngressConnectionCommand;


/***/ }),

/***/ 6963:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DescribeAutoScalingConfigurationCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class DescribeAutoScalingConfigurationCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, DescribeAutoScalingConfigurationCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "DescribeAutoScalingConfigurationCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_DescribeAutoScalingConfigurationCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_DescribeAutoScalingConfigurationCommand)(output, context);
    }
}
exports.DescribeAutoScalingConfigurationCommand = DescribeAutoScalingConfigurationCommand;


/***/ }),

/***/ 5901:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DescribeCustomDomainsCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class DescribeCustomDomainsCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, DescribeCustomDomainsCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "DescribeCustomDomainsCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_DescribeCustomDomainsCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_DescribeCustomDomainsCommand)(output, context);
    }
}
exports.DescribeCustomDomainsCommand = DescribeCustomDomainsCommand;


/***/ }),

/***/ 7324:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DescribeObservabilityConfigurationCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class DescribeObservabilityConfigurationCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, DescribeObservabilityConfigurationCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "DescribeObservabilityConfigurationCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_DescribeObservabilityConfigurationCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_DescribeObservabilityConfigurationCommand)(output, context);
    }
}
exports.DescribeObservabilityConfigurationCommand = DescribeObservabilityConfigurationCommand;


/***/ }),

/***/ 70:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DescribeServiceCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const models_0_1 = __nccwpck_require__(5133);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class DescribeServiceCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, DescribeServiceCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "DescribeServiceCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: models_0_1.DescribeServiceResponseFilterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_DescribeServiceCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_DescribeServiceCommand)(output, context);
    }
}
exports.DescribeServiceCommand = DescribeServiceCommand;


/***/ }),

/***/ 8176:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DescribeVpcConnectorCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class DescribeVpcConnectorCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, DescribeVpcConnectorCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "DescribeVpcConnectorCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_DescribeVpcConnectorCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_DescribeVpcConnectorCommand)(output, context);
    }
}
exports.DescribeVpcConnectorCommand = DescribeVpcConnectorCommand;


/***/ }),

/***/ 9260:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DescribeVpcIngressConnectionCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class DescribeVpcIngressConnectionCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, DescribeVpcIngressConnectionCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "DescribeVpcIngressConnectionCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_DescribeVpcIngressConnectionCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_DescribeVpcIngressConnectionCommand)(output, context);
    }
}
exports.DescribeVpcIngressConnectionCommand = DescribeVpcIngressConnectionCommand;


/***/ }),

/***/ 1141:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DisassociateCustomDomainCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class DisassociateCustomDomainCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, DisassociateCustomDomainCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "DisassociateCustomDomainCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_DisassociateCustomDomainCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_DisassociateCustomDomainCommand)(output, context);
    }
}
exports.DisassociateCustomDomainCommand = DisassociateCustomDomainCommand;


/***/ }),

/***/ 5337:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListAutoScalingConfigurationsCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class ListAutoScalingConfigurationsCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, ListAutoScalingConfigurationsCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "ListAutoScalingConfigurationsCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_ListAutoScalingConfigurationsCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_ListAutoScalingConfigurationsCommand)(output, context);
    }
}
exports.ListAutoScalingConfigurationsCommand = ListAutoScalingConfigurationsCommand;


/***/ }),

/***/ 9495:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListConnectionsCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class ListConnectionsCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, ListConnectionsCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "ListConnectionsCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_ListConnectionsCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_ListConnectionsCommand)(output, context);
    }
}
exports.ListConnectionsCommand = ListConnectionsCommand;


/***/ }),

/***/ 7610:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListObservabilityConfigurationsCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class ListObservabilityConfigurationsCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, ListObservabilityConfigurationsCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "ListObservabilityConfigurationsCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_ListObservabilityConfigurationsCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_ListObservabilityConfigurationsCommand)(output, context);
    }
}
exports.ListObservabilityConfigurationsCommand = ListObservabilityConfigurationsCommand;


/***/ }),

/***/ 7643:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListOperationsCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class ListOperationsCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, ListOperationsCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "ListOperationsCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_ListOperationsCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_ListOperationsCommand)(output, context);
    }
}
exports.ListOperationsCommand = ListOperationsCommand;


/***/ }),

/***/ 4070:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListServicesCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class ListServicesCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, ListServicesCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "ListServicesCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_ListServicesCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_ListServicesCommand)(output, context);
    }
}
exports.ListServicesCommand = ListServicesCommand;


/***/ }),

/***/ 9736:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListTagsForResourceCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class ListTagsForResourceCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, ListTagsForResourceCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "ListTagsForResourceCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_ListTagsForResourceCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_ListTagsForResourceCommand)(output, context);
    }
}
exports.ListTagsForResourceCommand = ListTagsForResourceCommand;


/***/ }),

/***/ 1924:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListVpcConnectorsCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class ListVpcConnectorsCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, ListVpcConnectorsCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "ListVpcConnectorsCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_ListVpcConnectorsCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_ListVpcConnectorsCommand)(output, context);
    }
}
exports.ListVpcConnectorsCommand = ListVpcConnectorsCommand;


/***/ }),

/***/ 2811:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListVpcIngressConnectionsCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class ListVpcIngressConnectionsCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, ListVpcIngressConnectionsCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "ListVpcIngressConnectionsCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_ListVpcIngressConnectionsCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_ListVpcIngressConnectionsCommand)(output, context);
    }
}
exports.ListVpcIngressConnectionsCommand = ListVpcIngressConnectionsCommand;


/***/ }),

/***/ 4929:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PauseServiceCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const models_0_1 = __nccwpck_require__(5133);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class PauseServiceCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, PauseServiceCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "PauseServiceCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: models_0_1.PauseServiceResponseFilterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_PauseServiceCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_PauseServiceCommand)(output, context);
    }
}
exports.PauseServiceCommand = PauseServiceCommand;


/***/ }),

/***/ 984:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResumeServiceCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const models_0_1 = __nccwpck_require__(5133);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class ResumeServiceCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, ResumeServiceCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "ResumeServiceCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: models_0_1.ResumeServiceResponseFilterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_ResumeServiceCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_ResumeServiceCommand)(output, context);
    }
}
exports.ResumeServiceCommand = ResumeServiceCommand;


/***/ }),

/***/ 9025:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StartDeploymentCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class StartDeploymentCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, StartDeploymentCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "StartDeploymentCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_StartDeploymentCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_StartDeploymentCommand)(output, context);
    }
}
exports.StartDeploymentCommand = StartDeploymentCommand;


/***/ }),

/***/ 4027:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TagResourceCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class TagResourceCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, TagResourceCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "TagResourceCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_TagResourceCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_TagResourceCommand)(output, context);
    }
}
exports.TagResourceCommand = TagResourceCommand;


/***/ }),

/***/ 4061:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UntagResourceCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class UntagResourceCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, UntagResourceCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "UntagResourceCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_UntagResourceCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_UntagResourceCommand)(output, context);
    }
}
exports.UntagResourceCommand = UntagResourceCommand;


/***/ }),

/***/ 5562:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateServiceCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const models_0_1 = __nccwpck_require__(5133);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class UpdateServiceCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, UpdateServiceCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "UpdateServiceCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.UpdateServiceRequestFilterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.UpdateServiceResponseFilterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_UpdateServiceCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_UpdateServiceCommand)(output, context);
    }
}
exports.UpdateServiceCommand = UpdateServiceCommand;


/***/ }),

/***/ 9456:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateVpcIngressConnectionCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_json1_0_1 = __nccwpck_require__(5406);
class UpdateVpcIngressConnectionCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, UpdateVpcIngressConnectionCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "AppRunnerClient";
        const commandName = "UpdateVpcIngressConnectionCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_json1_0_1.se_UpdateVpcIngressConnectionCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_json1_0_1.de_UpdateVpcIngressConnectionCommand)(output, context);
    }
}
exports.UpdateVpcIngressConnectionCommand = UpdateVpcIngressConnectionCommand;


/***/ }),

/***/ 6086:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(7559), exports);
tslib_1.__exportStar(__nccwpck_require__(9317), exports);
tslib_1.__exportStar(__nccwpck_require__(9011), exports);
tslib_1.__exportStar(__nccwpck_require__(8262), exports);
tslib_1.__exportStar(__nccwpck_require__(4051), exports);
tslib_1.__exportStar(__nccwpck_require__(6640), exports);
tslib_1.__exportStar(__nccwpck_require__(6530), exports);
tslib_1.__exportStar(__nccwpck_require__(2870), exports);
tslib_1.__exportStar(__nccwpck_require__(4353), exports);
tslib_1.__exportStar(__nccwpck_require__(2646), exports);
tslib_1.__exportStar(__nccwpck_require__(3242), exports);
tslib_1.__exportStar(__nccwpck_require__(7095), exports);
tslib_1.__exportStar(__nccwpck_require__(6045), exports);
tslib_1.__exportStar(__nccwpck_require__(6963), exports);
tslib_1.__exportStar(__nccwpck_require__(5901), exports);
tslib_1.__exportStar(__nccwpck_require__(7324), exports);
tslib_1.__exportStar(__nccwpck_require__(70), exports);
tslib_1.__exportStar(__nccwpck_require__(8176), exports);
tslib_1.__exportStar(__nccwpck_require__(9260), exports);
tslib_1.__exportStar(__nccwpck_require__(1141), exports);
tslib_1.__exportStar(__nccwpck_require__(5337), exports);
tslib_1.__exportStar(__nccwpck_require__(9495), exports);
tslib_1.__exportStar(__nccwpck_require__(7610), exports);
tslib_1.__exportStar(__nccwpck_require__(7643), exports);
tslib_1.__exportStar(__nccwpck_require__(4070), exports);
tslib_1.__exportStar(__nccwpck_require__(9736), exports);
tslib_1.__exportStar(__nccwpck_require__(1924), exports);
tslib_1.__exportStar(__nccwpck_require__(2811), exports);
tslib_1.__exportStar(__nccwpck_require__(4929), exports);
tslib_1.__exportStar(__nccwpck_require__(984), exports);
tslib_1.__exportStar(__nccwpck_require__(9025), exports);
tslib_1.__exportStar(__nccwpck_require__(4027), exports);
tslib_1.__exportStar(__nccwpck_require__(4061), exports);
tslib_1.__exportStar(__nccwpck_require__(5562), exports);
tslib_1.__exportStar(__nccwpck_require__(9456), exports);


/***/ }),

/***/ 5690:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveClientEndpointParameters = void 0;
const resolveClientEndpointParameters = (options) => {
    return {
        ...options,
        useDualstackEndpoint: options.useDualstackEndpoint ?? false,
        useFipsEndpoint: options.useFipsEndpoint ?? false,
        defaultSigningName: "apprunner",
    };
};
exports.resolveClientEndpointParameters = resolveClientEndpointParameters;


/***/ }),

/***/ 1454:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultEndpointResolver = void 0;
const util_endpoints_1 = __nccwpck_require__(3350);
const ruleset_1 = __nccwpck_require__(8361);
const defaultEndpointResolver = (endpointParams, context = {}) => {
    return (0, util_endpoints_1.resolveEndpoint)(ruleset_1.ruleSet, {
        endpointParams: endpointParams,
        logger: context.logger,
    });
};
exports.defaultEndpointResolver = defaultEndpointResolver;


/***/ }),

/***/ 8361:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ruleSet = void 0;
const q = "required", r = "fn", s = "argv", t = "ref";
const a = "isSet", b = "tree", c = "error", d = "endpoint", e = "PartitionResult", f = { [q]: false, "type": "String" }, g = { [q]: true, "default": false, "type": "Boolean" }, h = { [t]: "Endpoint" }, i = { [r]: "booleanEquals", [s]: [{ [t]: "UseFIPS" }, true] }, j = { [r]: "booleanEquals", [s]: [{ [t]: "UseDualStack" }, true] }, k = {}, l = { [r]: "booleanEquals", [s]: [true, { [r]: "getAttr", [s]: [{ [t]: e }, "supportsFIPS"] }] }, m = { [r]: "booleanEquals", [s]: [true, { [r]: "getAttr", [s]: [{ [t]: e }, "supportsDualStack"] }] }, n = [i], o = [j], p = [{ [t]: "Region" }];
const _data = { version: "1.0", parameters: { Region: f, UseDualStack: g, UseFIPS: g, Endpoint: f }, rules: [{ conditions: [{ [r]: a, [s]: [h] }], type: b, rules: [{ conditions: n, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: c }, { type: b, rules: [{ conditions: o, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: c }, { endpoint: { url: h, properties: k, headers: k }, type: d }] }] }, { type: b, rules: [{ conditions: [{ [r]: a, [s]: p }], type: b, rules: [{ conditions: [{ [r]: "aws.partition", [s]: p, assign: e }], type: b, rules: [{ conditions: [i, j], type: b, rules: [{ conditions: [l, m], type: b, rules: [{ type: b, rules: [{ endpoint: { url: "https://apprunner-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: k, headers: k }, type: d }] }] }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: c }] }, { conditions: n, type: b, rules: [{ conditions: [l], type: b, rules: [{ type: b, rules: [{ endpoint: { url: "https://apprunner-fips.{Region}.{PartitionResult#dnsSuffix}", properties: k, headers: k }, type: d }] }] }, { error: "FIPS is enabled but this partition does not support FIPS", type: c }] }, { conditions: o, type: b, rules: [{ conditions: [m], type: b, rules: [{ type: b, rules: [{ endpoint: { url: "https://apprunner.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: k, headers: k }, type: d }] }] }, { error: "DualStack is enabled but this partition does not support DualStack", type: c }] }, { type: b, rules: [{ endpoint: { url: "https://apprunner.{Region}.{PartitionResult#dnsSuffix}", properties: k, headers: k }, type: d }] }] }] }, { error: "Invalid Configuration: Missing Region", type: c }] }] };
exports.ruleSet = _data;


/***/ }),

/***/ 3503:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppRunnerServiceException = void 0;
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(647), exports);
tslib_1.__exportStar(__nccwpck_require__(7178), exports);
tslib_1.__exportStar(__nccwpck_require__(6086), exports);
tslib_1.__exportStar(__nccwpck_require__(6433), exports);
tslib_1.__exportStar(__nccwpck_require__(995), exports);
var AppRunnerServiceException_1 = __nccwpck_require__(6103);
Object.defineProperty(exports, "AppRunnerServiceException", ({ enumerable: true, get: function () { return AppRunnerServiceException_1.AppRunnerServiceException; } }));


/***/ }),

/***/ 6103:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppRunnerServiceException = void 0;
const smithy_client_1 = __nccwpck_require__(4963);
class AppRunnerServiceException extends smithy_client_1.ServiceException {
    constructor(options) {
        super(options);
        Object.setPrototypeOf(this, AppRunnerServiceException.prototype);
    }
}
exports.AppRunnerServiceException = AppRunnerServiceException;


/***/ }),

/***/ 6433:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(5133), exports);


/***/ }),

/***/ 5133:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateServiceResponseFilterSensitiveLog = exports.UpdateServiceRequestFilterSensitiveLog = exports.ResumeServiceResponseFilterSensitiveLog = exports.PauseServiceResponseFilterSensitiveLog = exports.DescribeServiceResponseFilterSensitiveLog = exports.DeleteServiceResponseFilterSensitiveLog = exports.CreateServiceResponseFilterSensitiveLog = exports.ServiceFilterSensitiveLog = exports.CreateServiceRequestFilterSensitiveLog = exports.SourceConfigurationFilterSensitiveLog = exports.ImageRepositoryFilterSensitiveLog = exports.ImageConfigurationFilterSensitiveLog = exports.CodeRepositoryFilterSensitiveLog = exports.CodeConfigurationFilterSensitiveLog = exports.CodeConfigurationValuesFilterSensitiveLog = exports.OperationType = exports.OperationStatus = exports.ResourceNotFoundException = exports.VpcIngressConnectionStatus = exports.VpcConnectorStatus = exports.ServiceStatus = exports.ImageRepositoryType = exports.SourceCodeVersionType = exports.ConfigurationSource = exports.Runtime = exports.EgressType = exports.HealthCheckProtocol = exports.ObservabilityConfigurationStatus = exports.TracingVendor = exports.ConnectionStatus = exports.ProviderType = exports.ServiceQuotaExceededException = exports.AutoScalingConfigurationStatus = exports.InvalidStateException = exports.InvalidRequestException = exports.InternalServiceErrorException = exports.CustomDomainAssociationStatus = exports.CertificateValidationRecordStatus = void 0;
const smithy_client_1 = __nccwpck_require__(4963);
const AppRunnerServiceException_1 = __nccwpck_require__(6103);
exports.CertificateValidationRecordStatus = {
    FAILED: "FAILED",
    PENDING_VALIDATION: "PENDING_VALIDATION",
    SUCCESS: "SUCCESS",
};
exports.CustomDomainAssociationStatus = {
    ACTIVE: "ACTIVE",
    BINDING_CERTIFICATE: "BINDING_CERTIFICATE",
    CREATE_FAILED: "CREATE_FAILED",
    CREATING: "CREATING",
    DELETE_FAILED: "DELETE_FAILED",
    DELETING: "DELETING",
    PENDING_CERTIFICATE_DNS_VALIDATION: "PENDING_CERTIFICATE_DNS_VALIDATION",
};
class InternalServiceErrorException extends AppRunnerServiceException_1.AppRunnerServiceException {
    constructor(opts) {
        super({
            name: "InternalServiceErrorException",
            $fault: "server",
            ...opts,
        });
        this.name = "InternalServiceErrorException";
        this.$fault = "server";
        Object.setPrototypeOf(this, InternalServiceErrorException.prototype);
        this.Message = opts.Message;
    }
}
exports.InternalServiceErrorException = InternalServiceErrorException;
class InvalidRequestException extends AppRunnerServiceException_1.AppRunnerServiceException {
    constructor(opts) {
        super({
            name: "InvalidRequestException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidRequestException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidRequestException.prototype);
        this.Message = opts.Message;
    }
}
exports.InvalidRequestException = InvalidRequestException;
class InvalidStateException extends AppRunnerServiceException_1.AppRunnerServiceException {
    constructor(opts) {
        super({
            name: "InvalidStateException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidStateException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidStateException.prototype);
        this.Message = opts.Message;
    }
}
exports.InvalidStateException = InvalidStateException;
exports.AutoScalingConfigurationStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
};
class ServiceQuotaExceededException extends AppRunnerServiceException_1.AppRunnerServiceException {
    constructor(opts) {
        super({
            name: "ServiceQuotaExceededException",
            $fault: "client",
            ...opts,
        });
        this.name = "ServiceQuotaExceededException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ServiceQuotaExceededException.prototype);
        this.Message = opts.Message;
    }
}
exports.ServiceQuotaExceededException = ServiceQuotaExceededException;
exports.ProviderType = {
    GITHUB: "GITHUB",
};
exports.ConnectionStatus = {
    AVAILABLE: "AVAILABLE",
    DELETED: "DELETED",
    ERROR: "ERROR",
    PENDING_HANDSHAKE: "PENDING_HANDSHAKE",
};
exports.TracingVendor = {
    AWSXRAY: "AWSXRAY",
};
exports.ObservabilityConfigurationStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
};
exports.HealthCheckProtocol = {
    HTTP: "HTTP",
    TCP: "TCP",
};
exports.EgressType = {
    DEFAULT: "DEFAULT",
    VPC: "VPC",
};
exports.Runtime = {
    CORRETTO_11: "CORRETTO_11",
    CORRETTO_8: "CORRETTO_8",
    DOTNET_6: "DOTNET_6",
    GO_1: "GO_1",
    NODEJS_12: "NODEJS_12",
    NODEJS_14: "NODEJS_14",
    NODEJS_16: "NODEJS_16",
    PHP_81: "PHP_81",
    PYTHON_3: "PYTHON_3",
    RUBY_31: "RUBY_31",
};
exports.ConfigurationSource = {
    API: "API",
    REPOSITORY: "REPOSITORY",
};
exports.SourceCodeVersionType = {
    BRANCH: "BRANCH",
};
exports.ImageRepositoryType = {
    ECR: "ECR",
    ECR_PUBLIC: "ECR_PUBLIC",
};
exports.ServiceStatus = {
    CREATE_FAILED: "CREATE_FAILED",
    DELETED: "DELETED",
    DELETE_FAILED: "DELETE_FAILED",
    OPERATION_IN_PROGRESS: "OPERATION_IN_PROGRESS",
    PAUSED: "PAUSED",
    RUNNING: "RUNNING",
};
exports.VpcConnectorStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
};
exports.VpcIngressConnectionStatus = {
    AVAILABLE: "AVAILABLE",
    DELETED: "DELETED",
    FAILED_CREATION: "FAILED_CREATION",
    FAILED_DELETION: "FAILED_DELETION",
    FAILED_UPDATE: "FAILED_UPDATE",
    PENDING_CREATION: "PENDING_CREATION",
    PENDING_DELETION: "PENDING_DELETION",
    PENDING_UPDATE: "PENDING_UPDATE",
};
class ResourceNotFoundException extends AppRunnerServiceException_1.AppRunnerServiceException {
    constructor(opts) {
        super({
            name: "ResourceNotFoundException",
            $fault: "client",
            ...opts,
        });
        this.name = "ResourceNotFoundException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
        this.Message = opts.Message;
    }
}
exports.ResourceNotFoundException = ResourceNotFoundException;
exports.OperationStatus = {
    FAILED: "FAILED",
    IN_PROGRESS: "IN_PROGRESS",
    PENDING: "PENDING",
    ROLLBACK_FAILED: "ROLLBACK_FAILED",
    ROLLBACK_IN_PROGRESS: "ROLLBACK_IN_PROGRESS",
    ROLLBACK_SUCCEEDED: "ROLLBACK_SUCCEEDED",
    SUCCEEDED: "SUCCEEDED",
};
exports.OperationType = {
    CREATE_SERVICE: "CREATE_SERVICE",
    DELETE_SERVICE: "DELETE_SERVICE",
    PAUSE_SERVICE: "PAUSE_SERVICE",
    RESUME_SERVICE: "RESUME_SERVICE",
    START_DEPLOYMENT: "START_DEPLOYMENT",
    UPDATE_SERVICE: "UPDATE_SERVICE",
};
const CodeConfigurationValuesFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.BuildCommand && { BuildCommand: smithy_client_1.SENSITIVE_STRING }),
    ...(obj.StartCommand && { StartCommand: smithy_client_1.SENSITIVE_STRING }),
    ...(obj.RuntimeEnvironmentVariables && { RuntimeEnvironmentVariables: smithy_client_1.SENSITIVE_STRING }),
    ...(obj.RuntimeEnvironmentSecrets && { RuntimeEnvironmentSecrets: smithy_client_1.SENSITIVE_STRING }),
});
exports.CodeConfigurationValuesFilterSensitiveLog = CodeConfigurationValuesFilterSensitiveLog;
const CodeConfigurationFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.CodeConfigurationValues && {
        CodeConfigurationValues: (0, exports.CodeConfigurationValuesFilterSensitiveLog)(obj.CodeConfigurationValues),
    }),
});
exports.CodeConfigurationFilterSensitiveLog = CodeConfigurationFilterSensitiveLog;
const CodeRepositoryFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.CodeConfiguration && { CodeConfiguration: (0, exports.CodeConfigurationFilterSensitiveLog)(obj.CodeConfiguration) }),
});
exports.CodeRepositoryFilterSensitiveLog = CodeRepositoryFilterSensitiveLog;
const ImageConfigurationFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.RuntimeEnvironmentVariables && { RuntimeEnvironmentVariables: smithy_client_1.SENSITIVE_STRING }),
    ...(obj.StartCommand && { StartCommand: smithy_client_1.SENSITIVE_STRING }),
    ...(obj.RuntimeEnvironmentSecrets && { RuntimeEnvironmentSecrets: smithy_client_1.SENSITIVE_STRING }),
});
exports.ImageConfigurationFilterSensitiveLog = ImageConfigurationFilterSensitiveLog;
const ImageRepositoryFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.ImageConfiguration && { ImageConfiguration: (0, exports.ImageConfigurationFilterSensitiveLog)(obj.ImageConfiguration) }),
});
exports.ImageRepositoryFilterSensitiveLog = ImageRepositoryFilterSensitiveLog;
const SourceConfigurationFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.CodeRepository && { CodeRepository: (0, exports.CodeRepositoryFilterSensitiveLog)(obj.CodeRepository) }),
    ...(obj.ImageRepository && { ImageRepository: (0, exports.ImageRepositoryFilterSensitiveLog)(obj.ImageRepository) }),
});
exports.SourceConfigurationFilterSensitiveLog = SourceConfigurationFilterSensitiveLog;
const CreateServiceRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.SourceConfiguration && {
        SourceConfiguration: (0, exports.SourceConfigurationFilterSensitiveLog)(obj.SourceConfiguration),
    }),
});
exports.CreateServiceRequestFilterSensitiveLog = CreateServiceRequestFilterSensitiveLog;
const ServiceFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.SourceConfiguration && {
        SourceConfiguration: (0, exports.SourceConfigurationFilterSensitiveLog)(obj.SourceConfiguration),
    }),
});
exports.ServiceFilterSensitiveLog = ServiceFilterSensitiveLog;
const CreateServiceResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Service && { Service: (0, exports.ServiceFilterSensitiveLog)(obj.Service) }),
});
exports.CreateServiceResponseFilterSensitiveLog = CreateServiceResponseFilterSensitiveLog;
const DeleteServiceResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Service && { Service: (0, exports.ServiceFilterSensitiveLog)(obj.Service) }),
});
exports.DeleteServiceResponseFilterSensitiveLog = DeleteServiceResponseFilterSensitiveLog;
const DescribeServiceResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Service && { Service: (0, exports.ServiceFilterSensitiveLog)(obj.Service) }),
});
exports.DescribeServiceResponseFilterSensitiveLog = DescribeServiceResponseFilterSensitiveLog;
const PauseServiceResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Service && { Service: (0, exports.ServiceFilterSensitiveLog)(obj.Service) }),
});
exports.PauseServiceResponseFilterSensitiveLog = PauseServiceResponseFilterSensitiveLog;
const ResumeServiceResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Service && { Service: (0, exports.ServiceFilterSensitiveLog)(obj.Service) }),
});
exports.ResumeServiceResponseFilterSensitiveLog = ResumeServiceResponseFilterSensitiveLog;
const UpdateServiceRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.SourceConfiguration && {
        SourceConfiguration: (0, exports.SourceConfigurationFilterSensitiveLog)(obj.SourceConfiguration),
    }),
});
exports.UpdateServiceRequestFilterSensitiveLog = UpdateServiceRequestFilterSensitiveLog;
const UpdateServiceResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Service && { Service: (0, exports.ServiceFilterSensitiveLog)(obj.Service) }),
});
exports.UpdateServiceResponseFilterSensitiveLog = UpdateServiceResponseFilterSensitiveLog;


/***/ }),

/***/ 1375:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.paginateDescribeCustomDomains = void 0;
const AppRunnerClient_1 = __nccwpck_require__(7178);
const DescribeCustomDomainsCommand_1 = __nccwpck_require__(5901);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new DescribeCustomDomainsCommand_1.DescribeCustomDomainsCommand(input), ...args);
};
async function* paginateDescribeCustomDomains(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.NextToken = token;
        input["MaxResults"] = config.pageSize;
        if (config.client instanceof AppRunnerClient_1.AppRunnerClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected AppRunner | AppRunnerClient");
        }
        yield page;
        const prevToken = token;
        token = page.NextToken;
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
    }
    return undefined;
}
exports.paginateDescribeCustomDomains = paginateDescribeCustomDomains;


/***/ }),

/***/ 7396:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 2823:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.paginateListAutoScalingConfigurations = void 0;
const AppRunnerClient_1 = __nccwpck_require__(7178);
const ListAutoScalingConfigurationsCommand_1 = __nccwpck_require__(5337);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new ListAutoScalingConfigurationsCommand_1.ListAutoScalingConfigurationsCommand(input), ...args);
};
async function* paginateListAutoScalingConfigurations(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.NextToken = token;
        input["MaxResults"] = config.pageSize;
        if (config.client instanceof AppRunnerClient_1.AppRunnerClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected AppRunner | AppRunnerClient");
        }
        yield page;
        const prevToken = token;
        token = page.NextToken;
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
    }
    return undefined;
}
exports.paginateListAutoScalingConfigurations = paginateListAutoScalingConfigurations;


/***/ }),

/***/ 7624:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.paginateListConnections = void 0;
const AppRunnerClient_1 = __nccwpck_require__(7178);
const ListConnectionsCommand_1 = __nccwpck_require__(9495);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new ListConnectionsCommand_1.ListConnectionsCommand(input), ...args);
};
async function* paginateListConnections(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.NextToken = token;
        input["MaxResults"] = config.pageSize;
        if (config.client instanceof AppRunnerClient_1.AppRunnerClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected AppRunner | AppRunnerClient");
        }
        yield page;
        const prevToken = token;
        token = page.NextToken;
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
    }
    return undefined;
}
exports.paginateListConnections = paginateListConnections;


/***/ }),

/***/ 7560:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.paginateListObservabilityConfigurations = void 0;
const AppRunnerClient_1 = __nccwpck_require__(7178);
const ListObservabilityConfigurationsCommand_1 = __nccwpck_require__(7610);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new ListObservabilityConfigurationsCommand_1.ListObservabilityConfigurationsCommand(input), ...args);
};
async function* paginateListObservabilityConfigurations(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.NextToken = token;
        input["MaxResults"] = config.pageSize;
        if (config.client instanceof AppRunnerClient_1.AppRunnerClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected AppRunner | AppRunnerClient");
        }
        yield page;
        const prevToken = token;
        token = page.NextToken;
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
    }
    return undefined;
}
exports.paginateListObservabilityConfigurations = paginateListObservabilityConfigurations;


/***/ }),

/***/ 6462:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.paginateListOperations = void 0;
const AppRunnerClient_1 = __nccwpck_require__(7178);
const ListOperationsCommand_1 = __nccwpck_require__(7643);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new ListOperationsCommand_1.ListOperationsCommand(input), ...args);
};
async function* paginateListOperations(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.NextToken = token;
        input["MaxResults"] = config.pageSize;
        if (config.client instanceof AppRunnerClient_1.AppRunnerClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected AppRunner | AppRunnerClient");
        }
        yield page;
        const prevToken = token;
        token = page.NextToken;
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
    }
    return undefined;
}
exports.paginateListOperations = paginateListOperations;


/***/ }),

/***/ 2924:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.paginateListServices = void 0;
const AppRunnerClient_1 = __nccwpck_require__(7178);
const ListServicesCommand_1 = __nccwpck_require__(4070);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new ListServicesCommand_1.ListServicesCommand(input), ...args);
};
async function* paginateListServices(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.NextToken = token;
        input["MaxResults"] = config.pageSize;
        if (config.client instanceof AppRunnerClient_1.AppRunnerClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected AppRunner | AppRunnerClient");
        }
        yield page;
        const prevToken = token;
        token = page.NextToken;
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
    }
    return undefined;
}
exports.paginateListServices = paginateListServices;


/***/ }),

/***/ 5967:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.paginateListVpcConnectors = void 0;
const AppRunnerClient_1 = __nccwpck_require__(7178);
const ListVpcConnectorsCommand_1 = __nccwpck_require__(1924);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new ListVpcConnectorsCommand_1.ListVpcConnectorsCommand(input), ...args);
};
async function* paginateListVpcConnectors(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.NextToken = token;
        input["MaxResults"] = config.pageSize;
        if (config.client instanceof AppRunnerClient_1.AppRunnerClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected AppRunner | AppRunnerClient");
        }
        yield page;
        const prevToken = token;
        token = page.NextToken;
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
    }
    return undefined;
}
exports.paginateListVpcConnectors = paginateListVpcConnectors;


/***/ }),

/***/ 1431:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.paginateListVpcIngressConnections = void 0;
const AppRunnerClient_1 = __nccwpck_require__(7178);
const ListVpcIngressConnectionsCommand_1 = __nccwpck_require__(2811);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new ListVpcIngressConnectionsCommand_1.ListVpcIngressConnectionsCommand(input), ...args);
};
async function* paginateListVpcIngressConnections(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.NextToken = token;
        input["MaxResults"] = config.pageSize;
        if (config.client instanceof AppRunnerClient_1.AppRunnerClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected AppRunner | AppRunnerClient");
        }
        yield page;
        const prevToken = token;
        token = page.NextToken;
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
    }
    return undefined;
}
exports.paginateListVpcIngressConnections = paginateListVpcIngressConnections;


/***/ }),

/***/ 995:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(1375), exports);
tslib_1.__exportStar(__nccwpck_require__(7396), exports);
tslib_1.__exportStar(__nccwpck_require__(2823), exports);
tslib_1.__exportStar(__nccwpck_require__(7624), exports);
tslib_1.__exportStar(__nccwpck_require__(7560), exports);
tslib_1.__exportStar(__nccwpck_require__(6462), exports);
tslib_1.__exportStar(__nccwpck_require__(2924), exports);
tslib_1.__exportStar(__nccwpck_require__(5967), exports);
tslib_1.__exportStar(__nccwpck_require__(1431), exports);


/***/ }),

/***/ 5406:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.de_DescribeCustomDomainsCommand = exports.de_DescribeAutoScalingConfigurationCommand = exports.de_DeleteVpcIngressConnectionCommand = exports.de_DeleteVpcConnectorCommand = exports.de_DeleteServiceCommand = exports.de_DeleteObservabilityConfigurationCommand = exports.de_DeleteConnectionCommand = exports.de_DeleteAutoScalingConfigurationCommand = exports.de_CreateVpcIngressConnectionCommand = exports.de_CreateVpcConnectorCommand = exports.de_CreateServiceCommand = exports.de_CreateObservabilityConfigurationCommand = exports.de_CreateConnectionCommand = exports.de_CreateAutoScalingConfigurationCommand = exports.de_AssociateCustomDomainCommand = exports.se_UpdateVpcIngressConnectionCommand = exports.se_UpdateServiceCommand = exports.se_UntagResourceCommand = exports.se_TagResourceCommand = exports.se_StartDeploymentCommand = exports.se_ResumeServiceCommand = exports.se_PauseServiceCommand = exports.se_ListVpcIngressConnectionsCommand = exports.se_ListVpcConnectorsCommand = exports.se_ListTagsForResourceCommand = exports.se_ListServicesCommand = exports.se_ListOperationsCommand = exports.se_ListObservabilityConfigurationsCommand = exports.se_ListConnectionsCommand = exports.se_ListAutoScalingConfigurationsCommand = exports.se_DisassociateCustomDomainCommand = exports.se_DescribeVpcIngressConnectionCommand = exports.se_DescribeVpcConnectorCommand = exports.se_DescribeServiceCommand = exports.se_DescribeObservabilityConfigurationCommand = exports.se_DescribeCustomDomainsCommand = exports.se_DescribeAutoScalingConfigurationCommand = exports.se_DeleteVpcIngressConnectionCommand = exports.se_DeleteVpcConnectorCommand = exports.se_DeleteServiceCommand = exports.se_DeleteObservabilityConfigurationCommand = exports.se_DeleteConnectionCommand = exports.se_DeleteAutoScalingConfigurationCommand = exports.se_CreateVpcIngressConnectionCommand = exports.se_CreateVpcConnectorCommand = exports.se_CreateServiceCommand = exports.se_CreateObservabilityConfigurationCommand = exports.se_CreateConnectionCommand = exports.se_CreateAutoScalingConfigurationCommand = exports.se_AssociateCustomDomainCommand = void 0;
exports.de_UpdateVpcIngressConnectionCommand = exports.de_UpdateServiceCommand = exports.de_UntagResourceCommand = exports.de_TagResourceCommand = exports.de_StartDeploymentCommand = exports.de_ResumeServiceCommand = exports.de_PauseServiceCommand = exports.de_ListVpcIngressConnectionsCommand = exports.de_ListVpcConnectorsCommand = exports.de_ListTagsForResourceCommand = exports.de_ListServicesCommand = exports.de_ListOperationsCommand = exports.de_ListObservabilityConfigurationsCommand = exports.de_ListConnectionsCommand = exports.de_ListAutoScalingConfigurationsCommand = exports.de_DisassociateCustomDomainCommand = exports.de_DescribeVpcIngressConnectionCommand = exports.de_DescribeVpcConnectorCommand = exports.de_DescribeServiceCommand = exports.de_DescribeObservabilityConfigurationCommand = void 0;
const protocol_http_1 = __nccwpck_require__(223);
const smithy_client_1 = __nccwpck_require__(4963);
const AppRunnerServiceException_1 = __nccwpck_require__(6103);
const models_0_1 = __nccwpck_require__(5133);
const se_AssociateCustomDomainCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.AssociateCustomDomain",
    };
    let body;
    body = JSON.stringify(se_AssociateCustomDomainRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_AssociateCustomDomainCommand = se_AssociateCustomDomainCommand;
const se_CreateAutoScalingConfigurationCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.CreateAutoScalingConfiguration",
    };
    let body;
    body = JSON.stringify(se_CreateAutoScalingConfigurationRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_CreateAutoScalingConfigurationCommand = se_CreateAutoScalingConfigurationCommand;
const se_CreateConnectionCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.CreateConnection",
    };
    let body;
    body = JSON.stringify(se_CreateConnectionRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_CreateConnectionCommand = se_CreateConnectionCommand;
const se_CreateObservabilityConfigurationCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.CreateObservabilityConfiguration",
    };
    let body;
    body = JSON.stringify(se_CreateObservabilityConfigurationRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_CreateObservabilityConfigurationCommand = se_CreateObservabilityConfigurationCommand;
const se_CreateServiceCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.CreateService",
    };
    let body;
    body = JSON.stringify(se_CreateServiceRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_CreateServiceCommand = se_CreateServiceCommand;
const se_CreateVpcConnectorCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.CreateVpcConnector",
    };
    let body;
    body = JSON.stringify(se_CreateVpcConnectorRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_CreateVpcConnectorCommand = se_CreateVpcConnectorCommand;
const se_CreateVpcIngressConnectionCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.CreateVpcIngressConnection",
    };
    let body;
    body = JSON.stringify(se_CreateVpcIngressConnectionRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_CreateVpcIngressConnectionCommand = se_CreateVpcIngressConnectionCommand;
const se_DeleteAutoScalingConfigurationCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.DeleteAutoScalingConfiguration",
    };
    let body;
    body = JSON.stringify(se_DeleteAutoScalingConfigurationRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_DeleteAutoScalingConfigurationCommand = se_DeleteAutoScalingConfigurationCommand;
const se_DeleteConnectionCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.DeleteConnection",
    };
    let body;
    body = JSON.stringify(se_DeleteConnectionRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_DeleteConnectionCommand = se_DeleteConnectionCommand;
const se_DeleteObservabilityConfigurationCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.DeleteObservabilityConfiguration",
    };
    let body;
    body = JSON.stringify(se_DeleteObservabilityConfigurationRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_DeleteObservabilityConfigurationCommand = se_DeleteObservabilityConfigurationCommand;
const se_DeleteServiceCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.DeleteService",
    };
    let body;
    body = JSON.stringify(se_DeleteServiceRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_DeleteServiceCommand = se_DeleteServiceCommand;
const se_DeleteVpcConnectorCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.DeleteVpcConnector",
    };
    let body;
    body = JSON.stringify(se_DeleteVpcConnectorRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_DeleteVpcConnectorCommand = se_DeleteVpcConnectorCommand;
const se_DeleteVpcIngressConnectionCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.DeleteVpcIngressConnection",
    };
    let body;
    body = JSON.stringify(se_DeleteVpcIngressConnectionRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_DeleteVpcIngressConnectionCommand = se_DeleteVpcIngressConnectionCommand;
const se_DescribeAutoScalingConfigurationCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.DescribeAutoScalingConfiguration",
    };
    let body;
    body = JSON.stringify(se_DescribeAutoScalingConfigurationRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_DescribeAutoScalingConfigurationCommand = se_DescribeAutoScalingConfigurationCommand;
const se_DescribeCustomDomainsCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.DescribeCustomDomains",
    };
    let body;
    body = JSON.stringify(se_DescribeCustomDomainsRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_DescribeCustomDomainsCommand = se_DescribeCustomDomainsCommand;
const se_DescribeObservabilityConfigurationCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.DescribeObservabilityConfiguration",
    };
    let body;
    body = JSON.stringify(se_DescribeObservabilityConfigurationRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_DescribeObservabilityConfigurationCommand = se_DescribeObservabilityConfigurationCommand;
const se_DescribeServiceCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.DescribeService",
    };
    let body;
    body = JSON.stringify(se_DescribeServiceRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_DescribeServiceCommand = se_DescribeServiceCommand;
const se_DescribeVpcConnectorCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.DescribeVpcConnector",
    };
    let body;
    body = JSON.stringify(se_DescribeVpcConnectorRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_DescribeVpcConnectorCommand = se_DescribeVpcConnectorCommand;
const se_DescribeVpcIngressConnectionCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.DescribeVpcIngressConnection",
    };
    let body;
    body = JSON.stringify(se_DescribeVpcIngressConnectionRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_DescribeVpcIngressConnectionCommand = se_DescribeVpcIngressConnectionCommand;
const se_DisassociateCustomDomainCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.DisassociateCustomDomain",
    };
    let body;
    body = JSON.stringify(se_DisassociateCustomDomainRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_DisassociateCustomDomainCommand = se_DisassociateCustomDomainCommand;
const se_ListAutoScalingConfigurationsCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.ListAutoScalingConfigurations",
    };
    let body;
    body = JSON.stringify(se_ListAutoScalingConfigurationsRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_ListAutoScalingConfigurationsCommand = se_ListAutoScalingConfigurationsCommand;
const se_ListConnectionsCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.ListConnections",
    };
    let body;
    body = JSON.stringify(se_ListConnectionsRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_ListConnectionsCommand = se_ListConnectionsCommand;
const se_ListObservabilityConfigurationsCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.ListObservabilityConfigurations",
    };
    let body;
    body = JSON.stringify(se_ListObservabilityConfigurationsRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_ListObservabilityConfigurationsCommand = se_ListObservabilityConfigurationsCommand;
const se_ListOperationsCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.ListOperations",
    };
    let body;
    body = JSON.stringify(se_ListOperationsRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_ListOperationsCommand = se_ListOperationsCommand;
const se_ListServicesCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.ListServices",
    };
    let body;
    body = JSON.stringify(se_ListServicesRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_ListServicesCommand = se_ListServicesCommand;
const se_ListTagsForResourceCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.ListTagsForResource",
    };
    let body;
    body = JSON.stringify(se_ListTagsForResourceRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_ListTagsForResourceCommand = se_ListTagsForResourceCommand;
const se_ListVpcConnectorsCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.ListVpcConnectors",
    };
    let body;
    body = JSON.stringify(se_ListVpcConnectorsRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_ListVpcConnectorsCommand = se_ListVpcConnectorsCommand;
const se_ListVpcIngressConnectionsCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.ListVpcIngressConnections",
    };
    let body;
    body = JSON.stringify(se_ListVpcIngressConnectionsRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_ListVpcIngressConnectionsCommand = se_ListVpcIngressConnectionsCommand;
const se_PauseServiceCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.PauseService",
    };
    let body;
    body = JSON.stringify(se_PauseServiceRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_PauseServiceCommand = se_PauseServiceCommand;
const se_ResumeServiceCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.ResumeService",
    };
    let body;
    body = JSON.stringify(se_ResumeServiceRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_ResumeServiceCommand = se_ResumeServiceCommand;
const se_StartDeploymentCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.StartDeployment",
    };
    let body;
    body = JSON.stringify(se_StartDeploymentRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_StartDeploymentCommand = se_StartDeploymentCommand;
const se_TagResourceCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.TagResource",
    };
    let body;
    body = JSON.stringify(se_TagResourceRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_TagResourceCommand = se_TagResourceCommand;
const se_UntagResourceCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.UntagResource",
    };
    let body;
    body = JSON.stringify(se_UntagResourceRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_UntagResourceCommand = se_UntagResourceCommand;
const se_UpdateServiceCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.UpdateService",
    };
    let body;
    body = JSON.stringify(se_UpdateServiceRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_UpdateServiceCommand = se_UpdateServiceCommand;
const se_UpdateVpcIngressConnectionCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "x-amz-target": "AppRunner.UpdateVpcIngressConnection",
    };
    let body;
    body = JSON.stringify(se_UpdateVpcIngressConnectionRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_UpdateVpcIngressConnectionCommand = se_UpdateVpcIngressConnectionCommand;
const de_AssociateCustomDomainCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_AssociateCustomDomainCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_AssociateCustomDomainResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_AssociateCustomDomainCommand = de_AssociateCustomDomainCommand;
const de_AssociateCustomDomainCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "InvalidStateException":
        case "com.amazonaws.apprunner#InvalidStateException":
            throw await de_InvalidStateExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_CreateAutoScalingConfigurationCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CreateAutoScalingConfigurationCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_CreateAutoScalingConfigurationResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_CreateAutoScalingConfigurationCommand = de_CreateAutoScalingConfigurationCommand;
const de_CreateAutoScalingConfigurationCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ServiceQuotaExceededException":
        case "com.amazonaws.apprunner#ServiceQuotaExceededException":
            throw await de_ServiceQuotaExceededExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_CreateConnectionCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CreateConnectionCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_CreateConnectionResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_CreateConnectionCommand = de_CreateConnectionCommand;
const de_CreateConnectionCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ServiceQuotaExceededException":
        case "com.amazonaws.apprunner#ServiceQuotaExceededException":
            throw await de_ServiceQuotaExceededExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_CreateObservabilityConfigurationCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CreateObservabilityConfigurationCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_CreateObservabilityConfigurationResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_CreateObservabilityConfigurationCommand = de_CreateObservabilityConfigurationCommand;
const de_CreateObservabilityConfigurationCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ServiceQuotaExceededException":
        case "com.amazonaws.apprunner#ServiceQuotaExceededException":
            throw await de_ServiceQuotaExceededExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_CreateServiceCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CreateServiceCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_CreateServiceResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_CreateServiceCommand = de_CreateServiceCommand;
const de_CreateServiceCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ServiceQuotaExceededException":
        case "com.amazonaws.apprunner#ServiceQuotaExceededException":
            throw await de_ServiceQuotaExceededExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_CreateVpcConnectorCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CreateVpcConnectorCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_CreateVpcConnectorResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_CreateVpcConnectorCommand = de_CreateVpcConnectorCommand;
const de_CreateVpcConnectorCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ServiceQuotaExceededException":
        case "com.amazonaws.apprunner#ServiceQuotaExceededException":
            throw await de_ServiceQuotaExceededExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_CreateVpcIngressConnectionCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_CreateVpcIngressConnectionCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_CreateVpcIngressConnectionResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_CreateVpcIngressConnectionCommand = de_CreateVpcIngressConnectionCommand;
const de_CreateVpcIngressConnectionCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "InvalidStateException":
        case "com.amazonaws.apprunner#InvalidStateException":
            throw await de_InvalidStateExceptionRes(parsedOutput, context);
        case "ServiceQuotaExceededException":
        case "com.amazonaws.apprunner#ServiceQuotaExceededException":
            throw await de_ServiceQuotaExceededExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_DeleteAutoScalingConfigurationCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_DeleteAutoScalingConfigurationCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_DeleteAutoScalingConfigurationResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_DeleteAutoScalingConfigurationCommand = de_DeleteAutoScalingConfigurationCommand;
const de_DeleteAutoScalingConfigurationCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_DeleteConnectionCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_DeleteConnectionCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_DeleteConnectionResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_DeleteConnectionCommand = de_DeleteConnectionCommand;
const de_DeleteConnectionCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_DeleteObservabilityConfigurationCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_DeleteObservabilityConfigurationCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_DeleteObservabilityConfigurationResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_DeleteObservabilityConfigurationCommand = de_DeleteObservabilityConfigurationCommand;
const de_DeleteObservabilityConfigurationCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_DeleteServiceCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_DeleteServiceCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_DeleteServiceResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_DeleteServiceCommand = de_DeleteServiceCommand;
const de_DeleteServiceCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "InvalidStateException":
        case "com.amazonaws.apprunner#InvalidStateException":
            throw await de_InvalidStateExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_DeleteVpcConnectorCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_DeleteVpcConnectorCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_DeleteVpcConnectorResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_DeleteVpcConnectorCommand = de_DeleteVpcConnectorCommand;
const de_DeleteVpcConnectorCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_DeleteVpcIngressConnectionCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_DeleteVpcIngressConnectionCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_DeleteVpcIngressConnectionResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_DeleteVpcIngressConnectionCommand = de_DeleteVpcIngressConnectionCommand;
const de_DeleteVpcIngressConnectionCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "InvalidStateException":
        case "com.amazonaws.apprunner#InvalidStateException":
            throw await de_InvalidStateExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_DescribeAutoScalingConfigurationCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_DescribeAutoScalingConfigurationCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_DescribeAutoScalingConfigurationResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_DescribeAutoScalingConfigurationCommand = de_DescribeAutoScalingConfigurationCommand;
const de_DescribeAutoScalingConfigurationCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_DescribeCustomDomainsCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_DescribeCustomDomainsCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_DescribeCustomDomainsResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_DescribeCustomDomainsCommand = de_DescribeCustomDomainsCommand;
const de_DescribeCustomDomainsCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_DescribeObservabilityConfigurationCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_DescribeObservabilityConfigurationCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_DescribeObservabilityConfigurationResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_DescribeObservabilityConfigurationCommand = de_DescribeObservabilityConfigurationCommand;
const de_DescribeObservabilityConfigurationCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_DescribeServiceCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_DescribeServiceCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_DescribeServiceResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_DescribeServiceCommand = de_DescribeServiceCommand;
const de_DescribeServiceCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_DescribeVpcConnectorCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_DescribeVpcConnectorCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_DescribeVpcConnectorResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_DescribeVpcConnectorCommand = de_DescribeVpcConnectorCommand;
const de_DescribeVpcConnectorCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_DescribeVpcIngressConnectionCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_DescribeVpcIngressConnectionCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_DescribeVpcIngressConnectionResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_DescribeVpcIngressConnectionCommand = de_DescribeVpcIngressConnectionCommand;
const de_DescribeVpcIngressConnectionCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_DisassociateCustomDomainCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_DisassociateCustomDomainCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_DisassociateCustomDomainResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_DisassociateCustomDomainCommand = de_DisassociateCustomDomainCommand;
const de_DisassociateCustomDomainCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "InvalidStateException":
        case "com.amazonaws.apprunner#InvalidStateException":
            throw await de_InvalidStateExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_ListAutoScalingConfigurationsCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_ListAutoScalingConfigurationsCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_ListAutoScalingConfigurationsResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_ListAutoScalingConfigurationsCommand = de_ListAutoScalingConfigurationsCommand;
const de_ListAutoScalingConfigurationsCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_ListConnectionsCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_ListConnectionsCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_ListConnectionsResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_ListConnectionsCommand = de_ListConnectionsCommand;
const de_ListConnectionsCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_ListObservabilityConfigurationsCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_ListObservabilityConfigurationsCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_ListObservabilityConfigurationsResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_ListObservabilityConfigurationsCommand = de_ListObservabilityConfigurationsCommand;
const de_ListObservabilityConfigurationsCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_ListOperationsCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_ListOperationsCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_ListOperationsResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_ListOperationsCommand = de_ListOperationsCommand;
const de_ListOperationsCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_ListServicesCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_ListServicesCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_ListServicesResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_ListServicesCommand = de_ListServicesCommand;
const de_ListServicesCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_ListTagsForResourceCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_ListTagsForResourceCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_ListTagsForResourceResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_ListTagsForResourceCommand = de_ListTagsForResourceCommand;
const de_ListTagsForResourceCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "InvalidStateException":
        case "com.amazonaws.apprunner#InvalidStateException":
            throw await de_InvalidStateExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_ListVpcConnectorsCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_ListVpcConnectorsCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_ListVpcConnectorsResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_ListVpcConnectorsCommand = de_ListVpcConnectorsCommand;
const de_ListVpcConnectorsCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_ListVpcIngressConnectionsCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_ListVpcIngressConnectionsCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_ListVpcIngressConnectionsResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_ListVpcIngressConnectionsCommand = de_ListVpcIngressConnectionsCommand;
const de_ListVpcIngressConnectionsCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_PauseServiceCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_PauseServiceCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_PauseServiceResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_PauseServiceCommand = de_PauseServiceCommand;
const de_PauseServiceCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "InvalidStateException":
        case "com.amazonaws.apprunner#InvalidStateException":
            throw await de_InvalidStateExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_ResumeServiceCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_ResumeServiceCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_ResumeServiceResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_ResumeServiceCommand = de_ResumeServiceCommand;
const de_ResumeServiceCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "InvalidStateException":
        case "com.amazonaws.apprunner#InvalidStateException":
            throw await de_InvalidStateExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_StartDeploymentCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_StartDeploymentCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_StartDeploymentResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_StartDeploymentCommand = de_StartDeploymentCommand;
const de_StartDeploymentCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_TagResourceCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_TagResourceCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_TagResourceResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_TagResourceCommand = de_TagResourceCommand;
const de_TagResourceCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "InvalidStateException":
        case "com.amazonaws.apprunner#InvalidStateException":
            throw await de_InvalidStateExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_UntagResourceCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_UntagResourceCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_UntagResourceResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_UntagResourceCommand = de_UntagResourceCommand;
const de_UntagResourceCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "InvalidStateException":
        case "com.amazonaws.apprunner#InvalidStateException":
            throw await de_InvalidStateExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_UpdateServiceCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_UpdateServiceCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_UpdateServiceResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_UpdateServiceCommand = de_UpdateServiceCommand;
const de_UpdateServiceCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "InvalidStateException":
        case "com.amazonaws.apprunner#InvalidStateException":
            throw await de_InvalidStateExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_UpdateVpcIngressConnectionCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_UpdateVpcIngressConnectionCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_UpdateVpcIngressConnectionResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_UpdateVpcIngressConnectionCommand = de_UpdateVpcIngressConnectionCommand;
const de_UpdateVpcIngressConnectionCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServiceErrorException":
        case "com.amazonaws.apprunner#InternalServiceErrorException":
            throw await de_InternalServiceErrorExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.apprunner#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "InvalidStateException":
        case "com.amazonaws.apprunner#InvalidStateException":
            throw await de_InvalidStateExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.apprunner#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: AppRunnerServiceException_1.AppRunnerServiceException,
                errorCode,
            });
    }
};
const de_InternalServiceErrorExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InternalServiceErrorException(body, context);
    const exception = new models_0_1.InternalServiceErrorException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, body);
};
const de_InvalidRequestExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidRequestException(body, context);
    const exception = new models_0_1.InvalidRequestException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, body);
};
const de_InvalidStateExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidStateException(body, context);
    const exception = new models_0_1.InvalidStateException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, body);
};
const de_ResourceNotFoundExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_ResourceNotFoundException(body, context);
    const exception = new models_0_1.ResourceNotFoundException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, body);
};
const de_ServiceQuotaExceededExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_ServiceQuotaExceededException(body, context);
    const exception = new models_0_1.ServiceQuotaExceededException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, body);
};
const se_AssociateCustomDomainRequest = (input, context) => {
    return {
        ...(input.DomainName != null && { DomainName: input.DomainName }),
        ...(input.EnableWWWSubdomain != null && { EnableWWWSubdomain: input.EnableWWWSubdomain }),
        ...(input.ServiceArn != null && { ServiceArn: input.ServiceArn }),
    };
};
const se_AuthenticationConfiguration = (input, context) => {
    return {
        ...(input.AccessRoleArn != null && { AccessRoleArn: input.AccessRoleArn }),
        ...(input.ConnectionArn != null && { ConnectionArn: input.ConnectionArn }),
    };
};
const se_CodeConfiguration = (input, context) => {
    return {
        ...(input.CodeConfigurationValues != null && {
            CodeConfigurationValues: se_CodeConfigurationValues(input.CodeConfigurationValues, context),
        }),
        ...(input.ConfigurationSource != null && { ConfigurationSource: input.ConfigurationSource }),
    };
};
const se_CodeConfigurationValues = (input, context) => {
    return {
        ...(input.BuildCommand != null && { BuildCommand: input.BuildCommand }),
        ...(input.Port != null && { Port: input.Port }),
        ...(input.Runtime != null && { Runtime: input.Runtime }),
        ...(input.RuntimeEnvironmentSecrets != null && {
            RuntimeEnvironmentSecrets: se_RuntimeEnvironmentSecrets(input.RuntimeEnvironmentSecrets, context),
        }),
        ...(input.RuntimeEnvironmentVariables != null && {
            RuntimeEnvironmentVariables: se_RuntimeEnvironmentVariables(input.RuntimeEnvironmentVariables, context),
        }),
        ...(input.StartCommand != null && { StartCommand: input.StartCommand }),
    };
};
const se_CodeRepository = (input, context) => {
    return {
        ...(input.CodeConfiguration != null && {
            CodeConfiguration: se_CodeConfiguration(input.CodeConfiguration, context),
        }),
        ...(input.RepositoryUrl != null && { RepositoryUrl: input.RepositoryUrl }),
        ...(input.SourceCodeVersion != null && {
            SourceCodeVersion: se_SourceCodeVersion(input.SourceCodeVersion, context),
        }),
    };
};
const se_CreateAutoScalingConfigurationRequest = (input, context) => {
    return {
        ...(input.AutoScalingConfigurationName != null && {
            AutoScalingConfigurationName: input.AutoScalingConfigurationName,
        }),
        ...(input.MaxConcurrency != null && { MaxConcurrency: input.MaxConcurrency }),
        ...(input.MaxSize != null && { MaxSize: input.MaxSize }),
        ...(input.MinSize != null && { MinSize: input.MinSize }),
        ...(input.Tags != null && { Tags: se_TagList(input.Tags, context) }),
    };
};
const se_CreateConnectionRequest = (input, context) => {
    return {
        ...(input.ConnectionName != null && { ConnectionName: input.ConnectionName }),
        ...(input.ProviderType != null && { ProviderType: input.ProviderType }),
        ...(input.Tags != null && { Tags: se_TagList(input.Tags, context) }),
    };
};
const se_CreateObservabilityConfigurationRequest = (input, context) => {
    return {
        ...(input.ObservabilityConfigurationName != null && {
            ObservabilityConfigurationName: input.ObservabilityConfigurationName,
        }),
        ...(input.Tags != null && { Tags: se_TagList(input.Tags, context) }),
        ...(input.TraceConfiguration != null && {
            TraceConfiguration: se_TraceConfiguration(input.TraceConfiguration, context),
        }),
    };
};
const se_CreateServiceRequest = (input, context) => {
    return {
        ...(input.AutoScalingConfigurationArn != null && {
            AutoScalingConfigurationArn: input.AutoScalingConfigurationArn,
        }),
        ...(input.EncryptionConfiguration != null && {
            EncryptionConfiguration: se_EncryptionConfiguration(input.EncryptionConfiguration, context),
        }),
        ...(input.HealthCheckConfiguration != null && {
            HealthCheckConfiguration: se_HealthCheckConfiguration(input.HealthCheckConfiguration, context),
        }),
        ...(input.InstanceConfiguration != null && {
            InstanceConfiguration: se_InstanceConfiguration(input.InstanceConfiguration, context),
        }),
        ...(input.NetworkConfiguration != null && {
            NetworkConfiguration: se_NetworkConfiguration(input.NetworkConfiguration, context),
        }),
        ...(input.ObservabilityConfiguration != null && {
            ObservabilityConfiguration: se_ServiceObservabilityConfiguration(input.ObservabilityConfiguration, context),
        }),
        ...(input.ServiceName != null && { ServiceName: input.ServiceName }),
        ...(input.SourceConfiguration != null && {
            SourceConfiguration: se_SourceConfiguration(input.SourceConfiguration, context),
        }),
        ...(input.Tags != null && { Tags: se_TagList(input.Tags, context) }),
    };
};
const se_CreateVpcConnectorRequest = (input, context) => {
    return {
        ...(input.SecurityGroups != null && { SecurityGroups: se_StringList(input.SecurityGroups, context) }),
        ...(input.Subnets != null && { Subnets: se_StringList(input.Subnets, context) }),
        ...(input.Tags != null && { Tags: se_TagList(input.Tags, context) }),
        ...(input.VpcConnectorName != null && { VpcConnectorName: input.VpcConnectorName }),
    };
};
const se_CreateVpcIngressConnectionRequest = (input, context) => {
    return {
        ...(input.IngressVpcConfiguration != null && {
            IngressVpcConfiguration: se_IngressVpcConfiguration(input.IngressVpcConfiguration, context),
        }),
        ...(input.ServiceArn != null && { ServiceArn: input.ServiceArn }),
        ...(input.Tags != null && { Tags: se_TagList(input.Tags, context) }),
        ...(input.VpcIngressConnectionName != null && { VpcIngressConnectionName: input.VpcIngressConnectionName }),
    };
};
const se_DeleteAutoScalingConfigurationRequest = (input, context) => {
    return {
        ...(input.AutoScalingConfigurationArn != null && {
            AutoScalingConfigurationArn: input.AutoScalingConfigurationArn,
        }),
    };
};
const se_DeleteConnectionRequest = (input, context) => {
    return {
        ...(input.ConnectionArn != null && { ConnectionArn: input.ConnectionArn }),
    };
};
const se_DeleteObservabilityConfigurationRequest = (input, context) => {
    return {
        ...(input.ObservabilityConfigurationArn != null && {
            ObservabilityConfigurationArn: input.ObservabilityConfigurationArn,
        }),
    };
};
const se_DeleteServiceRequest = (input, context) => {
    return {
        ...(input.ServiceArn != null && { ServiceArn: input.ServiceArn }),
    };
};
const se_DeleteVpcConnectorRequest = (input, context) => {
    return {
        ...(input.VpcConnectorArn != null && { VpcConnectorArn: input.VpcConnectorArn }),
    };
};
const se_DeleteVpcIngressConnectionRequest = (input, context) => {
    return {
        ...(input.VpcIngressConnectionArn != null && { VpcIngressConnectionArn: input.VpcIngressConnectionArn }),
    };
};
const se_DescribeAutoScalingConfigurationRequest = (input, context) => {
    return {
        ...(input.AutoScalingConfigurationArn != null && {
            AutoScalingConfigurationArn: input.AutoScalingConfigurationArn,
        }),
    };
};
const se_DescribeCustomDomainsRequest = (input, context) => {
    return {
        ...(input.MaxResults != null && { MaxResults: input.MaxResults }),
        ...(input.NextToken != null && { NextToken: input.NextToken }),
        ...(input.ServiceArn != null && { ServiceArn: input.ServiceArn }),
    };
};
const se_DescribeObservabilityConfigurationRequest = (input, context) => {
    return {
        ...(input.ObservabilityConfigurationArn != null && {
            ObservabilityConfigurationArn: input.ObservabilityConfigurationArn,
        }),
    };
};
const se_DescribeServiceRequest = (input, context) => {
    return {
        ...(input.ServiceArn != null && { ServiceArn: input.ServiceArn }),
    };
};
const se_DescribeVpcConnectorRequest = (input, context) => {
    return {
        ...(input.VpcConnectorArn != null && { VpcConnectorArn: input.VpcConnectorArn }),
    };
};
const se_DescribeVpcIngressConnectionRequest = (input, context) => {
    return {
        ...(input.VpcIngressConnectionArn != null && { VpcIngressConnectionArn: input.VpcIngressConnectionArn }),
    };
};
const se_DisassociateCustomDomainRequest = (input, context) => {
    return {
        ...(input.DomainName != null && { DomainName: input.DomainName }),
        ...(input.ServiceArn != null && { ServiceArn: input.ServiceArn }),
    };
};
const se_EgressConfiguration = (input, context) => {
    return {
        ...(input.EgressType != null && { EgressType: input.EgressType }),
        ...(input.VpcConnectorArn != null && { VpcConnectorArn: input.VpcConnectorArn }),
    };
};
const se_EncryptionConfiguration = (input, context) => {
    return {
        ...(input.KmsKey != null && { KmsKey: input.KmsKey }),
    };
};
const se_HealthCheckConfiguration = (input, context) => {
    return {
        ...(input.HealthyThreshold != null && { HealthyThreshold: input.HealthyThreshold }),
        ...(input.Interval != null && { Interval: input.Interval }),
        ...(input.Path != null && { Path: input.Path }),
        ...(input.Protocol != null && { Protocol: input.Protocol }),
        ...(input.Timeout != null && { Timeout: input.Timeout }),
        ...(input.UnhealthyThreshold != null && { UnhealthyThreshold: input.UnhealthyThreshold }),
    };
};
const se_ImageConfiguration = (input, context) => {
    return {
        ...(input.Port != null && { Port: input.Port }),
        ...(input.RuntimeEnvironmentSecrets != null && {
            RuntimeEnvironmentSecrets: se_RuntimeEnvironmentSecrets(input.RuntimeEnvironmentSecrets, context),
        }),
        ...(input.RuntimeEnvironmentVariables != null && {
            RuntimeEnvironmentVariables: se_RuntimeEnvironmentVariables(input.RuntimeEnvironmentVariables, context),
        }),
        ...(input.StartCommand != null && { StartCommand: input.StartCommand }),
    };
};
const se_ImageRepository = (input, context) => {
    return {
        ...(input.ImageConfiguration != null && {
            ImageConfiguration: se_ImageConfiguration(input.ImageConfiguration, context),
        }),
        ...(input.ImageIdentifier != null && { ImageIdentifier: input.ImageIdentifier }),
        ...(input.ImageRepositoryType != null && { ImageRepositoryType: input.ImageRepositoryType }),
    };
};
const se_IngressConfiguration = (input, context) => {
    return {
        ...(input.IsPubliclyAccessible != null && { IsPubliclyAccessible: input.IsPubliclyAccessible }),
    };
};
const se_IngressVpcConfiguration = (input, context) => {
    return {
        ...(input.VpcEndpointId != null && { VpcEndpointId: input.VpcEndpointId }),
        ...(input.VpcId != null && { VpcId: input.VpcId }),
    };
};
const se_InstanceConfiguration = (input, context) => {
    return {
        ...(input.Cpu != null && { Cpu: input.Cpu }),
        ...(input.InstanceRoleArn != null && { InstanceRoleArn: input.InstanceRoleArn }),
        ...(input.Memory != null && { Memory: input.Memory }),
    };
};
const se_ListAutoScalingConfigurationsRequest = (input, context) => {
    return {
        ...(input.AutoScalingConfigurationName != null && {
            AutoScalingConfigurationName: input.AutoScalingConfigurationName,
        }),
        ...(input.LatestOnly != null && { LatestOnly: input.LatestOnly }),
        ...(input.MaxResults != null && { MaxResults: input.MaxResults }),
        ...(input.NextToken != null && { NextToken: input.NextToken }),
    };
};
const se_ListConnectionsRequest = (input, context) => {
    return {
        ...(input.ConnectionName != null && { ConnectionName: input.ConnectionName }),
        ...(input.MaxResults != null && { MaxResults: input.MaxResults }),
        ...(input.NextToken != null && { NextToken: input.NextToken }),
    };
};
const se_ListObservabilityConfigurationsRequest = (input, context) => {
    return {
        ...(input.LatestOnly != null && { LatestOnly: input.LatestOnly }),
        ...(input.MaxResults != null && { MaxResults: input.MaxResults }),
        ...(input.NextToken != null && { NextToken: input.NextToken }),
        ...(input.ObservabilityConfigurationName != null && {
            ObservabilityConfigurationName: input.ObservabilityConfigurationName,
        }),
    };
};
const se_ListOperationsRequest = (input, context) => {
    return {
        ...(input.MaxResults != null && { MaxResults: input.MaxResults }),
        ...(input.NextToken != null && { NextToken: input.NextToken }),
        ...(input.ServiceArn != null && { ServiceArn: input.ServiceArn }),
    };
};
const se_ListServicesRequest = (input, context) => {
    return {
        ...(input.MaxResults != null && { MaxResults: input.MaxResults }),
        ...(input.NextToken != null && { NextToken: input.NextToken }),
    };
};
const se_ListTagsForResourceRequest = (input, context) => {
    return {
        ...(input.ResourceArn != null && { ResourceArn: input.ResourceArn }),
    };
};
const se_ListVpcConnectorsRequest = (input, context) => {
    return {
        ...(input.MaxResults != null && { MaxResults: input.MaxResults }),
        ...(input.NextToken != null && { NextToken: input.NextToken }),
    };
};
const se_ListVpcIngressConnectionsFilter = (input, context) => {
    return {
        ...(input.ServiceArn != null && { ServiceArn: input.ServiceArn }),
        ...(input.VpcEndpointId != null && { VpcEndpointId: input.VpcEndpointId }),
    };
};
const se_ListVpcIngressConnectionsRequest = (input, context) => {
    return {
        ...(input.Filter != null && { Filter: se_ListVpcIngressConnectionsFilter(input.Filter, context) }),
        ...(input.MaxResults != null && { MaxResults: input.MaxResults }),
        ...(input.NextToken != null && { NextToken: input.NextToken }),
    };
};
const se_NetworkConfiguration = (input, context) => {
    return {
        ...(input.EgressConfiguration != null && {
            EgressConfiguration: se_EgressConfiguration(input.EgressConfiguration, context),
        }),
        ...(input.IngressConfiguration != null && {
            IngressConfiguration: se_IngressConfiguration(input.IngressConfiguration, context),
        }),
    };
};
const se_PauseServiceRequest = (input, context) => {
    return {
        ...(input.ServiceArn != null && { ServiceArn: input.ServiceArn }),
    };
};
const se_ResumeServiceRequest = (input, context) => {
    return {
        ...(input.ServiceArn != null && { ServiceArn: input.ServiceArn }),
    };
};
const se_RuntimeEnvironmentSecrets = (input, context) => {
    return Object.entries(input).reduce((acc, [key, value]) => {
        if (value === null) {
            return acc;
        }
        acc[key] = value;
        return acc;
    }, {});
};
const se_RuntimeEnvironmentVariables = (input, context) => {
    return Object.entries(input).reduce((acc, [key, value]) => {
        if (value === null) {
            return acc;
        }
        acc[key] = value;
        return acc;
    }, {});
};
const se_ServiceObservabilityConfiguration = (input, context) => {
    return {
        ...(input.ObservabilityConfigurationArn != null && {
            ObservabilityConfigurationArn: input.ObservabilityConfigurationArn,
        }),
        ...(input.ObservabilityEnabled != null && { ObservabilityEnabled: input.ObservabilityEnabled }),
    };
};
const se_SourceCodeVersion = (input, context) => {
    return {
        ...(input.Type != null && { Type: input.Type }),
        ...(input.Value != null && { Value: input.Value }),
    };
};
const se_SourceConfiguration = (input, context) => {
    return {
        ...(input.AuthenticationConfiguration != null && {
            AuthenticationConfiguration: se_AuthenticationConfiguration(input.AuthenticationConfiguration, context),
        }),
        ...(input.AutoDeploymentsEnabled != null && { AutoDeploymentsEnabled: input.AutoDeploymentsEnabled }),
        ...(input.CodeRepository != null && { CodeRepository: se_CodeRepository(input.CodeRepository, context) }),
        ...(input.ImageRepository != null && { ImageRepository: se_ImageRepository(input.ImageRepository, context) }),
    };
};
const se_StartDeploymentRequest = (input, context) => {
    return {
        ...(input.ServiceArn != null && { ServiceArn: input.ServiceArn }),
    };
};
const se_StringList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        return entry;
    });
};
const se_Tag = (input, context) => {
    return {
        ...(input.Key != null && { Key: input.Key }),
        ...(input.Value != null && { Value: input.Value }),
    };
};
const se_TagKeyList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        return entry;
    });
};
const se_TagList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        return se_Tag(entry, context);
    });
};
const se_TagResourceRequest = (input, context) => {
    return {
        ...(input.ResourceArn != null && { ResourceArn: input.ResourceArn }),
        ...(input.Tags != null && { Tags: se_TagList(input.Tags, context) }),
    };
};
const se_TraceConfiguration = (input, context) => {
    return {
        ...(input.Vendor != null && { Vendor: input.Vendor }),
    };
};
const se_UntagResourceRequest = (input, context) => {
    return {
        ...(input.ResourceArn != null && { ResourceArn: input.ResourceArn }),
        ...(input.TagKeys != null && { TagKeys: se_TagKeyList(input.TagKeys, context) }),
    };
};
const se_UpdateServiceRequest = (input, context) => {
    return {
        ...(input.AutoScalingConfigurationArn != null && {
            AutoScalingConfigurationArn: input.AutoScalingConfigurationArn,
        }),
        ...(input.HealthCheckConfiguration != null && {
            HealthCheckConfiguration: se_HealthCheckConfiguration(input.HealthCheckConfiguration, context),
        }),
        ...(input.InstanceConfiguration != null && {
            InstanceConfiguration: se_InstanceConfiguration(input.InstanceConfiguration, context),
        }),
        ...(input.NetworkConfiguration != null && {
            NetworkConfiguration: se_NetworkConfiguration(input.NetworkConfiguration, context),
        }),
        ...(input.ObservabilityConfiguration != null && {
            ObservabilityConfiguration: se_ServiceObservabilityConfiguration(input.ObservabilityConfiguration, context),
        }),
        ...(input.ServiceArn != null && { ServiceArn: input.ServiceArn }),
        ...(input.SourceConfiguration != null && {
            SourceConfiguration: se_SourceConfiguration(input.SourceConfiguration, context),
        }),
    };
};
const se_UpdateVpcIngressConnectionRequest = (input, context) => {
    return {
        ...(input.IngressVpcConfiguration != null && {
            IngressVpcConfiguration: se_IngressVpcConfiguration(input.IngressVpcConfiguration, context),
        }),
        ...(input.VpcIngressConnectionArn != null && { VpcIngressConnectionArn: input.VpcIngressConnectionArn }),
    };
};
const de_AssociateCustomDomainResponse = (output, context) => {
    return {
        CustomDomain: output.CustomDomain != null ? de_CustomDomain(output.CustomDomain, context) : undefined,
        DNSTarget: (0, smithy_client_1.expectString)(output.DNSTarget),
        ServiceArn: (0, smithy_client_1.expectString)(output.ServiceArn),
        VpcDNSTargets: output.VpcDNSTargets != null ? de_VpcDNSTargetList(output.VpcDNSTargets, context) : undefined,
    };
};
const de_AuthenticationConfiguration = (output, context) => {
    return {
        AccessRoleArn: (0, smithy_client_1.expectString)(output.AccessRoleArn),
        ConnectionArn: (0, smithy_client_1.expectString)(output.ConnectionArn),
    };
};
const de_AutoScalingConfiguration = (output, context) => {
    return {
        AutoScalingConfigurationArn: (0, smithy_client_1.expectString)(output.AutoScalingConfigurationArn),
        AutoScalingConfigurationName: (0, smithy_client_1.expectString)(output.AutoScalingConfigurationName),
        AutoScalingConfigurationRevision: (0, smithy_client_1.expectInt32)(output.AutoScalingConfigurationRevision),
        CreatedAt: output.CreatedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.CreatedAt))) : undefined,
        DeletedAt: output.DeletedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.DeletedAt))) : undefined,
        Latest: (0, smithy_client_1.expectBoolean)(output.Latest),
        MaxConcurrency: (0, smithy_client_1.expectInt32)(output.MaxConcurrency),
        MaxSize: (0, smithy_client_1.expectInt32)(output.MaxSize),
        MinSize: (0, smithy_client_1.expectInt32)(output.MinSize),
        Status: (0, smithy_client_1.expectString)(output.Status),
    };
};
const de_AutoScalingConfigurationSummary = (output, context) => {
    return {
        AutoScalingConfigurationArn: (0, smithy_client_1.expectString)(output.AutoScalingConfigurationArn),
        AutoScalingConfigurationName: (0, smithy_client_1.expectString)(output.AutoScalingConfigurationName),
        AutoScalingConfigurationRevision: (0, smithy_client_1.expectInt32)(output.AutoScalingConfigurationRevision),
    };
};
const de_AutoScalingConfigurationSummaryList = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return de_AutoScalingConfigurationSummary(entry, context);
    });
    return retVal;
};
const de_CertificateValidationRecord = (output, context) => {
    return {
        Name: (0, smithy_client_1.expectString)(output.Name),
        Status: (0, smithy_client_1.expectString)(output.Status),
        Type: (0, smithy_client_1.expectString)(output.Type),
        Value: (0, smithy_client_1.expectString)(output.Value),
    };
};
const de_CertificateValidationRecordList = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return de_CertificateValidationRecord(entry, context);
    });
    return retVal;
};
const de_CodeConfiguration = (output, context) => {
    return {
        CodeConfigurationValues: output.CodeConfigurationValues != null
            ? de_CodeConfigurationValues(output.CodeConfigurationValues, context)
            : undefined,
        ConfigurationSource: (0, smithy_client_1.expectString)(output.ConfigurationSource),
    };
};
const de_CodeConfigurationValues = (output, context) => {
    return {
        BuildCommand: (0, smithy_client_1.expectString)(output.BuildCommand),
        Port: (0, smithy_client_1.expectString)(output.Port),
        Runtime: (0, smithy_client_1.expectString)(output.Runtime),
        RuntimeEnvironmentSecrets: output.RuntimeEnvironmentSecrets != null
            ? de_RuntimeEnvironmentSecrets(output.RuntimeEnvironmentSecrets, context)
            : undefined,
        RuntimeEnvironmentVariables: output.RuntimeEnvironmentVariables != null
            ? de_RuntimeEnvironmentVariables(output.RuntimeEnvironmentVariables, context)
            : undefined,
        StartCommand: (0, smithy_client_1.expectString)(output.StartCommand),
    };
};
const de_CodeRepository = (output, context) => {
    return {
        CodeConfiguration: output.CodeConfiguration != null ? de_CodeConfiguration(output.CodeConfiguration, context) : undefined,
        RepositoryUrl: (0, smithy_client_1.expectString)(output.RepositoryUrl),
        SourceCodeVersion: output.SourceCodeVersion != null ? de_SourceCodeVersion(output.SourceCodeVersion, context) : undefined,
    };
};
const de_Connection = (output, context) => {
    return {
        ConnectionArn: (0, smithy_client_1.expectString)(output.ConnectionArn),
        ConnectionName: (0, smithy_client_1.expectString)(output.ConnectionName),
        CreatedAt: output.CreatedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.CreatedAt))) : undefined,
        ProviderType: (0, smithy_client_1.expectString)(output.ProviderType),
        Status: (0, smithy_client_1.expectString)(output.Status),
    };
};
const de_ConnectionSummary = (output, context) => {
    return {
        ConnectionArn: (0, smithy_client_1.expectString)(output.ConnectionArn),
        ConnectionName: (0, smithy_client_1.expectString)(output.ConnectionName),
        CreatedAt: output.CreatedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.CreatedAt))) : undefined,
        ProviderType: (0, smithy_client_1.expectString)(output.ProviderType),
        Status: (0, smithy_client_1.expectString)(output.Status),
    };
};
const de_ConnectionSummaryList = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return de_ConnectionSummary(entry, context);
    });
    return retVal;
};
const de_CreateAutoScalingConfigurationResponse = (output, context) => {
    return {
        AutoScalingConfiguration: output.AutoScalingConfiguration != null
            ? de_AutoScalingConfiguration(output.AutoScalingConfiguration, context)
            : undefined,
    };
};
const de_CreateConnectionResponse = (output, context) => {
    return {
        Connection: output.Connection != null ? de_Connection(output.Connection, context) : undefined,
    };
};
const de_CreateObservabilityConfigurationResponse = (output, context) => {
    return {
        ObservabilityConfiguration: output.ObservabilityConfiguration != null
            ? de_ObservabilityConfiguration(output.ObservabilityConfiguration, context)
            : undefined,
    };
};
const de_CreateServiceResponse = (output, context) => {
    return {
        OperationId: (0, smithy_client_1.expectString)(output.OperationId),
        Service: output.Service != null ? de_Service(output.Service, context) : undefined,
    };
};
const de_CreateVpcConnectorResponse = (output, context) => {
    return {
        VpcConnector: output.VpcConnector != null ? de_VpcConnector(output.VpcConnector, context) : undefined,
    };
};
const de_CreateVpcIngressConnectionResponse = (output, context) => {
    return {
        VpcIngressConnection: output.VpcIngressConnection != null ? de_VpcIngressConnection(output.VpcIngressConnection, context) : undefined,
    };
};
const de_CustomDomain = (output, context) => {
    return {
        CertificateValidationRecords: output.CertificateValidationRecords != null
            ? de_CertificateValidationRecordList(output.CertificateValidationRecords, context)
            : undefined,
        DomainName: (0, smithy_client_1.expectString)(output.DomainName),
        EnableWWWSubdomain: (0, smithy_client_1.expectBoolean)(output.EnableWWWSubdomain),
        Status: (0, smithy_client_1.expectString)(output.Status),
    };
};
const de_CustomDomainList = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return de_CustomDomain(entry, context);
    });
    return retVal;
};
const de_DeleteAutoScalingConfigurationResponse = (output, context) => {
    return {
        AutoScalingConfiguration: output.AutoScalingConfiguration != null
            ? de_AutoScalingConfiguration(output.AutoScalingConfiguration, context)
            : undefined,
    };
};
const de_DeleteConnectionResponse = (output, context) => {
    return {
        Connection: output.Connection != null ? de_Connection(output.Connection, context) : undefined,
    };
};
const de_DeleteObservabilityConfigurationResponse = (output, context) => {
    return {
        ObservabilityConfiguration: output.ObservabilityConfiguration != null
            ? de_ObservabilityConfiguration(output.ObservabilityConfiguration, context)
            : undefined,
    };
};
const de_DeleteServiceResponse = (output, context) => {
    return {
        OperationId: (0, smithy_client_1.expectString)(output.OperationId),
        Service: output.Service != null ? de_Service(output.Service, context) : undefined,
    };
};
const de_DeleteVpcConnectorResponse = (output, context) => {
    return {
        VpcConnector: output.VpcConnector != null ? de_VpcConnector(output.VpcConnector, context) : undefined,
    };
};
const de_DeleteVpcIngressConnectionResponse = (output, context) => {
    return {
        VpcIngressConnection: output.VpcIngressConnection != null ? de_VpcIngressConnection(output.VpcIngressConnection, context) : undefined,
    };
};
const de_DescribeAutoScalingConfigurationResponse = (output, context) => {
    return {
        AutoScalingConfiguration: output.AutoScalingConfiguration != null
            ? de_AutoScalingConfiguration(output.AutoScalingConfiguration, context)
            : undefined,
    };
};
const de_DescribeCustomDomainsResponse = (output, context) => {
    return {
        CustomDomains: output.CustomDomains != null ? de_CustomDomainList(output.CustomDomains, context) : undefined,
        DNSTarget: (0, smithy_client_1.expectString)(output.DNSTarget),
        NextToken: (0, smithy_client_1.expectString)(output.NextToken),
        ServiceArn: (0, smithy_client_1.expectString)(output.ServiceArn),
        VpcDNSTargets: output.VpcDNSTargets != null ? de_VpcDNSTargetList(output.VpcDNSTargets, context) : undefined,
    };
};
const de_DescribeObservabilityConfigurationResponse = (output, context) => {
    return {
        ObservabilityConfiguration: output.ObservabilityConfiguration != null
            ? de_ObservabilityConfiguration(output.ObservabilityConfiguration, context)
            : undefined,
    };
};
const de_DescribeServiceResponse = (output, context) => {
    return {
        Service: output.Service != null ? de_Service(output.Service, context) : undefined,
    };
};
const de_DescribeVpcConnectorResponse = (output, context) => {
    return {
        VpcConnector: output.VpcConnector != null ? de_VpcConnector(output.VpcConnector, context) : undefined,
    };
};
const de_DescribeVpcIngressConnectionResponse = (output, context) => {
    return {
        VpcIngressConnection: output.VpcIngressConnection != null ? de_VpcIngressConnection(output.VpcIngressConnection, context) : undefined,
    };
};
const de_DisassociateCustomDomainResponse = (output, context) => {
    return {
        CustomDomain: output.CustomDomain != null ? de_CustomDomain(output.CustomDomain, context) : undefined,
        DNSTarget: (0, smithy_client_1.expectString)(output.DNSTarget),
        ServiceArn: (0, smithy_client_1.expectString)(output.ServiceArn),
        VpcDNSTargets: output.VpcDNSTargets != null ? de_VpcDNSTargetList(output.VpcDNSTargets, context) : undefined,
    };
};
const de_EgressConfiguration = (output, context) => {
    return {
        EgressType: (0, smithy_client_1.expectString)(output.EgressType),
        VpcConnectorArn: (0, smithy_client_1.expectString)(output.VpcConnectorArn),
    };
};
const de_EncryptionConfiguration = (output, context) => {
    return {
        KmsKey: (0, smithy_client_1.expectString)(output.KmsKey),
    };
};
const de_HealthCheckConfiguration = (output, context) => {
    return {
        HealthyThreshold: (0, smithy_client_1.expectInt32)(output.HealthyThreshold),
        Interval: (0, smithy_client_1.expectInt32)(output.Interval),
        Path: (0, smithy_client_1.expectString)(output.Path),
        Protocol: (0, smithy_client_1.expectString)(output.Protocol),
        Timeout: (0, smithy_client_1.expectInt32)(output.Timeout),
        UnhealthyThreshold: (0, smithy_client_1.expectInt32)(output.UnhealthyThreshold),
    };
};
const de_ImageConfiguration = (output, context) => {
    return {
        Port: (0, smithy_client_1.expectString)(output.Port),
        RuntimeEnvironmentSecrets: output.RuntimeEnvironmentSecrets != null
            ? de_RuntimeEnvironmentSecrets(output.RuntimeEnvironmentSecrets, context)
            : undefined,
        RuntimeEnvironmentVariables: output.RuntimeEnvironmentVariables != null
            ? de_RuntimeEnvironmentVariables(output.RuntimeEnvironmentVariables, context)
            : undefined,
        StartCommand: (0, smithy_client_1.expectString)(output.StartCommand),
    };
};
const de_ImageRepository = (output, context) => {
    return {
        ImageConfiguration: output.ImageConfiguration != null ? de_ImageConfiguration(output.ImageConfiguration, context) : undefined,
        ImageIdentifier: (0, smithy_client_1.expectString)(output.ImageIdentifier),
        ImageRepositoryType: (0, smithy_client_1.expectString)(output.ImageRepositoryType),
    };
};
const de_IngressConfiguration = (output, context) => {
    return {
        IsPubliclyAccessible: (0, smithy_client_1.expectBoolean)(output.IsPubliclyAccessible),
    };
};
const de_IngressVpcConfiguration = (output, context) => {
    return {
        VpcEndpointId: (0, smithy_client_1.expectString)(output.VpcEndpointId),
        VpcId: (0, smithy_client_1.expectString)(output.VpcId),
    };
};
const de_InstanceConfiguration = (output, context) => {
    return {
        Cpu: (0, smithy_client_1.expectString)(output.Cpu),
        InstanceRoleArn: (0, smithy_client_1.expectString)(output.InstanceRoleArn),
        Memory: (0, smithy_client_1.expectString)(output.Memory),
    };
};
const de_InternalServiceErrorException = (output, context) => {
    return {
        Message: (0, smithy_client_1.expectString)(output.Message),
    };
};
const de_InvalidRequestException = (output, context) => {
    return {
        Message: (0, smithy_client_1.expectString)(output.Message),
    };
};
const de_InvalidStateException = (output, context) => {
    return {
        Message: (0, smithy_client_1.expectString)(output.Message),
    };
};
const de_ListAutoScalingConfigurationsResponse = (output, context) => {
    return {
        AutoScalingConfigurationSummaryList: output.AutoScalingConfigurationSummaryList != null
            ? de_AutoScalingConfigurationSummaryList(output.AutoScalingConfigurationSummaryList, context)
            : undefined,
        NextToken: (0, smithy_client_1.expectString)(output.NextToken),
    };
};
const de_ListConnectionsResponse = (output, context) => {
    return {
        ConnectionSummaryList: output.ConnectionSummaryList != null
            ? de_ConnectionSummaryList(output.ConnectionSummaryList, context)
            : undefined,
        NextToken: (0, smithy_client_1.expectString)(output.NextToken),
    };
};
const de_ListObservabilityConfigurationsResponse = (output, context) => {
    return {
        NextToken: (0, smithy_client_1.expectString)(output.NextToken),
        ObservabilityConfigurationSummaryList: output.ObservabilityConfigurationSummaryList != null
            ? de_ObservabilityConfigurationSummaryList(output.ObservabilityConfigurationSummaryList, context)
            : undefined,
    };
};
const de_ListOperationsResponse = (output, context) => {
    return {
        NextToken: (0, smithy_client_1.expectString)(output.NextToken),
        OperationSummaryList: output.OperationSummaryList != null ? de_OperationSummaryList(output.OperationSummaryList, context) : undefined,
    };
};
const de_ListServicesResponse = (output, context) => {
    return {
        NextToken: (0, smithy_client_1.expectString)(output.NextToken),
        ServiceSummaryList: output.ServiceSummaryList != null ? de_ServiceSummaryList(output.ServiceSummaryList, context) : undefined,
    };
};
const de_ListTagsForResourceResponse = (output, context) => {
    return {
        Tags: output.Tags != null ? de_TagList(output.Tags, context) : undefined,
    };
};
const de_ListVpcConnectorsResponse = (output, context) => {
    return {
        NextToken: (0, smithy_client_1.expectString)(output.NextToken),
        VpcConnectors: output.VpcConnectors != null ? de_VpcConnectors(output.VpcConnectors, context) : undefined,
    };
};
const de_ListVpcIngressConnectionsResponse = (output, context) => {
    return {
        NextToken: (0, smithy_client_1.expectString)(output.NextToken),
        VpcIngressConnectionSummaryList: output.VpcIngressConnectionSummaryList != null
            ? de_VpcIngressConnectionSummaryList(output.VpcIngressConnectionSummaryList, context)
            : undefined,
    };
};
const de_NetworkConfiguration = (output, context) => {
    return {
        EgressConfiguration: output.EgressConfiguration != null ? de_EgressConfiguration(output.EgressConfiguration, context) : undefined,
        IngressConfiguration: output.IngressConfiguration != null ? de_IngressConfiguration(output.IngressConfiguration, context) : undefined,
    };
};
const de_ObservabilityConfiguration = (output, context) => {
    return {
        CreatedAt: output.CreatedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.CreatedAt))) : undefined,
        DeletedAt: output.DeletedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.DeletedAt))) : undefined,
        Latest: (0, smithy_client_1.expectBoolean)(output.Latest),
        ObservabilityConfigurationArn: (0, smithy_client_1.expectString)(output.ObservabilityConfigurationArn),
        ObservabilityConfigurationName: (0, smithy_client_1.expectString)(output.ObservabilityConfigurationName),
        ObservabilityConfigurationRevision: (0, smithy_client_1.expectInt32)(output.ObservabilityConfigurationRevision),
        Status: (0, smithy_client_1.expectString)(output.Status),
        TraceConfiguration: output.TraceConfiguration != null ? de_TraceConfiguration(output.TraceConfiguration, context) : undefined,
    };
};
const de_ObservabilityConfigurationSummary = (output, context) => {
    return {
        ObservabilityConfigurationArn: (0, smithy_client_1.expectString)(output.ObservabilityConfigurationArn),
        ObservabilityConfigurationName: (0, smithy_client_1.expectString)(output.ObservabilityConfigurationName),
        ObservabilityConfigurationRevision: (0, smithy_client_1.expectInt32)(output.ObservabilityConfigurationRevision),
    };
};
const de_ObservabilityConfigurationSummaryList = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return de_ObservabilityConfigurationSummary(entry, context);
    });
    return retVal;
};
const de_OperationSummary = (output, context) => {
    return {
        EndedAt: output.EndedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.EndedAt))) : undefined,
        Id: (0, smithy_client_1.expectString)(output.Id),
        StartedAt: output.StartedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.StartedAt))) : undefined,
        Status: (0, smithy_client_1.expectString)(output.Status),
        TargetArn: (0, smithy_client_1.expectString)(output.TargetArn),
        Type: (0, smithy_client_1.expectString)(output.Type),
        UpdatedAt: output.UpdatedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.UpdatedAt))) : undefined,
    };
};
const de_OperationSummaryList = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return de_OperationSummary(entry, context);
    });
    return retVal;
};
const de_PauseServiceResponse = (output, context) => {
    return {
        OperationId: (0, smithy_client_1.expectString)(output.OperationId),
        Service: output.Service != null ? de_Service(output.Service, context) : undefined,
    };
};
const de_ResourceNotFoundException = (output, context) => {
    return {
        Message: (0, smithy_client_1.expectString)(output.Message),
    };
};
const de_ResumeServiceResponse = (output, context) => {
    return {
        OperationId: (0, smithy_client_1.expectString)(output.OperationId),
        Service: output.Service != null ? de_Service(output.Service, context) : undefined,
    };
};
const de_RuntimeEnvironmentSecrets = (output, context) => {
    return Object.entries(output).reduce((acc, [key, value]) => {
        if (value === null) {
            return acc;
        }
        acc[key] = (0, smithy_client_1.expectString)(value);
        return acc;
    }, {});
};
const de_RuntimeEnvironmentVariables = (output, context) => {
    return Object.entries(output).reduce((acc, [key, value]) => {
        if (value === null) {
            return acc;
        }
        acc[key] = (0, smithy_client_1.expectString)(value);
        return acc;
    }, {});
};
const de_Service = (output, context) => {
    return {
        AutoScalingConfigurationSummary: output.AutoScalingConfigurationSummary != null
            ? de_AutoScalingConfigurationSummary(output.AutoScalingConfigurationSummary, context)
            : undefined,
        CreatedAt: output.CreatedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.CreatedAt))) : undefined,
        DeletedAt: output.DeletedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.DeletedAt))) : undefined,
        EncryptionConfiguration: output.EncryptionConfiguration != null
            ? de_EncryptionConfiguration(output.EncryptionConfiguration, context)
            : undefined,
        HealthCheckConfiguration: output.HealthCheckConfiguration != null
            ? de_HealthCheckConfiguration(output.HealthCheckConfiguration, context)
            : undefined,
        InstanceConfiguration: output.InstanceConfiguration != null
            ? de_InstanceConfiguration(output.InstanceConfiguration, context)
            : undefined,
        NetworkConfiguration: output.NetworkConfiguration != null ? de_NetworkConfiguration(output.NetworkConfiguration, context) : undefined,
        ObservabilityConfiguration: output.ObservabilityConfiguration != null
            ? de_ServiceObservabilityConfiguration(output.ObservabilityConfiguration, context)
            : undefined,
        ServiceArn: (0, smithy_client_1.expectString)(output.ServiceArn),
        ServiceId: (0, smithy_client_1.expectString)(output.ServiceId),
        ServiceName: (0, smithy_client_1.expectString)(output.ServiceName),
        ServiceUrl: (0, smithy_client_1.expectString)(output.ServiceUrl),
        SourceConfiguration: output.SourceConfiguration != null ? de_SourceConfiguration(output.SourceConfiguration, context) : undefined,
        Status: (0, smithy_client_1.expectString)(output.Status),
        UpdatedAt: output.UpdatedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.UpdatedAt))) : undefined,
    };
};
const de_ServiceObservabilityConfiguration = (output, context) => {
    return {
        ObservabilityConfigurationArn: (0, smithy_client_1.expectString)(output.ObservabilityConfigurationArn),
        ObservabilityEnabled: (0, smithy_client_1.expectBoolean)(output.ObservabilityEnabled),
    };
};
const de_ServiceQuotaExceededException = (output, context) => {
    return {
        Message: (0, smithy_client_1.expectString)(output.Message),
    };
};
const de_ServiceSummary = (output, context) => {
    return {
        CreatedAt: output.CreatedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.CreatedAt))) : undefined,
        ServiceArn: (0, smithy_client_1.expectString)(output.ServiceArn),
        ServiceId: (0, smithy_client_1.expectString)(output.ServiceId),
        ServiceName: (0, smithy_client_1.expectString)(output.ServiceName),
        ServiceUrl: (0, smithy_client_1.expectString)(output.ServiceUrl),
        Status: (0, smithy_client_1.expectString)(output.Status),
        UpdatedAt: output.UpdatedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.UpdatedAt))) : undefined,
    };
};
const de_ServiceSummaryList = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return de_ServiceSummary(entry, context);
    });
    return retVal;
};
const de_SourceCodeVersion = (output, context) => {
    return {
        Type: (0, smithy_client_1.expectString)(output.Type),
        Value: (0, smithy_client_1.expectString)(output.Value),
    };
};
const de_SourceConfiguration = (output, context) => {
    return {
        AuthenticationConfiguration: output.AuthenticationConfiguration != null
            ? de_AuthenticationConfiguration(output.AuthenticationConfiguration, context)
            : undefined,
        AutoDeploymentsEnabled: (0, smithy_client_1.expectBoolean)(output.AutoDeploymentsEnabled),
        CodeRepository: output.CodeRepository != null ? de_CodeRepository(output.CodeRepository, context) : undefined,
        ImageRepository: output.ImageRepository != null ? de_ImageRepository(output.ImageRepository, context) : undefined,
    };
};
const de_StartDeploymentResponse = (output, context) => {
    return {
        OperationId: (0, smithy_client_1.expectString)(output.OperationId),
    };
};
const de_StringList = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return (0, smithy_client_1.expectString)(entry);
    });
    return retVal;
};
const de_Tag = (output, context) => {
    return {
        Key: (0, smithy_client_1.expectString)(output.Key),
        Value: (0, smithy_client_1.expectString)(output.Value),
    };
};
const de_TagList = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return de_Tag(entry, context);
    });
    return retVal;
};
const de_TagResourceResponse = (output, context) => {
    return {};
};
const de_TraceConfiguration = (output, context) => {
    return {
        Vendor: (0, smithy_client_1.expectString)(output.Vendor),
    };
};
const de_UntagResourceResponse = (output, context) => {
    return {};
};
const de_UpdateServiceResponse = (output, context) => {
    return {
        OperationId: (0, smithy_client_1.expectString)(output.OperationId),
        Service: output.Service != null ? de_Service(output.Service, context) : undefined,
    };
};
const de_UpdateVpcIngressConnectionResponse = (output, context) => {
    return {
        VpcIngressConnection: output.VpcIngressConnection != null ? de_VpcIngressConnection(output.VpcIngressConnection, context) : undefined,
    };
};
const de_VpcConnector = (output, context) => {
    return {
        CreatedAt: output.CreatedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.CreatedAt))) : undefined,
        DeletedAt: output.DeletedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.DeletedAt))) : undefined,
        SecurityGroups: output.SecurityGroups != null ? de_StringList(output.SecurityGroups, context) : undefined,
        Status: (0, smithy_client_1.expectString)(output.Status),
        Subnets: output.Subnets != null ? de_StringList(output.Subnets, context) : undefined,
        VpcConnectorArn: (0, smithy_client_1.expectString)(output.VpcConnectorArn),
        VpcConnectorName: (0, smithy_client_1.expectString)(output.VpcConnectorName),
        VpcConnectorRevision: (0, smithy_client_1.expectInt32)(output.VpcConnectorRevision),
    };
};
const de_VpcConnectors = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return de_VpcConnector(entry, context);
    });
    return retVal;
};
const de_VpcDNSTarget = (output, context) => {
    return {
        DomainName: (0, smithy_client_1.expectString)(output.DomainName),
        VpcId: (0, smithy_client_1.expectString)(output.VpcId),
        VpcIngressConnectionArn: (0, smithy_client_1.expectString)(output.VpcIngressConnectionArn),
    };
};
const de_VpcDNSTargetList = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return de_VpcDNSTarget(entry, context);
    });
    return retVal;
};
const de_VpcIngressConnection = (output, context) => {
    return {
        AccountId: (0, smithy_client_1.expectString)(output.AccountId),
        CreatedAt: output.CreatedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.CreatedAt))) : undefined,
        DeletedAt: output.DeletedAt != null ? (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseEpochTimestamp)((0, smithy_client_1.expectNumber)(output.DeletedAt))) : undefined,
        DomainName: (0, smithy_client_1.expectString)(output.DomainName),
        IngressVpcConfiguration: output.IngressVpcConfiguration != null
            ? de_IngressVpcConfiguration(output.IngressVpcConfiguration, context)
            : undefined,
        ServiceArn: (0, smithy_client_1.expectString)(output.ServiceArn),
        Status: (0, smithy_client_1.expectString)(output.Status),
        VpcIngressConnectionArn: (0, smithy_client_1.expectString)(output.VpcIngressConnectionArn),
        VpcIngressConnectionName: (0, smithy_client_1.expectString)(output.VpcIngressConnectionName),
    };
};
const de_VpcIngressConnectionSummary = (output, context) => {
    return {
        ServiceArn: (0, smithy_client_1.expectString)(output.ServiceArn),
        VpcIngressConnectionArn: (0, smithy_client_1.expectString)(output.VpcIngressConnectionArn),
    };
};
const de_VpcIngressConnectionSummaryList = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return de_VpcIngressConnectionSummary(entry, context);
    });
    return retVal;
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});
const collectBody = (streamBody = new Uint8Array(), context) => {
    if (streamBody instanceof Uint8Array) {
        return Promise.resolve(streamBody);
    }
    return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
};
const collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
const buildHttpRpcRequest = async (context, headers, path, resolvedHostname, body) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const contents = {
        protocol,
        hostname,
        port,
        method: "POST",
        path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
        headers,
    };
    if (resolvedHostname !== undefined) {
        contents.hostname = resolvedHostname;
    }
    if (body !== undefined) {
        contents.body = body;
    }
    return new protocol_http_1.HttpRequest(contents);
};
const parseBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
    if (encoded.length) {
        return JSON.parse(encoded);
    }
    return {};
});
const parseErrorBody = async (errorBody, context) => {
    const value = await parseBody(errorBody, context);
    value.message = value.message ?? value.Message;
    return value;
};
const loadRestJsonErrorCode = (output, data) => {
    const findKey = (object, key) => Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase());
    const sanitizeErrorCode = (rawValue) => {
        let cleanValue = rawValue;
        if (typeof cleanValue === "number") {
            cleanValue = cleanValue.toString();
        }
        if (cleanValue.indexOf(",") >= 0) {
            cleanValue = cleanValue.split(",")[0];
        }
        if (cleanValue.indexOf(":") >= 0) {
            cleanValue = cleanValue.split(":")[0];
        }
        if (cleanValue.indexOf("#") >= 0) {
            cleanValue = cleanValue.split("#")[1];
        }
        return cleanValue;
    };
    const headerKey = findKey(output.headers, "x-amzn-errortype");
    if (headerKey !== undefined) {
        return sanitizeErrorCode(output.headers[headerKey]);
    }
    if (data.code !== undefined) {
        return sanitizeErrorCode(data.code);
    }
    if (data["__type"] !== undefined) {
        return sanitizeErrorCode(data["__type"]);
    }
};


/***/ }),

/***/ 9930:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRuntimeConfig = void 0;
const tslib_1 = __nccwpck_require__(4351);
const package_json_1 = tslib_1.__importDefault(__nccwpck_require__(9276));
const client_sts_1 = __nccwpck_require__(2209);
const config_resolver_1 = __nccwpck_require__(6153);
const credential_provider_node_1 = __nccwpck_require__(5531);
const hash_node_1 = __nccwpck_require__(7442);
const middleware_retry_1 = __nccwpck_require__(6064);
const node_config_provider_1 = __nccwpck_require__(7684);
const node_http_handler_1 = __nccwpck_require__(8805);
const util_body_length_node_1 = __nccwpck_require__(4147);
const util_retry_1 = __nccwpck_require__(9395);
const util_user_agent_node_1 = __nccwpck_require__(8095);
const runtimeConfig_shared_1 = __nccwpck_require__(7626);
const smithy_client_1 = __nccwpck_require__(4963);
const util_defaults_mode_node_1 = __nccwpck_require__(4243);
const smithy_client_2 = __nccwpck_require__(4963);
const getRuntimeConfig = (config) => {
    (0, smithy_client_2.emitWarningIfUnsupportedVersion)(process.version);
    const defaultsMode = (0, util_defaults_mode_node_1.resolveDefaultsModeConfig)(config);
    const defaultConfigProvider = () => defaultsMode().then(smithy_client_1.loadConfigsForDefaultMode);
    const clientSharedValues = (0, runtimeConfig_shared_1.getRuntimeConfig)(config);
    return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        defaultsMode,
        bodyLengthChecker: config?.bodyLengthChecker ?? util_body_length_node_1.calculateBodyLength,
        credentialDefaultProvider: config?.credentialDefaultProvider ?? (0, client_sts_1.decorateDefaultCredentialProvider)(credential_provider_node_1.defaultProvider),
        defaultUserAgentProvider: config?.defaultUserAgentProvider ??
            (0, util_user_agent_node_1.defaultUserAgent)({ serviceId: clientSharedValues.serviceId, clientVersion: package_json_1.default.version }),
        maxAttempts: config?.maxAttempts ?? (0, node_config_provider_1.loadConfig)(middleware_retry_1.NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
        region: config?.region ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_REGION_CONFIG_OPTIONS, config_resolver_1.NODE_REGION_CONFIG_FILE_OPTIONS),
        requestHandler: config?.requestHandler ?? new node_http_handler_1.NodeHttpHandler(defaultConfigProvider),
        retryMode: config?.retryMode ??
            (0, node_config_provider_1.loadConfig)({
                ...middleware_retry_1.NODE_RETRY_MODE_CONFIG_OPTIONS,
                default: async () => (await defaultConfigProvider()).retryMode || util_retry_1.DEFAULT_RETRY_MODE,
            }),
        sha256: config?.sha256 ?? hash_node_1.Hash.bind(null, "sha256"),
        streamCollector: config?.streamCollector ?? node_http_handler_1.streamCollector,
        useDualstackEndpoint: config?.useDualstackEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
        useFipsEndpoint: config?.useFipsEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS),
    };
};
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),

/***/ 7626:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRuntimeConfig = void 0;
const smithy_client_1 = __nccwpck_require__(4963);
const url_parser_1 = __nccwpck_require__(2992);
const util_base64_1 = __nccwpck_require__(7727);
const util_utf8_1 = __nccwpck_require__(2855);
const endpointResolver_1 = __nccwpck_require__(1454);
const getRuntimeConfig = (config) => ({
    apiVersion: "2020-05-15",
    base64Decoder: config?.base64Decoder ?? util_base64_1.fromBase64,
    base64Encoder: config?.base64Encoder ?? util_base64_1.toBase64,
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? endpointResolver_1.defaultEndpointResolver,
    logger: config?.logger ?? new smithy_client_1.NoOpLogger(),
    serviceId: config?.serviceId ?? "AppRunner",
    urlParser: config?.urlParser ?? url_parser_1.parseUrl,
    utf8Decoder: config?.utf8Decoder ?? util_utf8_1.fromUtf8,
    utf8Encoder: config?.utf8Encoder ?? util_utf8_1.toUtf8,
});
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),

/***/ 7124:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SSOOIDC = void 0;
const CreateTokenCommand_1 = __nccwpck_require__(2853);
const RegisterClientCommand_1 = __nccwpck_require__(6677);
const StartDeviceAuthorizationCommand_1 = __nccwpck_require__(8359);
const SSOOIDCClient_1 = __nccwpck_require__(139);
class SSOOIDC extends SSOOIDCClient_1.SSOOIDCClient {
    createToken(args, optionsOrCb, cb) {
        const command = new CreateTokenCommand_1.CreateTokenCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    registerClient(args, optionsOrCb, cb) {
        const command = new RegisterClientCommand_1.RegisterClientCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    startDeviceAuthorization(args, optionsOrCb, cb) {
        const command = new StartDeviceAuthorizationCommand_1.StartDeviceAuthorizationCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
}
exports.SSOOIDC = SSOOIDC;


/***/ }),

/***/ 139:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SSOOIDCClient = void 0;
const config_resolver_1 = __nccwpck_require__(6153);
const middleware_content_length_1 = __nccwpck_require__(2245);
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_host_header_1 = __nccwpck_require__(2545);
const middleware_logger_1 = __nccwpck_require__(14);
const middleware_recursion_detection_1 = __nccwpck_require__(5525);
const middleware_retry_1 = __nccwpck_require__(6064);
const middleware_user_agent_1 = __nccwpck_require__(4688);
const smithy_client_1 = __nccwpck_require__(4963);
const EndpointParameters_1 = __nccwpck_require__(1426);
const runtimeConfig_1 = __nccwpck_require__(5524);
class SSOOIDCClient extends smithy_client_1.Client {
    constructor(configuration) {
        const _config_0 = (0, runtimeConfig_1.getRuntimeConfig)(configuration);
        const _config_1 = (0, EndpointParameters_1.resolveClientEndpointParameters)(_config_0);
        const _config_2 = (0, config_resolver_1.resolveRegionConfig)(_config_1);
        const _config_3 = (0, middleware_endpoint_1.resolveEndpointConfig)(_config_2);
        const _config_4 = (0, middleware_retry_1.resolveRetryConfig)(_config_3);
        const _config_5 = (0, middleware_host_header_1.resolveHostHeaderConfig)(_config_4);
        const _config_6 = (0, middleware_user_agent_1.resolveUserAgentConfig)(_config_5);
        super(_config_6);
        this.config = _config_6;
        this.middlewareStack.use((0, middleware_retry_1.getRetryPlugin)(this.config));
        this.middlewareStack.use((0, middleware_content_length_1.getContentLengthPlugin)(this.config));
        this.middlewareStack.use((0, middleware_host_header_1.getHostHeaderPlugin)(this.config));
        this.middlewareStack.use((0, middleware_logger_1.getLoggerPlugin)(this.config));
        this.middlewareStack.use((0, middleware_recursion_detection_1.getRecursionDetectionPlugin)(this.config));
        this.middlewareStack.use((0, middleware_user_agent_1.getUserAgentPlugin)(this.config));
    }
    destroy() {
        super.destroy();
    }
}
exports.SSOOIDCClient = SSOOIDCClient;


/***/ }),

/***/ 2853:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTokenCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_restJson1_1 = __nccwpck_require__(1518);
class CreateTokenCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, CreateTokenCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOOIDCClient";
        const commandName = "CreateTokenCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_restJson1_1.se_CreateTokenCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_restJson1_1.de_CreateTokenCommand)(output, context);
    }
}
exports.CreateTokenCommand = CreateTokenCommand;


/***/ }),

/***/ 6677:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterClientCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_restJson1_1 = __nccwpck_require__(1518);
class RegisterClientCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, RegisterClientCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOOIDCClient";
        const commandName = "RegisterClientCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_restJson1_1.se_RegisterClientCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_restJson1_1.de_RegisterClientCommand)(output, context);
    }
}
exports.RegisterClientCommand = RegisterClientCommand;


/***/ }),

/***/ 8359:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StartDeviceAuthorizationCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_restJson1_1 = __nccwpck_require__(1518);
class StartDeviceAuthorizationCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, StartDeviceAuthorizationCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOOIDCClient";
        const commandName = "StartDeviceAuthorizationCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_restJson1_1.se_StartDeviceAuthorizationCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_restJson1_1.de_StartDeviceAuthorizationCommand)(output, context);
    }
}
exports.StartDeviceAuthorizationCommand = StartDeviceAuthorizationCommand;


/***/ }),

/***/ 447:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(2853), exports);
tslib_1.__exportStar(__nccwpck_require__(6677), exports);
tslib_1.__exportStar(__nccwpck_require__(8359), exports);


/***/ }),

/***/ 1426:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveClientEndpointParameters = void 0;
const resolveClientEndpointParameters = (options) => {
    return {
        ...options,
        useDualstackEndpoint: options.useDualstackEndpoint ?? false,
        useFipsEndpoint: options.useFipsEndpoint ?? false,
        defaultSigningName: "awsssooidc",
    };
};
exports.resolveClientEndpointParameters = resolveClientEndpointParameters;


/***/ }),

/***/ 7604:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultEndpointResolver = void 0;
const util_endpoints_1 = __nccwpck_require__(3350);
const ruleset_1 = __nccwpck_require__(1756);
const defaultEndpointResolver = (endpointParams, context = {}) => {
    return (0, util_endpoints_1.resolveEndpoint)(ruleset_1.ruleSet, {
        endpointParams: endpointParams,
        logger: context.logger,
    });
};
exports.defaultEndpointResolver = defaultEndpointResolver;


/***/ }),

/***/ 1756:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ruleSet = void 0;
const p = "required", q = "fn", r = "argv", s = "ref";
const a = "PartitionResult", b = "tree", c = "error", d = "endpoint", e = { [p]: false, "type": "String" }, f = { [p]: true, "default": false, "type": "Boolean" }, g = { [s]: "Endpoint" }, h = { [q]: "booleanEquals", [r]: [{ [s]: "UseFIPS" }, true] }, i = { [q]: "booleanEquals", [r]: [{ [s]: "UseDualStack" }, true] }, j = {}, k = { [q]: "booleanEquals", [r]: [true, { [q]: "getAttr", [r]: [{ [s]: a }, "supportsFIPS"] }] }, l = { [q]: "booleanEquals", [r]: [true, { [q]: "getAttr", [r]: [{ [s]: a }, "supportsDualStack"] }] }, m = [g], n = [h], o = [i];
const _data = { version: "1.0", parameters: { Region: e, UseDualStack: f, UseFIPS: f, Endpoint: e }, rules: [{ conditions: [{ [q]: "aws.partition", [r]: [{ [s]: "Region" }], assign: a }], type: b, rules: [{ conditions: [{ [q]: "isSet", [r]: m }, { [q]: "parseURL", [r]: m, assign: "url" }], type: b, rules: [{ conditions: n, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: c }, { type: b, rules: [{ conditions: o, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: c }, { endpoint: { url: g, properties: j, headers: j }, type: d }] }] }, { conditions: [h, i], type: b, rules: [{ conditions: [k, l], type: b, rules: [{ endpoint: { url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: j, headers: j }, type: d }] }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: c }] }, { conditions: n, type: b, rules: [{ conditions: [k], type: b, rules: [{ type: b, rules: [{ endpoint: { url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}", properties: j, headers: j }, type: d }] }] }, { error: "FIPS is enabled but this partition does not support FIPS", type: c }] }, { conditions: o, type: b, rules: [{ conditions: [l], type: b, rules: [{ endpoint: { url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: j, headers: j }, type: d }] }, { error: "DualStack is enabled but this partition does not support DualStack", type: c }] }, { endpoint: { url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}", properties: j, headers: j }, type: d }] }] };
exports.ruleSet = _data;


/***/ }),

/***/ 4527:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SSOOIDCServiceException = void 0;
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(7124), exports);
tslib_1.__exportStar(__nccwpck_require__(139), exports);
tslib_1.__exportStar(__nccwpck_require__(447), exports);
tslib_1.__exportStar(__nccwpck_require__(5973), exports);
var SSOOIDCServiceException_1 = __nccwpck_require__(3026);
Object.defineProperty(exports, "SSOOIDCServiceException", ({ enumerable: true, get: function () { return SSOOIDCServiceException_1.SSOOIDCServiceException; } }));


/***/ }),

/***/ 3026:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SSOOIDCServiceException = void 0;
const smithy_client_1 = __nccwpck_require__(4963);
class SSOOIDCServiceException extends smithy_client_1.ServiceException {
    constructor(options) {
        super(options);
        Object.setPrototypeOf(this, SSOOIDCServiceException.prototype);
    }
}
exports.SSOOIDCServiceException = SSOOIDCServiceException;


/***/ }),

/***/ 5973:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(9374), exports);


/***/ }),

/***/ 9374:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvalidClientMetadataException = exports.UnsupportedGrantTypeException = exports.UnauthorizedClientException = exports.SlowDownException = exports.InvalidScopeException = exports.InvalidRequestException = exports.InvalidGrantException = exports.InvalidClientException = exports.InternalServerException = exports.ExpiredTokenException = exports.AuthorizationPendingException = exports.AccessDeniedException = void 0;
const SSOOIDCServiceException_1 = __nccwpck_require__(3026);
class AccessDeniedException extends SSOOIDCServiceException_1.SSOOIDCServiceException {
    constructor(opts) {
        super({
            name: "AccessDeniedException",
            $fault: "client",
            ...opts,
        });
        this.name = "AccessDeniedException";
        this.$fault = "client";
        Object.setPrototypeOf(this, AccessDeniedException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
exports.AccessDeniedException = AccessDeniedException;
class AuthorizationPendingException extends SSOOIDCServiceException_1.SSOOIDCServiceException {
    constructor(opts) {
        super({
            name: "AuthorizationPendingException",
            $fault: "client",
            ...opts,
        });
        this.name = "AuthorizationPendingException";
        this.$fault = "client";
        Object.setPrototypeOf(this, AuthorizationPendingException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
exports.AuthorizationPendingException = AuthorizationPendingException;
class ExpiredTokenException extends SSOOIDCServiceException_1.SSOOIDCServiceException {
    constructor(opts) {
        super({
            name: "ExpiredTokenException",
            $fault: "client",
            ...opts,
        });
        this.name = "ExpiredTokenException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ExpiredTokenException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
exports.ExpiredTokenException = ExpiredTokenException;
class InternalServerException extends SSOOIDCServiceException_1.SSOOIDCServiceException {
    constructor(opts) {
        super({
            name: "InternalServerException",
            $fault: "server",
            ...opts,
        });
        this.name = "InternalServerException";
        this.$fault = "server";
        Object.setPrototypeOf(this, InternalServerException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
exports.InternalServerException = InternalServerException;
class InvalidClientException extends SSOOIDCServiceException_1.SSOOIDCServiceException {
    constructor(opts) {
        super({
            name: "InvalidClientException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidClientException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidClientException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
exports.InvalidClientException = InvalidClientException;
class InvalidGrantException extends SSOOIDCServiceException_1.SSOOIDCServiceException {
    constructor(opts) {
        super({
            name: "InvalidGrantException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidGrantException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidGrantException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
exports.InvalidGrantException = InvalidGrantException;
class InvalidRequestException extends SSOOIDCServiceException_1.SSOOIDCServiceException {
    constructor(opts) {
        super({
            name: "InvalidRequestException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidRequestException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidRequestException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
exports.InvalidRequestException = InvalidRequestException;
class InvalidScopeException extends SSOOIDCServiceException_1.SSOOIDCServiceException {
    constructor(opts) {
        super({
            name: "InvalidScopeException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidScopeException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidScopeException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
exports.InvalidScopeException = InvalidScopeException;
class SlowDownException extends SSOOIDCServiceException_1.SSOOIDCServiceException {
    constructor(opts) {
        super({
            name: "SlowDownException",
            $fault: "client",
            ...opts,
        });
        this.name = "SlowDownException";
        this.$fault = "client";
        Object.setPrototypeOf(this, SlowDownException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
exports.SlowDownException = SlowDownException;
class UnauthorizedClientException extends SSOOIDCServiceException_1.SSOOIDCServiceException {
    constructor(opts) {
        super({
            name: "UnauthorizedClientException",
            $fault: "client",
            ...opts,
        });
        this.name = "UnauthorizedClientException";
        this.$fault = "client";
        Object.setPrototypeOf(this, UnauthorizedClientException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
exports.UnauthorizedClientException = UnauthorizedClientException;
class UnsupportedGrantTypeException extends SSOOIDCServiceException_1.SSOOIDCServiceException {
    constructor(opts) {
        super({
            name: "UnsupportedGrantTypeException",
            $fault: "client",
            ...opts,
        });
        this.name = "UnsupportedGrantTypeException";
        this.$fault = "client";
        Object.setPrototypeOf(this, UnsupportedGrantTypeException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
exports.UnsupportedGrantTypeException = UnsupportedGrantTypeException;
class InvalidClientMetadataException extends SSOOIDCServiceException_1.SSOOIDCServiceException {
    constructor(opts) {
        super({
            name: "InvalidClientMetadataException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidClientMetadataException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidClientMetadataException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
exports.InvalidClientMetadataException = InvalidClientMetadataException;


/***/ }),

/***/ 1518:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.de_StartDeviceAuthorizationCommand = exports.de_RegisterClientCommand = exports.de_CreateTokenCommand = exports.se_StartDeviceAuthorizationCommand = exports.se_RegisterClientCommand = exports.se_CreateTokenCommand = void 0;
const protocol_http_1 = __nccwpck_require__(223);
const smithy_client_1 = __nccwpck_require__(4963);
const models_0_1 = __nccwpck_require__(9374);
const SSOOIDCServiceException_1 = __nccwpck_require__(3026);
const se_CreateTokenCommand = async (input, context) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const headers = {
        "content-type": "application/json",
    };
    const resolvedPath = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}` + "/token";
    let body;
    body = JSON.stringify({
        ...(input.clientId != null && { clientId: input.clientId }),
        ...(input.clientSecret != null && { clientSecret: input.clientSecret }),
        ...(input.code != null && { code: input.code }),
        ...(input.deviceCode != null && { deviceCode: input.deviceCode }),
        ...(input.grantType != null && { grantType: input.grantType }),
        ...(input.redirectUri != null && { redirectUri: input.redirectUri }),
        ...(input.refreshToken != null && { refreshToken: input.refreshToken }),
        ...(input.scope != null && { scope: se_Scopes(input.scope, context) }),
    });
    return new protocol_http_1.HttpRequest({
        protocol,
        hostname,
        port,
        method: "POST",
        headers,
        path: resolvedPath,
        body,
    });
};
exports.se_CreateTokenCommand = se_CreateTokenCommand;
const se_RegisterClientCommand = async (input, context) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const headers = {
        "content-type": "application/json",
    };
    const resolvedPath = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}` + "/client/register";
    let body;
    body = JSON.stringify({
        ...(input.clientName != null && { clientName: input.clientName }),
        ...(input.clientType != null && { clientType: input.clientType }),
        ...(input.scopes != null && { scopes: se_Scopes(input.scopes, context) }),
    });
    return new protocol_http_1.HttpRequest({
        protocol,
        hostname,
        port,
        method: "POST",
        headers,
        path: resolvedPath,
        body,
    });
};
exports.se_RegisterClientCommand = se_RegisterClientCommand;
const se_StartDeviceAuthorizationCommand = async (input, context) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const headers = {
        "content-type": "application/json",
    };
    const resolvedPath = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}` + "/device_authorization";
    let body;
    body = JSON.stringify({
        ...(input.clientId != null && { clientId: input.clientId }),
        ...(input.clientSecret != null && { clientSecret: input.clientSecret }),
        ...(input.startUrl != null && { startUrl: input.startUrl }),
    });
    return new protocol_http_1.HttpRequest({
        protocol,
        hostname,
        port,
        method: "POST",
        headers,
        path: resolvedPath,
        body,
    });
};
exports.se_StartDeviceAuthorizationCommand = se_StartDeviceAuthorizationCommand;
const de_CreateTokenCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CreateTokenCommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = (0, smithy_client_1.expectNonNull)((0, smithy_client_1.expectObject)(await parseBody(output.body, context)), "body");
    if (data.accessToken != null) {
        contents.accessToken = (0, smithy_client_1.expectString)(data.accessToken);
    }
    if (data.expiresIn != null) {
        contents.expiresIn = (0, smithy_client_1.expectInt32)(data.expiresIn);
    }
    if (data.idToken != null) {
        contents.idToken = (0, smithy_client_1.expectString)(data.idToken);
    }
    if (data.refreshToken != null) {
        contents.refreshToken = (0, smithy_client_1.expectString)(data.refreshToken);
    }
    if (data.tokenType != null) {
        contents.tokenType = (0, smithy_client_1.expectString)(data.tokenType);
    }
    return contents;
};
exports.de_CreateTokenCommand = de_CreateTokenCommand;
const de_CreateTokenCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "AccessDeniedException":
        case "com.amazonaws.ssooidc#AccessDeniedException":
            throw await de_AccessDeniedExceptionRes(parsedOutput, context);
        case "AuthorizationPendingException":
        case "com.amazonaws.ssooidc#AuthorizationPendingException":
            throw await de_AuthorizationPendingExceptionRes(parsedOutput, context);
        case "ExpiredTokenException":
        case "com.amazonaws.ssooidc#ExpiredTokenException":
            throw await de_ExpiredTokenExceptionRes(parsedOutput, context);
        case "InternalServerException":
        case "com.amazonaws.ssooidc#InternalServerException":
            throw await de_InternalServerExceptionRes(parsedOutput, context);
        case "InvalidClientException":
        case "com.amazonaws.ssooidc#InvalidClientException":
            throw await de_InvalidClientExceptionRes(parsedOutput, context);
        case "InvalidGrantException":
        case "com.amazonaws.ssooidc#InvalidGrantException":
            throw await de_InvalidGrantExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.ssooidc#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "InvalidScopeException":
        case "com.amazonaws.ssooidc#InvalidScopeException":
            throw await de_InvalidScopeExceptionRes(parsedOutput, context);
        case "SlowDownException":
        case "com.amazonaws.ssooidc#SlowDownException":
            throw await de_SlowDownExceptionRes(parsedOutput, context);
        case "UnauthorizedClientException":
        case "com.amazonaws.ssooidc#UnauthorizedClientException":
            throw await de_UnauthorizedClientExceptionRes(parsedOutput, context);
        case "UnsupportedGrantTypeException":
        case "com.amazonaws.ssooidc#UnsupportedGrantTypeException":
            throw await de_UnsupportedGrantTypeExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: SSOOIDCServiceException_1.SSOOIDCServiceException,
                errorCode,
            });
    }
};
const de_RegisterClientCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_RegisterClientCommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = (0, smithy_client_1.expectNonNull)((0, smithy_client_1.expectObject)(await parseBody(output.body, context)), "body");
    if (data.authorizationEndpoint != null) {
        contents.authorizationEndpoint = (0, smithy_client_1.expectString)(data.authorizationEndpoint);
    }
    if (data.clientId != null) {
        contents.clientId = (0, smithy_client_1.expectString)(data.clientId);
    }
    if (data.clientIdIssuedAt != null) {
        contents.clientIdIssuedAt = (0, smithy_client_1.expectLong)(data.clientIdIssuedAt);
    }
    if (data.clientSecret != null) {
        contents.clientSecret = (0, smithy_client_1.expectString)(data.clientSecret);
    }
    if (data.clientSecretExpiresAt != null) {
        contents.clientSecretExpiresAt = (0, smithy_client_1.expectLong)(data.clientSecretExpiresAt);
    }
    if (data.tokenEndpoint != null) {
        contents.tokenEndpoint = (0, smithy_client_1.expectString)(data.tokenEndpoint);
    }
    return contents;
};
exports.de_RegisterClientCommand = de_RegisterClientCommand;
const de_RegisterClientCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServerException":
        case "com.amazonaws.ssooidc#InternalServerException":
            throw await de_InternalServerExceptionRes(parsedOutput, context);
        case "InvalidClientMetadataException":
        case "com.amazonaws.ssooidc#InvalidClientMetadataException":
            throw await de_InvalidClientMetadataExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.ssooidc#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "InvalidScopeException":
        case "com.amazonaws.ssooidc#InvalidScopeException":
            throw await de_InvalidScopeExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: SSOOIDCServiceException_1.SSOOIDCServiceException,
                errorCode,
            });
    }
};
const de_StartDeviceAuthorizationCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_StartDeviceAuthorizationCommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = (0, smithy_client_1.expectNonNull)((0, smithy_client_1.expectObject)(await parseBody(output.body, context)), "body");
    if (data.deviceCode != null) {
        contents.deviceCode = (0, smithy_client_1.expectString)(data.deviceCode);
    }
    if (data.expiresIn != null) {
        contents.expiresIn = (0, smithy_client_1.expectInt32)(data.expiresIn);
    }
    if (data.interval != null) {
        contents.interval = (0, smithy_client_1.expectInt32)(data.interval);
    }
    if (data.userCode != null) {
        contents.userCode = (0, smithy_client_1.expectString)(data.userCode);
    }
    if (data.verificationUri != null) {
        contents.verificationUri = (0, smithy_client_1.expectString)(data.verificationUri);
    }
    if (data.verificationUriComplete != null) {
        contents.verificationUriComplete = (0, smithy_client_1.expectString)(data.verificationUriComplete);
    }
    return contents;
};
exports.de_StartDeviceAuthorizationCommand = de_StartDeviceAuthorizationCommand;
const de_StartDeviceAuthorizationCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InternalServerException":
        case "com.amazonaws.ssooidc#InternalServerException":
            throw await de_InternalServerExceptionRes(parsedOutput, context);
        case "InvalidClientException":
        case "com.amazonaws.ssooidc#InvalidClientException":
            throw await de_InvalidClientExceptionRes(parsedOutput, context);
        case "InvalidRequestException":
        case "com.amazonaws.ssooidc#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "SlowDownException":
        case "com.amazonaws.ssooidc#SlowDownException":
            throw await de_SlowDownExceptionRes(parsedOutput, context);
        case "UnauthorizedClientException":
        case "com.amazonaws.ssooidc#UnauthorizedClientException":
            throw await de_UnauthorizedClientExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: SSOOIDCServiceException_1.SSOOIDCServiceException,
                errorCode,
            });
    }
};
const map = smithy_client_1.map;
const de_AccessDeniedExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.error != null) {
        contents.error = (0, smithy_client_1.expectString)(data.error);
    }
    if (data.error_description != null) {
        contents.error_description = (0, smithy_client_1.expectString)(data.error_description);
    }
    const exception = new models_0_1.AccessDeniedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const de_AuthorizationPendingExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.error != null) {
        contents.error = (0, smithy_client_1.expectString)(data.error);
    }
    if (data.error_description != null) {
        contents.error_description = (0, smithy_client_1.expectString)(data.error_description);
    }
    const exception = new models_0_1.AuthorizationPendingException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const de_ExpiredTokenExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.error != null) {
        contents.error = (0, smithy_client_1.expectString)(data.error);
    }
    if (data.error_description != null) {
        contents.error_description = (0, smithy_client_1.expectString)(data.error_description);
    }
    const exception = new models_0_1.ExpiredTokenException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const de_InternalServerExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.error != null) {
        contents.error = (0, smithy_client_1.expectString)(data.error);
    }
    if (data.error_description != null) {
        contents.error_description = (0, smithy_client_1.expectString)(data.error_description);
    }
    const exception = new models_0_1.InternalServerException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const de_InvalidClientExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.error != null) {
        contents.error = (0, smithy_client_1.expectString)(data.error);
    }
    if (data.error_description != null) {
        contents.error_description = (0, smithy_client_1.expectString)(data.error_description);
    }
    const exception = new models_0_1.InvalidClientException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const de_InvalidClientMetadataExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.error != null) {
        contents.error = (0, smithy_client_1.expectString)(data.error);
    }
    if (data.error_description != null) {
        contents.error_description = (0, smithy_client_1.expectString)(data.error_description);
    }
    const exception = new models_0_1.InvalidClientMetadataException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const de_InvalidGrantExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.error != null) {
        contents.error = (0, smithy_client_1.expectString)(data.error);
    }
    if (data.error_description != null) {
        contents.error_description = (0, smithy_client_1.expectString)(data.error_description);
    }
    const exception = new models_0_1.InvalidGrantException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const de_InvalidRequestExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.error != null) {
        contents.error = (0, smithy_client_1.expectString)(data.error);
    }
    if (data.error_description != null) {
        contents.error_description = (0, smithy_client_1.expectString)(data.error_description);
    }
    const exception = new models_0_1.InvalidRequestException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const de_InvalidScopeExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.error != null) {
        contents.error = (0, smithy_client_1.expectString)(data.error);
    }
    if (data.error_description != null) {
        contents.error_description = (0, smithy_client_1.expectString)(data.error_description);
    }
    const exception = new models_0_1.InvalidScopeException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const de_SlowDownExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.error != null) {
        contents.error = (0, smithy_client_1.expectString)(data.error);
    }
    if (data.error_description != null) {
        contents.error_description = (0, smithy_client_1.expectString)(data.error_description);
    }
    const exception = new models_0_1.SlowDownException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const de_UnauthorizedClientExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.error != null) {
        contents.error = (0, smithy_client_1.expectString)(data.error);
    }
    if (data.error_description != null) {
        contents.error_description = (0, smithy_client_1.expectString)(data.error_description);
    }
    const exception = new models_0_1.UnauthorizedClientException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const de_UnsupportedGrantTypeExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.error != null) {
        contents.error = (0, smithy_client_1.expectString)(data.error);
    }
    if (data.error_description != null) {
        contents.error_description = (0, smithy_client_1.expectString)(data.error_description);
    }
    const exception = new models_0_1.UnsupportedGrantTypeException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const se_Scopes = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        return entry;
    });
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});
const collectBody = (streamBody = new Uint8Array(), context) => {
    if (streamBody instanceof Uint8Array) {
        return Promise.resolve(streamBody);
    }
    return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
};
const collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
const isSerializableHeaderValue = (value) => value !== undefined &&
    value !== null &&
    value !== "" &&
    (!Object.getOwnPropertyNames(value).includes("length") || value.length != 0) &&
    (!Object.getOwnPropertyNames(value).includes("size") || value.size != 0);
const parseBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
    if (encoded.length) {
        return JSON.parse(encoded);
    }
    return {};
});
const parseErrorBody = async (errorBody, context) => {
    const value = await parseBody(errorBody, context);
    value.message = value.message ?? value.Message;
    return value;
};
const loadRestJsonErrorCode = (output, data) => {
    const findKey = (object, key) => Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase());
    const sanitizeErrorCode = (rawValue) => {
        let cleanValue = rawValue;
        if (typeof cleanValue === "number") {
            cleanValue = cleanValue.toString();
        }
        if (cleanValue.indexOf(",") >= 0) {
            cleanValue = cleanValue.split(",")[0];
        }
        if (cleanValue.indexOf(":") >= 0) {
            cleanValue = cleanValue.split(":")[0];
        }
        if (cleanValue.indexOf("#") >= 0) {
            cleanValue = cleanValue.split("#")[1];
        }
        return cleanValue;
    };
    const headerKey = findKey(output.headers, "x-amzn-errortype");
    if (headerKey !== undefined) {
        return sanitizeErrorCode(output.headers[headerKey]);
    }
    if (data.code !== undefined) {
        return sanitizeErrorCode(data.code);
    }
    if (data["__type"] !== undefined) {
        return sanitizeErrorCode(data["__type"]);
    }
};


/***/ }),

/***/ 5524:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRuntimeConfig = void 0;
const tslib_1 = __nccwpck_require__(4351);
const package_json_1 = tslib_1.__importDefault(__nccwpck_require__(9722));
const config_resolver_1 = __nccwpck_require__(6153);
const hash_node_1 = __nccwpck_require__(7442);
const middleware_retry_1 = __nccwpck_require__(6064);
const node_config_provider_1 = __nccwpck_require__(7684);
const node_http_handler_1 = __nccwpck_require__(8805);
const util_body_length_node_1 = __nccwpck_require__(4147);
const util_retry_1 = __nccwpck_require__(9395);
const util_user_agent_node_1 = __nccwpck_require__(8095);
const runtimeConfig_shared_1 = __nccwpck_require__(8005);
const smithy_client_1 = __nccwpck_require__(4963);
const util_defaults_mode_node_1 = __nccwpck_require__(4243);
const smithy_client_2 = __nccwpck_require__(4963);
const getRuntimeConfig = (config) => {
    (0, smithy_client_2.emitWarningIfUnsupportedVersion)(process.version);
    const defaultsMode = (0, util_defaults_mode_node_1.resolveDefaultsModeConfig)(config);
    const defaultConfigProvider = () => defaultsMode().then(smithy_client_1.loadConfigsForDefaultMode);
    const clientSharedValues = (0, runtimeConfig_shared_1.getRuntimeConfig)(config);
    return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        defaultsMode,
        bodyLengthChecker: config?.bodyLengthChecker ?? util_body_length_node_1.calculateBodyLength,
        defaultUserAgentProvider: config?.defaultUserAgentProvider ??
            (0, util_user_agent_node_1.defaultUserAgent)({ serviceId: clientSharedValues.serviceId, clientVersion: package_json_1.default.version }),
        maxAttempts: config?.maxAttempts ?? (0, node_config_provider_1.loadConfig)(middleware_retry_1.NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
        region: config?.region ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_REGION_CONFIG_OPTIONS, config_resolver_1.NODE_REGION_CONFIG_FILE_OPTIONS),
        requestHandler: config?.requestHandler ?? new node_http_handler_1.NodeHttpHandler(defaultConfigProvider),
        retryMode: config?.retryMode ??
            (0, node_config_provider_1.loadConfig)({
                ...middleware_retry_1.NODE_RETRY_MODE_CONFIG_OPTIONS,
                default: async () => (await defaultConfigProvider()).retryMode || util_retry_1.DEFAULT_RETRY_MODE,
            }),
        sha256: config?.sha256 ?? hash_node_1.Hash.bind(null, "sha256"),
        streamCollector: config?.streamCollector ?? node_http_handler_1.streamCollector,
        useDualstackEndpoint: config?.useDualstackEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
        useFipsEndpoint: config?.useFipsEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS),
    };
};
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),

/***/ 8005:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRuntimeConfig = void 0;
const smithy_client_1 = __nccwpck_require__(4963);
const url_parser_1 = __nccwpck_require__(2992);
const util_base64_1 = __nccwpck_require__(7727);
const util_utf8_1 = __nccwpck_require__(2855);
const endpointResolver_1 = __nccwpck_require__(7604);
const getRuntimeConfig = (config) => ({
    apiVersion: "2019-06-10",
    base64Decoder: config?.base64Decoder ?? util_base64_1.fromBase64,
    base64Encoder: config?.base64Encoder ?? util_base64_1.toBase64,
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? endpointResolver_1.defaultEndpointResolver,
    logger: config?.logger ?? new smithy_client_1.NoOpLogger(),
    serviceId: config?.serviceId ?? "SSO OIDC",
    urlParser: config?.urlParser ?? url_parser_1.parseUrl,
    utf8Decoder: config?.utf8Decoder ?? util_utf8_1.fromUtf8,
    utf8Encoder: config?.utf8Encoder ?? util_utf8_1.toUtf8,
});
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),

/***/ 9838:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SSO = void 0;
const GetRoleCredentialsCommand_1 = __nccwpck_require__(8972);
const ListAccountRolesCommand_1 = __nccwpck_require__(1513);
const ListAccountsCommand_1 = __nccwpck_require__(5009);
const LogoutCommand_1 = __nccwpck_require__(2586);
const SSOClient_1 = __nccwpck_require__(1057);
class SSO extends SSOClient_1.SSOClient {
    getRoleCredentials(args, optionsOrCb, cb) {
        const command = new GetRoleCredentialsCommand_1.GetRoleCredentialsCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    listAccountRoles(args, optionsOrCb, cb) {
        const command = new ListAccountRolesCommand_1.ListAccountRolesCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    listAccounts(args, optionsOrCb, cb) {
        const command = new ListAccountsCommand_1.ListAccountsCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    logout(args, optionsOrCb, cb) {
        const command = new LogoutCommand_1.LogoutCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
}
exports.SSO = SSO;


/***/ }),

/***/ 1057:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SSOClient = void 0;
const config_resolver_1 = __nccwpck_require__(6153);
const middleware_content_length_1 = __nccwpck_require__(2245);
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_host_header_1 = __nccwpck_require__(2545);
const middleware_logger_1 = __nccwpck_require__(14);
const middleware_recursion_detection_1 = __nccwpck_require__(5525);
const middleware_retry_1 = __nccwpck_require__(6064);
const middleware_user_agent_1 = __nccwpck_require__(4688);
const smithy_client_1 = __nccwpck_require__(4963);
const EndpointParameters_1 = __nccwpck_require__(4214);
const runtimeConfig_1 = __nccwpck_require__(9756);
class SSOClient extends smithy_client_1.Client {
    constructor(configuration) {
        const _config_0 = (0, runtimeConfig_1.getRuntimeConfig)(configuration);
        const _config_1 = (0, EndpointParameters_1.resolveClientEndpointParameters)(_config_0);
        const _config_2 = (0, config_resolver_1.resolveRegionConfig)(_config_1);
        const _config_3 = (0, middleware_endpoint_1.resolveEndpointConfig)(_config_2);
        const _config_4 = (0, middleware_retry_1.resolveRetryConfig)(_config_3);
        const _config_5 = (0, middleware_host_header_1.resolveHostHeaderConfig)(_config_4);
        const _config_6 = (0, middleware_user_agent_1.resolveUserAgentConfig)(_config_5);
        super(_config_6);
        this.config = _config_6;
        this.middlewareStack.use((0, middleware_retry_1.getRetryPlugin)(this.config));
        this.middlewareStack.use((0, middleware_content_length_1.getContentLengthPlugin)(this.config));
        this.middlewareStack.use((0, middleware_host_header_1.getHostHeaderPlugin)(this.config));
        this.middlewareStack.use((0, middleware_logger_1.getLoggerPlugin)(this.config));
        this.middlewareStack.use((0, middleware_recursion_detection_1.getRecursionDetectionPlugin)(this.config));
        this.middlewareStack.use((0, middleware_user_agent_1.getUserAgentPlugin)(this.config));
    }
    destroy() {
        super.destroy();
    }
}
exports.SSOClient = SSOClient;


/***/ }),

/***/ 8972:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetRoleCredentialsCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const models_0_1 = __nccwpck_require__(6390);
const Aws_restJson1_1 = __nccwpck_require__(8507);
class GetRoleCredentialsCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, GetRoleCredentialsCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOClient";
        const commandName = "GetRoleCredentialsCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.GetRoleCredentialsRequestFilterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.GetRoleCredentialsResponseFilterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_restJson1_1.se_GetRoleCredentialsCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_restJson1_1.de_GetRoleCredentialsCommand)(output, context);
    }
}
exports.GetRoleCredentialsCommand = GetRoleCredentialsCommand;


/***/ }),

/***/ 1513:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListAccountRolesCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const models_0_1 = __nccwpck_require__(6390);
const Aws_restJson1_1 = __nccwpck_require__(8507);
class ListAccountRolesCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, ListAccountRolesCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOClient";
        const commandName = "ListAccountRolesCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.ListAccountRolesRequestFilterSensitiveLog,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_restJson1_1.se_ListAccountRolesCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_restJson1_1.de_ListAccountRolesCommand)(output, context);
    }
}
exports.ListAccountRolesCommand = ListAccountRolesCommand;


/***/ }),

/***/ 5009:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListAccountsCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const models_0_1 = __nccwpck_require__(6390);
const Aws_restJson1_1 = __nccwpck_require__(8507);
class ListAccountsCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, ListAccountsCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOClient";
        const commandName = "ListAccountsCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.ListAccountsRequestFilterSensitiveLog,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_restJson1_1.se_ListAccountsCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_restJson1_1.de_ListAccountsCommand)(output, context);
    }
}
exports.ListAccountsCommand = ListAccountsCommand;


/***/ }),

/***/ 2586:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogoutCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const models_0_1 = __nccwpck_require__(6390);
const Aws_restJson1_1 = __nccwpck_require__(8507);
class LogoutCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, LogoutCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOClient";
        const commandName = "LogoutCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.LogoutRequestFilterSensitiveLog,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_restJson1_1.se_LogoutCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_restJson1_1.de_LogoutCommand)(output, context);
    }
}
exports.LogoutCommand = LogoutCommand;


/***/ }),

/***/ 5706:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(8972), exports);
tslib_1.__exportStar(__nccwpck_require__(1513), exports);
tslib_1.__exportStar(__nccwpck_require__(5009), exports);
tslib_1.__exportStar(__nccwpck_require__(2586), exports);


/***/ }),

/***/ 4214:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveClientEndpointParameters = void 0;
const resolveClientEndpointParameters = (options) => {
    return {
        ...options,
        useDualstackEndpoint: options.useDualstackEndpoint ?? false,
        useFipsEndpoint: options.useFipsEndpoint ?? false,
        defaultSigningName: "awsssoportal",
    };
};
exports.resolveClientEndpointParameters = resolveClientEndpointParameters;


/***/ }),

/***/ 898:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultEndpointResolver = void 0;
const util_endpoints_1 = __nccwpck_require__(3350);
const ruleset_1 = __nccwpck_require__(3341);
const defaultEndpointResolver = (endpointParams, context = {}) => {
    return (0, util_endpoints_1.resolveEndpoint)(ruleset_1.ruleSet, {
        endpointParams: endpointParams,
        logger: context.logger,
    });
};
exports.defaultEndpointResolver = defaultEndpointResolver;


/***/ }),

/***/ 3341:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ruleSet = void 0;
const p = "required", q = "fn", r = "argv", s = "ref";
const a = "PartitionResult", b = "tree", c = "error", d = "endpoint", e = { [p]: false, "type": "String" }, f = { [p]: true, "default": false, "type": "Boolean" }, g = { [s]: "Endpoint" }, h = { [q]: "booleanEquals", [r]: [{ [s]: "UseFIPS" }, true] }, i = { [q]: "booleanEquals", [r]: [{ [s]: "UseDualStack" }, true] }, j = {}, k = { [q]: "booleanEquals", [r]: [true, { [q]: "getAttr", [r]: [{ [s]: a }, "supportsFIPS"] }] }, l = { [q]: "booleanEquals", [r]: [true, { [q]: "getAttr", [r]: [{ [s]: a }, "supportsDualStack"] }] }, m = [g], n = [h], o = [i];
const _data = { version: "1.0", parameters: { Region: e, UseDualStack: f, UseFIPS: f, Endpoint: e }, rules: [{ conditions: [{ [q]: "aws.partition", [r]: [{ [s]: "Region" }], assign: a }], type: b, rules: [{ conditions: [{ [q]: "isSet", [r]: m }, { [q]: "parseURL", [r]: m, assign: "url" }], type: b, rules: [{ conditions: n, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: c }, { type: b, rules: [{ conditions: o, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: c }, { endpoint: { url: g, properties: j, headers: j }, type: d }] }] }, { conditions: [h, i], type: b, rules: [{ conditions: [k, l], type: b, rules: [{ endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: j, headers: j }, type: d }] }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: c }] }, { conditions: n, type: b, rules: [{ conditions: [k], type: b, rules: [{ type: b, rules: [{ endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}", properties: j, headers: j }, type: d }] }] }, { error: "FIPS is enabled but this partition does not support FIPS", type: c }] }, { conditions: o, type: b, rules: [{ conditions: [l], type: b, rules: [{ endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: j, headers: j }, type: d }] }, { error: "DualStack is enabled but this partition does not support DualStack", type: c }] }, { endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}", properties: j, headers: j }, type: d }] }] };
exports.ruleSet = _data;


/***/ }),

/***/ 2666:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SSOServiceException = void 0;
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(9838), exports);
tslib_1.__exportStar(__nccwpck_require__(1057), exports);
tslib_1.__exportStar(__nccwpck_require__(5706), exports);
tslib_1.__exportStar(__nccwpck_require__(4952), exports);
tslib_1.__exportStar(__nccwpck_require__(6773), exports);
var SSOServiceException_1 = __nccwpck_require__(1517);
Object.defineProperty(exports, "SSOServiceException", ({ enumerable: true, get: function () { return SSOServiceException_1.SSOServiceException; } }));


/***/ }),

/***/ 1517:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SSOServiceException = void 0;
const smithy_client_1 = __nccwpck_require__(4963);
class SSOServiceException extends smithy_client_1.ServiceException {
    constructor(options) {
        super(options);
        Object.setPrototypeOf(this, SSOServiceException.prototype);
    }
}
exports.SSOServiceException = SSOServiceException;


/***/ }),

/***/ 4952:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(6390), exports);


/***/ }),

/***/ 6390:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogoutRequestFilterSensitiveLog = exports.ListAccountsRequestFilterSensitiveLog = exports.ListAccountRolesRequestFilterSensitiveLog = exports.GetRoleCredentialsResponseFilterSensitiveLog = exports.RoleCredentialsFilterSensitiveLog = exports.GetRoleCredentialsRequestFilterSensitiveLog = exports.UnauthorizedException = exports.TooManyRequestsException = exports.ResourceNotFoundException = exports.InvalidRequestException = void 0;
const smithy_client_1 = __nccwpck_require__(4963);
const SSOServiceException_1 = __nccwpck_require__(1517);
class InvalidRequestException extends SSOServiceException_1.SSOServiceException {
    constructor(opts) {
        super({
            name: "InvalidRequestException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidRequestException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidRequestException.prototype);
    }
}
exports.InvalidRequestException = InvalidRequestException;
class ResourceNotFoundException extends SSOServiceException_1.SSOServiceException {
    constructor(opts) {
        super({
            name: "ResourceNotFoundException",
            $fault: "client",
            ...opts,
        });
        this.name = "ResourceNotFoundException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
    }
}
exports.ResourceNotFoundException = ResourceNotFoundException;
class TooManyRequestsException extends SSOServiceException_1.SSOServiceException {
    constructor(opts) {
        super({
            name: "TooManyRequestsException",
            $fault: "client",
            ...opts,
        });
        this.name = "TooManyRequestsException";
        this.$fault = "client";
        Object.setPrototypeOf(this, TooManyRequestsException.prototype);
    }
}
exports.TooManyRequestsException = TooManyRequestsException;
class UnauthorizedException extends SSOServiceException_1.SSOServiceException {
    constructor(opts) {
        super({
            name: "UnauthorizedException",
            $fault: "client",
            ...opts,
        });
        this.name = "UnauthorizedException";
        this.$fault = "client";
        Object.setPrototypeOf(this, UnauthorizedException.prototype);
    }
}
exports.UnauthorizedException = UnauthorizedException;
const GetRoleCredentialsRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.accessToken && { accessToken: smithy_client_1.SENSITIVE_STRING }),
});
exports.GetRoleCredentialsRequestFilterSensitiveLog = GetRoleCredentialsRequestFilterSensitiveLog;
const RoleCredentialsFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.secretAccessKey && { secretAccessKey: smithy_client_1.SENSITIVE_STRING }),
    ...(obj.sessionToken && { sessionToken: smithy_client_1.SENSITIVE_STRING }),
});
exports.RoleCredentialsFilterSensitiveLog = RoleCredentialsFilterSensitiveLog;
const GetRoleCredentialsResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.roleCredentials && { roleCredentials: (0, exports.RoleCredentialsFilterSensitiveLog)(obj.roleCredentials) }),
});
exports.GetRoleCredentialsResponseFilterSensitiveLog = GetRoleCredentialsResponseFilterSensitiveLog;
const ListAccountRolesRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.accessToken && { accessToken: smithy_client_1.SENSITIVE_STRING }),
});
exports.ListAccountRolesRequestFilterSensitiveLog = ListAccountRolesRequestFilterSensitiveLog;
const ListAccountsRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.accessToken && { accessToken: smithy_client_1.SENSITIVE_STRING }),
});
exports.ListAccountsRequestFilterSensitiveLog = ListAccountsRequestFilterSensitiveLog;
const LogoutRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.accessToken && { accessToken: smithy_client_1.SENSITIVE_STRING }),
});
exports.LogoutRequestFilterSensitiveLog = LogoutRequestFilterSensitiveLog;


/***/ }),

/***/ 849:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 8460:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.paginateListAccountRoles = void 0;
const ListAccountRolesCommand_1 = __nccwpck_require__(1513);
const SSOClient_1 = __nccwpck_require__(1057);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new ListAccountRolesCommand_1.ListAccountRolesCommand(input), ...args);
};
async function* paginateListAccountRoles(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.nextToken = token;
        input["maxResults"] = config.pageSize;
        if (config.client instanceof SSOClient_1.SSOClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected SSO | SSOClient");
        }
        yield page;
        const prevToken = token;
        token = page.nextToken;
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
    }
    return undefined;
}
exports.paginateListAccountRoles = paginateListAccountRoles;


/***/ }),

/***/ 938:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.paginateListAccounts = void 0;
const ListAccountsCommand_1 = __nccwpck_require__(5009);
const SSOClient_1 = __nccwpck_require__(1057);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new ListAccountsCommand_1.ListAccountsCommand(input), ...args);
};
async function* paginateListAccounts(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.nextToken = token;
        input["maxResults"] = config.pageSize;
        if (config.client instanceof SSOClient_1.SSOClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected SSO | SSOClient");
        }
        yield page;
        const prevToken = token;
        token = page.nextToken;
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
    }
    return undefined;
}
exports.paginateListAccounts = paginateListAccounts;


/***/ }),

/***/ 6773:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(849), exports);
tslib_1.__exportStar(__nccwpck_require__(8460), exports);
tslib_1.__exportStar(__nccwpck_require__(938), exports);


/***/ }),

/***/ 8507:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.de_LogoutCommand = exports.de_ListAccountsCommand = exports.de_ListAccountRolesCommand = exports.de_GetRoleCredentialsCommand = exports.se_LogoutCommand = exports.se_ListAccountsCommand = exports.se_ListAccountRolesCommand = exports.se_GetRoleCredentialsCommand = void 0;
const protocol_http_1 = __nccwpck_require__(223);
const smithy_client_1 = __nccwpck_require__(4963);
const models_0_1 = __nccwpck_require__(6390);
const SSOServiceException_1 = __nccwpck_require__(1517);
const se_GetRoleCredentialsCommand = async (input, context) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const headers = map({}, isSerializableHeaderValue, {
        "x-amz-sso_bearer_token": input.accessToken,
    });
    const resolvedPath = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}` + "/federation/credentials";
    const query = map({
        role_name: [, (0, smithy_client_1.expectNonNull)(input.roleName, `roleName`)],
        account_id: [, (0, smithy_client_1.expectNonNull)(input.accountId, `accountId`)],
    });
    let body;
    return new protocol_http_1.HttpRequest({
        protocol,
        hostname,
        port,
        method: "GET",
        headers,
        path: resolvedPath,
        query,
        body,
    });
};
exports.se_GetRoleCredentialsCommand = se_GetRoleCredentialsCommand;
const se_ListAccountRolesCommand = async (input, context) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const headers = map({}, isSerializableHeaderValue, {
        "x-amz-sso_bearer_token": input.accessToken,
    });
    const resolvedPath = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}` + "/assignment/roles";
    const query = map({
        next_token: [, input.nextToken],
        max_result: [() => input.maxResults !== void 0, () => input.maxResults.toString()],
        account_id: [, (0, smithy_client_1.expectNonNull)(input.accountId, `accountId`)],
    });
    let body;
    return new protocol_http_1.HttpRequest({
        protocol,
        hostname,
        port,
        method: "GET",
        headers,
        path: resolvedPath,
        query,
        body,
    });
};
exports.se_ListAccountRolesCommand = se_ListAccountRolesCommand;
const se_ListAccountsCommand = async (input, context) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const headers = map({}, isSerializableHeaderValue, {
        "x-amz-sso_bearer_token": input.accessToken,
    });
    const resolvedPath = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}` + "/assignment/accounts";
    const query = map({
        next_token: [, input.nextToken],
        max_result: [() => input.maxResults !== void 0, () => input.maxResults.toString()],
    });
    let body;
    return new protocol_http_1.HttpRequest({
        protocol,
        hostname,
        port,
        method: "GET",
        headers,
        path: resolvedPath,
        query,
        body,
    });
};
exports.se_ListAccountsCommand = se_ListAccountsCommand;
const se_LogoutCommand = async (input, context) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const headers = map({}, isSerializableHeaderValue, {
        "x-amz-sso_bearer_token": input.accessToken,
    });
    const resolvedPath = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}` + "/logout";
    let body;
    return new protocol_http_1.HttpRequest({
        protocol,
        hostname,
        port,
        method: "POST",
        headers,
        path: resolvedPath,
        body,
    });
};
exports.se_LogoutCommand = se_LogoutCommand;
const de_GetRoleCredentialsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_GetRoleCredentialsCommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = (0, smithy_client_1.expectNonNull)((0, smithy_client_1.expectObject)(await parseBody(output.body, context)), "body");
    if (data.roleCredentials != null) {
        contents.roleCredentials = de_RoleCredentials(data.roleCredentials, context);
    }
    return contents;
};
exports.de_GetRoleCredentialsCommand = de_GetRoleCredentialsCommand;
const de_GetRoleCredentialsCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
            throw await de_TooManyRequestsExceptionRes(parsedOutput, context);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
            throw await de_UnauthorizedExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: SSOServiceException_1.SSOServiceException,
                errorCode,
            });
    }
};
const de_ListAccountRolesCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_ListAccountRolesCommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = (0, smithy_client_1.expectNonNull)((0, smithy_client_1.expectObject)(await parseBody(output.body, context)), "body");
    if (data.nextToken != null) {
        contents.nextToken = (0, smithy_client_1.expectString)(data.nextToken);
    }
    if (data.roleList != null) {
        contents.roleList = de_RoleListType(data.roleList, context);
    }
    return contents;
};
exports.de_ListAccountRolesCommand = de_ListAccountRolesCommand;
const de_ListAccountRolesCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
            throw await de_TooManyRequestsExceptionRes(parsedOutput, context);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
            throw await de_UnauthorizedExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: SSOServiceException_1.SSOServiceException,
                errorCode,
            });
    }
};
const de_ListAccountsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_ListAccountsCommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = (0, smithy_client_1.expectNonNull)((0, smithy_client_1.expectObject)(await parseBody(output.body, context)), "body");
    if (data.accountList != null) {
        contents.accountList = de_AccountListType(data.accountList, context);
    }
    if (data.nextToken != null) {
        contents.nextToken = (0, smithy_client_1.expectString)(data.nextToken);
    }
    return contents;
};
exports.de_ListAccountsCommand = de_ListAccountsCommand;
const de_ListAccountsCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
            throw await de_TooManyRequestsExceptionRes(parsedOutput, context);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
            throw await de_UnauthorizedExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: SSOServiceException_1.SSOServiceException,
                errorCode,
            });
    }
};
const de_LogoutCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_LogoutCommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
exports.de_LogoutCommand = de_LogoutCommand;
const de_LogoutCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
            throw await de_TooManyRequestsExceptionRes(parsedOutput, context);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
            throw await de_UnauthorizedExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody,
                exceptionCtor: SSOServiceException_1.SSOServiceException,
                errorCode,
            });
    }
};
const map = smithy_client_1.map;
const de_InvalidRequestExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.message != null) {
        contents.message = (0, smithy_client_1.expectString)(data.message);
    }
    const exception = new models_0_1.InvalidRequestException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const de_ResourceNotFoundExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.message != null) {
        contents.message = (0, smithy_client_1.expectString)(data.message);
    }
    const exception = new models_0_1.ResourceNotFoundException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const de_TooManyRequestsExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.message != null) {
        contents.message = (0, smithy_client_1.expectString)(data.message);
    }
    const exception = new models_0_1.TooManyRequestsException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const de_UnauthorizedExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    if (data.message != null) {
        contents.message = (0, smithy_client_1.expectString)(data.message);
    }
    const exception = new models_0_1.UnauthorizedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, parsedOutput.body);
};
const de_AccountInfo = (output, context) => {
    return {
        accountId: (0, smithy_client_1.expectString)(output.accountId),
        accountName: (0, smithy_client_1.expectString)(output.accountName),
        emailAddress: (0, smithy_client_1.expectString)(output.emailAddress),
    };
};
const de_AccountListType = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return de_AccountInfo(entry, context);
    });
    return retVal;
};
const de_RoleCredentials = (output, context) => {
    return {
        accessKeyId: (0, smithy_client_1.expectString)(output.accessKeyId),
        expiration: (0, smithy_client_1.expectLong)(output.expiration),
        secretAccessKey: (0, smithy_client_1.expectString)(output.secretAccessKey),
        sessionToken: (0, smithy_client_1.expectString)(output.sessionToken),
    };
};
const de_RoleInfo = (output, context) => {
    return {
        accountId: (0, smithy_client_1.expectString)(output.accountId),
        roleName: (0, smithy_client_1.expectString)(output.roleName),
    };
};
const de_RoleListType = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return de_RoleInfo(entry, context);
    });
    return retVal;
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});
const collectBody = (streamBody = new Uint8Array(), context) => {
    if (streamBody instanceof Uint8Array) {
        return Promise.resolve(streamBody);
    }
    return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
};
const collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
const isSerializableHeaderValue = (value) => value !== undefined &&
    value !== null &&
    value !== "" &&
    (!Object.getOwnPropertyNames(value).includes("length") || value.length != 0) &&
    (!Object.getOwnPropertyNames(value).includes("size") || value.size != 0);
const parseBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
    if (encoded.length) {
        return JSON.parse(encoded);
    }
    return {};
});
const parseErrorBody = async (errorBody, context) => {
    const value = await parseBody(errorBody, context);
    value.message = value.message ?? value.Message;
    return value;
};
const loadRestJsonErrorCode = (output, data) => {
    const findKey = (object, key) => Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase());
    const sanitizeErrorCode = (rawValue) => {
        let cleanValue = rawValue;
        if (typeof cleanValue === "number") {
            cleanValue = cleanValue.toString();
        }
        if (cleanValue.indexOf(",") >= 0) {
            cleanValue = cleanValue.split(",")[0];
        }
        if (cleanValue.indexOf(":") >= 0) {
            cleanValue = cleanValue.split(":")[0];
        }
        if (cleanValue.indexOf("#") >= 0) {
            cleanValue = cleanValue.split("#")[1];
        }
        return cleanValue;
    };
    const headerKey = findKey(output.headers, "x-amzn-errortype");
    if (headerKey !== undefined) {
        return sanitizeErrorCode(output.headers[headerKey]);
    }
    if (data.code !== undefined) {
        return sanitizeErrorCode(data.code);
    }
    if (data["__type"] !== undefined) {
        return sanitizeErrorCode(data["__type"]);
    }
};


/***/ }),

/***/ 9756:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRuntimeConfig = void 0;
const tslib_1 = __nccwpck_require__(4351);
const package_json_1 = tslib_1.__importDefault(__nccwpck_require__(1092));
const config_resolver_1 = __nccwpck_require__(6153);
const hash_node_1 = __nccwpck_require__(7442);
const middleware_retry_1 = __nccwpck_require__(6064);
const node_config_provider_1 = __nccwpck_require__(7684);
const node_http_handler_1 = __nccwpck_require__(8805);
const util_body_length_node_1 = __nccwpck_require__(4147);
const util_retry_1 = __nccwpck_require__(9395);
const util_user_agent_node_1 = __nccwpck_require__(8095);
const runtimeConfig_shared_1 = __nccwpck_require__(4355);
const smithy_client_1 = __nccwpck_require__(4963);
const util_defaults_mode_node_1 = __nccwpck_require__(4243);
const smithy_client_2 = __nccwpck_require__(4963);
const getRuntimeConfig = (config) => {
    (0, smithy_client_2.emitWarningIfUnsupportedVersion)(process.version);
    const defaultsMode = (0, util_defaults_mode_node_1.resolveDefaultsModeConfig)(config);
    const defaultConfigProvider = () => defaultsMode().then(smithy_client_1.loadConfigsForDefaultMode);
    const clientSharedValues = (0, runtimeConfig_shared_1.getRuntimeConfig)(config);
    return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        defaultsMode,
        bodyLengthChecker: config?.bodyLengthChecker ?? util_body_length_node_1.calculateBodyLength,
        defaultUserAgentProvider: config?.defaultUserAgentProvider ??
            (0, util_user_agent_node_1.defaultUserAgent)({ serviceId: clientSharedValues.serviceId, clientVersion: package_json_1.default.version }),
        maxAttempts: config?.maxAttempts ?? (0, node_config_provider_1.loadConfig)(middleware_retry_1.NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
        region: config?.region ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_REGION_CONFIG_OPTIONS, config_resolver_1.NODE_REGION_CONFIG_FILE_OPTIONS),
        requestHandler: config?.requestHandler ?? new node_http_handler_1.NodeHttpHandler(defaultConfigProvider),
        retryMode: config?.retryMode ??
            (0, node_config_provider_1.loadConfig)({
                ...middleware_retry_1.NODE_RETRY_MODE_CONFIG_OPTIONS,
                default: async () => (await defaultConfigProvider()).retryMode || util_retry_1.DEFAULT_RETRY_MODE,
            }),
        sha256: config?.sha256 ?? hash_node_1.Hash.bind(null, "sha256"),
        streamCollector: config?.streamCollector ?? node_http_handler_1.streamCollector,
        useDualstackEndpoint: config?.useDualstackEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
        useFipsEndpoint: config?.useFipsEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS),
    };
};
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),

/***/ 4355:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRuntimeConfig = void 0;
const smithy_client_1 = __nccwpck_require__(4963);
const url_parser_1 = __nccwpck_require__(2992);
const util_base64_1 = __nccwpck_require__(7727);
const util_utf8_1 = __nccwpck_require__(2855);
const endpointResolver_1 = __nccwpck_require__(898);
const getRuntimeConfig = (config) => ({
    apiVersion: "2019-06-10",
    base64Decoder: config?.base64Decoder ?? util_base64_1.fromBase64,
    base64Encoder: config?.base64Encoder ?? util_base64_1.toBase64,
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? endpointResolver_1.defaultEndpointResolver,
    logger: config?.logger ?? new smithy_client_1.NoOpLogger(),
    serviceId: config?.serviceId ?? "SSO",
    urlParser: config?.urlParser ?? url_parser_1.parseUrl,
    utf8Decoder: config?.utf8Decoder ?? util_utf8_1.fromUtf8,
    utf8Encoder: config?.utf8Encoder ?? util_utf8_1.toUtf8,
});
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),

/***/ 7588:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.STS = void 0;
const AssumeRoleCommand_1 = __nccwpck_require__(9802);
const AssumeRoleWithSAMLCommand_1 = __nccwpck_require__(2865);
const AssumeRoleWithWebIdentityCommand_1 = __nccwpck_require__(7451);
const DecodeAuthorizationMessageCommand_1 = __nccwpck_require__(4150);
const GetAccessKeyInfoCommand_1 = __nccwpck_require__(9804);
const GetCallerIdentityCommand_1 = __nccwpck_require__(4278);
const GetFederationTokenCommand_1 = __nccwpck_require__(7552);
const GetSessionTokenCommand_1 = __nccwpck_require__(3285);
const STSClient_1 = __nccwpck_require__(4195);
class STS extends STSClient_1.STSClient {
    assumeRole(args, optionsOrCb, cb) {
        const command = new AssumeRoleCommand_1.AssumeRoleCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    assumeRoleWithSAML(args, optionsOrCb, cb) {
        const command = new AssumeRoleWithSAMLCommand_1.AssumeRoleWithSAMLCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    assumeRoleWithWebIdentity(args, optionsOrCb, cb) {
        const command = new AssumeRoleWithWebIdentityCommand_1.AssumeRoleWithWebIdentityCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    decodeAuthorizationMessage(args, optionsOrCb, cb) {
        const command = new DecodeAuthorizationMessageCommand_1.DecodeAuthorizationMessageCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    getAccessKeyInfo(args, optionsOrCb, cb) {
        const command = new GetAccessKeyInfoCommand_1.GetAccessKeyInfoCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    getCallerIdentity(args, optionsOrCb, cb) {
        const command = new GetCallerIdentityCommand_1.GetCallerIdentityCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    getFederationToken(args, optionsOrCb, cb) {
        const command = new GetFederationTokenCommand_1.GetFederationTokenCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    getSessionToken(args, optionsOrCb, cb) {
        const command = new GetSessionTokenCommand_1.GetSessionTokenCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
}
exports.STS = STS;


/***/ }),

/***/ 4195:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.STSClient = void 0;
const config_resolver_1 = __nccwpck_require__(6153);
const middleware_content_length_1 = __nccwpck_require__(2245);
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_host_header_1 = __nccwpck_require__(2545);
const middleware_logger_1 = __nccwpck_require__(14);
const middleware_recursion_detection_1 = __nccwpck_require__(5525);
const middleware_retry_1 = __nccwpck_require__(6064);
const middleware_sdk_sts_1 = __nccwpck_require__(5959);
const middleware_user_agent_1 = __nccwpck_require__(4688);
const smithy_client_1 = __nccwpck_require__(4963);
const EndpointParameters_1 = __nccwpck_require__(510);
const runtimeConfig_1 = __nccwpck_require__(3405);
class STSClient extends smithy_client_1.Client {
    constructor(configuration) {
        const _config_0 = (0, runtimeConfig_1.getRuntimeConfig)(configuration);
        const _config_1 = (0, EndpointParameters_1.resolveClientEndpointParameters)(_config_0);
        const _config_2 = (0, config_resolver_1.resolveRegionConfig)(_config_1);
        const _config_3 = (0, middleware_endpoint_1.resolveEndpointConfig)(_config_2);
        const _config_4 = (0, middleware_retry_1.resolveRetryConfig)(_config_3);
        const _config_5 = (0, middleware_host_header_1.resolveHostHeaderConfig)(_config_4);
        const _config_6 = (0, middleware_sdk_sts_1.resolveStsAuthConfig)(_config_5, { stsClientCtor: STSClient });
        const _config_7 = (0, middleware_user_agent_1.resolveUserAgentConfig)(_config_6);
        super(_config_7);
        this.config = _config_7;
        this.middlewareStack.use((0, middleware_retry_1.getRetryPlugin)(this.config));
        this.middlewareStack.use((0, middleware_content_length_1.getContentLengthPlugin)(this.config));
        this.middlewareStack.use((0, middleware_host_header_1.getHostHeaderPlugin)(this.config));
        this.middlewareStack.use((0, middleware_logger_1.getLoggerPlugin)(this.config));
        this.middlewareStack.use((0, middleware_recursion_detection_1.getRecursionDetectionPlugin)(this.config));
        this.middlewareStack.use((0, middleware_user_agent_1.getUserAgentPlugin)(this.config));
    }
    destroy() {
        super.destroy();
    }
}
exports.STSClient = STSClient;


/***/ }),

/***/ 9802:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssumeRoleCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const middleware_signing_1 = __nccwpck_require__(4935);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_query_1 = __nccwpck_require__(740);
class AssumeRoleCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, AssumeRoleCommand.getEndpointParameterInstructions()));
        this.middlewareStack.use((0, middleware_signing_1.getAwsAuthPlugin)(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "AssumeRoleCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_query_1.se_AssumeRoleCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_query_1.de_AssumeRoleCommand)(output, context);
    }
}
exports.AssumeRoleCommand = AssumeRoleCommand;


/***/ }),

/***/ 2865:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssumeRoleWithSAMLCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_query_1 = __nccwpck_require__(740);
class AssumeRoleWithSAMLCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, AssumeRoleWithSAMLCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "AssumeRoleWithSAMLCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_query_1.se_AssumeRoleWithSAMLCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_query_1.de_AssumeRoleWithSAMLCommand)(output, context);
    }
}
exports.AssumeRoleWithSAMLCommand = AssumeRoleWithSAMLCommand;


/***/ }),

/***/ 7451:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssumeRoleWithWebIdentityCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_query_1 = __nccwpck_require__(740);
class AssumeRoleWithWebIdentityCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, AssumeRoleWithWebIdentityCommand.getEndpointParameterInstructions()));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "AssumeRoleWithWebIdentityCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_query_1.se_AssumeRoleWithWebIdentityCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_query_1.de_AssumeRoleWithWebIdentityCommand)(output, context);
    }
}
exports.AssumeRoleWithWebIdentityCommand = AssumeRoleWithWebIdentityCommand;


/***/ }),

/***/ 4150:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DecodeAuthorizationMessageCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const middleware_signing_1 = __nccwpck_require__(4935);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_query_1 = __nccwpck_require__(740);
class DecodeAuthorizationMessageCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, DecodeAuthorizationMessageCommand.getEndpointParameterInstructions()));
        this.middlewareStack.use((0, middleware_signing_1.getAwsAuthPlugin)(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "DecodeAuthorizationMessageCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_query_1.se_DecodeAuthorizationMessageCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_query_1.de_DecodeAuthorizationMessageCommand)(output, context);
    }
}
exports.DecodeAuthorizationMessageCommand = DecodeAuthorizationMessageCommand;


/***/ }),

/***/ 9804:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetAccessKeyInfoCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const middleware_signing_1 = __nccwpck_require__(4935);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_query_1 = __nccwpck_require__(740);
class GetAccessKeyInfoCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, GetAccessKeyInfoCommand.getEndpointParameterInstructions()));
        this.middlewareStack.use((0, middleware_signing_1.getAwsAuthPlugin)(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "GetAccessKeyInfoCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_query_1.se_GetAccessKeyInfoCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_query_1.de_GetAccessKeyInfoCommand)(output, context);
    }
}
exports.GetAccessKeyInfoCommand = GetAccessKeyInfoCommand;


/***/ }),

/***/ 4278:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetCallerIdentityCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const middleware_signing_1 = __nccwpck_require__(4935);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_query_1 = __nccwpck_require__(740);
class GetCallerIdentityCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, GetCallerIdentityCommand.getEndpointParameterInstructions()));
        this.middlewareStack.use((0, middleware_signing_1.getAwsAuthPlugin)(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "GetCallerIdentityCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_query_1.se_GetCallerIdentityCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_query_1.de_GetCallerIdentityCommand)(output, context);
    }
}
exports.GetCallerIdentityCommand = GetCallerIdentityCommand;


/***/ }),

/***/ 7552:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetFederationTokenCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const middleware_signing_1 = __nccwpck_require__(4935);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_query_1 = __nccwpck_require__(740);
class GetFederationTokenCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, GetFederationTokenCommand.getEndpointParameterInstructions()));
        this.middlewareStack.use((0, middleware_signing_1.getAwsAuthPlugin)(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "GetFederationTokenCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_query_1.se_GetFederationTokenCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_query_1.de_GetFederationTokenCommand)(output, context);
    }
}
exports.GetFederationTokenCommand = GetFederationTokenCommand;


/***/ }),

/***/ 3285:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetSessionTokenCommand = void 0;
const middleware_endpoint_1 = __nccwpck_require__(5497);
const middleware_serde_1 = __nccwpck_require__(3631);
const middleware_signing_1 = __nccwpck_require__(4935);
const smithy_client_1 = __nccwpck_require__(4963);
const Aws_query_1 = __nccwpck_require__(740);
class GetSessionTokenCommand extends smithy_client_1.Command {
    static getEndpointParameterInstructions() {
        return {
            UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, GetSessionTokenCommand.getEndpointParameterInstructions()));
        this.middlewareStack.use((0, middleware_signing_1.getAwsAuthPlugin)(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "GetSessionTokenCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: (_) => _,
            outputFilterSensitiveLog: (_) => _,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_query_1.se_GetSessionTokenCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_query_1.de_GetSessionTokenCommand)(output, context);
    }
}
exports.GetSessionTokenCommand = GetSessionTokenCommand;


/***/ }),

/***/ 5716:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(9802), exports);
tslib_1.__exportStar(__nccwpck_require__(2865), exports);
tslib_1.__exportStar(__nccwpck_require__(7451), exports);
tslib_1.__exportStar(__nccwpck_require__(4150), exports);
tslib_1.__exportStar(__nccwpck_require__(9804), exports);
tslib_1.__exportStar(__nccwpck_require__(4278), exports);
tslib_1.__exportStar(__nccwpck_require__(7552), exports);
tslib_1.__exportStar(__nccwpck_require__(3285), exports);


/***/ }),

/***/ 8028:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decorateDefaultCredentialProvider = exports.getDefaultRoleAssumerWithWebIdentity = exports.getDefaultRoleAssumer = void 0;
const defaultStsRoleAssumers_1 = __nccwpck_require__(48);
const STSClient_1 = __nccwpck_require__(4195);
const getCustomizableStsClientCtor = (baseCtor, customizations) => {
    if (!customizations)
        return baseCtor;
    else
        return class CustomizableSTSClient extends baseCtor {
            constructor(config) {
                super(config);
                for (const customization of customizations) {
                    this.middlewareStack.use(customization);
                }
            }
        };
};
const getDefaultRoleAssumer = (stsOptions = {}, stsPlugins) => (0, defaultStsRoleAssumers_1.getDefaultRoleAssumer)(stsOptions, getCustomizableStsClientCtor(STSClient_1.STSClient, stsPlugins));
exports.getDefaultRoleAssumer = getDefaultRoleAssumer;
const getDefaultRoleAssumerWithWebIdentity = (stsOptions = {}, stsPlugins) => (0, defaultStsRoleAssumers_1.getDefaultRoleAssumerWithWebIdentity)(stsOptions, getCustomizableStsClientCtor(STSClient_1.STSClient, stsPlugins));
exports.getDefaultRoleAssumerWithWebIdentity = getDefaultRoleAssumerWithWebIdentity;
const decorateDefaultCredentialProvider = (provider) => (input) => provider({
    roleAssumer: (0, exports.getDefaultRoleAssumer)(input),
    roleAssumerWithWebIdentity: (0, exports.getDefaultRoleAssumerWithWebIdentity)(input),
    ...input,
});
exports.decorateDefaultCredentialProvider = decorateDefaultCredentialProvider;


/***/ }),

/***/ 48:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decorateDefaultCredentialProvider = exports.getDefaultRoleAssumerWithWebIdentity = exports.getDefaultRoleAssumer = void 0;
const AssumeRoleCommand_1 = __nccwpck_require__(9802);
const AssumeRoleWithWebIdentityCommand_1 = __nccwpck_require__(7451);
const ASSUME_ROLE_DEFAULT_REGION = "us-east-1";
const decorateDefaultRegion = (region) => {
    if (typeof region !== "function") {
        return region === undefined ? ASSUME_ROLE_DEFAULT_REGION : region;
    }
    return async () => {
        try {
            return await region();
        }
        catch (e) {
            return ASSUME_ROLE_DEFAULT_REGION;
        }
    };
};
const getDefaultRoleAssumer = (stsOptions, stsClientCtor) => {
    let stsClient;
    let closureSourceCreds;
    return async (sourceCreds, params) => {
        closureSourceCreds = sourceCreds;
        if (!stsClient) {
            const { logger, region, requestHandler } = stsOptions;
            stsClient = new stsClientCtor({
                logger,
                credentialDefaultProvider: () => async () => closureSourceCreds,
                region: decorateDefaultRegion(region || stsOptions.region),
                ...(requestHandler ? { requestHandler } : {}),
            });
        }
        const { Credentials } = await stsClient.send(new AssumeRoleCommand_1.AssumeRoleCommand(params));
        if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
            throw new Error(`Invalid response from STS.assumeRole call with role ${params.RoleArn}`);
        }
        return {
            accessKeyId: Credentials.AccessKeyId,
            secretAccessKey: Credentials.SecretAccessKey,
            sessionToken: Credentials.SessionToken,
            expiration: Credentials.Expiration,
        };
    };
};
exports.getDefaultRoleAssumer = getDefaultRoleAssumer;
const getDefaultRoleAssumerWithWebIdentity = (stsOptions, stsClientCtor) => {
    let stsClient;
    return async (params) => {
        if (!stsClient) {
            const { logger, region, requestHandler } = stsOptions;
            stsClient = new stsClientCtor({
                logger,
                region: decorateDefaultRegion(region || stsOptions.region),
                ...(requestHandler ? { requestHandler } : {}),
            });
        }
        const { Credentials } = await stsClient.send(new AssumeRoleWithWebIdentityCommand_1.AssumeRoleWithWebIdentityCommand(params));
        if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
            throw new Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${params.RoleArn}`);
        }
        return {
            accessKeyId: Credentials.AccessKeyId,
            secretAccessKey: Credentials.SecretAccessKey,
            sessionToken: Credentials.SessionToken,
            expiration: Credentials.Expiration,
        };
    };
};
exports.getDefaultRoleAssumerWithWebIdentity = getDefaultRoleAssumerWithWebIdentity;
const decorateDefaultCredentialProvider = (provider) => (input) => provider({
    roleAssumer: (0, exports.getDefaultRoleAssumer)(input, input.stsClientCtor),
    roleAssumerWithWebIdentity: (0, exports.getDefaultRoleAssumerWithWebIdentity)(input, input.stsClientCtor),
    ...input,
});
exports.decorateDefaultCredentialProvider = decorateDefaultCredentialProvider;


/***/ }),

/***/ 510:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveClientEndpointParameters = void 0;
const resolveClientEndpointParameters = (options) => {
    return {
        ...options,
        useDualstackEndpoint: options.useDualstackEndpoint ?? false,
        useFipsEndpoint: options.useFipsEndpoint ?? false,
        useGlobalEndpoint: options.useGlobalEndpoint ?? false,
        defaultSigningName: "sts",
    };
};
exports.resolveClientEndpointParameters = resolveClientEndpointParameters;


/***/ }),

/***/ 1203:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultEndpointResolver = void 0;
const util_endpoints_1 = __nccwpck_require__(3350);
const ruleset_1 = __nccwpck_require__(6882);
const defaultEndpointResolver = (endpointParams, context = {}) => {
    return (0, util_endpoints_1.resolveEndpoint)(ruleset_1.ruleSet, {
        endpointParams: endpointParams,
        logger: context.logger,
    });
};
exports.defaultEndpointResolver = defaultEndpointResolver;


/***/ }),

/***/ 6882:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ruleSet = void 0;
const G = "required", H = "type", I = "fn", J = "argv", K = "ref", L = "properties", M = "headers";
const a = false, b = true, c = "PartitionResult", d = "tree", e = "booleanEquals", f = "stringEquals", g = "sigv4", h = "us-east-1", i = "sts", j = "endpoint", k = "https://sts.{Region}.{PartitionResult#dnsSuffix}", l = "error", m = "getAttr", n = { [G]: false, [H]: "String" }, o = { [G]: true, "default": false, [H]: "Boolean" }, p = { [K]: "Region" }, q = { [K]: "UseFIPS" }, r = { [K]: "UseDualStack" }, s = { [I]: "isSet", [J]: [{ [K]: "Endpoint" }] }, t = { [K]: "Endpoint" }, u = { "url": "https://sts.amazonaws.com", [L]: { "authSchemes": [{ "name": g, "signingRegion": h, "signingName": i }] }, [M]: {} }, v = {}, w = { "conditions": [{ [I]: f, [J]: [p, "aws-global"] }], [j]: u, [H]: j }, x = { [I]: e, [J]: [q, true] }, y = { [I]: e, [J]: [r, true] }, z = { [I]: e, [J]: [true, { [I]: m, [J]: [{ [K]: c }, "supportsFIPS"] }] }, A = { [K]: c }, B = { [I]: e, [J]: [true, { [I]: m, [J]: [A, "supportsDualStack"] }] }, C = { "url": k, [L]: {}, [M]: {} }, D = [t], E = [x], F = [y];
const _data = { version: "1.0", parameters: { Region: n, UseDualStack: o, UseFIPS: o, Endpoint: n, UseGlobalEndpoint: o }, rules: [{ conditions: [{ [I]: "aws.partition", [J]: [p], assign: c }], [H]: d, rules: [{ conditions: [{ [I]: e, [J]: [{ [K]: "UseGlobalEndpoint" }, b] }, { [I]: e, [J]: [q, a] }, { [I]: e, [J]: [r, a] }, { [I]: "not", [J]: [s] }], [H]: d, rules: [{ conditions: [{ [I]: f, [J]: [p, "ap-northeast-1"] }], endpoint: u, [H]: j }, { conditions: [{ [I]: f, [J]: [p, "ap-south-1"] }], endpoint: u, [H]: j }, { conditions: [{ [I]: f, [J]: [p, "ap-southeast-1"] }], endpoint: u, [H]: j }, { conditions: [{ [I]: f, [J]: [p, "ap-southeast-2"] }], endpoint: u, [H]: j }, w, { conditions: [{ [I]: f, [J]: [p, "ca-central-1"] }], endpoint: u, [H]: j }, { conditions: [{ [I]: f, [J]: [p, "eu-central-1"] }], endpoint: u, [H]: j }, { conditions: [{ [I]: f, [J]: [p, "eu-north-1"] }], endpoint: u, [H]: j }, { conditions: [{ [I]: f, [J]: [p, "eu-west-1"] }], endpoint: u, [H]: j }, { conditions: [{ [I]: f, [J]: [p, "eu-west-2"] }], endpoint: u, [H]: j }, { conditions: [{ [I]: f, [J]: [p, "eu-west-3"] }], endpoint: u, [H]: j }, { conditions: [{ [I]: f, [J]: [p, "sa-east-1"] }], endpoint: u, [H]: j }, { conditions: [{ [I]: f, [J]: [p, h] }], endpoint: u, [H]: j }, { conditions: [{ [I]: f, [J]: [p, "us-east-2"] }], endpoint: u, [H]: j }, { conditions: [{ [I]: f, [J]: [p, "us-west-1"] }], endpoint: u, [H]: j }, { conditions: [{ [I]: f, [J]: [p, "us-west-2"] }], endpoint: u, [H]: j }, { endpoint: { url: k, [L]: { authSchemes: [{ name: g, signingRegion: "{Region}", signingName: i }] }, [M]: v }, [H]: j }] }, { conditions: [s, { [I]: "parseURL", [J]: D, assign: "url" }], [H]: d, rules: [{ conditions: E, error: "Invalid Configuration: FIPS and custom endpoint are not supported", [H]: l }, { [H]: d, rules: [{ conditions: F, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", [H]: l }, { endpoint: { url: t, [L]: v, [M]: v }, [H]: j }] }] }, { conditions: [x, y], [H]: d, rules: [{ conditions: [z, B], [H]: d, rules: [{ endpoint: { url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", [L]: v, [M]: v }, [H]: j }] }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", [H]: l }] }, { conditions: E, [H]: d, rules: [{ conditions: [z], [H]: d, rules: [{ [H]: d, rules: [{ conditions: [{ [I]: f, [J]: ["aws-us-gov", { [I]: m, [J]: [A, "name"] }] }], endpoint: C, [H]: j }, { endpoint: { url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}", [L]: v, [M]: v }, [H]: j }] }] }, { error: "FIPS is enabled but this partition does not support FIPS", [H]: l }] }, { conditions: F, [H]: d, rules: [{ conditions: [B], [H]: d, rules: [{ endpoint: { url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}", [L]: v, [M]: v }, [H]: j }] }, { error: "DualStack is enabled but this partition does not support DualStack", [H]: l }] }, { [H]: d, rules: [w, { endpoint: C, [H]: j }] }] }] };
exports.ruleSet = _data;


/***/ }),

/***/ 2209:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.STSServiceException = void 0;
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(7588), exports);
tslib_1.__exportStar(__nccwpck_require__(4195), exports);
tslib_1.__exportStar(__nccwpck_require__(5716), exports);
tslib_1.__exportStar(__nccwpck_require__(8028), exports);
tslib_1.__exportStar(__nccwpck_require__(106), exports);
var STSServiceException_1 = __nccwpck_require__(6450);
Object.defineProperty(exports, "STSServiceException", ({ enumerable: true, get: function () { return STSServiceException_1.STSServiceException; } }));


/***/ }),

/***/ 6450:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.STSServiceException = void 0;
const smithy_client_1 = __nccwpck_require__(4963);
class STSServiceException extends smithy_client_1.ServiceException {
    constructor(options) {
        super(options);
        Object.setPrototypeOf(this, STSServiceException.prototype);
    }
}
exports.STSServiceException = STSServiceException;


/***/ }),

/***/ 106:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(1780), exports);


/***/ }),

/***/ 1780:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvalidAuthorizationMessageException = exports.IDPCommunicationErrorException = exports.InvalidIdentityTokenException = exports.IDPRejectedClaimException = exports.RegionDisabledException = exports.PackedPolicyTooLargeException = exports.MalformedPolicyDocumentException = exports.ExpiredTokenException = void 0;
const STSServiceException_1 = __nccwpck_require__(6450);
class ExpiredTokenException extends STSServiceException_1.STSServiceException {
    constructor(opts) {
        super({
            name: "ExpiredTokenException",
            $fault: "client",
            ...opts,
        });
        this.name = "ExpiredTokenException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ExpiredTokenException.prototype);
    }
}
exports.ExpiredTokenException = ExpiredTokenException;
class MalformedPolicyDocumentException extends STSServiceException_1.STSServiceException {
    constructor(opts) {
        super({
            name: "MalformedPolicyDocumentException",
            $fault: "client",
            ...opts,
        });
        this.name = "MalformedPolicyDocumentException";
        this.$fault = "client";
        Object.setPrototypeOf(this, MalformedPolicyDocumentException.prototype);
    }
}
exports.MalformedPolicyDocumentException = MalformedPolicyDocumentException;
class PackedPolicyTooLargeException extends STSServiceException_1.STSServiceException {
    constructor(opts) {
        super({
            name: "PackedPolicyTooLargeException",
            $fault: "client",
            ...opts,
        });
        this.name = "PackedPolicyTooLargeException";
        this.$fault = "client";
        Object.setPrototypeOf(this, PackedPolicyTooLargeException.prototype);
    }
}
exports.PackedPolicyTooLargeException = PackedPolicyTooLargeException;
class RegionDisabledException extends STSServiceException_1.STSServiceException {
    constructor(opts) {
        super({
            name: "RegionDisabledException",
            $fault: "client",
            ...opts,
        });
        this.name = "RegionDisabledException";
        this.$fault = "client";
        Object.setPrototypeOf(this, RegionDisabledException.prototype);
    }
}
exports.RegionDisabledException = RegionDisabledException;
class IDPRejectedClaimException extends STSServiceException_1.STSServiceException {
    constructor(opts) {
        super({
            name: "IDPRejectedClaimException",
            $fault: "client",
            ...opts,
        });
        this.name = "IDPRejectedClaimException";
        this.$fault = "client";
        Object.setPrototypeOf(this, IDPRejectedClaimException.prototype);
    }
}
exports.IDPRejectedClaimException = IDPRejectedClaimException;
class InvalidIdentityTokenException extends STSServiceException_1.STSServiceException {
    constructor(opts) {
        super({
            name: "InvalidIdentityTokenException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidIdentityTokenException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidIdentityTokenException.prototype);
    }
}
exports.InvalidIdentityTokenException = InvalidIdentityTokenException;
class IDPCommunicationErrorException extends STSServiceException_1.STSServiceException {
    constructor(opts) {
        super({
            name: "IDPCommunicationErrorException",
            $fault: "client",
            ...opts,
        });
        this.name = "IDPCommunicationErrorException";
        this.$fault = "client";
        Object.setPrototypeOf(this, IDPCommunicationErrorException.prototype);
    }
}
exports.IDPCommunicationErrorException = IDPCommunicationErrorException;
class InvalidAuthorizationMessageException extends STSServiceException_1.STSServiceException {
    constructor(opts) {
        super({
            name: "InvalidAuthorizationMessageException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidAuthorizationMessageException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidAuthorizationMessageException.prototype);
    }
}
exports.InvalidAuthorizationMessageException = InvalidAuthorizationMessageException;


/***/ }),

/***/ 740:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.de_GetSessionTokenCommand = exports.de_GetFederationTokenCommand = exports.de_GetCallerIdentityCommand = exports.de_GetAccessKeyInfoCommand = exports.de_DecodeAuthorizationMessageCommand = exports.de_AssumeRoleWithWebIdentityCommand = exports.de_AssumeRoleWithSAMLCommand = exports.de_AssumeRoleCommand = exports.se_GetSessionTokenCommand = exports.se_GetFederationTokenCommand = exports.se_GetCallerIdentityCommand = exports.se_GetAccessKeyInfoCommand = exports.se_DecodeAuthorizationMessageCommand = exports.se_AssumeRoleWithWebIdentityCommand = exports.se_AssumeRoleWithSAMLCommand = exports.se_AssumeRoleCommand = void 0;
const protocol_http_1 = __nccwpck_require__(223);
const smithy_client_1 = __nccwpck_require__(4963);
const fast_xml_parser_1 = __nccwpck_require__(2603);
const models_0_1 = __nccwpck_require__(1780);
const STSServiceException_1 = __nccwpck_require__(6450);
const se_AssumeRoleCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...se_AssumeRoleRequest(input, context),
        Action: "AssumeRole",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_AssumeRoleCommand = se_AssumeRoleCommand;
const se_AssumeRoleWithSAMLCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...se_AssumeRoleWithSAMLRequest(input, context),
        Action: "AssumeRoleWithSAML",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_AssumeRoleWithSAMLCommand = se_AssumeRoleWithSAMLCommand;
const se_AssumeRoleWithWebIdentityCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...se_AssumeRoleWithWebIdentityRequest(input, context),
        Action: "AssumeRoleWithWebIdentity",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_AssumeRoleWithWebIdentityCommand = se_AssumeRoleWithWebIdentityCommand;
const se_DecodeAuthorizationMessageCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...se_DecodeAuthorizationMessageRequest(input, context),
        Action: "DecodeAuthorizationMessage",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_DecodeAuthorizationMessageCommand = se_DecodeAuthorizationMessageCommand;
const se_GetAccessKeyInfoCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...se_GetAccessKeyInfoRequest(input, context),
        Action: "GetAccessKeyInfo",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_GetAccessKeyInfoCommand = se_GetAccessKeyInfoCommand;
const se_GetCallerIdentityCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...se_GetCallerIdentityRequest(input, context),
        Action: "GetCallerIdentity",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_GetCallerIdentityCommand = se_GetCallerIdentityCommand;
const se_GetFederationTokenCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...se_GetFederationTokenRequest(input, context),
        Action: "GetFederationToken",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_GetFederationTokenCommand = se_GetFederationTokenCommand;
const se_GetSessionTokenCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...se_GetSessionTokenRequest(input, context),
        Action: "GetSessionToken",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.se_GetSessionTokenCommand = se_GetSessionTokenCommand;
const de_AssumeRoleCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_AssumeRoleCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_AssumeRoleResponse(data.AssumeRoleResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_AssumeRoleCommand = de_AssumeRoleCommand;
const de_AssumeRoleCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
            throw await de_ExpiredTokenExceptionRes(parsedOutput, context);
        case "MalformedPolicyDocument":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
            throw await de_MalformedPolicyDocumentExceptionRes(parsedOutput, context);
        case "PackedPolicyTooLarge":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
            throw await de_PackedPolicyTooLargeExceptionRes(parsedOutput, context);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
            throw await de_RegionDisabledExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody: parsedBody.Error,
                exceptionCtor: STSServiceException_1.STSServiceException,
                errorCode,
            });
    }
};
const de_AssumeRoleWithSAMLCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_AssumeRoleWithSAMLCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_AssumeRoleWithSAMLResponse(data.AssumeRoleWithSAMLResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_AssumeRoleWithSAMLCommand = de_AssumeRoleWithSAMLCommand;
const de_AssumeRoleWithSAMLCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
            throw await de_ExpiredTokenExceptionRes(parsedOutput, context);
        case "IDPRejectedClaim":
        case "com.amazonaws.sts#IDPRejectedClaimException":
            throw await de_IDPRejectedClaimExceptionRes(parsedOutput, context);
        case "InvalidIdentityToken":
        case "com.amazonaws.sts#InvalidIdentityTokenException":
            throw await de_InvalidIdentityTokenExceptionRes(parsedOutput, context);
        case "MalformedPolicyDocument":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
            throw await de_MalformedPolicyDocumentExceptionRes(parsedOutput, context);
        case "PackedPolicyTooLarge":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
            throw await de_PackedPolicyTooLargeExceptionRes(parsedOutput, context);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
            throw await de_RegionDisabledExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody: parsedBody.Error,
                exceptionCtor: STSServiceException_1.STSServiceException,
                errorCode,
            });
    }
};
const de_AssumeRoleWithWebIdentityCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_AssumeRoleWithWebIdentityCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_AssumeRoleWithWebIdentityResponse(data.AssumeRoleWithWebIdentityResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_AssumeRoleWithWebIdentityCommand = de_AssumeRoleWithWebIdentityCommand;
const de_AssumeRoleWithWebIdentityCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
            throw await de_ExpiredTokenExceptionRes(parsedOutput, context);
        case "IDPCommunicationError":
        case "com.amazonaws.sts#IDPCommunicationErrorException":
            throw await de_IDPCommunicationErrorExceptionRes(parsedOutput, context);
        case "IDPRejectedClaim":
        case "com.amazonaws.sts#IDPRejectedClaimException":
            throw await de_IDPRejectedClaimExceptionRes(parsedOutput, context);
        case "InvalidIdentityToken":
        case "com.amazonaws.sts#InvalidIdentityTokenException":
            throw await de_InvalidIdentityTokenExceptionRes(parsedOutput, context);
        case "MalformedPolicyDocument":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
            throw await de_MalformedPolicyDocumentExceptionRes(parsedOutput, context);
        case "PackedPolicyTooLarge":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
            throw await de_PackedPolicyTooLargeExceptionRes(parsedOutput, context);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
            throw await de_RegionDisabledExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody: parsedBody.Error,
                exceptionCtor: STSServiceException_1.STSServiceException,
                errorCode,
            });
    }
};
const de_DecodeAuthorizationMessageCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_DecodeAuthorizationMessageCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_DecodeAuthorizationMessageResponse(data.DecodeAuthorizationMessageResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_DecodeAuthorizationMessageCommand = de_DecodeAuthorizationMessageCommand;
const de_DecodeAuthorizationMessageCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidAuthorizationMessageException":
        case "com.amazonaws.sts#InvalidAuthorizationMessageException":
            throw await de_InvalidAuthorizationMessageExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody: parsedBody.Error,
                exceptionCtor: STSServiceException_1.STSServiceException,
                errorCode,
            });
    }
};
const de_GetAccessKeyInfoCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_GetAccessKeyInfoCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_GetAccessKeyInfoResponse(data.GetAccessKeyInfoResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_GetAccessKeyInfoCommand = de_GetAccessKeyInfoCommand;
const de_GetAccessKeyInfoCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadQueryErrorCode(output, parsedOutput.body);
    const parsedBody = parsedOutput.body;
    (0, smithy_client_1.throwDefaultError)({
        output,
        parsedBody: parsedBody.Error,
        exceptionCtor: STSServiceException_1.STSServiceException,
        errorCode,
    });
};
const de_GetCallerIdentityCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_GetCallerIdentityCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_GetCallerIdentityResponse(data.GetCallerIdentityResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_GetCallerIdentityCommand = de_GetCallerIdentityCommand;
const de_GetCallerIdentityCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadQueryErrorCode(output, parsedOutput.body);
    const parsedBody = parsedOutput.body;
    (0, smithy_client_1.throwDefaultError)({
        output,
        parsedBody: parsedBody.Error,
        exceptionCtor: STSServiceException_1.STSServiceException,
        errorCode,
    });
};
const de_GetFederationTokenCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_GetFederationTokenCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_GetFederationTokenResponse(data.GetFederationTokenResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_GetFederationTokenCommand = de_GetFederationTokenCommand;
const de_GetFederationTokenCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "MalformedPolicyDocument":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
            throw await de_MalformedPolicyDocumentExceptionRes(parsedOutput, context);
        case "PackedPolicyTooLarge":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
            throw await de_PackedPolicyTooLargeExceptionRes(parsedOutput, context);
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
            throw await de_RegionDisabledExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody: parsedBody.Error,
                exceptionCtor: STSServiceException_1.STSServiceException,
                errorCode,
            });
    }
};
const de_GetSessionTokenCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return de_GetSessionTokenCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = de_GetSessionTokenResponse(data.GetSessionTokenResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.de_GetSessionTokenCommand = de_GetSessionTokenCommand;
const de_GetSessionTokenCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
            throw await de_RegionDisabledExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            (0, smithy_client_1.throwDefaultError)({
                output,
                parsedBody: parsedBody.Error,
                exceptionCtor: STSServiceException_1.STSServiceException,
                errorCode,
            });
    }
};
const de_ExpiredTokenExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_ExpiredTokenException(body.Error, context);
    const exception = new models_0_1.ExpiredTokenException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, body);
};
const de_IDPCommunicationErrorExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_IDPCommunicationErrorException(body.Error, context);
    const exception = new models_0_1.IDPCommunicationErrorException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, body);
};
const de_IDPRejectedClaimExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_IDPRejectedClaimException(body.Error, context);
    const exception = new models_0_1.IDPRejectedClaimException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, body);
};
const de_InvalidAuthorizationMessageExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidAuthorizationMessageException(body.Error, context);
    const exception = new models_0_1.InvalidAuthorizationMessageException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, body);
};
const de_InvalidIdentityTokenExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_InvalidIdentityTokenException(body.Error, context);
    const exception = new models_0_1.InvalidIdentityTokenException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, body);
};
const de_MalformedPolicyDocumentExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_MalformedPolicyDocumentException(body.Error, context);
    const exception = new models_0_1.MalformedPolicyDocumentException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, body);
};
const de_PackedPolicyTooLargeExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_PackedPolicyTooLargeException(body.Error, context);
    const exception = new models_0_1.PackedPolicyTooLargeException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, body);
};
const de_RegionDisabledExceptionRes = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = de_RegionDisabledException(body.Error, context);
    const exception = new models_0_1.RegionDisabledException({
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    });
    return (0, smithy_client_1.decorateServiceException)(exception, body);
};
const se_AssumeRoleRequest = (input, context) => {
    const entries = {};
    if (input.RoleArn != null) {
        entries["RoleArn"] = input.RoleArn;
    }
    if (input.RoleSessionName != null) {
        entries["RoleSessionName"] = input.RoleSessionName;
    }
    if (input.PolicyArns != null) {
        const memberEntries = se_policyDescriptorListType(input.PolicyArns, context);
        if (input.PolicyArns?.length === 0) {
            entries.PolicyArns = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `PolicyArns.${key}`;
            entries[loc] = value;
        });
    }
    if (input.Policy != null) {
        entries["Policy"] = input.Policy;
    }
    if (input.DurationSeconds != null) {
        entries["DurationSeconds"] = input.DurationSeconds;
    }
    if (input.Tags != null) {
        const memberEntries = se_tagListType(input.Tags, context);
        if (input.Tags?.length === 0) {
            entries.Tags = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Tags.${key}`;
            entries[loc] = value;
        });
    }
    if (input.TransitiveTagKeys != null) {
        const memberEntries = se_tagKeyListType(input.TransitiveTagKeys, context);
        if (input.TransitiveTagKeys?.length === 0) {
            entries.TransitiveTagKeys = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `TransitiveTagKeys.${key}`;
            entries[loc] = value;
        });
    }
    if (input.ExternalId != null) {
        entries["ExternalId"] = input.ExternalId;
    }
    if (input.SerialNumber != null) {
        entries["SerialNumber"] = input.SerialNumber;
    }
    if (input.TokenCode != null) {
        entries["TokenCode"] = input.TokenCode;
    }
    if (input.SourceIdentity != null) {
        entries["SourceIdentity"] = input.SourceIdentity;
    }
    return entries;
};
const se_AssumeRoleWithSAMLRequest = (input, context) => {
    const entries = {};
    if (input.RoleArn != null) {
        entries["RoleArn"] = input.RoleArn;
    }
    if (input.PrincipalArn != null) {
        entries["PrincipalArn"] = input.PrincipalArn;
    }
    if (input.SAMLAssertion != null) {
        entries["SAMLAssertion"] = input.SAMLAssertion;
    }
    if (input.PolicyArns != null) {
        const memberEntries = se_policyDescriptorListType(input.PolicyArns, context);
        if (input.PolicyArns?.length === 0) {
            entries.PolicyArns = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `PolicyArns.${key}`;
            entries[loc] = value;
        });
    }
    if (input.Policy != null) {
        entries["Policy"] = input.Policy;
    }
    if (input.DurationSeconds != null) {
        entries["DurationSeconds"] = input.DurationSeconds;
    }
    return entries;
};
const se_AssumeRoleWithWebIdentityRequest = (input, context) => {
    const entries = {};
    if (input.RoleArn != null) {
        entries["RoleArn"] = input.RoleArn;
    }
    if (input.RoleSessionName != null) {
        entries["RoleSessionName"] = input.RoleSessionName;
    }
    if (input.WebIdentityToken != null) {
        entries["WebIdentityToken"] = input.WebIdentityToken;
    }
    if (input.ProviderId != null) {
        entries["ProviderId"] = input.ProviderId;
    }
    if (input.PolicyArns != null) {
        const memberEntries = se_policyDescriptorListType(input.PolicyArns, context);
        if (input.PolicyArns?.length === 0) {
            entries.PolicyArns = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `PolicyArns.${key}`;
            entries[loc] = value;
        });
    }
    if (input.Policy != null) {
        entries["Policy"] = input.Policy;
    }
    if (input.DurationSeconds != null) {
        entries["DurationSeconds"] = input.DurationSeconds;
    }
    return entries;
};
const se_DecodeAuthorizationMessageRequest = (input, context) => {
    const entries = {};
    if (input.EncodedMessage != null) {
        entries["EncodedMessage"] = input.EncodedMessage;
    }
    return entries;
};
const se_GetAccessKeyInfoRequest = (input, context) => {
    const entries = {};
    if (input.AccessKeyId != null) {
        entries["AccessKeyId"] = input.AccessKeyId;
    }
    return entries;
};
const se_GetCallerIdentityRequest = (input, context) => {
    const entries = {};
    return entries;
};
const se_GetFederationTokenRequest = (input, context) => {
    const entries = {};
    if (input.Name != null) {
        entries["Name"] = input.Name;
    }
    if (input.Policy != null) {
        entries["Policy"] = input.Policy;
    }
    if (input.PolicyArns != null) {
        const memberEntries = se_policyDescriptorListType(input.PolicyArns, context);
        if (input.PolicyArns?.length === 0) {
            entries.PolicyArns = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `PolicyArns.${key}`;
            entries[loc] = value;
        });
    }
    if (input.DurationSeconds != null) {
        entries["DurationSeconds"] = input.DurationSeconds;
    }
    if (input.Tags != null) {
        const memberEntries = se_tagListType(input.Tags, context);
        if (input.Tags?.length === 0) {
            entries.Tags = [];
        }
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Tags.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const se_GetSessionTokenRequest = (input, context) => {
    const entries = {};
    if (input.DurationSeconds != null) {
        entries["DurationSeconds"] = input.DurationSeconds;
    }
    if (input.SerialNumber != null) {
        entries["SerialNumber"] = input.SerialNumber;
    }
    if (input.TokenCode != null) {
        entries["TokenCode"] = input.TokenCode;
    }
    return entries;
};
const se_policyDescriptorListType = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = se_PolicyDescriptorType(entry, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const se_PolicyDescriptorType = (input, context) => {
    const entries = {};
    if (input.arn != null) {
        entries["arn"] = input.arn;
    }
    return entries;
};
const se_Tag = (input, context) => {
    const entries = {};
    if (input.Key != null) {
        entries["Key"] = input.Key;
    }
    if (input.Value != null) {
        entries["Value"] = input.Value;
    }
    return entries;
};
const se_tagKeyListType = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        entries[`member.${counter}`] = entry;
        counter++;
    }
    return entries;
};
const se_tagListType = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = se_Tag(entry, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const de_AssumedRoleUser = (output, context) => {
    const contents = {};
    if (output["AssumedRoleId"] !== undefined) {
        contents.AssumedRoleId = (0, smithy_client_1.expectString)(output["AssumedRoleId"]);
    }
    if (output["Arn"] !== undefined) {
        contents.Arn = (0, smithy_client_1.expectString)(output["Arn"]);
    }
    return contents;
};
const de_AssumeRoleResponse = (output, context) => {
    const contents = {};
    if (output["Credentials"] !== undefined) {
        contents.Credentials = de_Credentials(output["Credentials"], context);
    }
    if (output["AssumedRoleUser"] !== undefined) {
        contents.AssumedRoleUser = de_AssumedRoleUser(output["AssumedRoleUser"], context);
    }
    if (output["PackedPolicySize"] !== undefined) {
        contents.PackedPolicySize = (0, smithy_client_1.strictParseInt32)(output["PackedPolicySize"]);
    }
    if (output["SourceIdentity"] !== undefined) {
        contents.SourceIdentity = (0, smithy_client_1.expectString)(output["SourceIdentity"]);
    }
    return contents;
};
const de_AssumeRoleWithSAMLResponse = (output, context) => {
    const contents = {};
    if (output["Credentials"] !== undefined) {
        contents.Credentials = de_Credentials(output["Credentials"], context);
    }
    if (output["AssumedRoleUser"] !== undefined) {
        contents.AssumedRoleUser = de_AssumedRoleUser(output["AssumedRoleUser"], context);
    }
    if (output["PackedPolicySize"] !== undefined) {
        contents.PackedPolicySize = (0, smithy_client_1.strictParseInt32)(output["PackedPolicySize"]);
    }
    if (output["Subject"] !== undefined) {
        contents.Subject = (0, smithy_client_1.expectString)(output["Subject"]);
    }
    if (output["SubjectType"] !== undefined) {
        contents.SubjectType = (0, smithy_client_1.expectString)(output["SubjectType"]);
    }
    if (output["Issuer"] !== undefined) {
        contents.Issuer = (0, smithy_client_1.expectString)(output["Issuer"]);
    }
    if (output["Audience"] !== undefined) {
        contents.Audience = (0, smithy_client_1.expectString)(output["Audience"]);
    }
    if (output["NameQualifier"] !== undefined) {
        contents.NameQualifier = (0, smithy_client_1.expectString)(output["NameQualifier"]);
    }
    if (output["SourceIdentity"] !== undefined) {
        contents.SourceIdentity = (0, smithy_client_1.expectString)(output["SourceIdentity"]);
    }
    return contents;
};
const de_AssumeRoleWithWebIdentityResponse = (output, context) => {
    const contents = {};
    if (output["Credentials"] !== undefined) {
        contents.Credentials = de_Credentials(output["Credentials"], context);
    }
    if (output["SubjectFromWebIdentityToken"] !== undefined) {
        contents.SubjectFromWebIdentityToken = (0, smithy_client_1.expectString)(output["SubjectFromWebIdentityToken"]);
    }
    if (output["AssumedRoleUser"] !== undefined) {
        contents.AssumedRoleUser = de_AssumedRoleUser(output["AssumedRoleUser"], context);
    }
    if (output["PackedPolicySize"] !== undefined) {
        contents.PackedPolicySize = (0, smithy_client_1.strictParseInt32)(output["PackedPolicySize"]);
    }
    if (output["Provider"] !== undefined) {
        contents.Provider = (0, smithy_client_1.expectString)(output["Provider"]);
    }
    if (output["Audience"] !== undefined) {
        contents.Audience = (0, smithy_client_1.expectString)(output["Audience"]);
    }
    if (output["SourceIdentity"] !== undefined) {
        contents.SourceIdentity = (0, smithy_client_1.expectString)(output["SourceIdentity"]);
    }
    return contents;
};
const de_Credentials = (output, context) => {
    const contents = {};
    if (output["AccessKeyId"] !== undefined) {
        contents.AccessKeyId = (0, smithy_client_1.expectString)(output["AccessKeyId"]);
    }
    if (output["SecretAccessKey"] !== undefined) {
        contents.SecretAccessKey = (0, smithy_client_1.expectString)(output["SecretAccessKey"]);
    }
    if (output["SessionToken"] !== undefined) {
        contents.SessionToken = (0, smithy_client_1.expectString)(output["SessionToken"]);
    }
    if (output["Expiration"] !== undefined) {
        contents.Expiration = (0, smithy_client_1.expectNonNull)((0, smithy_client_1.parseRfc3339DateTimeWithOffset)(output["Expiration"]));
    }
    return contents;
};
const de_DecodeAuthorizationMessageResponse = (output, context) => {
    const contents = {};
    if (output["DecodedMessage"] !== undefined) {
        contents.DecodedMessage = (0, smithy_client_1.expectString)(output["DecodedMessage"]);
    }
    return contents;
};
const de_ExpiredTokenException = (output, context) => {
    const contents = {};
    if (output["message"] !== undefined) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
    }
    return contents;
};
const de_FederatedUser = (output, context) => {
    const contents = {};
    if (output["FederatedUserId"] !== undefined) {
        contents.FederatedUserId = (0, smithy_client_1.expectString)(output["FederatedUserId"]);
    }
    if (output["Arn"] !== undefined) {
        contents.Arn = (0, smithy_client_1.expectString)(output["Arn"]);
    }
    return contents;
};
const de_GetAccessKeyInfoResponse = (output, context) => {
    const contents = {};
    if (output["Account"] !== undefined) {
        contents.Account = (0, smithy_client_1.expectString)(output["Account"]);
    }
    return contents;
};
const de_GetCallerIdentityResponse = (output, context) => {
    const contents = {};
    if (output["UserId"] !== undefined) {
        contents.UserId = (0, smithy_client_1.expectString)(output["UserId"]);
    }
    if (output["Account"] !== undefined) {
        contents.Account = (0, smithy_client_1.expectString)(output["Account"]);
    }
    if (output["Arn"] !== undefined) {
        contents.Arn = (0, smithy_client_1.expectString)(output["Arn"]);
    }
    return contents;
};
const de_GetFederationTokenResponse = (output, context) => {
    const contents = {};
    if (output["Credentials"] !== undefined) {
        contents.Credentials = de_Credentials(output["Credentials"], context);
    }
    if (output["FederatedUser"] !== undefined) {
        contents.FederatedUser = de_FederatedUser(output["FederatedUser"], context);
    }
    if (output["PackedPolicySize"] !== undefined) {
        contents.PackedPolicySize = (0, smithy_client_1.strictParseInt32)(output["PackedPolicySize"]);
    }
    return contents;
};
const de_GetSessionTokenResponse = (output, context) => {
    const contents = {};
    if (output["Credentials"] !== undefined) {
        contents.Credentials = de_Credentials(output["Credentials"], context);
    }
    return contents;
};
const de_IDPCommunicationErrorException = (output, context) => {
    const contents = {};
    if (output["message"] !== undefined) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
    }
    return contents;
};
const de_IDPRejectedClaimException = (output, context) => {
    const contents = {};
    if (output["message"] !== undefined) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
    }
    return contents;
};
const de_InvalidAuthorizationMessageException = (output, context) => {
    const contents = {};
    if (output["message"] !== undefined) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
    }
    return contents;
};
const de_InvalidIdentityTokenException = (output, context) => {
    const contents = {};
    if (output["message"] !== undefined) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
    }
    return contents;
};
const de_MalformedPolicyDocumentException = (output, context) => {
    const contents = {};
    if (output["message"] !== undefined) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
    }
    return contents;
};
const de_PackedPolicyTooLargeException = (output, context) => {
    const contents = {};
    if (output["message"] !== undefined) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
    }
    return contents;
};
const de_RegionDisabledException = (output, context) => {
    const contents = {};
    if (output["message"] !== undefined) {
        contents.message = (0, smithy_client_1.expectString)(output["message"]);
    }
    return contents;
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});
const collectBody = (streamBody = new Uint8Array(), context) => {
    if (streamBody instanceof Uint8Array) {
        return Promise.resolve(streamBody);
    }
    return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
};
const collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
const buildHttpRpcRequest = async (context, headers, path, resolvedHostname, body) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const contents = {
        protocol,
        hostname,
        port,
        method: "POST",
        path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
        headers,
    };
    if (resolvedHostname !== undefined) {
        contents.hostname = resolvedHostname;
    }
    if (body !== undefined) {
        contents.body = body;
    }
    return new protocol_http_1.HttpRequest(contents);
};
const parseBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
    if (encoded.length) {
        const parser = new fast_xml_parser_1.XMLParser({
            attributeNamePrefix: "",
            htmlEntities: true,
            ignoreAttributes: false,
            ignoreDeclaration: true,
            parseTagValue: false,
            trimValues: false,
            tagValueProcessor: (_, val) => (val.trim() === "" && val.includes("\n") ? "" : undefined),
        });
        parser.addEntity("#xD", "\r");
        parser.addEntity("#10", "\n");
        const parsedObj = parser.parse(encoded);
        const textNodeName = "#text";
        const key = Object.keys(parsedObj)[0];
        const parsedObjToReturn = parsedObj[key];
        if (parsedObjToReturn[textNodeName]) {
            parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
            delete parsedObjToReturn[textNodeName];
        }
        return (0, smithy_client_1.getValueFromTextNode)(parsedObjToReturn);
    }
    return {};
});
const parseErrorBody = async (errorBody, context) => {
    const value = await parseBody(errorBody, context);
    if (value.Error) {
        value.Error.message = value.Error.message ?? value.Error.Message;
    }
    return value;
};
const buildFormUrlencodedString = (formEntries) => Object.entries(formEntries)
    .map(([key, value]) => (0, smithy_client_1.extendedEncodeURIComponent)(key) + "=" + (0, smithy_client_1.extendedEncodeURIComponent)(value))
    .join("&");
const loadQueryErrorCode = (output, data) => {
    if (data.Error?.Code !== undefined) {
        return data.Error.Code;
    }
    if (output.statusCode == 404) {
        return "NotFound";
    }
};


/***/ }),

/***/ 3405:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRuntimeConfig = void 0;
const tslib_1 = __nccwpck_require__(4351);
const package_json_1 = tslib_1.__importDefault(__nccwpck_require__(7947));
const defaultStsRoleAssumers_1 = __nccwpck_require__(48);
const config_resolver_1 = __nccwpck_require__(6153);
const credential_provider_node_1 = __nccwpck_require__(5531);
const hash_node_1 = __nccwpck_require__(7442);
const middleware_retry_1 = __nccwpck_require__(6064);
const node_config_provider_1 = __nccwpck_require__(7684);
const node_http_handler_1 = __nccwpck_require__(8805);
const util_body_length_node_1 = __nccwpck_require__(4147);
const util_retry_1 = __nccwpck_require__(9395);
const util_user_agent_node_1 = __nccwpck_require__(8095);
const runtimeConfig_shared_1 = __nccwpck_require__(2642);
const smithy_client_1 = __nccwpck_require__(4963);
const util_defaults_mode_node_1 = __nccwpck_require__(4243);
const smithy_client_2 = __nccwpck_require__(4963);
const getRuntimeConfig = (config) => {
    (0, smithy_client_2.emitWarningIfUnsupportedVersion)(process.version);
    const defaultsMode = (0, util_defaults_mode_node_1.resolveDefaultsModeConfig)(config);
    const defaultConfigProvider = () => defaultsMode().then(smithy_client_1.loadConfigsForDefaultMode);
    const clientSharedValues = (0, runtimeConfig_shared_1.getRuntimeConfig)(config);
    return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        defaultsMode,
        bodyLengthChecker: config?.bodyLengthChecker ?? util_body_length_node_1.calculateBodyLength,
        credentialDefaultProvider: config?.credentialDefaultProvider ?? (0, defaultStsRoleAssumers_1.decorateDefaultCredentialProvider)(credential_provider_node_1.defaultProvider),
        defaultUserAgentProvider: config?.defaultUserAgentProvider ??
            (0, util_user_agent_node_1.defaultUserAgent)({ serviceId: clientSharedValues.serviceId, clientVersion: package_json_1.default.version }),
        maxAttempts: config?.maxAttempts ?? (0, node_config_provider_1.loadConfig)(middleware_retry_1.NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
        region: config?.region ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_REGION_CONFIG_OPTIONS, config_resolver_1.NODE_REGION_CONFIG_FILE_OPTIONS),
        requestHandler: config?.requestHandler ?? new node_http_handler_1.NodeHttpHandler(defaultConfigProvider),
        retryMode: config?.retryMode ??
            (0, node_config_provider_1.loadConfig)({
                ...middleware_retry_1.NODE_RETRY_MODE_CONFIG_OPTIONS,
                default: async () => (await defaultConfigProvider()).retryMode || util_retry_1.DEFAULT_RETRY_MODE,
            }),
        sha256: config?.sha256 ?? hash_node_1.Hash.bind(null, "sha256"),
        streamCollector: config?.streamCollector ?? node_http_handler_1.streamCollector,
        useDualstackEndpoint: config?.useDualstackEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
        useFipsEndpoint: config?.useFipsEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS),
    };
};
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),

/***/ 2642:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRuntimeConfig = void 0;
const smithy_client_1 = __nccwpck_require__(4963);
const url_parser_1 = __nccwpck_require__(2992);
const util_base64_1 = __nccwpck_require__(7727);
const util_utf8_1 = __nccwpck_require__(2855);
const endpointResolver_1 = __nccwpck_require__(1203);
const getRuntimeConfig = (config) => ({
    apiVersion: "2011-06-15",
    base64Decoder: config?.base64Decoder ?? util_base64_1.fromBase64,
    base64Encoder: config?.base64Encoder ?? util_base64_1.toBase64,
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? endpointResolver_1.defaultEndpointResolver,
    logger: config?.logger ?? new smithy_client_1.NoOpLogger(),
    serviceId: config?.serviceId ?? "STS",
    urlParser: config?.urlParser ?? url_parser_1.parseUrl,
    utf8Decoder: config?.utf8Decoder ?? util_utf8_1.fromUtf8,
    utf8Encoder: config?.utf8Encoder ?? util_utf8_1.toUtf8,
});
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),

/***/ 4723:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = exports.DEFAULT_USE_DUALSTACK_ENDPOINT = exports.CONFIG_USE_DUALSTACK_ENDPOINT = exports.ENV_USE_DUALSTACK_ENDPOINT = void 0;
const util_config_provider_1 = __nccwpck_require__(6168);
exports.ENV_USE_DUALSTACK_ENDPOINT = "AWS_USE_DUALSTACK_ENDPOINT";
exports.CONFIG_USE_DUALSTACK_ENDPOINT = "use_dualstack_endpoint";
exports.DEFAULT_USE_DUALSTACK_ENDPOINT = false;
exports.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => (0, util_config_provider_1.booleanSelector)(env, exports.ENV_USE_DUALSTACK_ENDPOINT, util_config_provider_1.SelectorType.ENV),
    configFileSelector: (profile) => (0, util_config_provider_1.booleanSelector)(profile, exports.CONFIG_USE_DUALSTACK_ENDPOINT, util_config_provider_1.SelectorType.CONFIG),
    default: false,
};


/***/ }),

/***/ 2478:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = exports.DEFAULT_USE_FIPS_ENDPOINT = exports.CONFIG_USE_FIPS_ENDPOINT = exports.ENV_USE_FIPS_ENDPOINT = void 0;
const util_config_provider_1 = __nccwpck_require__(6168);
exports.ENV_USE_FIPS_ENDPOINT = "AWS_USE_FIPS_ENDPOINT";
exports.CONFIG_USE_FIPS_ENDPOINT = "use_fips_endpoint";
exports.DEFAULT_USE_FIPS_ENDPOINT = false;
exports.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => (0, util_config_provider_1.booleanSelector)(env, exports.ENV_USE_FIPS_ENDPOINT, util_config_provider_1.SelectorType.ENV),
    configFileSelector: (profile) => (0, util_config_provider_1.booleanSelector)(profile, exports.CONFIG_USE_FIPS_ENDPOINT, util_config_provider_1.SelectorType.CONFIG),
    default: false,
};


/***/ }),

/***/ 7392:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(4723), exports);
tslib_1.__exportStar(__nccwpck_require__(2478), exports);
tslib_1.__exportStar(__nccwpck_require__(2108), exports);
tslib_1.__exportStar(__nccwpck_require__(2327), exports);


/***/ }),

/***/ 2108:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveCustomEndpointsConfig = void 0;
const util_middleware_1 = __nccwpck_require__(236);
const resolveCustomEndpointsConfig = (input) => {
    var _a, _b;
    const { endpoint, urlParser } = input;
    return {
        ...input,
        tls: (_a = input.tls) !== null && _a !== void 0 ? _a : true,
        endpoint: (0, util_middleware_1.normalizeProvider)(typeof endpoint === "string" ? urlParser(endpoint) : endpoint),
        isCustomEndpoint: true,
        useDualstackEndpoint: (0, util_middleware_1.normalizeProvider)((_b = input.useDualstackEndpoint) !== null && _b !== void 0 ? _b : false),
    };
};
exports.resolveCustomEndpointsConfig = resolveCustomEndpointsConfig;


/***/ }),

/***/ 2327:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveEndpointsConfig = void 0;
const util_middleware_1 = __nccwpck_require__(236);
const getEndpointFromRegion_1 = __nccwpck_require__(4159);
const resolveEndpointsConfig = (input) => {
    var _a, _b;
    const useDualstackEndpoint = (0, util_middleware_1.normalizeProvider)((_a = input.useDualstackEndpoint) !== null && _a !== void 0 ? _a : false);
    const { endpoint, useFipsEndpoint, urlParser } = input;
    return {
        ...input,
        tls: (_b = input.tls) !== null && _b !== void 0 ? _b : true,
        endpoint: endpoint
            ? (0, util_middleware_1.normalizeProvider)(typeof endpoint === "string" ? urlParser(endpoint) : endpoint)
            : () => (0, getEndpointFromRegion_1.getEndpointFromRegion)({ ...input, useDualstackEndpoint, useFipsEndpoint }),
        isCustomEndpoint: !!endpoint,
        useDualstackEndpoint,
    };
};
exports.resolveEndpointsConfig = resolveEndpointsConfig;


/***/ }),

/***/ 4159:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getEndpointFromRegion = void 0;
const getEndpointFromRegion = async (input) => {
    var _a;
    const { tls = true } = input;
    const region = await input.region();
    const dnsHostRegex = new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/);
    if (!dnsHostRegex.test(region)) {
        throw new Error("Invalid region in client config");
    }
    const useDualstackEndpoint = await input.useDualstackEndpoint();
    const useFipsEndpoint = await input.useFipsEndpoint();
    const { hostname } = (_a = (await input.regionInfoProvider(region, { useDualstackEndpoint, useFipsEndpoint }))) !== null && _a !== void 0 ? _a : {};
    if (!hostname) {
        throw new Error("Cannot resolve hostname from client config");
    }
    return input.urlParser(`${tls ? "https:" : "http:"}//${hostname}`);
};
exports.getEndpointFromRegion = getEndpointFromRegion;


/***/ }),

/***/ 6153:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(7392), exports);
tslib_1.__exportStar(__nccwpck_require__(5441), exports);
tslib_1.__exportStar(__nccwpck_require__(6258), exports);


/***/ }),

/***/ 422:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NODE_REGION_CONFIG_FILE_OPTIONS = exports.NODE_REGION_CONFIG_OPTIONS = exports.REGION_INI_NAME = exports.REGION_ENV_NAME = void 0;
exports.REGION_ENV_NAME = "AWS_REGION";
exports.REGION_INI_NAME = "region";
exports.NODE_REGION_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => env[exports.REGION_ENV_NAME],
    configFileSelector: (profile) => profile[exports.REGION_INI_NAME],
    default: () => {
        throw new Error("Region is missing");
    },
};
exports.NODE_REGION_CONFIG_FILE_OPTIONS = {
    preferredFile: "credentials",
};


/***/ }),

/***/ 2844:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRealRegion = void 0;
const isFipsRegion_1 = __nccwpck_require__(2440);
const getRealRegion = (region) => (0, isFipsRegion_1.isFipsRegion)(region)
    ? ["fips-aws-global", "aws-fips"].includes(region)
        ? "us-east-1"
        : region.replace(/fips-(dkr-|prod-)?|-fips/, "")
    : region;
exports.getRealRegion = getRealRegion;


/***/ }),

/***/ 5441:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(422), exports);
tslib_1.__exportStar(__nccwpck_require__(174), exports);


/***/ }),

/***/ 2440:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isFipsRegion = void 0;
const isFipsRegion = (region) => typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips"));
exports.isFipsRegion = isFipsRegion;


/***/ }),

/***/ 174:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveRegionConfig = void 0;
const getRealRegion_1 = __nccwpck_require__(2844);
const isFipsRegion_1 = __nccwpck_require__(2440);
const resolveRegionConfig = (input) => {
    const { region, useFipsEndpoint } = input;
    if (!region) {
        throw new Error("Region is missing");
    }
    return {
        ...input,
        region: async () => {
            if (typeof region === "string") {
                return (0, getRealRegion_1.getRealRegion)(region);
            }
            const providedRegion = await region();
            return (0, getRealRegion_1.getRealRegion)(providedRegion);
        },
        useFipsEndpoint: async () => {
            const providedRegion = typeof region === "string" ? region : await region();
            if ((0, isFipsRegion_1.isFipsRegion)(providedRegion)) {
                return true;
            }
            return typeof useFipsEndpoint !== "function" ? Promise.resolve(!!useFipsEndpoint) : useFipsEndpoint();
        },
    };
};
exports.resolveRegionConfig = resolveRegionConfig;


/***/ }),

/***/ 3566:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 6057:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 5280:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getHostnameFromVariants = void 0;
const getHostnameFromVariants = (variants = [], { useFipsEndpoint, useDualstackEndpoint }) => {
    var _a;
    return (_a = variants.find(({ tags }) => useFipsEndpoint === tags.includes("fips") && useDualstackEndpoint === tags.includes("dualstack"))) === null || _a === void 0 ? void 0 : _a.hostname;
};
exports.getHostnameFromVariants = getHostnameFromVariants;


/***/ }),

/***/ 6167:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRegionInfo = void 0;
const getHostnameFromVariants_1 = __nccwpck_require__(5280);
const getResolvedHostname_1 = __nccwpck_require__(3877);
const getResolvedPartition_1 = __nccwpck_require__(7642);
const getResolvedSigningRegion_1 = __nccwpck_require__(3517);
const getRegionInfo = (region, { useFipsEndpoint = false, useDualstackEndpoint = false, signingService, regionHash, partitionHash, }) => {
    var _a, _b, _c, _d, _e, _f;
    const partition = (0, getResolvedPartition_1.getResolvedPartition)(region, { partitionHash });
    const resolvedRegion = region in regionHash ? region : (_b = (_a = partitionHash[partition]) === null || _a === void 0 ? void 0 : _a.endpoint) !== null && _b !== void 0 ? _b : region;
    const hostnameOptions = { useFipsEndpoint, useDualstackEndpoint };
    const regionHostname = (0, getHostnameFromVariants_1.getHostnameFromVariants)((_c = regionHash[resolvedRegion]) === null || _c === void 0 ? void 0 : _c.variants, hostnameOptions);
    const partitionHostname = (0, getHostnameFromVariants_1.getHostnameFromVariants)((_d = partitionHash[partition]) === null || _d === void 0 ? void 0 : _d.variants, hostnameOptions);
    const hostname = (0, getResolvedHostname_1.getResolvedHostname)(resolvedRegion, { regionHostname, partitionHostname });
    if (hostname === undefined) {
        throw new Error(`Endpoint resolution failed for: ${{ resolvedRegion, useFipsEndpoint, useDualstackEndpoint }}`);
    }
    const signingRegion = (0, getResolvedSigningRegion_1.getResolvedSigningRegion)(hostname, {
        signingRegion: (_e = regionHash[resolvedRegion]) === null || _e === void 0 ? void 0 : _e.signingRegion,
        regionRegex: partitionHash[partition].regionRegex,
        useFipsEndpoint,
    });
    return {
        partition,
        signingService,
        hostname,
        ...(signingRegion && { signingRegion }),
        ...(((_f = regionHash[resolvedRegion]) === null || _f === void 0 ? void 0 : _f.signingService) && {
            signingService: regionHash[resolvedRegion].signingService,
        }),
    };
};
exports.getRegionInfo = getRegionInfo;


/***/ }),

/***/ 3877:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getResolvedHostname = void 0;
const getResolvedHostname = (resolvedRegion, { regionHostname, partitionHostname }) => regionHostname
    ? regionHostname
    : partitionHostname
        ? partitionHostname.replace("{region}", resolvedRegion)
        : undefined;
exports.getResolvedHostname = getResolvedHostname;


/***/ }),

/***/ 7642:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getResolvedPartition = void 0;
const getResolvedPartition = (region, { partitionHash }) => { var _a; return (_a = Object.keys(partitionHash || {}).find((key) => partitionHash[key].regions.includes(region))) !== null && _a !== void 0 ? _a : "aws"; };
exports.getResolvedPartition = getResolvedPartition;


/***/ }),

/***/ 3517:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getResolvedSigningRegion = void 0;
const getResolvedSigningRegion = (hostname, { signingRegion, regionRegex, useFipsEndpoint }) => {
    if (signingRegion) {
        return signingRegion;
    }
    else if (useFipsEndpoint) {
        const regionRegexJs = regionRegex.replace("\\\\", "\\").replace(/^\^/g, "\\.").replace(/\$$/g, "\\.");
        const regionRegexmatchArray = hostname.match(regionRegexJs);
        if (regionRegexmatchArray) {
            return regionRegexmatchArray[0].slice(1, -1);
        }
    }
};
exports.getResolvedSigningRegion = getResolvedSigningRegion;


/***/ }),

/***/ 6258:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(3566), exports);
tslib_1.__exportStar(__nccwpck_require__(6057), exports);
tslib_1.__exportStar(__nccwpck_require__(6167), exports);


/***/ }),

/***/ 8583:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromEnv = exports.ENV_EXPIRATION = exports.ENV_SESSION = exports.ENV_SECRET = exports.ENV_KEY = void 0;
const property_provider_1 = __nccwpck_require__(4462);
exports.ENV_KEY = "AWS_ACCESS_KEY_ID";
exports.ENV_SECRET = "AWS_SECRET_ACCESS_KEY";
exports.ENV_SESSION = "AWS_SESSION_TOKEN";
exports.ENV_EXPIRATION = "AWS_CREDENTIAL_EXPIRATION";
const fromEnv = () => async () => {
    const accessKeyId = process.env[exports.ENV_KEY];
    const secretAccessKey = process.env[exports.ENV_SECRET];
    const sessionToken = process.env[exports.ENV_SESSION];
    const expiry = process.env[exports.ENV_EXPIRATION];
    if (accessKeyId && secretAccessKey) {
        return {
            accessKeyId,
            secretAccessKey,
            ...(sessionToken && { sessionToken }),
            ...(expiry && { expiration: new Date(expiry) }),
        };
    }
    throw new property_provider_1.CredentialsProviderError("Unable to find environment variable credentials.");
};
exports.fromEnv = fromEnv;


/***/ }),

/***/ 5972:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(8583), exports);


/***/ }),

/***/ 3736:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Endpoint = void 0;
var Endpoint;
(function (Endpoint) {
    Endpoint["IPv4"] = "http://169.254.169.254";
    Endpoint["IPv6"] = "http://[fd00:ec2::254]";
})(Endpoint = exports.Endpoint || (exports.Endpoint = {}));


/***/ }),

/***/ 8438:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ENDPOINT_CONFIG_OPTIONS = exports.CONFIG_ENDPOINT_NAME = exports.ENV_ENDPOINT_NAME = void 0;
exports.ENV_ENDPOINT_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT";
exports.CONFIG_ENDPOINT_NAME = "ec2_metadata_service_endpoint";
exports.ENDPOINT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => env[exports.ENV_ENDPOINT_NAME],
    configFileSelector: (profile) => profile[exports.CONFIG_ENDPOINT_NAME],
    default: undefined,
};


/***/ }),

/***/ 1695:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EndpointMode = void 0;
var EndpointMode;
(function (EndpointMode) {
    EndpointMode["IPv4"] = "IPv4";
    EndpointMode["IPv6"] = "IPv6";
})(EndpointMode = exports.EndpointMode || (exports.EndpointMode = {}));


/***/ }),

/***/ 7824:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ENDPOINT_MODE_CONFIG_OPTIONS = exports.CONFIG_ENDPOINT_MODE_NAME = exports.ENV_ENDPOINT_MODE_NAME = void 0;
const EndpointMode_1 = __nccwpck_require__(1695);
exports.ENV_ENDPOINT_MODE_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE";
exports.CONFIG_ENDPOINT_MODE_NAME = "ec2_metadata_service_endpoint_mode";
exports.ENDPOINT_MODE_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => env[exports.ENV_ENDPOINT_MODE_NAME],
    configFileSelector: (profile) => profile[exports.CONFIG_ENDPOINT_MODE_NAME],
    default: EndpointMode_1.EndpointMode.IPv4,
};


/***/ }),

/***/ 5232:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromContainerMetadata = exports.ENV_CMDS_AUTH_TOKEN = exports.ENV_CMDS_RELATIVE_URI = exports.ENV_CMDS_FULL_URI = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const url_1 = __nccwpck_require__(7310);
const httpRequest_1 = __nccwpck_require__(1303);
const ImdsCredentials_1 = __nccwpck_require__(1467);
const RemoteProviderInit_1 = __nccwpck_require__(2314);
const retry_1 = __nccwpck_require__(9912);
exports.ENV_CMDS_FULL_URI = "AWS_CONTAINER_CREDENTIALS_FULL_URI";
exports.ENV_CMDS_RELATIVE_URI = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI";
exports.ENV_CMDS_AUTH_TOKEN = "AWS_CONTAINER_AUTHORIZATION_TOKEN";
const fromContainerMetadata = (init = {}) => {
    const { timeout, maxRetries } = (0, RemoteProviderInit_1.providerConfigFromInit)(init);
    return () => (0, retry_1.retry)(async () => {
        const requestOptions = await getCmdsUri();
        const credsResponse = JSON.parse(await requestFromEcsImds(timeout, requestOptions));
        if (!(0, ImdsCredentials_1.isImdsCredentials)(credsResponse)) {
            throw new property_provider_1.CredentialsProviderError("Invalid response received from instance metadata service.");
        }
        return (0, ImdsCredentials_1.fromImdsCredentials)(credsResponse);
    }, maxRetries);
};
exports.fromContainerMetadata = fromContainerMetadata;
const requestFromEcsImds = async (timeout, options) => {
    if (process.env[exports.ENV_CMDS_AUTH_TOKEN]) {
        options.headers = {
            ...options.headers,
            Authorization: process.env[exports.ENV_CMDS_AUTH_TOKEN],
        };
    }
    const buffer = await (0, httpRequest_1.httpRequest)({
        ...options,
        timeout,
    });
    return buffer.toString();
};
const CMDS_IP = "169.254.170.2";
const GREENGRASS_HOSTS = {
    localhost: true,
    "127.0.0.1": true,
};
const GREENGRASS_PROTOCOLS = {
    "http:": true,
    "https:": true,
};
const getCmdsUri = async () => {
    if (process.env[exports.ENV_CMDS_RELATIVE_URI]) {
        return {
            hostname: CMDS_IP,
            path: process.env[exports.ENV_CMDS_RELATIVE_URI],
        };
    }
    if (process.env[exports.ENV_CMDS_FULL_URI]) {
        const parsed = (0, url_1.parse)(process.env[exports.ENV_CMDS_FULL_URI]);
        if (!parsed.hostname || !(parsed.hostname in GREENGRASS_HOSTS)) {
            throw new property_provider_1.CredentialsProviderError(`${parsed.hostname} is not a valid container metadata service hostname`, false);
        }
        if (!parsed.protocol || !(parsed.protocol in GREENGRASS_PROTOCOLS)) {
            throw new property_provider_1.CredentialsProviderError(`${parsed.protocol} is not a valid container metadata service protocol`, false);
        }
        return {
            ...parsed,
            port: parsed.port ? parseInt(parsed.port, 10) : undefined,
        };
    }
    throw new property_provider_1.CredentialsProviderError("The container metadata credential provider cannot be used unless" +
        ` the ${exports.ENV_CMDS_RELATIVE_URI} or ${exports.ENV_CMDS_FULL_URI} environment` +
        " variable is set", false);
};


/***/ }),

/***/ 5813:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromInstanceMetadata = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const httpRequest_1 = __nccwpck_require__(1303);
const ImdsCredentials_1 = __nccwpck_require__(1467);
const RemoteProviderInit_1 = __nccwpck_require__(2314);
const retry_1 = __nccwpck_require__(9912);
const getInstanceMetadataEndpoint_1 = __nccwpck_require__(1206);
const staticStabilityProvider_1 = __nccwpck_require__(4620);
const IMDS_PATH = "/latest/meta-data/iam/security-credentials/";
const IMDS_TOKEN_PATH = "/latest/api/token";
const fromInstanceMetadata = (init = {}) => (0, staticStabilityProvider_1.staticStabilityProvider)(getInstanceImdsProvider(init), { logger: init.logger });
exports.fromInstanceMetadata = fromInstanceMetadata;
const getInstanceImdsProvider = (init) => {
    let disableFetchToken = false;
    const { timeout, maxRetries } = (0, RemoteProviderInit_1.providerConfigFromInit)(init);
    const getCredentials = async (maxRetries, options) => {
        const profile = (await (0, retry_1.retry)(async () => {
            let profile;
            try {
                profile = await getProfile(options);
            }
            catch (err) {
                if (err.statusCode === 401) {
                    disableFetchToken = false;
                }
                throw err;
            }
            return profile;
        }, maxRetries)).trim();
        return (0, retry_1.retry)(async () => {
            let creds;
            try {
                creds = await getCredentialsFromProfile(profile, options);
            }
            catch (err) {
                if (err.statusCode === 401) {
                    disableFetchToken = false;
                }
                throw err;
            }
            return creds;
        }, maxRetries);
    };
    return async () => {
        const endpoint = await (0, getInstanceMetadataEndpoint_1.getInstanceMetadataEndpoint)();
        if (disableFetchToken) {
            return getCredentials(maxRetries, { ...endpoint, timeout });
        }
        else {
            let token;
            try {
                token = (await getMetadataToken({ ...endpoint, timeout })).toString();
            }
            catch (error) {
                if ((error === null || error === void 0 ? void 0 : error.statusCode) === 400) {
                    throw Object.assign(error, {
                        message: "EC2 Metadata token request returned error",
                    });
                }
                else if (error.message === "TimeoutError" || [403, 404, 405].includes(error.statusCode)) {
                    disableFetchToken = true;
                }
                return getCredentials(maxRetries, { ...endpoint, timeout });
            }
            return getCredentials(maxRetries, {
                ...endpoint,
                headers: {
                    "x-aws-ec2-metadata-token": token,
                },
                timeout,
            });
        }
    };
};
const getMetadataToken = async (options) => (0, httpRequest_1.httpRequest)({
    ...options,
    path: IMDS_TOKEN_PATH,
    method: "PUT",
    headers: {
        "x-aws-ec2-metadata-token-ttl-seconds": "21600",
    },
});
const getProfile = async (options) => (await (0, httpRequest_1.httpRequest)({ ...options, path: IMDS_PATH })).toString();
const getCredentialsFromProfile = async (profile, options) => {
    const credsResponse = JSON.parse((await (0, httpRequest_1.httpRequest)({
        ...options,
        path: IMDS_PATH + profile,
    })).toString());
    if (!(0, ImdsCredentials_1.isImdsCredentials)(credsResponse)) {
        throw new property_provider_1.CredentialsProviderError("Invalid response received from instance metadata service.");
    }
    return (0, ImdsCredentials_1.fromImdsCredentials)(credsResponse);
};


/***/ }),

/***/ 5898:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getInstanceMetadataEndpoint = exports.httpRequest = void 0;
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(5232), exports);
tslib_1.__exportStar(__nccwpck_require__(5813), exports);
tslib_1.__exportStar(__nccwpck_require__(2314), exports);
tslib_1.__exportStar(__nccwpck_require__(1178), exports);
var httpRequest_1 = __nccwpck_require__(1303);
Object.defineProperty(exports, "httpRequest", ({ enumerable: true, get: function () { return httpRequest_1.httpRequest; } }));
var getInstanceMetadataEndpoint_1 = __nccwpck_require__(1206);
Object.defineProperty(exports, "getInstanceMetadataEndpoint", ({ enumerable: true, get: function () { return getInstanceMetadataEndpoint_1.getInstanceMetadataEndpoint; } }));


/***/ }),

/***/ 1467:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromImdsCredentials = exports.isImdsCredentials = void 0;
const isImdsCredentials = (arg) => Boolean(arg) &&
    typeof arg === "object" &&
    typeof arg.AccessKeyId === "string" &&
    typeof arg.SecretAccessKey === "string" &&
    typeof arg.Token === "string" &&
    typeof arg.Expiration === "string";
exports.isImdsCredentials = isImdsCredentials;
const fromImdsCredentials = (creds) => ({
    accessKeyId: creds.AccessKeyId,
    secretAccessKey: creds.SecretAccessKey,
    sessionToken: creds.Token,
    expiration: new Date(creds.Expiration),
});
exports.fromImdsCredentials = fromImdsCredentials;


/***/ }),

/***/ 2314:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.providerConfigFromInit = exports.DEFAULT_MAX_RETRIES = exports.DEFAULT_TIMEOUT = void 0;
exports.DEFAULT_TIMEOUT = 1000;
exports.DEFAULT_MAX_RETRIES = 0;
const providerConfigFromInit = ({ maxRetries = exports.DEFAULT_MAX_RETRIES, timeout = exports.DEFAULT_TIMEOUT, }) => ({ maxRetries, timeout });
exports.providerConfigFromInit = providerConfigFromInit;


/***/ }),

/***/ 1303:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.httpRequest = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const buffer_1 = __nccwpck_require__(4300);
const http_1 = __nccwpck_require__(3685);
function httpRequest(options) {
    return new Promise((resolve, reject) => {
        var _a;
        const req = (0, http_1.request)({
            method: "GET",
            ...options,
            hostname: (_a = options.hostname) === null || _a === void 0 ? void 0 : _a.replace(/^\[(.+)\]$/, "$1"),
        });
        req.on("error", (err) => {
            reject(Object.assign(new property_provider_1.ProviderError("Unable to connect to instance metadata service"), err));
            req.destroy();
        });
        req.on("timeout", () => {
            reject(new property_provider_1.ProviderError("TimeoutError from instance metadata service"));
            req.destroy();
        });
        req.on("response", (res) => {
            const { statusCode = 400 } = res;
            if (statusCode < 200 || 300 <= statusCode) {
                reject(Object.assign(new property_provider_1.ProviderError("Error response received from instance metadata service"), { statusCode }));
                req.destroy();
            }
            const chunks = [];
            res.on("data", (chunk) => {
                chunks.push(chunk);
            });
            res.on("end", () => {
                resolve(buffer_1.Buffer.concat(chunks));
                req.destroy();
            });
        });
        req.end();
    });
}
exports.httpRequest = httpRequest;


/***/ }),

/***/ 9912:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.retry = void 0;
const retry = (toRetry, maxRetries) => {
    let promise = toRetry();
    for (let i = 0; i < maxRetries; i++) {
        promise = promise.catch(toRetry);
    }
    return promise;
};
exports.retry = retry;


/***/ }),

/***/ 1178:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 8473:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getExtendedInstanceMetadataCredentials = void 0;
const STATIC_STABILITY_REFRESH_INTERVAL_SECONDS = 5 * 60;
const STATIC_STABILITY_REFRESH_INTERVAL_JITTER_WINDOW_SECONDS = 5 * 60;
const STATIC_STABILITY_DOC_URL = "https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html";
const getExtendedInstanceMetadataCredentials = (credentials, logger) => {
    var _a;
    const refreshInterval = STATIC_STABILITY_REFRESH_INTERVAL_SECONDS +
        Math.floor(Math.random() * STATIC_STABILITY_REFRESH_INTERVAL_JITTER_WINDOW_SECONDS);
    const newExpiration = new Date(Date.now() + refreshInterval * 1000);
    logger.warn("Attempting credential expiration extension due to a credential service availability issue. A refresh of these " +
        "credentials will be attempted after ${new Date(newExpiration)}.\nFor more information, please visit: " +
        STATIC_STABILITY_DOC_URL);
    const originalExpiration = (_a = credentials.originalExpiration) !== null && _a !== void 0 ? _a : credentials.expiration;
    return {
        ...credentials,
        ...(originalExpiration ? { originalExpiration } : {}),
        expiration: newExpiration,
    };
};
exports.getExtendedInstanceMetadataCredentials = getExtendedInstanceMetadataCredentials;


/***/ }),

/***/ 1206:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getInstanceMetadataEndpoint = void 0;
const node_config_provider_1 = __nccwpck_require__(7684);
const url_parser_1 = __nccwpck_require__(2992);
const Endpoint_1 = __nccwpck_require__(3736);
const EndpointConfigOptions_1 = __nccwpck_require__(8438);
const EndpointMode_1 = __nccwpck_require__(1695);
const EndpointModeConfigOptions_1 = __nccwpck_require__(7824);
const getInstanceMetadataEndpoint = async () => (0, url_parser_1.parseUrl)((await getFromEndpointConfig()) || (await getFromEndpointModeConfig()));
exports.getInstanceMetadataEndpoint = getInstanceMetadataEndpoint;
const getFromEndpointConfig = async () => (0, node_config_provider_1.loadConfig)(EndpointConfigOptions_1.ENDPOINT_CONFIG_OPTIONS)();
const getFromEndpointModeConfig = async () => {
    const endpointMode = await (0, node_config_provider_1.loadConfig)(EndpointModeConfigOptions_1.ENDPOINT_MODE_CONFIG_OPTIONS)();
    switch (endpointMode) {
        case EndpointMode_1.EndpointMode.IPv4:
            return Endpoint_1.Endpoint.IPv4;
        case EndpointMode_1.EndpointMode.IPv6:
            return Endpoint_1.Endpoint.IPv6;
        default:
            throw new Error(`Unsupported endpoint mode: ${endpointMode}.` + ` Select from ${Object.values(EndpointMode_1.EndpointMode)}`);
    }
};


/***/ }),

/***/ 4620:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.staticStabilityProvider = void 0;
const getExtendedInstanceMetadataCredentials_1 = __nccwpck_require__(8473);
const staticStabilityProvider = (provider, options = {}) => {
    const logger = (options === null || options === void 0 ? void 0 : options.logger) || console;
    let pastCredentials;
    return async () => {
        let credentials;
        try {
            credentials = await provider();
            if (credentials.expiration && credentials.expiration.getTime() < Date.now()) {
                credentials = (0, getExtendedInstanceMetadataCredentials_1.getExtendedInstanceMetadataCredentials)(credentials, logger);
            }
        }
        catch (e) {
            if (pastCredentials) {
                logger.warn("Credential renew failed: ", e);
                credentials = (0, getExtendedInstanceMetadataCredentials_1.getExtendedInstanceMetadataCredentials)(pastCredentials, logger);
            }
            else {
                throw e;
            }
        }
        pastCredentials = credentials;
        return credentials;
    };
};
exports.staticStabilityProvider = staticStabilityProvider;


/***/ }),

/***/ 5442:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromIni = void 0;
const shared_ini_file_loader_1 = __nccwpck_require__(7387);
const resolveProfileData_1 = __nccwpck_require__(5653);
const fromIni = (init = {}) => async () => {
    const profiles = await (0, shared_ini_file_loader_1.parseKnownFiles)(init);
    return (0, resolveProfileData_1.resolveProfileData)((0, shared_ini_file_loader_1.getProfileName)(init), profiles, init);
};
exports.fromIni = fromIni;


/***/ }),

/***/ 4203:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(5442), exports);


/***/ }),

/***/ 853:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveAssumeRoleCredentials = exports.isAssumeRoleProfile = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const shared_ini_file_loader_1 = __nccwpck_require__(7387);
const resolveCredentialSource_1 = __nccwpck_require__(2458);
const resolveProfileData_1 = __nccwpck_require__(5653);
const isAssumeRoleProfile = (arg) => Boolean(arg) &&
    typeof arg === "object" &&
    typeof arg.role_arn === "string" &&
    ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1 &&
    ["undefined", "string"].indexOf(typeof arg.external_id) > -1 &&
    ["undefined", "string"].indexOf(typeof arg.mfa_serial) > -1 &&
    (isAssumeRoleWithSourceProfile(arg) || isAssumeRoleWithProviderProfile(arg));
exports.isAssumeRoleProfile = isAssumeRoleProfile;
const isAssumeRoleWithSourceProfile = (arg) => typeof arg.source_profile === "string" && typeof arg.credential_source === "undefined";
const isAssumeRoleWithProviderProfile = (arg) => typeof arg.credential_source === "string" && typeof arg.source_profile === "undefined";
const resolveAssumeRoleCredentials = async (profileName, profiles, options, visitedProfiles = {}) => {
    const data = profiles[profileName];
    if (!options.roleAssumer) {
        throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} requires a role to be assumed, but no role assumption callback was provided.`, false);
    }
    const { source_profile } = data;
    if (source_profile && source_profile in visitedProfiles) {
        throw new property_provider_1.CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile` +
            ` ${(0, shared_ini_file_loader_1.getProfileName)(options)}. Profiles visited: ` +
            Object.keys(visitedProfiles).join(", "), false);
    }
    const sourceCredsProvider = source_profile
        ? (0, resolveProfileData_1.resolveProfileData)(source_profile, profiles, options, {
            ...visitedProfiles,
            [source_profile]: true,
        })
        : (0, resolveCredentialSource_1.resolveCredentialSource)(data.credential_source, profileName)();
    const params = {
        RoleArn: data.role_arn,
        RoleSessionName: data.role_session_name || `aws-sdk-js-${Date.now()}`,
        ExternalId: data.external_id,
    };
    const { mfa_serial } = data;
    if (mfa_serial) {
        if (!options.mfaCodeProvider) {
            throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} requires multi-factor authentication, but no MFA code callback was provided.`, false);
        }
        params.SerialNumber = mfa_serial;
        params.TokenCode = await options.mfaCodeProvider(mfa_serial);
    }
    const sourceCreds = await sourceCredsProvider;
    return options.roleAssumer(sourceCreds, params);
};
exports.resolveAssumeRoleCredentials = resolveAssumeRoleCredentials;


/***/ }),

/***/ 2458:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveCredentialSource = void 0;
const credential_provider_env_1 = __nccwpck_require__(5972);
const credential_provider_imds_1 = __nccwpck_require__(5898);
const property_provider_1 = __nccwpck_require__(4462);
const resolveCredentialSource = (credentialSource, profileName) => {
    const sourceProvidersMap = {
        EcsContainer: credential_provider_imds_1.fromContainerMetadata,
        Ec2InstanceMetadata: credential_provider_imds_1.fromInstanceMetadata,
        Environment: credential_provider_env_1.fromEnv,
    };
    if (credentialSource in sourceProvidersMap) {
        return sourceProvidersMap[credentialSource]();
    }
    else {
        throw new property_provider_1.CredentialsProviderError(`Unsupported credential source in profile ${profileName}. Got ${credentialSource}, ` +
            `expected EcsContainer or Ec2InstanceMetadata or Environment.`);
    }
};
exports.resolveCredentialSource = resolveCredentialSource;


/***/ }),

/***/ 9993:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveProcessCredentials = exports.isProcessProfile = void 0;
const credential_provider_process_1 = __nccwpck_require__(9969);
const isProcessProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.credential_process === "string";
exports.isProcessProfile = isProcessProfile;
const resolveProcessCredentials = async (options, profile) => (0, credential_provider_process_1.fromProcess)({
    ...options,
    profile,
})();
exports.resolveProcessCredentials = resolveProcessCredentials;


/***/ }),

/***/ 5653:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveProfileData = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const resolveAssumeRoleCredentials_1 = __nccwpck_require__(853);
const resolveProcessCredentials_1 = __nccwpck_require__(9993);
const resolveSsoCredentials_1 = __nccwpck_require__(9867);
const resolveStaticCredentials_1 = __nccwpck_require__(3071);
const resolveWebIdentityCredentials_1 = __nccwpck_require__(8342);
const resolveProfileData = async (profileName, profiles, options, visitedProfiles = {}) => {
    const data = profiles[profileName];
    if (Object.keys(visitedProfiles).length > 0 && (0, resolveStaticCredentials_1.isStaticCredsProfile)(data)) {
        return (0, resolveStaticCredentials_1.resolveStaticCredentials)(data);
    }
    if ((0, resolveAssumeRoleCredentials_1.isAssumeRoleProfile)(data)) {
        return (0, resolveAssumeRoleCredentials_1.resolveAssumeRoleCredentials)(profileName, profiles, options, visitedProfiles);
    }
    if ((0, resolveStaticCredentials_1.isStaticCredsProfile)(data)) {
        return (0, resolveStaticCredentials_1.resolveStaticCredentials)(data);
    }
    if ((0, resolveWebIdentityCredentials_1.isWebIdentityProfile)(data)) {
        return (0, resolveWebIdentityCredentials_1.resolveWebIdentityCredentials)(data, options);
    }
    if ((0, resolveProcessCredentials_1.isProcessProfile)(data)) {
        return (0, resolveProcessCredentials_1.resolveProcessCredentials)(options, profileName);
    }
    if ((0, resolveSsoCredentials_1.isSsoProfile)(data)) {
        return (0, resolveSsoCredentials_1.resolveSsoCredentials)(data);
    }
    throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} could not be found or parsed in shared credentials file.`);
};
exports.resolveProfileData = resolveProfileData;


/***/ }),

/***/ 9867:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveSsoCredentials = exports.isSsoProfile = void 0;
const credential_provider_sso_1 = __nccwpck_require__(6414);
var credential_provider_sso_2 = __nccwpck_require__(6414);
Object.defineProperty(exports, "isSsoProfile", ({ enumerable: true, get: function () { return credential_provider_sso_2.isSsoProfile; } }));
const resolveSsoCredentials = (data) => {
    const { sso_start_url, sso_account_id, sso_session, sso_region, sso_role_name } = (0, credential_provider_sso_1.validateSsoProfile)(data);
    return (0, credential_provider_sso_1.fromSSO)({
        ssoStartUrl: sso_start_url,
        ssoAccountId: sso_account_id,
        ssoSession: sso_session,
        ssoRegion: sso_region,
        ssoRoleName: sso_role_name,
    })();
};
exports.resolveSsoCredentials = resolveSsoCredentials;


/***/ }),

/***/ 3071:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveStaticCredentials = exports.isStaticCredsProfile = void 0;
const isStaticCredsProfile = (arg) => Boolean(arg) &&
    typeof arg === "object" &&
    typeof arg.aws_access_key_id === "string" &&
    typeof arg.aws_secret_access_key === "string" &&
    ["undefined", "string"].indexOf(typeof arg.aws_session_token) > -1;
exports.isStaticCredsProfile = isStaticCredsProfile;
const resolveStaticCredentials = (profile) => Promise.resolve({
    accessKeyId: profile.aws_access_key_id,
    secretAccessKey: profile.aws_secret_access_key,
    sessionToken: profile.aws_session_token,
});
exports.resolveStaticCredentials = resolveStaticCredentials;


/***/ }),

/***/ 8342:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveWebIdentityCredentials = exports.isWebIdentityProfile = void 0;
const credential_provider_web_identity_1 = __nccwpck_require__(5646);
const isWebIdentityProfile = (arg) => Boolean(arg) &&
    typeof arg === "object" &&
    typeof arg.web_identity_token_file === "string" &&
    typeof arg.role_arn === "string" &&
    ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1;
exports.isWebIdentityProfile = isWebIdentityProfile;
const resolveWebIdentityCredentials = async (profile, options) => (0, credential_provider_web_identity_1.fromTokenFile)({
    webIdentityTokenFile: profile.web_identity_token_file,
    roleArn: profile.role_arn,
    roleSessionName: profile.role_session_name,
    roleAssumerWithWebIdentity: options.roleAssumerWithWebIdentity,
})();
exports.resolveWebIdentityCredentials = resolveWebIdentityCredentials;


/***/ }),

/***/ 5560:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultProvider = void 0;
const credential_provider_env_1 = __nccwpck_require__(5972);
const credential_provider_ini_1 = __nccwpck_require__(4203);
const credential_provider_process_1 = __nccwpck_require__(9969);
const credential_provider_sso_1 = __nccwpck_require__(6414);
const credential_provider_web_identity_1 = __nccwpck_require__(5646);
const property_provider_1 = __nccwpck_require__(4462);
const shared_ini_file_loader_1 = __nccwpck_require__(7387);
const remoteProvider_1 = __nccwpck_require__(626);
const defaultProvider = (init = {}) => (0, property_provider_1.memoize)((0, property_provider_1.chain)(...(init.profile || process.env[shared_ini_file_loader_1.ENV_PROFILE] ? [] : [(0, credential_provider_env_1.fromEnv)()]), (0, credential_provider_sso_1.fromSSO)(init), (0, credential_provider_ini_1.fromIni)(init), (0, credential_provider_process_1.fromProcess)(init), (0, credential_provider_web_identity_1.fromTokenFile)(init), (0, remoteProvider_1.remoteProvider)(init), async () => {
    throw new property_provider_1.CredentialsProviderError("Could not load credentials from any providers", false);
}), (credentials) => credentials.expiration !== undefined && credentials.expiration.getTime() - Date.now() < 300000, (credentials) => credentials.expiration !== undefined);
exports.defaultProvider = defaultProvider;


/***/ }),

/***/ 5531:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(5560), exports);


/***/ }),

/***/ 626:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.remoteProvider = exports.ENV_IMDS_DISABLED = void 0;
const credential_provider_imds_1 = __nccwpck_require__(5898);
const property_provider_1 = __nccwpck_require__(4462);
exports.ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
const remoteProvider = (init) => {
    if (process.env[credential_provider_imds_1.ENV_CMDS_RELATIVE_URI] || process.env[credential_provider_imds_1.ENV_CMDS_FULL_URI]) {
        return (0, credential_provider_imds_1.fromContainerMetadata)(init);
    }
    if (process.env[exports.ENV_IMDS_DISABLED]) {
        return async () => {
            throw new property_provider_1.CredentialsProviderError("EC2 Instance Metadata Service access disabled");
        };
    }
    return (0, credential_provider_imds_1.fromInstanceMetadata)(init);
};
exports.remoteProvider = remoteProvider;


/***/ }),

/***/ 2650:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromProcess = void 0;
const shared_ini_file_loader_1 = __nccwpck_require__(7387);
const resolveProcessCredentials_1 = __nccwpck_require__(4926);
const fromProcess = (init = {}) => async () => {
    const profiles = await (0, shared_ini_file_loader_1.parseKnownFiles)(init);
    return (0, resolveProcessCredentials_1.resolveProcessCredentials)((0, shared_ini_file_loader_1.getProfileName)(init), profiles);
};
exports.fromProcess = fromProcess;


/***/ }),

/***/ 1104:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getValidatedProcessCredentials = void 0;
const getValidatedProcessCredentials = (profileName, data) => {
    if (data.Version !== 1) {
        throw Error(`Profile ${profileName} credential_process did not return Version 1.`);
    }
    if (data.AccessKeyId === undefined || data.SecretAccessKey === undefined) {
        throw Error(`Profile ${profileName} credential_process returned invalid credentials.`);
    }
    if (data.Expiration) {
        const currentTime = new Date();
        const expireTime = new Date(data.Expiration);
        if (expireTime < currentTime) {
            throw Error(`Profile ${profileName} credential_process returned expired credentials.`);
        }
    }
    return {
        accessKeyId: data.AccessKeyId,
        secretAccessKey: data.SecretAccessKey,
        ...(data.SessionToken && { sessionToken: data.SessionToken }),
        ...(data.Expiration && { expiration: new Date(data.Expiration) }),
    };
};
exports.getValidatedProcessCredentials = getValidatedProcessCredentials;


/***/ }),

/***/ 9969:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(2650), exports);


/***/ }),

/***/ 4926:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveProcessCredentials = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const child_process_1 = __nccwpck_require__(2081);
const util_1 = __nccwpck_require__(3837);
const getValidatedProcessCredentials_1 = __nccwpck_require__(1104);
const resolveProcessCredentials = async (profileName, profiles) => {
    const profile = profiles[profileName];
    if (profiles[profileName]) {
        const credentialProcess = profile["credential_process"];
        if (credentialProcess !== undefined) {
            const execPromise = (0, util_1.promisify)(child_process_1.exec);
            try {
                const { stdout } = await execPromise(credentialProcess);
                let data;
                try {
                    data = JSON.parse(stdout.trim());
                }
                catch (_a) {
                    throw Error(`Profile ${profileName} credential_process returned invalid JSON.`);
                }
                return (0, getValidatedProcessCredentials_1.getValidatedProcessCredentials)(profileName, data);
            }
            catch (error) {
                throw new property_provider_1.CredentialsProviderError(error.message);
            }
        }
        else {
            throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} did not contain credential_process.`);
        }
    }
    else {
        throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} could not be found in shared credentials file.`);
    }
};
exports.resolveProcessCredentials = resolveProcessCredentials;


/***/ }),

/***/ 5184:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromSSO = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const shared_ini_file_loader_1 = __nccwpck_require__(7387);
const isSsoProfile_1 = __nccwpck_require__(2572);
const resolveSSOCredentials_1 = __nccwpck_require__(4729);
const validateSsoProfile_1 = __nccwpck_require__(8098);
const fromSSO = (init = {}) => async () => {
    const { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoClient, ssoSession } = init;
    const profileName = (0, shared_ini_file_loader_1.getProfileName)(init);
    if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName && !ssoSession) {
        const profiles = await (0, shared_ini_file_loader_1.parseKnownFiles)(init);
        const profile = profiles[profileName];
        if (!profile) {
            throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} was not found.`);
        }
        if (!(0, isSsoProfile_1.isSsoProfile)(profile)) {
            throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} is not configured with SSO credentials.`);
        }
        if (profile === null || profile === void 0 ? void 0 : profile.sso_session) {
            const ssoSessions = await (0, shared_ini_file_loader_1.loadSsoSessionData)(init);
            const session = ssoSessions[profile.sso_session];
            const conflictMsg = ` configurations in profile ${profileName} and sso-session ${profile.sso_session}`;
            if (ssoRegion && ssoRegion !== session.sso_region) {
                throw new property_provider_1.CredentialsProviderError(`Conflicting SSO region` + conflictMsg, false);
            }
            if (ssoStartUrl && ssoStartUrl !== session.sso_start_url) {
                throw new property_provider_1.CredentialsProviderError(`Conflicting SSO start_url` + conflictMsg, false);
            }
            profile.sso_region = session.sso_region;
            profile.sso_start_url = session.sso_start_url;
        }
        const { sso_start_url, sso_account_id, sso_region, sso_role_name, sso_session } = (0, validateSsoProfile_1.validateSsoProfile)(profile);
        return (0, resolveSSOCredentials_1.resolveSSOCredentials)({
            ssoStartUrl: sso_start_url,
            ssoSession: sso_session,
            ssoAccountId: sso_account_id,
            ssoRegion: sso_region,
            ssoRoleName: sso_role_name,
            ssoClient: ssoClient,
            profile: profileName,
        });
    }
    else if (!ssoStartUrl || !ssoAccountId || !ssoRegion || !ssoRoleName) {
        throw new property_provider_1.CredentialsProviderError("Incomplete configuration. The fromSSO() argument hash must include " +
            '"ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"');
    }
    else {
        return (0, resolveSSOCredentials_1.resolveSSOCredentials)({
            ssoStartUrl,
            ssoSession,
            ssoAccountId,
            ssoRegion,
            ssoRoleName,
            ssoClient,
            profile: profileName,
        });
    }
};
exports.fromSSO = fromSSO;


/***/ }),

/***/ 6414:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(5184), exports);
tslib_1.__exportStar(__nccwpck_require__(2572), exports);
tslib_1.__exportStar(__nccwpck_require__(6623), exports);
tslib_1.__exportStar(__nccwpck_require__(8098), exports);


/***/ }),

/***/ 2572:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isSsoProfile = void 0;
const isSsoProfile = (arg) => arg &&
    (typeof arg.sso_start_url === "string" ||
        typeof arg.sso_account_id === "string" ||
        typeof arg.sso_session === "string" ||
        typeof arg.sso_region === "string" ||
        typeof arg.sso_role_name === "string");
exports.isSsoProfile = isSsoProfile;


/***/ }),

/***/ 4729:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveSSOCredentials = void 0;
const client_sso_1 = __nccwpck_require__(2666);
const property_provider_1 = __nccwpck_require__(4462);
const shared_ini_file_loader_1 = __nccwpck_require__(7387);
const token_providers_1 = __nccwpck_require__(2843);
const EXPIRE_WINDOW_MS = 15 * 60 * 1000;
const SHOULD_FAIL_CREDENTIAL_CHAIN = false;
const resolveSSOCredentials = async ({ ssoStartUrl, ssoSession, ssoAccountId, ssoRegion, ssoRoleName, ssoClient, profile, }) => {
    let token;
    const refreshMessage = `To refresh this SSO session run aws sso login with the corresponding profile.`;
    if (ssoSession) {
        try {
            const _token = await (0, token_providers_1.fromSso)({ profile })();
            token = {
                accessToken: _token.token,
                expiresAt: new Date(_token.expiration).toISOString(),
            };
        }
        catch (e) {
            throw new property_provider_1.CredentialsProviderError(e.message, SHOULD_FAIL_CREDENTIAL_CHAIN);
        }
    }
    else {
        try {
            token = await (0, shared_ini_file_loader_1.getSSOTokenFromFile)(ssoStartUrl);
        }
        catch (e) {
            throw new property_provider_1.CredentialsProviderError(`The SSO session associated with this profile is invalid. ${refreshMessage}`, SHOULD_FAIL_CREDENTIAL_CHAIN);
        }
    }
    if (new Date(token.expiresAt).getTime() - Date.now() <= EXPIRE_WINDOW_MS) {
        throw new property_provider_1.CredentialsProviderError(`The SSO session associated with this profile has expired. ${refreshMessage}`, SHOULD_FAIL_CREDENTIAL_CHAIN);
    }
    const { accessToken } = token;
    const sso = ssoClient || new client_sso_1.SSOClient({ region: ssoRegion });
    let ssoResp;
    try {
        ssoResp = await sso.send(new client_sso_1.GetRoleCredentialsCommand({
            accountId: ssoAccountId,
            roleName: ssoRoleName,
            accessToken,
        }));
    }
    catch (e) {
        throw property_provider_1.CredentialsProviderError.from(e, SHOULD_FAIL_CREDENTIAL_CHAIN);
    }
    const { roleCredentials: { accessKeyId, secretAccessKey, sessionToken, expiration } = {} } = ssoResp;
    if (!accessKeyId || !secretAccessKey || !sessionToken || !expiration) {
        throw new property_provider_1.CredentialsProviderError("SSO returns an invalid temporary credential.", SHOULD_FAIL_CREDENTIAL_CHAIN);
    }
    return { accessKeyId, secretAccessKey, sessionToken, expiration: new Date(expiration) };
};
exports.resolveSSOCredentials = resolveSSOCredentials;


/***/ }),

/***/ 6623:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 8098:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateSsoProfile = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const validateSsoProfile = (profile) => {
    const { sso_start_url, sso_account_id, sso_region, sso_role_name } = profile;
    if (!sso_start_url || !sso_account_id || !sso_region || !sso_role_name) {
        throw new property_provider_1.CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", ` +
            `"sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(profile).join(", ")}\nReference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, false);
    }
    return profile;
};
exports.validateSsoProfile = validateSsoProfile;


/***/ }),

/***/ 5614:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromTokenFile = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const fs_1 = __nccwpck_require__(7147);
const fromWebToken_1 = __nccwpck_require__(7905);
const ENV_TOKEN_FILE = "AWS_WEB_IDENTITY_TOKEN_FILE";
const ENV_ROLE_ARN = "AWS_ROLE_ARN";
const ENV_ROLE_SESSION_NAME = "AWS_ROLE_SESSION_NAME";
const fromTokenFile = (init = {}) => async () => {
    return resolveTokenFile(init);
};
exports.fromTokenFile = fromTokenFile;
const resolveTokenFile = (init) => {
    var _a, _b, _c;
    const webIdentityTokenFile = (_a = init === null || init === void 0 ? void 0 : init.webIdentityTokenFile) !== null && _a !== void 0 ? _a : process.env[ENV_TOKEN_FILE];
    const roleArn = (_b = init === null || init === void 0 ? void 0 : init.roleArn) !== null && _b !== void 0 ? _b : process.env[ENV_ROLE_ARN];
    const roleSessionName = (_c = init === null || init === void 0 ? void 0 : init.roleSessionName) !== null && _c !== void 0 ? _c : process.env[ENV_ROLE_SESSION_NAME];
    if (!webIdentityTokenFile || !roleArn) {
        throw new property_provider_1.CredentialsProviderError("Web identity configuration not specified");
    }
    return (0, fromWebToken_1.fromWebToken)({
        ...init,
        webIdentityToken: (0, fs_1.readFileSync)(webIdentityTokenFile, { encoding: "ascii" }),
        roleArn,
        roleSessionName,
    })();
};


/***/ }),

/***/ 7905:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromWebToken = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const fromWebToken = (init) => () => {
    const { roleArn, roleSessionName, webIdentityToken, providerId, policyArns, policy, durationSeconds, roleAssumerWithWebIdentity, } = init;
    if (!roleAssumerWithWebIdentity) {
        throw new property_provider_1.CredentialsProviderError(`Role Arn '${roleArn}' needs to be assumed with web identity,` +
            ` but no role assumption callback was provided.`, false);
    }
    return roleAssumerWithWebIdentity({
        RoleArn: roleArn,
        RoleSessionName: roleSessionName !== null && roleSessionName !== void 0 ? roleSessionName : `aws-sdk-js-session-${Date.now()}`,
        WebIdentityToken: webIdentityToken,
        ProviderId: providerId,
        PolicyArns: policyArns,
        Policy: policy,
        DurationSeconds: durationSeconds,
    });
};
exports.fromWebToken = fromWebToken;


/***/ }),

/***/ 5646:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(5614), exports);
tslib_1.__exportStar(__nccwpck_require__(7905), exports);


/***/ }),

/***/ 7442:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Hash = void 0;
const util_buffer_from_1 = __nccwpck_require__(6010);
const util_utf8_1 = __nccwpck_require__(2855);
const buffer_1 = __nccwpck_require__(4300);
const crypto_1 = __nccwpck_require__(6113);
class Hash {
    constructor(algorithmIdentifier, secret) {
        this.algorithmIdentifier = algorithmIdentifier;
        this.secret = secret;
        this.reset();
    }
    update(toHash, encoding) {
        this.hash.update((0, util_utf8_1.toUint8Array)(castSourceData(toHash, encoding)));
    }
    digest() {
        return Promise.resolve(this.hash.digest());
    }
    reset() {
        this.hash = this.secret
            ? (0, crypto_1.createHmac)(this.algorithmIdentifier, castSourceData(this.secret))
            : (0, crypto_1.createHash)(this.algorithmIdentifier);
    }
}
exports.Hash = Hash;
function castSourceData(toCast, encoding) {
    if (buffer_1.Buffer.isBuffer(toCast)) {
        return toCast;
    }
    if (typeof toCast === "string") {
        return (0, util_buffer_from_1.fromString)(toCast, encoding);
    }
    if (ArrayBuffer.isView(toCast)) {
        return (0, util_buffer_from_1.fromArrayBuffer)(toCast.buffer, toCast.byteOffset, toCast.byteLength);
    }
    return (0, util_buffer_from_1.fromArrayBuffer)(toCast);
}


/***/ }),

/***/ 9126:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isArrayBuffer = void 0;
const isArrayBuffer = (arg) => (typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer) ||
    Object.prototype.toString.call(arg) === "[object ArrayBuffer]";
exports.isArrayBuffer = isArrayBuffer;


/***/ }),

/***/ 2245:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getContentLengthPlugin = exports.contentLengthMiddlewareOptions = exports.contentLengthMiddleware = void 0;
const protocol_http_1 = __nccwpck_require__(223);
const CONTENT_LENGTH_HEADER = "content-length";
function contentLengthMiddleware(bodyLengthChecker) {
    return (next) => async (args) => {
        const request = args.request;
        if (protocol_http_1.HttpRequest.isInstance(request)) {
            const { body, headers } = request;
            if (body &&
                Object.keys(headers)
                    .map((str) => str.toLowerCase())
                    .indexOf(CONTENT_LENGTH_HEADER) === -1) {
                try {
                    const length = bodyLengthChecker(body);
                    request.headers = {
                        ...request.headers,
                        [CONTENT_LENGTH_HEADER]: String(length),
                    };
                }
                catch (error) {
                }
            }
        }
        return next({
            ...args,
            request,
        });
    };
}
exports.contentLengthMiddleware = contentLengthMiddleware;
exports.contentLengthMiddlewareOptions = {
    step: "build",
    tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
    name: "contentLengthMiddleware",
    override: true,
};
const getContentLengthPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), exports.contentLengthMiddlewareOptions);
    },
});
exports.getContentLengthPlugin = getContentLengthPlugin;


/***/ }),

/***/ 3504:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createConfigValueProvider = void 0;
const createConfigValueProvider = (configKey, canonicalEndpointParamKey, config) => {
    const configProvider = async () => {
        var _a;
        const configValue = (_a = config[configKey]) !== null && _a !== void 0 ? _a : config[canonicalEndpointParamKey];
        if (typeof configValue === "function") {
            return configValue();
        }
        return configValue;
    };
    if (configKey === "endpoint" || canonicalEndpointParamKey === "endpoint") {
        return async () => {
            const endpoint = await configProvider();
            if (endpoint && typeof endpoint === "object") {
                if ("url" in endpoint) {
                    return endpoint.url.href;
                }
                if ("hostname" in endpoint) {
                    const { protocol, hostname, port, path } = endpoint;
                    return `${protocol}//${hostname}${port ? ":" + port : ""}${path}`;
                }
            }
            return endpoint;
        };
    }
    return configProvider;
};
exports.createConfigValueProvider = createConfigValueProvider;


/***/ }),

/***/ 2419:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveParams = exports.getEndpointFromInstructions = void 0;
const service_customizations_1 = __nccwpck_require__(3589);
const createConfigValueProvider_1 = __nccwpck_require__(3504);
const getEndpointFromInstructions = async (commandInput, instructionsSupplier, clientConfig, context) => {
    const endpointParams = await (0, exports.resolveParams)(commandInput, instructionsSupplier, clientConfig);
    if (typeof clientConfig.endpointProvider !== "function") {
        throw new Error("config.endpointProvider is not set.");
    }
    const endpoint = clientConfig.endpointProvider(endpointParams, context);
    return endpoint;
};
exports.getEndpointFromInstructions = getEndpointFromInstructions;
const resolveParams = async (commandInput, instructionsSupplier, clientConfig) => {
    var _a;
    const endpointParams = {};
    const instructions = ((_a = instructionsSupplier === null || instructionsSupplier === void 0 ? void 0 : instructionsSupplier.getEndpointParameterInstructions) === null || _a === void 0 ? void 0 : _a.call(instructionsSupplier)) || {};
    for (const [name, instruction] of Object.entries(instructions)) {
        switch (instruction.type) {
            case "staticContextParams":
                endpointParams[name] = instruction.value;
                break;
            case "contextParams":
                endpointParams[name] = commandInput[instruction.name];
                break;
            case "clientContextParams":
            case "builtInParams":
                endpointParams[name] = await (0, createConfigValueProvider_1.createConfigValueProvider)(instruction.name, name, clientConfig)();
                break;
            default:
                throw new Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(instruction));
        }
    }
    if (Object.keys(instructions).length === 0) {
        Object.assign(endpointParams, clientConfig);
    }
    if (String(clientConfig.serviceId).toLowerCase() === "s3") {
        await (0, service_customizations_1.resolveParamsForS3)(endpointParams);
    }
    return endpointParams;
};
exports.resolveParams = resolveParams;


/***/ }),

/***/ 197:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(2419), exports);
tslib_1.__exportStar(__nccwpck_require__(8289), exports);


/***/ }),

/***/ 8289:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toEndpointV1 = void 0;
const url_parser_1 = __nccwpck_require__(2992);
const toEndpointV1 = (endpoint) => {
    if (typeof endpoint === "object") {
        if ("url" in endpoint) {
            return (0, url_parser_1.parseUrl)(endpoint.url);
        }
        return endpoint;
    }
    return (0, url_parser_1.parseUrl)(endpoint);
};
exports.toEndpointV1 = toEndpointV1;


/***/ }),

/***/ 2639:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.endpointMiddleware = void 0;
const getEndpointFromInstructions_1 = __nccwpck_require__(2419);
const endpointMiddleware = ({ config, instructions, }) => {
    return (next, context) => async (args) => {
        var _a, _b;
        const endpoint = await (0, getEndpointFromInstructions_1.getEndpointFromInstructions)(args.input, {
            getEndpointParameterInstructions() {
                return instructions;
            },
        }, { ...config }, context);
        context.endpointV2 = endpoint;
        context.authSchemes = (_a = endpoint.properties) === null || _a === void 0 ? void 0 : _a.authSchemes;
        const authScheme = (_b = context.authSchemes) === null || _b === void 0 ? void 0 : _b[0];
        if (authScheme) {
            context["signing_region"] = authScheme.signingRegion;
            context["signing_service"] = authScheme.signingName;
        }
        return next({
            ...args,
        });
    };
};
exports.endpointMiddleware = endpointMiddleware;


/***/ }),

/***/ 7981:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getEndpointPlugin = exports.endpointMiddlewareOptions = void 0;
const middleware_serde_1 = __nccwpck_require__(3631);
const endpointMiddleware_1 = __nccwpck_require__(2639);
exports.endpointMiddlewareOptions = {
    step: "serialize",
    tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
    name: "endpointV2Middleware",
    override: true,
    relation: "before",
    toMiddleware: middleware_serde_1.serializerMiddlewareOption.name,
};
const getEndpointPlugin = (config, instructions) => ({
    applyToStack: (clientStack) => {
        clientStack.addRelativeTo((0, endpointMiddleware_1.endpointMiddleware)({
            config,
            instructions,
        }), exports.endpointMiddlewareOptions);
    },
});
exports.getEndpointPlugin = getEndpointPlugin;


/***/ }),

/***/ 5497:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(197), exports);
tslib_1.__exportStar(__nccwpck_require__(2639), exports);
tslib_1.__exportStar(__nccwpck_require__(7981), exports);
tslib_1.__exportStar(__nccwpck_require__(3157), exports);
tslib_1.__exportStar(__nccwpck_require__(2521), exports);


/***/ }),

/***/ 3157:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveEndpointConfig = void 0;
const util_middleware_1 = __nccwpck_require__(236);
const toEndpointV1_1 = __nccwpck_require__(8289);
const resolveEndpointConfig = (input) => {
    var _a, _b, _c;
    const tls = (_a = input.tls) !== null && _a !== void 0 ? _a : true;
    const { endpoint } = input;
    const customEndpointProvider = endpoint != null ? async () => (0, toEndpointV1_1.toEndpointV1)(await (0, util_middleware_1.normalizeProvider)(endpoint)()) : undefined;
    const isCustomEndpoint = !!endpoint;
    return {
        ...input,
        endpoint: customEndpointProvider,
        tls,
        isCustomEndpoint,
        useDualstackEndpoint: (0, util_middleware_1.normalizeProvider)((_b = input.useDualstackEndpoint) !== null && _b !== void 0 ? _b : false),
        useFipsEndpoint: (0, util_middleware_1.normalizeProvider)((_c = input.useFipsEndpoint) !== null && _c !== void 0 ? _c : false),
    };
};
exports.resolveEndpointConfig = resolveEndpointConfig;


/***/ }),

/***/ 3589:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(8648), exports);


/***/ }),

/***/ 8648:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isArnBucketName = exports.isDnsCompatibleBucketName = exports.S3_HOSTNAME_PATTERN = exports.DOT_PATTERN = exports.resolveParamsForS3 = void 0;
const resolveParamsForS3 = async (endpointParams) => {
    const bucket = (endpointParams === null || endpointParams === void 0 ? void 0 : endpointParams.Bucket) || "";
    if (typeof endpointParams.Bucket === "string") {
        endpointParams.Bucket = bucket.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
    }
    if ((0, exports.isArnBucketName)(bucket)) {
        if (endpointParams.ForcePathStyle === true) {
            throw new Error("Path-style addressing cannot be used with ARN buckets");
        }
    }
    else if (!(0, exports.isDnsCompatibleBucketName)(bucket) ||
        (bucket.indexOf(".") !== -1 && !String(endpointParams.Endpoint).startsWith("http:")) ||
        bucket.toLowerCase() !== bucket ||
        bucket.length < 3) {
        endpointParams.ForcePathStyle = true;
    }
    if (endpointParams.DisableMultiRegionAccessPoints) {
        endpointParams.disableMultiRegionAccessPoints = true;
        endpointParams.DisableMRAP = true;
    }
    return endpointParams;
};
exports.resolveParamsForS3 = resolveParamsForS3;
const DOMAIN_PATTERN = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/;
const IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
const DOTS_PATTERN = /\.\./;
exports.DOT_PATTERN = /\./;
exports.S3_HOSTNAME_PATTERN = /^(.+\.)?s3(-fips)?(\.dualstack)?[.-]([a-z0-9-]+)\./;
const isDnsCompatibleBucketName = (bucketName) => DOMAIN_PATTERN.test(bucketName) && !IP_ADDRESS_PATTERN.test(bucketName) && !DOTS_PATTERN.test(bucketName);
exports.isDnsCompatibleBucketName = isDnsCompatibleBucketName;
const isArnBucketName = (bucketName) => {
    const [arn, partition, service, region, account, typeOrId] = bucketName.split(":");
    const isArn = arn === "arn" && bucketName.split(":").length >= 6;
    const isValidArn = [arn, partition, service, account, typeOrId].filter(Boolean).length === 5;
    if (isArn && !isValidArn) {
        throw new Error(`Invalid ARN: ${bucketName} was an invalid ARN.`);
    }
    return arn === "arn" && !!partition && !!service && !!account && !!typeOrId;
};
exports.isArnBucketName = isArnBucketName;


/***/ }),

/***/ 2521:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 2545:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getHostHeaderPlugin = exports.hostHeaderMiddlewareOptions = exports.hostHeaderMiddleware = exports.resolveHostHeaderConfig = void 0;
const protocol_http_1 = __nccwpck_require__(223);
function resolveHostHeaderConfig(input) {
    return input;
}
exports.resolveHostHeaderConfig = resolveHostHeaderConfig;
const hostHeaderMiddleware = (options) => (next) => async (args) => {
    if (!protocol_http_1.HttpRequest.isInstance(args.request))
        return next(args);
    const { request } = args;
    const { handlerProtocol = "" } = options.requestHandler.metadata || {};
    if (handlerProtocol.indexOf("h2") >= 0 && !request.headers[":authority"]) {
        delete request.headers["host"];
        request.headers[":authority"] = "";
    }
    else if (!request.headers["host"]) {
        let host = request.hostname;
        if (request.port != null)
            host += `:${request.port}`;
        request.headers["host"] = host;
    }
    return next(args);
};
exports.hostHeaderMiddleware = hostHeaderMiddleware;
exports.hostHeaderMiddlewareOptions = {
    name: "hostHeaderMiddleware",
    step: "build",
    priority: "low",
    tags: ["HOST"],
    override: true,
};
const getHostHeaderPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.add((0, exports.hostHeaderMiddleware)(options), exports.hostHeaderMiddlewareOptions);
    },
});
exports.getHostHeaderPlugin = getHostHeaderPlugin;


/***/ }),

/***/ 14:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(9754), exports);


/***/ }),

/***/ 9754:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLoggerPlugin = exports.loggerMiddlewareOptions = exports.loggerMiddleware = void 0;
const loggerMiddleware = () => (next, context) => async (args) => {
    var _a, _b;
    try {
        const response = await next(args);
        const { clientName, commandName, logger, dynamoDbDocumentClientOptions = {} } = context;
        const { overrideInputFilterSensitiveLog, overrideOutputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
        const inputFilterSensitiveLog = overrideInputFilterSensitiveLog !== null && overrideInputFilterSensitiveLog !== void 0 ? overrideInputFilterSensitiveLog : context.inputFilterSensitiveLog;
        const outputFilterSensitiveLog = overrideOutputFilterSensitiveLog !== null && overrideOutputFilterSensitiveLog !== void 0 ? overrideOutputFilterSensitiveLog : context.outputFilterSensitiveLog;
        const { $metadata, ...outputWithoutMetadata } = response.output;
        (_a = logger === null || logger === void 0 ? void 0 : logger.info) === null || _a === void 0 ? void 0 : _a.call(logger, {
            clientName,
            commandName,
            input: inputFilterSensitiveLog(args.input),
            output: outputFilterSensitiveLog(outputWithoutMetadata),
            metadata: $metadata,
        });
        return response;
    }
    catch (error) {
        const { clientName, commandName, logger, dynamoDbDocumentClientOptions = {} } = context;
        const { overrideInputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
        const inputFilterSensitiveLog = overrideInputFilterSensitiveLog !== null && overrideInputFilterSensitiveLog !== void 0 ? overrideInputFilterSensitiveLog : context.inputFilterSensitiveLog;
        (_b = logger === null || logger === void 0 ? void 0 : logger.error) === null || _b === void 0 ? void 0 : _b.call(logger, {
            clientName,
            commandName,
            input: inputFilterSensitiveLog(args.input),
            error,
            metadata: error.$metadata,
        });
        throw error;
    }
};
exports.loggerMiddleware = loggerMiddleware;
exports.loggerMiddlewareOptions = {
    name: "loggerMiddleware",
    tags: ["LOGGER"],
    step: "initialize",
    override: true,
};
const getLoggerPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.add((0, exports.loggerMiddleware)(), exports.loggerMiddlewareOptions);
    },
});
exports.getLoggerPlugin = getLoggerPlugin;


/***/ }),

/***/ 5525:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRecursionDetectionPlugin = exports.addRecursionDetectionMiddlewareOptions = exports.recursionDetectionMiddleware = void 0;
const protocol_http_1 = __nccwpck_require__(223);
const TRACE_ID_HEADER_NAME = "X-Amzn-Trace-Id";
const ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
const ENV_TRACE_ID = "_X_AMZN_TRACE_ID";
const recursionDetectionMiddleware = (options) => (next) => async (args) => {
    const { request } = args;
    if (!protocol_http_1.HttpRequest.isInstance(request) ||
        options.runtime !== "node" ||
        request.headers.hasOwnProperty(TRACE_ID_HEADER_NAME)) {
        return next(args);
    }
    const functionName = process.env[ENV_LAMBDA_FUNCTION_NAME];
    const traceId = process.env[ENV_TRACE_ID];
    const nonEmptyString = (str) => typeof str === "string" && str.length > 0;
    if (nonEmptyString(functionName) && nonEmptyString(traceId)) {
        request.headers[TRACE_ID_HEADER_NAME] = traceId;
    }
    return next({
        ...args,
        request,
    });
};
exports.recursionDetectionMiddleware = recursionDetectionMiddleware;
exports.addRecursionDetectionMiddlewareOptions = {
    step: "build",
    tags: ["RECURSION_DETECTION"],
    name: "recursionDetectionMiddleware",
    override: true,
    priority: "low",
};
const getRecursionDetectionPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.add((0, exports.recursionDetectionMiddleware)(options), exports.addRecursionDetectionMiddlewareOptions);
    },
});
exports.getRecursionDetectionPlugin = getRecursionDetectionPlugin;


/***/ }),

/***/ 7328:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdaptiveRetryStrategy = void 0;
const util_retry_1 = __nccwpck_require__(9395);
const StandardRetryStrategy_1 = __nccwpck_require__(533);
class AdaptiveRetryStrategy extends StandardRetryStrategy_1.StandardRetryStrategy {
    constructor(maxAttemptsProvider, options) {
        const { rateLimiter, ...superOptions } = options !== null && options !== void 0 ? options : {};
        super(maxAttemptsProvider, superOptions);
        this.rateLimiter = rateLimiter !== null && rateLimiter !== void 0 ? rateLimiter : new util_retry_1.DefaultRateLimiter();
        this.mode = util_retry_1.RETRY_MODES.ADAPTIVE;
    }
    async retry(next, args) {
        return super.retry(next, args, {
            beforeRequest: async () => {
                return this.rateLimiter.getSendToken();
            },
            afterRequest: (response) => {
                this.rateLimiter.updateClientSendingRate(response);
            },
        });
    }
}
exports.AdaptiveRetryStrategy = AdaptiveRetryStrategy;


/***/ }),

/***/ 533:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StandardRetryStrategy = void 0;
const protocol_http_1 = __nccwpck_require__(223);
const service_error_classification_1 = __nccwpck_require__(1921);
const util_retry_1 = __nccwpck_require__(9395);
const uuid_1 = __nccwpck_require__(5840);
const defaultRetryQuota_1 = __nccwpck_require__(2568);
const delayDecider_1 = __nccwpck_require__(5940);
const retryDecider_1 = __nccwpck_require__(9572);
const util_1 = __nccwpck_require__(7154);
class StandardRetryStrategy {
    constructor(maxAttemptsProvider, options) {
        var _a, _b, _c;
        this.maxAttemptsProvider = maxAttemptsProvider;
        this.mode = util_retry_1.RETRY_MODES.STANDARD;
        this.retryDecider = (_a = options === null || options === void 0 ? void 0 : options.retryDecider) !== null && _a !== void 0 ? _a : retryDecider_1.defaultRetryDecider;
        this.delayDecider = (_b = options === null || options === void 0 ? void 0 : options.delayDecider) !== null && _b !== void 0 ? _b : delayDecider_1.defaultDelayDecider;
        this.retryQuota = (_c = options === null || options === void 0 ? void 0 : options.retryQuota) !== null && _c !== void 0 ? _c : (0, defaultRetryQuota_1.getDefaultRetryQuota)(util_retry_1.INITIAL_RETRY_TOKENS);
    }
    shouldRetry(error, attempts, maxAttempts) {
        return attempts < maxAttempts && this.retryDecider(error) && this.retryQuota.hasRetryTokens(error);
    }
    async getMaxAttempts() {
        let maxAttempts;
        try {
            maxAttempts = await this.maxAttemptsProvider();
        }
        catch (error) {
            maxAttempts = util_retry_1.DEFAULT_MAX_ATTEMPTS;
        }
        return maxAttempts;
    }
    async retry(next, args, options) {
        let retryTokenAmount;
        let attempts = 0;
        let totalDelay = 0;
        const maxAttempts = await this.getMaxAttempts();
        const { request } = args;
        if (protocol_http_1.HttpRequest.isInstance(request)) {
            request.headers[util_retry_1.INVOCATION_ID_HEADER] = (0, uuid_1.v4)();
        }
        while (true) {
            try {
                if (protocol_http_1.HttpRequest.isInstance(request)) {
                    request.headers[util_retry_1.REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
                }
                if (options === null || options === void 0 ? void 0 : options.beforeRequest) {
                    await options.beforeRequest();
                }
                const { response, output } = await next(args);
                if (options === null || options === void 0 ? void 0 : options.afterRequest) {
                    options.afterRequest(response);
                }
                this.retryQuota.releaseRetryTokens(retryTokenAmount);
                output.$metadata.attempts = attempts + 1;
                output.$metadata.totalRetryDelay = totalDelay;
                return { response, output };
            }
            catch (e) {
                const err = (0, util_1.asSdkError)(e);
                attempts++;
                if (this.shouldRetry(err, attempts, maxAttempts)) {
                    retryTokenAmount = this.retryQuota.retrieveRetryTokens(err);
                    const delayFromDecider = this.delayDecider((0, service_error_classification_1.isThrottlingError)(err) ? util_retry_1.THROTTLING_RETRY_DELAY_BASE : util_retry_1.DEFAULT_RETRY_DELAY_BASE, attempts);
                    const delayFromResponse = getDelayFromRetryAfterHeader(err.$response);
                    const delay = Math.max(delayFromResponse || 0, delayFromDecider);
                    totalDelay += delay;
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    continue;
                }
                if (!err.$metadata) {
                    err.$metadata = {};
                }
                err.$metadata.attempts = attempts;
                err.$metadata.totalRetryDelay = totalDelay;
                throw err;
            }
        }
    }
}
exports.StandardRetryStrategy = StandardRetryStrategy;
const getDelayFromRetryAfterHeader = (response) => {
    if (!protocol_http_1.HttpResponse.isInstance(response))
        return;
    const retryAfterHeaderName = Object.keys(response.headers).find((key) => key.toLowerCase() === "retry-after");
    if (!retryAfterHeaderName)
        return;
    const retryAfter = response.headers[retryAfterHeaderName];
    const retryAfterSeconds = Number(retryAfter);
    if (!Number.isNaN(retryAfterSeconds))
        return retryAfterSeconds * 1000;
    const retryAfterDate = new Date(retryAfter);
    return retryAfterDate.getTime() - Date.now();
};


/***/ }),

/***/ 6160:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NODE_RETRY_MODE_CONFIG_OPTIONS = exports.CONFIG_RETRY_MODE = exports.ENV_RETRY_MODE = exports.resolveRetryConfig = exports.NODE_MAX_ATTEMPT_CONFIG_OPTIONS = exports.CONFIG_MAX_ATTEMPTS = exports.ENV_MAX_ATTEMPTS = void 0;
const util_middleware_1 = __nccwpck_require__(236);
const util_retry_1 = __nccwpck_require__(9395);
exports.ENV_MAX_ATTEMPTS = "AWS_MAX_ATTEMPTS";
exports.CONFIG_MAX_ATTEMPTS = "max_attempts";
exports.NODE_MAX_ATTEMPT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => {
        const value = env[exports.ENV_MAX_ATTEMPTS];
        if (!value)
            return undefined;
        const maxAttempt = parseInt(value);
        if (Number.isNaN(maxAttempt)) {
            throw new Error(`Environment variable ${exports.ENV_MAX_ATTEMPTS} mast be a number, got "${value}"`);
        }
        return maxAttempt;
    },
    configFileSelector: (profile) => {
        const value = profile[exports.CONFIG_MAX_ATTEMPTS];
        if (!value)
            return undefined;
        const maxAttempt = parseInt(value);
        if (Number.isNaN(maxAttempt)) {
            throw new Error(`Shared config file entry ${exports.CONFIG_MAX_ATTEMPTS} mast be a number, got "${value}"`);
        }
        return maxAttempt;
    },
    default: util_retry_1.DEFAULT_MAX_ATTEMPTS,
};
const resolveRetryConfig = (input) => {
    var _a;
    const { retryStrategy } = input;
    const maxAttempts = (0, util_middleware_1.normalizeProvider)((_a = input.maxAttempts) !== null && _a !== void 0 ? _a : util_retry_1.DEFAULT_MAX_ATTEMPTS);
    return {
        ...input,
        maxAttempts,
        retryStrategy: async () => {
            if (retryStrategy) {
                return retryStrategy;
            }
            const retryMode = await (0, util_middleware_1.normalizeProvider)(input.retryMode)();
            if (retryMode === util_retry_1.RETRY_MODES.ADAPTIVE) {
                return new util_retry_1.AdaptiveRetryStrategy(maxAttempts);
            }
            return new util_retry_1.StandardRetryStrategy(maxAttempts);
        },
    };
};
exports.resolveRetryConfig = resolveRetryConfig;
exports.ENV_RETRY_MODE = "AWS_RETRY_MODE";
exports.CONFIG_RETRY_MODE = "retry_mode";
exports.NODE_RETRY_MODE_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => env[exports.ENV_RETRY_MODE],
    configFileSelector: (profile) => profile[exports.CONFIG_RETRY_MODE],
    default: util_retry_1.DEFAULT_RETRY_MODE,
};


/***/ }),

/***/ 2568:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDefaultRetryQuota = void 0;
const util_retry_1 = __nccwpck_require__(9395);
const getDefaultRetryQuota = (initialRetryTokens, options) => {
    var _a, _b, _c;
    const MAX_CAPACITY = initialRetryTokens;
    const noRetryIncrement = (_a = options === null || options === void 0 ? void 0 : options.noRetryIncrement) !== null && _a !== void 0 ? _a : util_retry_1.NO_RETRY_INCREMENT;
    const retryCost = (_b = options === null || options === void 0 ? void 0 : options.retryCost) !== null && _b !== void 0 ? _b : util_retry_1.RETRY_COST;
    const timeoutRetryCost = (_c = options === null || options === void 0 ? void 0 : options.timeoutRetryCost) !== null && _c !== void 0 ? _c : util_retry_1.TIMEOUT_RETRY_COST;
    let availableCapacity = initialRetryTokens;
    const getCapacityAmount = (error) => (error.name === "TimeoutError" ? timeoutRetryCost : retryCost);
    const hasRetryTokens = (error) => getCapacityAmount(error) <= availableCapacity;
    const retrieveRetryTokens = (error) => {
        if (!hasRetryTokens(error)) {
            throw new Error("No retry token available");
        }
        const capacityAmount = getCapacityAmount(error);
        availableCapacity -= capacityAmount;
        return capacityAmount;
    };
    const releaseRetryTokens = (capacityReleaseAmount) => {
        availableCapacity += capacityReleaseAmount !== null && capacityReleaseAmount !== void 0 ? capacityReleaseAmount : noRetryIncrement;
        availableCapacity = Math.min(availableCapacity, MAX_CAPACITY);
    };
    return Object.freeze({
        hasRetryTokens,
        retrieveRetryTokens,
        releaseRetryTokens,
    });
};
exports.getDefaultRetryQuota = getDefaultRetryQuota;


/***/ }),

/***/ 5940:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultDelayDecider = void 0;
const util_retry_1 = __nccwpck_require__(9395);
const defaultDelayDecider = (delayBase, attempts) => Math.floor(Math.min(util_retry_1.MAXIMUM_RETRY_DELAY, Math.random() * 2 ** attempts * delayBase));
exports.defaultDelayDecider = defaultDelayDecider;


/***/ }),

/***/ 6064:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(7328), exports);
tslib_1.__exportStar(__nccwpck_require__(533), exports);
tslib_1.__exportStar(__nccwpck_require__(6160), exports);
tslib_1.__exportStar(__nccwpck_require__(5940), exports);
tslib_1.__exportStar(__nccwpck_require__(3521), exports);
tslib_1.__exportStar(__nccwpck_require__(9572), exports);
tslib_1.__exportStar(__nccwpck_require__(1806), exports);


/***/ }),

/***/ 3521:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOmitRetryHeadersPlugin = exports.omitRetryHeadersMiddlewareOptions = exports.omitRetryHeadersMiddleware = void 0;
const protocol_http_1 = __nccwpck_require__(223);
const util_retry_1 = __nccwpck_require__(9395);
const omitRetryHeadersMiddleware = () => (next) => async (args) => {
    const { request } = args;
    if (protocol_http_1.HttpRequest.isInstance(request)) {
        delete request.headers[util_retry_1.INVOCATION_ID_HEADER];
        delete request.headers[util_retry_1.REQUEST_HEADER];
    }
    return next(args);
};
exports.omitRetryHeadersMiddleware = omitRetryHeadersMiddleware;
exports.omitRetryHeadersMiddlewareOptions = {
    name: "omitRetryHeadersMiddleware",
    tags: ["RETRY", "HEADERS", "OMIT_RETRY_HEADERS"],
    relation: "before",
    toMiddleware: "awsAuthMiddleware",
    override: true,
};
const getOmitRetryHeadersPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.addRelativeTo((0, exports.omitRetryHeadersMiddleware)(), exports.omitRetryHeadersMiddlewareOptions);
    },
});
exports.getOmitRetryHeadersPlugin = getOmitRetryHeadersPlugin;


/***/ }),

/***/ 9572:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultRetryDecider = void 0;
const service_error_classification_1 = __nccwpck_require__(1921);
const defaultRetryDecider = (error) => {
    if (!error) {
        return false;
    }
    return (0, service_error_classification_1.isRetryableByTrait)(error) || (0, service_error_classification_1.isClockSkewError)(error) || (0, service_error_classification_1.isThrottlingError)(error) || (0, service_error_classification_1.isTransientError)(error);
};
exports.defaultRetryDecider = defaultRetryDecider;


/***/ }),

/***/ 1806:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRetryAfterHint = exports.getRetryPlugin = exports.retryMiddlewareOptions = exports.retryMiddleware = void 0;
const protocol_http_1 = __nccwpck_require__(223);
const service_error_classification_1 = __nccwpck_require__(1921);
const util_retry_1 = __nccwpck_require__(9395);
const uuid_1 = __nccwpck_require__(5840);
const util_1 = __nccwpck_require__(7154);
const retryMiddleware = (options) => (next, context) => async (args) => {
    let retryStrategy = await options.retryStrategy();
    const maxAttempts = await options.maxAttempts();
    if (isRetryStrategyV2(retryStrategy)) {
        retryStrategy = retryStrategy;
        let retryToken = await retryStrategy.acquireInitialRetryToken(context["partition_id"]);
        let lastError = new Error();
        let attempts = 0;
        let totalRetryDelay = 0;
        const { request } = args;
        if (protocol_http_1.HttpRequest.isInstance(request)) {
            request.headers[util_retry_1.INVOCATION_ID_HEADER] = (0, uuid_1.v4)();
        }
        while (true) {
            try {
                if (protocol_http_1.HttpRequest.isInstance(request)) {
                    request.headers[util_retry_1.REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
                }
                const { response, output } = await next(args);
                retryStrategy.recordSuccess(retryToken);
                output.$metadata.attempts = attempts + 1;
                output.$metadata.totalRetryDelay = totalRetryDelay;
                return { response, output };
            }
            catch (e) {
                const retryErrorInfo = getRetyErrorInto(e);
                lastError = (0, util_1.asSdkError)(e);
                try {
                    retryToken = await retryStrategy.refreshRetryTokenForRetry(retryToken, retryErrorInfo);
                }
                catch (refreshError) {
                    if (!lastError.$metadata) {
                        lastError.$metadata = {};
                    }
                    lastError.$metadata.attempts = attempts + 1;
                    lastError.$metadata.totalRetryDelay = totalRetryDelay;
                    throw lastError;
                }
                attempts = retryToken.getRetryCount();
                const delay = retryToken.getRetryDelay();
                totalRetryDelay += delay;
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }
    else {
        retryStrategy = retryStrategy;
        if (retryStrategy === null || retryStrategy === void 0 ? void 0 : retryStrategy.mode)
            context.userAgent = [...(context.userAgent || []), ["cfg/retry-mode", retryStrategy.mode]];
        return retryStrategy.retry(next, args);
    }
};
exports.retryMiddleware = retryMiddleware;
const isRetryStrategyV2 = (retryStrategy) => typeof retryStrategy.acquireInitialRetryToken !== "undefined" &&
    typeof retryStrategy.refreshRetryTokenForRetry !== "undefined" &&
    typeof retryStrategy.recordSuccess !== "undefined";
const getRetyErrorInto = (error) => {
    const errorInfo = {
        errorType: getRetryErrorType(error),
    };
    const retryAfterHint = (0, exports.getRetryAfterHint)(error.$response);
    if (retryAfterHint) {
        errorInfo.retryAfterHint = retryAfterHint;
    }
    return errorInfo;
};
const getRetryErrorType = (error) => {
    if ((0, service_error_classification_1.isThrottlingError)(error))
        return "THROTTLING";
    if ((0, service_error_classification_1.isTransientError)(error))
        return "TRANSIENT";
    if ((0, service_error_classification_1.isServerError)(error))
        return "SERVER_ERROR";
    return "CLIENT_ERROR";
};
exports.retryMiddlewareOptions = {
    name: "retryMiddleware",
    tags: ["RETRY"],
    step: "finalizeRequest",
    priority: "high",
    override: true,
};
const getRetryPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.add((0, exports.retryMiddleware)(options), exports.retryMiddlewareOptions);
    },
});
exports.getRetryPlugin = getRetryPlugin;
const getRetryAfterHint = (response) => {
    if (!protocol_http_1.HttpResponse.isInstance(response))
        return;
    const retryAfterHeaderName = Object.keys(response.headers).find((key) => key.toLowerCase() === "retry-after");
    if (!retryAfterHeaderName)
        return;
    const retryAfter = response.headers[retryAfterHeaderName];
    const retryAfterSeconds = Number(retryAfter);
    if (!Number.isNaN(retryAfterSeconds))
        return new Date(retryAfterSeconds * 1000);
    const retryAfterDate = new Date(retryAfter);
    return retryAfterDate;
};
exports.getRetryAfterHint = getRetryAfterHint;


/***/ }),

/***/ 7154:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.asSdkError = void 0;
const asSdkError = (error) => {
    if (error instanceof Error)
        return error;
    if (error instanceof Object)
        return Object.assign(new Error(), error);
    if (typeof error === "string")
        return new Error(error);
    return new Error(`AWS SDK error wrapper for ${error}`);
};
exports.asSdkError = asSdkError;


/***/ }),

/***/ 5959:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveStsAuthConfig = void 0;
const middleware_signing_1 = __nccwpck_require__(4935);
const resolveStsAuthConfig = (input, { stsClientCtor }) => (0, middleware_signing_1.resolveAwsAuthConfig)({
    ...input,
    stsClientCtor,
});
exports.resolveStsAuthConfig = resolveStsAuthConfig;


/***/ }),

/***/ 5648:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deserializerMiddleware = void 0;
const deserializerMiddleware = (options, deserializer) => (next, context) => async (args) => {
    const { response } = await next(args);
    try {
        const parsed = await deserializer(response, options);
        return {
            response,
            output: parsed,
        };
    }
    catch (error) {
        Object.defineProperty(error, "$response", {
            value: response,
        });
        if (!('$metadata' in error)) {
            const hint = `Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
            error.message += "\n  " + hint;
        }
        throw error;
    }
};
exports.deserializerMiddleware = deserializerMiddleware;


/***/ }),

/***/ 3631:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(5648), exports);
tslib_1.__exportStar(__nccwpck_require__(9328), exports);
tslib_1.__exportStar(__nccwpck_require__(9511), exports);


/***/ }),

/***/ 9328:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSerdePlugin = exports.serializerMiddlewareOption = exports.deserializerMiddlewareOption = void 0;
const deserializerMiddleware_1 = __nccwpck_require__(5648);
const serializerMiddleware_1 = __nccwpck_require__(9511);
exports.deserializerMiddlewareOption = {
    name: "deserializerMiddleware",
    step: "deserialize",
    tags: ["DESERIALIZER"],
    override: true,
};
exports.serializerMiddlewareOption = {
    name: "serializerMiddleware",
    step: "serialize",
    tags: ["SERIALIZER"],
    override: true,
};
function getSerdePlugin(config, serializer, deserializer) {
    return {
        applyToStack: (commandStack) => {
            commandStack.add((0, deserializerMiddleware_1.deserializerMiddleware)(config, deserializer), exports.deserializerMiddlewareOption);
            commandStack.add((0, serializerMiddleware_1.serializerMiddleware)(config, serializer), exports.serializerMiddlewareOption);
        },
    };
}
exports.getSerdePlugin = getSerdePlugin;


/***/ }),

/***/ 9511:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.serializerMiddleware = void 0;
const serializerMiddleware = (options, serializer) => (next, context) => async (args) => {
    var _a;
    const endpoint = ((_a = context.endpointV2) === null || _a === void 0 ? void 0 : _a.url) && options.urlParser
        ? async () => options.urlParser(context.endpointV2.url)
        : options.endpoint;
    if (!endpoint) {
        throw new Error("No valid endpoint provider available.");
    }
    const request = await serializer(args.input, { ...options, endpoint });
    return next({
        ...args,
        request,
    });
};
exports.serializerMiddleware = serializerMiddleware;


/***/ }),

/***/ 3061:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveSigV4AuthConfig = exports.resolveAwsAuthConfig = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const signature_v4_1 = __nccwpck_require__(4275);
const util_middleware_1 = __nccwpck_require__(236);
const CREDENTIAL_EXPIRE_WINDOW = 300000;
const resolveAwsAuthConfig = (input) => {
    const normalizedCreds = input.credentials
        ? normalizeCredentialProvider(input.credentials)
        : input.credentialDefaultProvider(input);
    const { signingEscapePath = true, systemClockOffset = input.systemClockOffset || 0, sha256 } = input;
    let signer;
    if (input.signer) {
        signer = (0, util_middleware_1.normalizeProvider)(input.signer);
    }
    else if (input.regionInfoProvider) {
        signer = () => (0, util_middleware_1.normalizeProvider)(input.region)()
            .then(async (region) => [
            (await input.regionInfoProvider(region, {
                useFipsEndpoint: await input.useFipsEndpoint(),
                useDualstackEndpoint: await input.useDualstackEndpoint(),
            })) || {},
            region,
        ])
            .then(([regionInfo, region]) => {
            const { signingRegion, signingService } = regionInfo;
            input.signingRegion = input.signingRegion || signingRegion || region;
            input.signingName = input.signingName || signingService || input.serviceId;
            const params = {
                ...input,
                credentials: normalizedCreds,
                region: input.signingRegion,
                service: input.signingName,
                sha256,
                uriEscapePath: signingEscapePath,
            };
            const SignerCtor = input.signerConstructor || signature_v4_1.SignatureV4;
            return new SignerCtor(params);
        });
    }
    else {
        signer = async (authScheme) => {
            authScheme = Object.assign({}, {
                name: "sigv4",
                signingName: input.signingName || input.defaultSigningName,
                signingRegion: await (0, util_middleware_1.normalizeProvider)(input.region)(),
                properties: {},
            }, authScheme);
            const signingRegion = authScheme.signingRegion;
            const signingService = authScheme.signingName;
            input.signingRegion = input.signingRegion || signingRegion;
            input.signingName = input.signingName || signingService || input.serviceId;
            const params = {
                ...input,
                credentials: normalizedCreds,
                region: input.signingRegion,
                service: input.signingName,
                sha256,
                uriEscapePath: signingEscapePath,
            };
            const SignerCtor = input.signerConstructor || signature_v4_1.SignatureV4;
            return new SignerCtor(params);
        };
    }
    return {
        ...input,
        systemClockOffset,
        signingEscapePath,
        credentials: normalizedCreds,
        signer,
    };
};
exports.resolveAwsAuthConfig = resolveAwsAuthConfig;
const resolveSigV4AuthConfig = (input) => {
    const normalizedCreds = input.credentials
        ? normalizeCredentialProvider(input.credentials)
        : input.credentialDefaultProvider(input);
    const { signingEscapePath = true, systemClockOffset = input.systemClockOffset || 0, sha256 } = input;
    let signer;
    if (input.signer) {
        signer = (0, util_middleware_1.normalizeProvider)(input.signer);
    }
    else {
        signer = (0, util_middleware_1.normalizeProvider)(new signature_v4_1.SignatureV4({
            credentials: normalizedCreds,
            region: input.region,
            service: input.signingName,
            sha256,
            uriEscapePath: signingEscapePath,
        }));
    }
    return {
        ...input,
        systemClockOffset,
        signingEscapePath,
        credentials: normalizedCreds,
        signer,
    };
};
exports.resolveSigV4AuthConfig = resolveSigV4AuthConfig;
const normalizeCredentialProvider = (credentials) => {
    if (typeof credentials === "function") {
        return (0, property_provider_1.memoize)(credentials, (credentials) => credentials.expiration !== undefined &&
            credentials.expiration.getTime() - Date.now() < CREDENTIAL_EXPIRE_WINDOW, (credentials) => credentials.expiration !== undefined);
    }
    return (0, util_middleware_1.normalizeProvider)(credentials);
};


/***/ }),

/***/ 4935:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(3061), exports);
tslib_1.__exportStar(__nccwpck_require__(2509), exports);


/***/ }),

/***/ 2509:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSigV4AuthPlugin = exports.getAwsAuthPlugin = exports.awsAuthMiddlewareOptions = exports.awsAuthMiddleware = void 0;
const protocol_http_1 = __nccwpck_require__(223);
const getSkewCorrectedDate_1 = __nccwpck_require__(8253);
const getUpdatedSystemClockOffset_1 = __nccwpck_require__(5863);
const awsAuthMiddleware = (options) => (next, context) => async function (args) {
    var _a, _b, _c, _d;
    if (!protocol_http_1.HttpRequest.isInstance(args.request))
        return next(args);
    const authScheme = (_c = (_b = (_a = context.endpointV2) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.authSchemes) === null || _c === void 0 ? void 0 : _c[0];
    const multiRegionOverride = (authScheme === null || authScheme === void 0 ? void 0 : authScheme.name) === "sigv4a" ? (_d = authScheme === null || authScheme === void 0 ? void 0 : authScheme.signingRegionSet) === null || _d === void 0 ? void 0 : _d.join(",") : undefined;
    const signer = await options.signer(authScheme);
    const output = await next({
        ...args,
        request: await signer.sign(args.request, {
            signingDate: (0, getSkewCorrectedDate_1.getSkewCorrectedDate)(options.systemClockOffset),
            signingRegion: multiRegionOverride || context["signing_region"],
            signingService: context["signing_service"],
        }),
    }).catch((error) => {
        var _a;
        const serverTime = (_a = error.ServerTime) !== null && _a !== void 0 ? _a : getDateHeader(error.$response);
        if (serverTime) {
            options.systemClockOffset = (0, getUpdatedSystemClockOffset_1.getUpdatedSystemClockOffset)(serverTime, options.systemClockOffset);
        }
        throw error;
    });
    const dateHeader = getDateHeader(output.response);
    if (dateHeader) {
        options.systemClockOffset = (0, getUpdatedSystemClockOffset_1.getUpdatedSystemClockOffset)(dateHeader, options.systemClockOffset);
    }
    return output;
};
exports.awsAuthMiddleware = awsAuthMiddleware;
const getDateHeader = (response) => { var _a, _b, _c; return protocol_http_1.HttpResponse.isInstance(response) ? (_b = (_a = response.headers) === null || _a === void 0 ? void 0 : _a.date) !== null && _b !== void 0 ? _b : (_c = response.headers) === null || _c === void 0 ? void 0 : _c.Date : undefined; };
exports.awsAuthMiddlewareOptions = {
    name: "awsAuthMiddleware",
    tags: ["SIGNATURE", "AWSAUTH"],
    relation: "after",
    toMiddleware: "retryMiddleware",
    override: true,
};
const getAwsAuthPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.addRelativeTo((0, exports.awsAuthMiddleware)(options), exports.awsAuthMiddlewareOptions);
    },
});
exports.getAwsAuthPlugin = getAwsAuthPlugin;
exports.getSigV4AuthPlugin = exports.getAwsAuthPlugin;


/***/ }),

/***/ 8253:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSkewCorrectedDate = void 0;
const getSkewCorrectedDate = (systemClockOffset) => new Date(Date.now() + systemClockOffset);
exports.getSkewCorrectedDate = getSkewCorrectedDate;


/***/ }),

/***/ 5863:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUpdatedSystemClockOffset = void 0;
const isClockSkewed_1 = __nccwpck_require__(5301);
const getUpdatedSystemClockOffset = (clockTime, currentSystemClockOffset) => {
    const clockTimeInMs = Date.parse(clockTime);
    if ((0, isClockSkewed_1.isClockSkewed)(clockTimeInMs, currentSystemClockOffset)) {
        return clockTimeInMs - Date.now();
    }
    return currentSystemClockOffset;
};
exports.getUpdatedSystemClockOffset = getUpdatedSystemClockOffset;


/***/ }),

/***/ 5301:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isClockSkewed = void 0;
const getSkewCorrectedDate_1 = __nccwpck_require__(8253);
const isClockSkewed = (clockTime, systemClockOffset) => Math.abs((0, getSkewCorrectedDate_1.getSkewCorrectedDate)(systemClockOffset).getTime() - clockTime) >= 300000;
exports.isClockSkewed = isClockSkewed;


/***/ }),

/***/ 8399:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.constructStack = void 0;
const constructStack = () => {
    let absoluteEntries = [];
    let relativeEntries = [];
    const entriesNameSet = new Set();
    const sort = (entries) => entries.sort((a, b) => stepWeights[b.step] - stepWeights[a.step] ||
        priorityWeights[b.priority || "normal"] - priorityWeights[a.priority || "normal"]);
    const removeByName = (toRemove) => {
        let isRemoved = false;
        const filterCb = (entry) => {
            if (entry.name && entry.name === toRemove) {
                isRemoved = true;
                entriesNameSet.delete(toRemove);
                return false;
            }
            return true;
        };
        absoluteEntries = absoluteEntries.filter(filterCb);
        relativeEntries = relativeEntries.filter(filterCb);
        return isRemoved;
    };
    const removeByReference = (toRemove) => {
        let isRemoved = false;
        const filterCb = (entry) => {
            if (entry.middleware === toRemove) {
                isRemoved = true;
                if (entry.name)
                    entriesNameSet.delete(entry.name);
                return false;
            }
            return true;
        };
        absoluteEntries = absoluteEntries.filter(filterCb);
        relativeEntries = relativeEntries.filter(filterCb);
        return isRemoved;
    };
    const cloneTo = (toStack) => {
        absoluteEntries.forEach((entry) => {
            toStack.add(entry.middleware, { ...entry });
        });
        relativeEntries.forEach((entry) => {
            toStack.addRelativeTo(entry.middleware, { ...entry });
        });
        return toStack;
    };
    const expandRelativeMiddlewareList = (from) => {
        const expandedMiddlewareList = [];
        from.before.forEach((entry) => {
            if (entry.before.length === 0 && entry.after.length === 0) {
                expandedMiddlewareList.push(entry);
            }
            else {
                expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
            }
        });
        expandedMiddlewareList.push(from);
        from.after.reverse().forEach((entry) => {
            if (entry.before.length === 0 && entry.after.length === 0) {
                expandedMiddlewareList.push(entry);
            }
            else {
                expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
            }
        });
        return expandedMiddlewareList;
    };
    const getMiddlewareList = (debug = false) => {
        const normalizedAbsoluteEntries = [];
        const normalizedRelativeEntries = [];
        const normalizedEntriesNameMap = {};
        absoluteEntries.forEach((entry) => {
            const normalizedEntry = {
                ...entry,
                before: [],
                after: [],
            };
            if (normalizedEntry.name)
                normalizedEntriesNameMap[normalizedEntry.name] = normalizedEntry;
            normalizedAbsoluteEntries.push(normalizedEntry);
        });
        relativeEntries.forEach((entry) => {
            const normalizedEntry = {
                ...entry,
                before: [],
                after: [],
            };
            if (normalizedEntry.name)
                normalizedEntriesNameMap[normalizedEntry.name] = normalizedEntry;
            normalizedRelativeEntries.push(normalizedEntry);
        });
        normalizedRelativeEntries.forEach((entry) => {
            if (entry.toMiddleware) {
                const toMiddleware = normalizedEntriesNameMap[entry.toMiddleware];
                if (toMiddleware === undefined) {
                    if (debug) {
                        return;
                    }
                    throw new Error(`${entry.toMiddleware} is not found when adding ${entry.name || "anonymous"} middleware ${entry.relation} ${entry.toMiddleware}`);
                }
                if (entry.relation === "after") {
                    toMiddleware.after.push(entry);
                }
                if (entry.relation === "before") {
                    toMiddleware.before.push(entry);
                }
            }
        });
        const mainChain = sort(normalizedAbsoluteEntries)
            .map(expandRelativeMiddlewareList)
            .reduce((wholeList, expendedMiddlewareList) => {
            wholeList.push(...expendedMiddlewareList);
            return wholeList;
        }, []);
        return mainChain;
    };
    const stack = {
        add: (middleware, options = {}) => {
            const { name, override } = options;
            const entry = {
                step: "initialize",
                priority: "normal",
                middleware,
                ...options,
            };
            if (name) {
                if (entriesNameSet.has(name)) {
                    if (!override)
                        throw new Error(`Duplicate middleware name '${name}'`);
                    const toOverrideIndex = absoluteEntries.findIndex((entry) => entry.name === name);
                    const toOverride = absoluteEntries[toOverrideIndex];
                    if (toOverride.step !== entry.step || toOverride.priority !== entry.priority) {
                        throw new Error(`"${name}" middleware with ${toOverride.priority} priority in ${toOverride.step} step cannot be ` +
                            `overridden by same-name middleware with ${entry.priority} priority in ${entry.step} step.`);
                    }
                    absoluteEntries.splice(toOverrideIndex, 1);
                }
                entriesNameSet.add(name);
            }
            absoluteEntries.push(entry);
        },
        addRelativeTo: (middleware, options) => {
            const { name, override } = options;
            const entry = {
                middleware,
                ...options,
            };
            if (name) {
                if (entriesNameSet.has(name)) {
                    if (!override)
                        throw new Error(`Duplicate middleware name '${name}'`);
                    const toOverrideIndex = relativeEntries.findIndex((entry) => entry.name === name);
                    const toOverride = relativeEntries[toOverrideIndex];
                    if (toOverride.toMiddleware !== entry.toMiddleware || toOverride.relation !== entry.relation) {
                        throw new Error(`"${name}" middleware ${toOverride.relation} "${toOverride.toMiddleware}" middleware cannot be overridden ` +
                            `by same-name middleware ${entry.relation} "${entry.toMiddleware}" middleware.`);
                    }
                    relativeEntries.splice(toOverrideIndex, 1);
                }
                entriesNameSet.add(name);
            }
            relativeEntries.push(entry);
        },
        clone: () => cloneTo((0, exports.constructStack)()),
        use: (plugin) => {
            plugin.applyToStack(stack);
        },
        remove: (toRemove) => {
            if (typeof toRemove === "string")
                return removeByName(toRemove);
            else
                return removeByReference(toRemove);
        },
        removeByTag: (toRemove) => {
            let isRemoved = false;
            const filterCb = (entry) => {
                const { tags, name } = entry;
                if (tags && tags.includes(toRemove)) {
                    if (name)
                        entriesNameSet.delete(name);
                    isRemoved = true;
                    return false;
                }
                return true;
            };
            absoluteEntries = absoluteEntries.filter(filterCb);
            relativeEntries = relativeEntries.filter(filterCb);
            return isRemoved;
        },
        concat: (from) => {
            const cloned = cloneTo((0, exports.constructStack)());
            cloned.use(from);
            return cloned;
        },
        applyToStack: cloneTo,
        identify: () => {
            return getMiddlewareList(true).map((mw) => {
                return mw.name + ": " + (mw.tags || []).join(",");
            });
        },
        resolve: (handler, context) => {
            for (const middleware of getMiddlewareList()
                .map((entry) => entry.middleware)
                .reverse()) {
                handler = middleware(handler, context);
            }
            return handler;
        },
    };
    return stack;
};
exports.constructStack = constructStack;
const stepWeights = {
    initialize: 5,
    serialize: 4,
    build: 3,
    finalizeRequest: 2,
    deserialize: 1,
};
const priorityWeights = {
    high: 3,
    normal: 2,
    low: 1,
};


/***/ }),

/***/ 1461:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(8399), exports);


/***/ }),

/***/ 6546:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveUserAgentConfig = void 0;
function resolveUserAgentConfig(input) {
    return {
        ...input,
        customUserAgent: typeof input.customUserAgent === "string" ? [[input.customUserAgent]] : input.customUserAgent,
    };
}
exports.resolveUserAgentConfig = resolveUserAgentConfig;


/***/ }),

/***/ 8025:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UA_ESCAPE_REGEX = exports.SPACE = exports.X_AMZ_USER_AGENT = exports.USER_AGENT = void 0;
exports.USER_AGENT = "user-agent";
exports.X_AMZ_USER_AGENT = "x-amz-user-agent";
exports.SPACE = " ";
exports.UA_ESCAPE_REGEX = /[^\!\#\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g;


/***/ }),

/***/ 4688:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(6546), exports);
tslib_1.__exportStar(__nccwpck_require__(6236), exports);


/***/ }),

/***/ 6236:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUserAgentPlugin = exports.getUserAgentMiddlewareOptions = exports.userAgentMiddleware = void 0;
const protocol_http_1 = __nccwpck_require__(223);
const util_endpoints_1 = __nccwpck_require__(3350);
const constants_1 = __nccwpck_require__(8025);
const userAgentMiddleware = (options) => (next, context) => async (args) => {
    var _a, _b;
    const { request } = args;
    if (!protocol_http_1.HttpRequest.isInstance(request))
        return next(args);
    const { headers } = request;
    const userAgent = ((_a = context === null || context === void 0 ? void 0 : context.userAgent) === null || _a === void 0 ? void 0 : _a.map(escapeUserAgent)) || [];
    const defaultUserAgent = (await options.defaultUserAgentProvider()).map(escapeUserAgent);
    const customUserAgent = ((_b = options === null || options === void 0 ? void 0 : options.customUserAgent) === null || _b === void 0 ? void 0 : _b.map(escapeUserAgent)) || [];
    const prefix = (0, util_endpoints_1.getUserAgentPrefix)();
    const sdkUserAgentValue = (prefix ? [prefix] : [])
        .concat([...defaultUserAgent, ...userAgent, ...customUserAgent])
        .join(constants_1.SPACE);
    const normalUAValue = [
        ...defaultUserAgent.filter((section) => section.startsWith("aws-sdk-")),
        ...customUserAgent,
    ].join(constants_1.SPACE);
    if (options.runtime !== "browser") {
        if (normalUAValue) {
            headers[constants_1.X_AMZ_USER_AGENT] = headers[constants_1.X_AMZ_USER_AGENT]
                ? `${headers[constants_1.USER_AGENT]} ${normalUAValue}`
                : normalUAValue;
        }
        headers[constants_1.USER_AGENT] = sdkUserAgentValue;
    }
    else {
        headers[constants_1.X_AMZ_USER_AGENT] = sdkUserAgentValue;
    }
    return next({
        ...args,
        request,
    });
};
exports.userAgentMiddleware = userAgentMiddleware;
const escapeUserAgent = ([name, version]) => {
    const prefixSeparatorIndex = name.indexOf("/");
    const prefix = name.substring(0, prefixSeparatorIndex);
    let uaName = name.substring(prefixSeparatorIndex + 1);
    if (prefix === "api") {
        uaName = uaName.toLowerCase();
    }
    return [prefix, uaName, version]
        .filter((item) => item && item.length > 0)
        .map((item) => item === null || item === void 0 ? void 0 : item.replace(constants_1.UA_ESCAPE_REGEX, "_"))
        .join("/");
};
exports.getUserAgentMiddlewareOptions = {
    name: "getUserAgentMiddleware",
    step: "build",
    priority: "low",
    tags: ["SET_USER_AGENT", "USER_AGENT"],
    override: true,
};
const getUserAgentPlugin = (config) => ({
    applyToStack: (clientStack) => {
        clientStack.add((0, exports.userAgentMiddleware)(config), exports.getUserAgentMiddlewareOptions);
    },
});
exports.getUserAgentPlugin = getUserAgentPlugin;


/***/ }),

/***/ 2175:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadConfig = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const fromEnv_1 = __nccwpck_require__(6161);
const fromSharedConfigFiles_1 = __nccwpck_require__(3905);
const fromStatic_1 = __nccwpck_require__(5881);
const loadConfig = ({ environmentVariableSelector, configFileSelector, default: defaultValue }, configuration = {}) => (0, property_provider_1.memoize)((0, property_provider_1.chain)((0, fromEnv_1.fromEnv)(environmentVariableSelector), (0, fromSharedConfigFiles_1.fromSharedConfigFiles)(configFileSelector, configuration), (0, fromStatic_1.fromStatic)(defaultValue)));
exports.loadConfig = loadConfig;


/***/ }),

/***/ 6161:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromEnv = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const fromEnv = (envVarSelector) => async () => {
    try {
        const config = envVarSelector(process.env);
        if (config === undefined) {
            throw new Error();
        }
        return config;
    }
    catch (e) {
        throw new property_provider_1.CredentialsProviderError(e.message || `Cannot load config from environment variables with getter: ${envVarSelector}`);
    }
};
exports.fromEnv = fromEnv;


/***/ }),

/***/ 3905:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromSharedConfigFiles = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const shared_ini_file_loader_1 = __nccwpck_require__(7387);
const fromSharedConfigFiles = (configSelector, { preferredFile = "config", ...init } = {}) => async () => {
    const profile = (0, shared_ini_file_loader_1.getProfileName)(init);
    const { configFile, credentialsFile } = await (0, shared_ini_file_loader_1.loadSharedConfigFiles)(init);
    const profileFromCredentials = credentialsFile[profile] || {};
    const profileFromConfig = configFile[profile] || {};
    const mergedProfile = preferredFile === "config"
        ? { ...profileFromCredentials, ...profileFromConfig }
        : { ...profileFromConfig, ...profileFromCredentials };
    try {
        const configValue = configSelector(mergedProfile);
        if (configValue === undefined) {
            throw new Error();
        }
        return configValue;
    }
    catch (e) {
        throw new property_provider_1.CredentialsProviderError(e.message ||
            `Cannot load config for profile ${profile} in SDK configuration files with getter: ${configSelector}`);
    }
};
exports.fromSharedConfigFiles = fromSharedConfigFiles;


/***/ }),

/***/ 5881:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromStatic = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const isFunction = (func) => typeof func === "function";
const fromStatic = (defaultValue) => isFunction(defaultValue) ? async () => await defaultValue() : (0, property_provider_1.fromStatic)(defaultValue);
exports.fromStatic = fromStatic;


/***/ }),

/***/ 7684:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(2175), exports);


/***/ }),

/***/ 3647:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NODEJS_TIMEOUT_ERROR_CODES = void 0;
exports.NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "EPIPE", "ETIMEDOUT"];


/***/ }),

/***/ 6225:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTransformedHeaders = void 0;
const getTransformedHeaders = (headers) => {
    const transformedHeaders = {};
    for (const name of Object.keys(headers)) {
        const headerValues = headers[name];
        transformedHeaders[name] = Array.isArray(headerValues) ? headerValues.join(",") : headerValues;
    }
    return transformedHeaders;
};
exports.getTransformedHeaders = getTransformedHeaders;


/***/ }),

/***/ 8805:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(2298), exports);
tslib_1.__exportStar(__nccwpck_require__(2533), exports);
tslib_1.__exportStar(__nccwpck_require__(2198), exports);


/***/ }),

/***/ 2298:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NodeHttpHandler = exports.DEFAULT_REQUEST_TIMEOUT = void 0;
const protocol_http_1 = __nccwpck_require__(223);
const querystring_builder_1 = __nccwpck_require__(3402);
const http_1 = __nccwpck_require__(3685);
const https_1 = __nccwpck_require__(5687);
const constants_1 = __nccwpck_require__(3647);
const get_transformed_headers_1 = __nccwpck_require__(6225);
const write_request_body_1 = __nccwpck_require__(5248);
exports.DEFAULT_REQUEST_TIMEOUT = 0;
class NodeHttpHandler {
    constructor(options) {
        this.metadata = { handlerProtocol: "http/1.1" };
        this.configProvider = new Promise((resolve, reject) => {
            if (typeof options === "function") {
                options()
                    .then((_options) => {
                    resolve(this.resolveDefaultConfig(_options));
                })
                    .catch(reject);
            }
            else {
                resolve(this.resolveDefaultConfig(options));
            }
        });
    }
    resolveDefaultConfig(options) {
        var _a, _b;
        const { requestTimeout, connectionTimeout, socketTimeout, httpAgent, httpsAgent } = options || {};
        const keepAlive = true;
        const maxSockets = 50;
        return {
            connectionTimeout,
            socketTimeout,
            requestTimeout: (_b = (_a = requestTimeout !== null && requestTimeout !== void 0 ? requestTimeout : connectionTimeout) !== null && _a !== void 0 ? _a : socketTimeout) !== null && _b !== void 0 ? _b : exports.DEFAULT_REQUEST_TIMEOUT,
            httpAgent: httpAgent || new http_1.Agent({ keepAlive, maxSockets }),
            httpsAgent: httpsAgent || new https_1.Agent({ keepAlive, maxSockets }),
        };
    }
    destroy() {
        var _a, _b, _c, _d;
        (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.httpAgent) === null || _b === void 0 ? void 0 : _b.destroy();
        (_d = (_c = this.config) === null || _c === void 0 ? void 0 : _c.httpsAgent) === null || _d === void 0 ? void 0 : _d.destroy();
    }
    async handle(request, { abortSignal } = {}) {
        if (!this.config) {
            this.config = await this.configProvider;
        }
        return new Promise((resolve, reject) => {
            var _a, _b;
            if (!this.config) {
                throw new Error("Node HTTP request handler config is not resolved");
            }
            if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
                const abortError = new Error("Request aborted");
                abortError.name = "AbortError";
                reject(abortError);
                return;
            }
            const isSSL = request.protocol === "https:";
            const queryString = (0, querystring_builder_1.buildQueryString)(request.query || {});
            const nodeHttpsOptions = {
                headers: request.headers,
                host: request.hostname,
                method: request.method,
                path: queryString ? `${request.path}?${queryString}` : request.path,
                port: request.port,
                agent: isSSL ? this.config.httpsAgent : this.config.httpAgent,
            };
            const requestFunc = isSSL ? https_1.request : http_1.request;
            const req = requestFunc(nodeHttpsOptions, (res) => {
                const httpResponse = new protocol_http_1.HttpResponse({
                    statusCode: res.statusCode || -1,
                    headers: (0, get_transformed_headers_1.getTransformedHeaders)(res.headers),
                    body: res,
                });
                resolve({ response: httpResponse });
            });
            req.on("error", (err) => {
                if (constants_1.NODEJS_TIMEOUT_ERROR_CODES.includes(err.code)) {
                    reject(Object.assign(err, { name: "TimeoutError" }));
                }
                else {
                    reject(err);
                }
            });
            const timeout = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.requestTimeout) !== null && _b !== void 0 ? _b : exports.DEFAULT_REQUEST_TIMEOUT;
            req.setTimeout(timeout, () => {
                req.destroy();
                reject(Object.assign(new Error(`Connection timed out after ${timeout} ms`), { name: "TimeoutError" }));
            });
            if (abortSignal) {
                abortSignal.onabort = () => {
                    req.abort();
                    const abortError = new Error("Request aborted");
                    abortError.name = "AbortError";
                    reject(abortError);
                };
            }
            (0, write_request_body_1.writeRequestBody)(req, request);
        });
    }
}
exports.NodeHttpHandler = NodeHttpHandler;


/***/ }),

/***/ 6675:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NodeHttp2ConnectionManager = void 0;
const tslib_1 = __nccwpck_require__(4351);
const http2_1 = tslib_1.__importDefault(__nccwpck_require__(5158));
const node_http2_connection_pool_1 = __nccwpck_require__(4368);
class NodeHttp2ConnectionManager {
    constructor(config) {
        this.sessionCache = new Map();
        this.config = config;
        if (this.config.maxConcurrency && this.config.maxConcurrency <= 0) {
            throw new RangeError("maxConcurrency must be greater than zero.");
        }
    }
    lease(requestContext, connectionConfiguration) {
        const url = this.getUrlString(requestContext);
        const existingPool = this.sessionCache.get(url);
        if (existingPool) {
            const existingSession = existingPool.poll();
            if (existingSession && !this.config.disableConcurrency) {
                return existingSession;
            }
        }
        const session = http2_1.default.connect(url);
        if (this.config.maxConcurrency) {
            session.settings({ maxConcurrentStreams: this.config.maxConcurrency }, (err) => {
                if (err) {
                    throw new Error("Fail to set maxConcurrentStreams to " +
                        this.config.maxConcurrency +
                        "when creating new session for " +
                        requestContext.destination.toString());
                }
            });
        }
        session.unref();
        const destroySessionCb = () => {
            session.destroy();
            this.deleteSession(url, session);
        };
        session.on("goaway", destroySessionCb);
        session.on("error", destroySessionCb);
        session.on("frameError", destroySessionCb);
        session.on("close", () => this.deleteSession(url, session));
        if (connectionConfiguration.requestTimeout) {
            session.setTimeout(connectionConfiguration.requestTimeout, destroySessionCb);
        }
        const connectionPool = this.sessionCache.get(url) || new node_http2_connection_pool_1.NodeHttp2ConnectionPool();
        connectionPool.offerLast(session);
        this.sessionCache.set(url, connectionPool);
        return session;
    }
    deleteSession(authority, session) {
        const existingConnectionPool = this.sessionCache.get(authority);
        if (!existingConnectionPool) {
            return;
        }
        if (!existingConnectionPool.contains(session)) {
            return;
        }
        existingConnectionPool.remove(session);
        this.sessionCache.set(authority, existingConnectionPool);
    }
    release(requestContext, session) {
        var _a;
        const cacheKey = this.getUrlString(requestContext);
        (_a = this.sessionCache.get(cacheKey)) === null || _a === void 0 ? void 0 : _a.offerLast(session);
    }
    destroy() {
        for (const [key, connectionPool] of this.sessionCache) {
            for (const session of connectionPool) {
                if (!session.destroyed) {
                    session.destroy();
                }
                connectionPool.remove(session);
            }
            this.sessionCache.delete(key);
        }
    }
    setMaxConcurrentStreams(maxConcurrentStreams) {
        if (this.config.maxConcurrency && this.config.maxConcurrency <= 0) {
            throw new RangeError("maxConcurrentStreams must be greater than zero.");
        }
        this.config.maxConcurrency = maxConcurrentStreams;
    }
    setDisableConcurrentStreams(disableConcurrentStreams) {
        this.config.disableConcurrency = disableConcurrentStreams;
    }
    getUrlString(request) {
        return request.destination.toString();
    }
}
exports.NodeHttp2ConnectionManager = NodeHttp2ConnectionManager;


/***/ }),

/***/ 4368:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NodeHttp2ConnectionPool = void 0;
class NodeHttp2ConnectionPool {
    constructor(sessions) {
        this.sessions = [];
        this.sessions = sessions !== null && sessions !== void 0 ? sessions : [];
    }
    poll() {
        if (this.sessions.length > 0) {
            return this.sessions.shift();
        }
    }
    offerLast(session) {
        this.sessions.push(session);
    }
    contains(session) {
        return this.sessions.includes(session);
    }
    remove(session) {
        this.sessions = this.sessions.filter((s) => s !== session);
    }
    [Symbol.iterator]() {
        return this.sessions[Symbol.iterator]();
    }
    destroy(connection) {
        for (const session of this.sessions) {
            if (session === connection) {
                if (!session.destroyed) {
                    session.destroy();
                }
            }
        }
    }
}
exports.NodeHttp2ConnectionPool = NodeHttp2ConnectionPool;


/***/ }),

/***/ 2533:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NodeHttp2Handler = void 0;
const protocol_http_1 = __nccwpck_require__(223);
const querystring_builder_1 = __nccwpck_require__(3402);
const http2_1 = __nccwpck_require__(5158);
const get_transformed_headers_1 = __nccwpck_require__(6225);
const node_http2_connection_manager_1 = __nccwpck_require__(6675);
const write_request_body_1 = __nccwpck_require__(5248);
class NodeHttp2Handler {
    constructor(options) {
        this.metadata = { handlerProtocol: "h2" };
        this.connectionManager = new node_http2_connection_manager_1.NodeHttp2ConnectionManager({});
        this.configProvider = new Promise((resolve, reject) => {
            if (typeof options === "function") {
                options()
                    .then((opts) => {
                    resolve(opts || {});
                })
                    .catch(reject);
            }
            else {
                resolve(options || {});
            }
        });
    }
    destroy() {
        this.connectionManager.destroy();
    }
    async handle(request, { abortSignal } = {}) {
        if (!this.config) {
            this.config = await this.configProvider;
            this.connectionManager.setDisableConcurrentStreams(this.config.disableConcurrentStreams || false);
            if (this.config.maxConcurrentStreams) {
                this.connectionManager.setMaxConcurrentStreams(this.config.maxConcurrentStreams);
            }
        }
        const { requestTimeout, disableConcurrentStreams } = this.config;
        return new Promise((resolve, rejectOriginal) => {
            var _a;
            let fulfilled = false;
            if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
                fulfilled = true;
                const abortError = new Error("Request aborted");
                abortError.name = "AbortError";
                rejectOriginal(abortError);
                return;
            }
            const { hostname, method, port, protocol, path, query } = request;
            const authority = `${protocol}//${hostname}${port ? `:${port}` : ""}`;
            const requestContext = { destination: new URL(authority) };
            const session = this.connectionManager.lease(requestContext, {
                requestTimeout: (_a = this.config) === null || _a === void 0 ? void 0 : _a.sessionTimeout,
                disableConcurrentStreams: disableConcurrentStreams || false,
            });
            const reject = (err) => {
                if (disableConcurrentStreams) {
                    this.destroySession(session);
                }
                fulfilled = true;
                rejectOriginal(err);
            };
            const queryString = (0, querystring_builder_1.buildQueryString)(query || {});
            const req = session.request({
                ...request.headers,
                [http2_1.constants.HTTP2_HEADER_PATH]: queryString ? `${path}?${queryString}` : path,
                [http2_1.constants.HTTP2_HEADER_METHOD]: method,
            });
            session.ref();
            req.on("response", (headers) => {
                const httpResponse = new protocol_http_1.HttpResponse({
                    statusCode: headers[":status"] || -1,
                    headers: (0, get_transformed_headers_1.getTransformedHeaders)(headers),
                    body: req,
                });
                fulfilled = true;
                resolve({ response: httpResponse });
                if (disableConcurrentStreams) {
                    session.close();
                    this.connectionManager.deleteSession(authority, session);
                }
            });
            if (requestTimeout) {
                req.setTimeout(requestTimeout, () => {
                    req.close();
                    const timeoutError = new Error(`Stream timed out because of no activity for ${requestTimeout} ms`);
                    timeoutError.name = "TimeoutError";
                    reject(timeoutError);
                });
            }
            if (abortSignal) {
                abortSignal.onabort = () => {
                    req.close();
                    const abortError = new Error("Request aborted");
                    abortError.name = "AbortError";
                    reject(abortError);
                };
            }
            req.on("frameError", (type, code, id) => {
                reject(new Error(`Frame type id ${type} in stream id ${id} has failed with code ${code}.`));
            });
            req.on("error", reject);
            req.on("aborted", () => {
                reject(new Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${req.rstCode}.`));
            });
            req.on("close", () => {
                session.unref();
                if (disableConcurrentStreams) {
                    session.destroy();
                }
                if (!fulfilled) {
                    reject(new Error("Unexpected error: http2 request did not get a response"));
                }
            });
            (0, write_request_body_1.writeRequestBody)(req, request);
        });
    }
    destroySession(session) {
        if (!session.destroyed) {
            session.destroy();
        }
    }
}
exports.NodeHttp2Handler = NodeHttp2Handler;


/***/ }),

/***/ 4362:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Collector = void 0;
const stream_1 = __nccwpck_require__(2781);
class Collector extends stream_1.Writable {
    constructor() {
        super(...arguments);
        this.bufferedBytes = [];
    }
    _write(chunk, encoding, callback) {
        this.bufferedBytes.push(chunk);
        callback();
    }
}
exports.Collector = Collector;


/***/ }),

/***/ 2198:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.streamCollector = void 0;
const collector_1 = __nccwpck_require__(4362);
const streamCollector = (stream) => new Promise((resolve, reject) => {
    const collector = new collector_1.Collector();
    stream.pipe(collector);
    stream.on("error", (err) => {
        collector.end();
        reject(err);
    });
    collector.on("error", reject);
    collector.on("finish", function () {
        const bytes = new Uint8Array(Buffer.concat(this.bufferedBytes));
        resolve(bytes);
    });
});
exports.streamCollector = streamCollector;


/***/ }),

/***/ 5248:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.writeRequestBody = void 0;
const stream_1 = __nccwpck_require__(2781);
function writeRequestBody(httpRequest, request) {
    const expect = request.headers["Expect"] || request.headers["expect"];
    if (expect === "100-continue") {
        httpRequest.on("continue", () => {
            writeBody(httpRequest, request.body);
        });
    }
    else {
        writeBody(httpRequest, request.body);
    }
}
exports.writeRequestBody = writeRequestBody;
function writeBody(httpRequest, body) {
    if (body instanceof stream_1.Readable) {
        body.pipe(httpRequest);
    }
    else if (body) {
        httpRequest.end(Buffer.from(body));
    }
    else {
        httpRequest.end();
    }
}


/***/ }),

/***/ 6875:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CredentialsProviderError = void 0;
const ProviderError_1 = __nccwpck_require__(1786);
class CredentialsProviderError extends ProviderError_1.ProviderError {
    constructor(message, tryNextLink = true) {
        super(message, tryNextLink);
        this.tryNextLink = tryNextLink;
        this.name = "CredentialsProviderError";
        Object.setPrototypeOf(this, CredentialsProviderError.prototype);
    }
}
exports.CredentialsProviderError = CredentialsProviderError;


/***/ }),

/***/ 1786:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProviderError = void 0;
class ProviderError extends Error {
    constructor(message, tryNextLink = true) {
        super(message);
        this.tryNextLink = tryNextLink;
        this.name = "ProviderError";
        Object.setPrototypeOf(this, ProviderError.prototype);
    }
    static from(error, tryNextLink = true) {
        return Object.assign(new this(error.message, tryNextLink), error);
    }
}
exports.ProviderError = ProviderError;


/***/ }),

/***/ 2173:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TokenProviderError = void 0;
const ProviderError_1 = __nccwpck_require__(1786);
class TokenProviderError extends ProviderError_1.ProviderError {
    constructor(message, tryNextLink = true) {
        super(message, tryNextLink);
        this.tryNextLink = tryNextLink;
        this.name = "TokenProviderError";
        Object.setPrototypeOf(this, TokenProviderError.prototype);
    }
}
exports.TokenProviderError = TokenProviderError;


/***/ }),

/***/ 1444:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.chain = void 0;
const ProviderError_1 = __nccwpck_require__(1786);
function chain(...providers) {
    return () => {
        let promise = Promise.reject(new ProviderError_1.ProviderError("No providers in chain"));
        for (const provider of providers) {
            promise = promise.catch((err) => {
                if (err === null || err === void 0 ? void 0 : err.tryNextLink) {
                    return provider();
                }
                throw err;
            });
        }
        return promise;
    };
}
exports.chain = chain;


/***/ }),

/***/ 529:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromStatic = void 0;
const fromStatic = (staticValue) => () => Promise.resolve(staticValue);
exports.fromStatic = fromStatic;


/***/ }),

/***/ 4462:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(6875), exports);
tslib_1.__exportStar(__nccwpck_require__(1786), exports);
tslib_1.__exportStar(__nccwpck_require__(2173), exports);
tslib_1.__exportStar(__nccwpck_require__(1444), exports);
tslib_1.__exportStar(__nccwpck_require__(529), exports);
tslib_1.__exportStar(__nccwpck_require__(714), exports);


/***/ }),

/***/ 714:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.memoize = void 0;
const memoize = (provider, isExpired, requiresRefresh) => {
    let resolved;
    let pending;
    let hasResult;
    let isConstant = false;
    const coalesceProvider = async () => {
        if (!pending) {
            pending = provider();
        }
        try {
            resolved = await pending;
            hasResult = true;
            isConstant = false;
        }
        finally {
            pending = undefined;
        }
        return resolved;
    };
    if (isExpired === undefined) {
        return async (options) => {
            if (!hasResult || (options === null || options === void 0 ? void 0 : options.forceRefresh)) {
                resolved = await coalesceProvider();
            }
            return resolved;
        };
    }
    return async (options) => {
        if (!hasResult || (options === null || options === void 0 ? void 0 : options.forceRefresh)) {
            resolved = await coalesceProvider();
        }
        if (isConstant) {
            return resolved;
        }
        if (requiresRefresh && !requiresRefresh(resolved)) {
            isConstant = true;
            return resolved;
        }
        if (isExpired(resolved)) {
            await coalesceProvider();
            return resolved;
        }
        return resolved;
    };
};
exports.memoize = memoize;


/***/ }),

/***/ 3915:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Field = void 0;
const FieldPosition_1 = __nccwpck_require__(3908);
class Field {
    constructor({ name, kind = FieldPosition_1.FieldPosition.HEADER, values = [] }) {
        this.name = name;
        this.kind = kind;
        this.values = values;
    }
    add(value) {
        this.values.push(value);
    }
    set(values) {
        this.values = values;
    }
    remove(value) {
        this.values = this.values.filter((v) => v !== value);
    }
    toString() {
        return this.values.map((v) => (v.includes(",") || v.includes(" ") ? `"${v}"` : v)).join(", ");
    }
    get() {
        return this.values;
    }
}
exports.Field = Field;


/***/ }),

/***/ 3908:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FieldPosition = void 0;
var FieldPosition;
(function (FieldPosition) {
    FieldPosition[FieldPosition["HEADER"] = 0] = "HEADER";
    FieldPosition[FieldPosition["TRAILER"] = 1] = "TRAILER";
})(FieldPosition = exports.FieldPosition || (exports.FieldPosition = {}));


/***/ }),

/***/ 8343:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Fields = void 0;
class Fields {
    constructor({ fields = [], encoding = "utf-8" }) {
        this.entries = {};
        fields.forEach(this.setField.bind(this));
        this.encoding = encoding;
    }
    setField(field) {
        this.entries[field.name.toLowerCase()] = field;
    }
    getField(name) {
        return this.entries[name.toLowerCase()];
    }
    removeField(name) {
        delete this.entries[name.toLowerCase()];
    }
    getByType(kind) {
        return Object.values(this.entries).filter((field) => field.kind === kind);
    }
}
exports.Fields = Fields;


/***/ }),

/***/ 6779:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 2872:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpRequest = void 0;
class HttpRequest {
    constructor(options) {
        this.method = options.method || "GET";
        this.hostname = options.hostname || "localhost";
        this.port = options.port;
        this.query = options.query || {};
        this.headers = options.headers || {};
        this.body = options.body;
        this.protocol = options.protocol
            ? options.protocol.slice(-1) !== ":"
                ? `${options.protocol}:`
                : options.protocol
            : "https:";
        this.path = options.path ? (options.path.charAt(0) !== "/" ? `/${options.path}` : options.path) : "/";
    }
    static isInstance(request) {
        if (!request)
            return false;
        const req = request;
        return ("method" in req &&
            "protocol" in req &&
            "hostname" in req &&
            "path" in req &&
            typeof req["query"] === "object" &&
            typeof req["headers"] === "object");
    }
    clone() {
        const cloned = new HttpRequest({
            ...this,
            headers: { ...this.headers },
        });
        if (cloned.query)
            cloned.query = cloneQuery(cloned.query);
        return cloned;
    }
}
exports.HttpRequest = HttpRequest;
function cloneQuery(query) {
    return Object.keys(query).reduce((carry, paramName) => {
        const param = query[paramName];
        return {
            ...carry,
            [paramName]: Array.isArray(param) ? [...param] : param,
        };
    }, {});
}


/***/ }),

/***/ 2348:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpResponse = void 0;
class HttpResponse {
    constructor(options) {
        this.statusCode = options.statusCode;
        this.headers = options.headers || {};
        this.body = options.body;
    }
    static isInstance(response) {
        if (!response)
            return false;
        const resp = response;
        return typeof resp.statusCode === "number" && typeof resp.headers === "object";
    }
}
exports.HttpResponse = HttpResponse;


/***/ }),

/***/ 223:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(3915), exports);
tslib_1.__exportStar(__nccwpck_require__(3908), exports);
tslib_1.__exportStar(__nccwpck_require__(8343), exports);
tslib_1.__exportStar(__nccwpck_require__(6779), exports);
tslib_1.__exportStar(__nccwpck_require__(2872), exports);
tslib_1.__exportStar(__nccwpck_require__(2348), exports);
tslib_1.__exportStar(__nccwpck_require__(5694), exports);


/***/ }),

/***/ 5694:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isValidHostname = void 0;
function isValidHostname(hostname) {
    const hostPattern = /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/;
    return hostPattern.test(hostname);
}
exports.isValidHostname = isValidHostname;


/***/ }),

/***/ 3402:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildQueryString = void 0;
const util_uri_escape_1 = __nccwpck_require__(7952);
function buildQueryString(query) {
    const parts = [];
    for (let key of Object.keys(query).sort()) {
        const value = query[key];
        key = (0, util_uri_escape_1.escapeUri)(key);
        if (Array.isArray(value)) {
            for (let i = 0, iLen = value.length; i < iLen; i++) {
                parts.push(`${key}=${(0, util_uri_escape_1.escapeUri)(value[i])}`);
            }
        }
        else {
            let qsEntry = key;
            if (value || typeof value === "string") {
                qsEntry += `=${(0, util_uri_escape_1.escapeUri)(value)}`;
            }
            parts.push(qsEntry);
        }
    }
    return parts.join("&");
}
exports.buildQueryString = buildQueryString;


/***/ }),

/***/ 7424:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseQueryString = void 0;
function parseQueryString(querystring) {
    const query = {};
    querystring = querystring.replace(/^\?/, "");
    if (querystring) {
        for (const pair of querystring.split("&")) {
            let [key, value = null] = pair.split("=");
            key = decodeURIComponent(key);
            if (value) {
                value = decodeURIComponent(value);
            }
            if (!(key in query)) {
                query[key] = value;
            }
            else if (Array.isArray(query[key])) {
                query[key].push(value);
            }
            else {
                query[key] = [query[key], value];
            }
        }
    }
    return query;
}
exports.parseQueryString = parseQueryString;


/***/ }),

/***/ 7352:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NODEJS_TIMEOUT_ERROR_CODES = exports.TRANSIENT_ERROR_STATUS_CODES = exports.TRANSIENT_ERROR_CODES = exports.THROTTLING_ERROR_CODES = exports.CLOCK_SKEW_ERROR_CODES = void 0;
exports.CLOCK_SKEW_ERROR_CODES = [
    "AuthFailure",
    "InvalidSignatureException",
    "RequestExpired",
    "RequestInTheFuture",
    "RequestTimeTooSkewed",
    "SignatureDoesNotMatch",
];
exports.THROTTLING_ERROR_CODES = [
    "BandwidthLimitExceeded",
    "EC2ThrottledException",
    "LimitExceededException",
    "PriorRequestNotComplete",
    "ProvisionedThroughputExceededException",
    "RequestLimitExceeded",
    "RequestThrottled",
    "RequestThrottledException",
    "SlowDown",
    "ThrottledException",
    "Throttling",
    "ThrottlingException",
    "TooManyRequestsException",
    "TransactionInProgressException",
];
exports.TRANSIENT_ERROR_CODES = ["AbortError", "TimeoutError", "RequestTimeout", "RequestTimeoutException"];
exports.TRANSIENT_ERROR_STATUS_CODES = [500, 502, 503, 504];
exports.NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "EPIPE", "ETIMEDOUT"];


/***/ }),

/***/ 1921:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isServerError = exports.isTransientError = exports.isThrottlingError = exports.isClockSkewError = exports.isRetryableByTrait = void 0;
const constants_1 = __nccwpck_require__(7352);
const isRetryableByTrait = (error) => error.$retryable !== undefined;
exports.isRetryableByTrait = isRetryableByTrait;
const isClockSkewError = (error) => constants_1.CLOCK_SKEW_ERROR_CODES.includes(error.name);
exports.isClockSkewError = isClockSkewError;
const isThrottlingError = (error) => {
    var _a, _b;
    return ((_a = error.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) === 429 ||
        constants_1.THROTTLING_ERROR_CODES.includes(error.name) ||
        ((_b = error.$retryable) === null || _b === void 0 ? void 0 : _b.throttling) == true;
};
exports.isThrottlingError = isThrottlingError;
const isTransientError = (error) => {
    var _a;
    return constants_1.TRANSIENT_ERROR_CODES.includes(error.name) ||
        constants_1.NODEJS_TIMEOUT_ERROR_CODES.includes((error === null || error === void 0 ? void 0 : error.code) || "") ||
        constants_1.TRANSIENT_ERROR_STATUS_CODES.includes(((_a = error.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) || 0);
};
exports.isTransientError = isTransientError;
const isServerError = (error) => {
    var _a;
    if (((_a = error.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) !== undefined) {
        const statusCode = error.$metadata.httpStatusCode;
        if (500 <= statusCode && statusCode <= 599 && !(0, exports.isTransientError)(error)) {
            return true;
        }
        return false;
    }
    return false;
};
exports.isServerError = isServerError;


/***/ }),

/***/ 5216:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getConfigFilepath = exports.ENV_CONFIG_PATH = void 0;
const path_1 = __nccwpck_require__(1017);
const getHomeDir_1 = __nccwpck_require__(7363);
exports.ENV_CONFIG_PATH = "AWS_CONFIG_FILE";
const getConfigFilepath = () => process.env[exports.ENV_CONFIG_PATH] || (0, path_1.join)((0, getHomeDir_1.getHomeDir)(), ".aws", "config");
exports.getConfigFilepath = getConfigFilepath;


/***/ }),

/***/ 1569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCredentialsFilepath = exports.ENV_CREDENTIALS_PATH = void 0;
const path_1 = __nccwpck_require__(1017);
const getHomeDir_1 = __nccwpck_require__(7363);
exports.ENV_CREDENTIALS_PATH = "AWS_SHARED_CREDENTIALS_FILE";
const getCredentialsFilepath = () => process.env[exports.ENV_CREDENTIALS_PATH] || (0, path_1.join)((0, getHomeDir_1.getHomeDir)(), ".aws", "credentials");
exports.getCredentialsFilepath = getCredentialsFilepath;


/***/ }),

/***/ 7363:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getHomeDir = void 0;
const os_1 = __nccwpck_require__(2037);
const path_1 = __nccwpck_require__(1017);
const getHomeDir = () => {
    const { HOME, USERPROFILE, HOMEPATH, HOMEDRIVE = `C:${path_1.sep}` } = process.env;
    if (HOME)
        return HOME;
    if (USERPROFILE)
        return USERPROFILE;
    if (HOMEPATH)
        return `${HOMEDRIVE}${HOMEPATH}`;
    return (0, os_1.homedir)();
};
exports.getHomeDir = getHomeDir;


/***/ }),

/***/ 7498:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getProfileData = void 0;
const profileKeyRegex = /^profile\s(["'])?([^\1]+)\1$/;
const getProfileData = (data) => Object.entries(data)
    .filter(([key]) => profileKeyRegex.test(key))
    .reduce((acc, [key, value]) => ({ ...acc, [profileKeyRegex.exec(key)[2]]: value }), {
    ...(data.default && { default: data.default }),
});
exports.getProfileData = getProfileData;


/***/ }),

/***/ 6776:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getProfileName = exports.DEFAULT_PROFILE = exports.ENV_PROFILE = void 0;
exports.ENV_PROFILE = "AWS_PROFILE";
exports.DEFAULT_PROFILE = "default";
const getProfileName = (init) => init.profile || process.env[exports.ENV_PROFILE] || exports.DEFAULT_PROFILE;
exports.getProfileName = getProfileName;


/***/ }),

/***/ 6147:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSSOTokenFilepath = void 0;
const crypto_1 = __nccwpck_require__(6113);
const path_1 = __nccwpck_require__(1017);
const getHomeDir_1 = __nccwpck_require__(7363);
const getSSOTokenFilepath = (id) => {
    const hasher = (0, crypto_1.createHash)("sha1");
    const cacheName = hasher.update(id).digest("hex");
    return (0, path_1.join)((0, getHomeDir_1.getHomeDir)(), ".aws", "sso", "cache", `${cacheName}.json`);
};
exports.getSSOTokenFilepath = getSSOTokenFilepath;


/***/ }),

/***/ 8553:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSSOTokenFromFile = void 0;
const fs_1 = __nccwpck_require__(7147);
const getSSOTokenFilepath_1 = __nccwpck_require__(6147);
const { readFile } = fs_1.promises;
const getSSOTokenFromFile = async (id) => {
    const ssoTokenFilepath = (0, getSSOTokenFilepath_1.getSSOTokenFilepath)(id);
    const ssoTokenText = await readFile(ssoTokenFilepath, "utf8");
    return JSON.parse(ssoTokenText);
};
exports.getSSOTokenFromFile = getSSOTokenFromFile;


/***/ }),

/***/ 5175:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSsoSessionData = void 0;
const ssoSessionKeyRegex = /^sso-session\s(["'])?([^\1]+)\1$/;
const getSsoSessionData = (data) => Object.entries(data)
    .filter(([key]) => ssoSessionKeyRegex.test(key))
    .reduce((acc, [key, value]) => ({ ...acc, [ssoSessionKeyRegex.exec(key)[2]]: value }), {});
exports.getSsoSessionData = getSsoSessionData;


/***/ }),

/***/ 7387:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(7363), exports);
tslib_1.__exportStar(__nccwpck_require__(6776), exports);
tslib_1.__exportStar(__nccwpck_require__(6147), exports);
tslib_1.__exportStar(__nccwpck_require__(8553), exports);
tslib_1.__exportStar(__nccwpck_require__(7871), exports);
tslib_1.__exportStar(__nccwpck_require__(6179), exports);
tslib_1.__exportStar(__nccwpck_require__(6533), exports);
tslib_1.__exportStar(__nccwpck_require__(4105), exports);


/***/ }),

/***/ 7871:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadSharedConfigFiles = void 0;
const getConfigFilepath_1 = __nccwpck_require__(5216);
const getCredentialsFilepath_1 = __nccwpck_require__(1569);
const getProfileData_1 = __nccwpck_require__(7498);
const parseIni_1 = __nccwpck_require__(2806);
const slurpFile_1 = __nccwpck_require__(9242);
const swallowError = () => ({});
const loadSharedConfigFiles = async (init = {}) => {
    const { filepath = (0, getCredentialsFilepath_1.getCredentialsFilepath)(), configFilepath = (0, getConfigFilepath_1.getConfigFilepath)() } = init;
    const parsedFiles = await Promise.all([
        (0, slurpFile_1.slurpFile)(configFilepath, {
            ignoreCache: init.ignoreCache,
        })
            .then(parseIni_1.parseIni)
            .then(getProfileData_1.getProfileData)
            .catch(swallowError),
        (0, slurpFile_1.slurpFile)(filepath, {
            ignoreCache: init.ignoreCache,
        })
            .then(parseIni_1.parseIni)
            .catch(swallowError),
    ]);
    return {
        configFile: parsedFiles[0],
        credentialsFile: parsedFiles[1],
    };
};
exports.loadSharedConfigFiles = loadSharedConfigFiles;


/***/ }),

/***/ 6179:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadSsoSessionData = void 0;
const getConfigFilepath_1 = __nccwpck_require__(5216);
const getSsoSessionData_1 = __nccwpck_require__(5175);
const parseIni_1 = __nccwpck_require__(2806);
const slurpFile_1 = __nccwpck_require__(9242);
const swallowError = () => ({});
const loadSsoSessionData = async (init = {}) => {
    var _a;
    return (0, slurpFile_1.slurpFile)((_a = init.configFilepath) !== null && _a !== void 0 ? _a : (0, getConfigFilepath_1.getConfigFilepath)())
        .then(parseIni_1.parseIni)
        .then(getSsoSessionData_1.getSsoSessionData)
        .catch(swallowError);
};
exports.loadSsoSessionData = loadSsoSessionData;


/***/ }),

/***/ 1224:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mergeConfigFiles = void 0;
const mergeConfigFiles = (...files) => {
    const merged = {};
    for (const file of files) {
        for (const [key, values] of Object.entries(file)) {
            if (merged[key] !== undefined) {
                Object.assign(merged[key], values);
            }
            else {
                merged[key] = values;
            }
        }
    }
    return merged;
};
exports.mergeConfigFiles = mergeConfigFiles;


/***/ }),

/***/ 2806:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseIni = void 0;
const profileNameBlockList = ["__proto__", "profile __proto__"];
const parseIni = (iniData) => {
    const map = {};
    let currentSection;
    for (let line of iniData.split(/\r?\n/)) {
        line = line.split(/(^|\s)[;#]/)[0].trim();
        const isSection = line[0] === "[" && line[line.length - 1] === "]";
        if (isSection) {
            currentSection = line.substring(1, line.length - 1);
            if (profileNameBlockList.includes(currentSection)) {
                throw new Error(`Found invalid profile name "${currentSection}"`);
            }
        }
        else if (currentSection) {
            const indexOfEqualsSign = line.indexOf("=");
            const start = 0;
            const end = line.length - 1;
            const isAssignment = indexOfEqualsSign !== -1 && indexOfEqualsSign !== start && indexOfEqualsSign !== end;
            if (isAssignment) {
                const [name, value] = [
                    line.substring(0, indexOfEqualsSign).trim(),
                    line.substring(indexOfEqualsSign + 1).trim(),
                ];
                map[currentSection] = map[currentSection] || {};
                map[currentSection][name] = value;
            }
        }
    }
    return map;
};
exports.parseIni = parseIni;


/***/ }),

/***/ 6533:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseKnownFiles = void 0;
const loadSharedConfigFiles_1 = __nccwpck_require__(7871);
const mergeConfigFiles_1 = __nccwpck_require__(1224);
const parseKnownFiles = async (init) => {
    const parsedFiles = await (0, loadSharedConfigFiles_1.loadSharedConfigFiles)(init);
    return (0, mergeConfigFiles_1.mergeConfigFiles)(parsedFiles.configFile, parsedFiles.credentialsFile);
};
exports.parseKnownFiles = parseKnownFiles;


/***/ }),

/***/ 9242:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.slurpFile = void 0;
const fs_1 = __nccwpck_require__(7147);
const { readFile } = fs_1.promises;
const filePromisesHash = {};
const slurpFile = (path, options) => {
    if (!filePromisesHash[path] || (options === null || options === void 0 ? void 0 : options.ignoreCache)) {
        filePromisesHash[path] = readFile(path, "utf8");
    }
    return filePromisesHash[path];
};
exports.slurpFile = slurpFile;


/***/ }),

/***/ 4105:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 5086:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignatureV4 = void 0;
const util_hex_encoding_1 = __nccwpck_require__(1968);
const util_middleware_1 = __nccwpck_require__(236);
const util_utf8_1 = __nccwpck_require__(2855);
const constants_1 = __nccwpck_require__(342);
const credentialDerivation_1 = __nccwpck_require__(1424);
const getCanonicalHeaders_1 = __nccwpck_require__(3590);
const getCanonicalQuery_1 = __nccwpck_require__(2019);
const getPayloadHash_1 = __nccwpck_require__(7080);
const headerUtil_1 = __nccwpck_require__(4120);
const moveHeadersToQuery_1 = __nccwpck_require__(8201);
const prepareRequest_1 = __nccwpck_require__(5772);
const utilDate_1 = __nccwpck_require__(4799);
class SignatureV4 {
    constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true, }) {
        this.service = service;
        this.sha256 = sha256;
        this.uriEscapePath = uriEscapePath;
        this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
        this.regionProvider = (0, util_middleware_1.normalizeProvider)(region);
        this.credentialProvider = (0, util_middleware_1.normalizeProvider)(credentials);
    }
    async presign(originalRequest, options = {}) {
        const { signingDate = new Date(), expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, signingRegion, signingService, } = options;
        const credentials = await this.credentialProvider();
        this.validateResolvedCredentials(credentials);
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : (await this.regionProvider());
        const { longDate, shortDate } = formatDate(signingDate);
        if (expiresIn > constants_1.MAX_PRESIGNED_TTL) {
            return Promise.reject("Signature version 4 presigned URLs" + " must have an expiration date less than one week in" + " the future");
        }
        const scope = (0, credentialDerivation_1.createScope)(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
        const request = (0, moveHeadersToQuery_1.moveHeadersToQuery)((0, prepareRequest_1.prepareRequest)(originalRequest), { unhoistableHeaders });
        if (credentials.sessionToken) {
            request.query[constants_1.TOKEN_QUERY_PARAM] = credentials.sessionToken;
        }
        request.query[constants_1.ALGORITHM_QUERY_PARAM] = constants_1.ALGORITHM_IDENTIFIER;
        request.query[constants_1.CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`;
        request.query[constants_1.AMZ_DATE_QUERY_PARAM] = longDate;
        request.query[constants_1.EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
        const canonicalHeaders = (0, getCanonicalHeaders_1.getCanonicalHeaders)(request, unsignableHeaders, signableHeaders);
        request.query[constants_1.SIGNED_HEADERS_QUERY_PARAM] = getCanonicalHeaderList(canonicalHeaders);
        request.query[constants_1.SIGNATURE_QUERY_PARAM] = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, await (0, getPayloadHash_1.getPayloadHash)(originalRequest, this.sha256)));
        return request;
    }
    async sign(toSign, options) {
        if (typeof toSign === "string") {
            return this.signString(toSign, options);
        }
        else if (toSign.headers && toSign.payload) {
            return this.signEvent(toSign, options);
        }
        else {
            return this.signRequest(toSign, options);
        }
    }
    async signEvent({ headers, payload }, { signingDate = new Date(), priorSignature, signingRegion, signingService }) {
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : (await this.regionProvider());
        const { shortDate, longDate } = formatDate(signingDate);
        const scope = (0, credentialDerivation_1.createScope)(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
        const hashedPayload = await (0, getPayloadHash_1.getPayloadHash)({ headers: {}, body: payload }, this.sha256);
        const hash = new this.sha256();
        hash.update(headers);
        const hashedHeaders = (0, util_hex_encoding_1.toHex)(await hash.digest());
        const stringToSign = [
            constants_1.EVENT_ALGORITHM_IDENTIFIER,
            longDate,
            scope,
            priorSignature,
            hashedHeaders,
            hashedPayload,
        ].join("\n");
        return this.signString(stringToSign, { signingDate, signingRegion: region, signingService });
    }
    async signString(stringToSign, { signingDate = new Date(), signingRegion, signingService } = {}) {
        const credentials = await this.credentialProvider();
        this.validateResolvedCredentials(credentials);
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : (await this.regionProvider());
        const { shortDate } = formatDate(signingDate);
        const hash = new this.sha256(await this.getSigningKey(credentials, region, shortDate, signingService));
        hash.update((0, util_utf8_1.toUint8Array)(stringToSign));
        return (0, util_hex_encoding_1.toHex)(await hash.digest());
    }
    async signRequest(requestToSign, { signingDate = new Date(), signableHeaders, unsignableHeaders, signingRegion, signingService, } = {}) {
        const credentials = await this.credentialProvider();
        this.validateResolvedCredentials(credentials);
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : (await this.regionProvider());
        const request = (0, prepareRequest_1.prepareRequest)(requestToSign);
        const { longDate, shortDate } = formatDate(signingDate);
        const scope = (0, credentialDerivation_1.createScope)(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
        request.headers[constants_1.AMZ_DATE_HEADER] = longDate;
        if (credentials.sessionToken) {
            request.headers[constants_1.TOKEN_HEADER] = credentials.sessionToken;
        }
        const payloadHash = await (0, getPayloadHash_1.getPayloadHash)(request, this.sha256);
        if (!(0, headerUtil_1.hasHeader)(constants_1.SHA256_HEADER, request.headers) && this.applyChecksum) {
            request.headers[constants_1.SHA256_HEADER] = payloadHash;
        }
        const canonicalHeaders = (0, getCanonicalHeaders_1.getCanonicalHeaders)(request, unsignableHeaders, signableHeaders);
        const signature = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, payloadHash));
        request.headers[constants_1.AUTH_HEADER] =
            `${constants_1.ALGORITHM_IDENTIFIER} ` +
                `Credential=${credentials.accessKeyId}/${scope}, ` +
                `SignedHeaders=${getCanonicalHeaderList(canonicalHeaders)}, ` +
                `Signature=${signature}`;
        return request;
    }
    createCanonicalRequest(request, canonicalHeaders, payloadHash) {
        const sortedHeaders = Object.keys(canonicalHeaders).sort();
        return `${request.method}
${this.getCanonicalPath(request)}
${(0, getCanonicalQuery_1.getCanonicalQuery)(request)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join("\n")}

${sortedHeaders.join(";")}
${payloadHash}`;
    }
    async createStringToSign(longDate, credentialScope, canonicalRequest) {
        const hash = new this.sha256();
        hash.update((0, util_utf8_1.toUint8Array)(canonicalRequest));
        const hashedRequest = await hash.digest();
        return `${constants_1.ALGORITHM_IDENTIFIER}
${longDate}
${credentialScope}
${(0, util_hex_encoding_1.toHex)(hashedRequest)}`;
    }
    getCanonicalPath({ path }) {
        if (this.uriEscapePath) {
            const normalizedPathSegments = [];
            for (const pathSegment of path.split("/")) {
                if ((pathSegment === null || pathSegment === void 0 ? void 0 : pathSegment.length) === 0)
                    continue;
                if (pathSegment === ".")
                    continue;
                if (pathSegment === "..") {
                    normalizedPathSegments.pop();
                }
                else {
                    normalizedPathSegments.push(pathSegment);
                }
            }
            const normalizedPath = `${(path === null || path === void 0 ? void 0 : path.startsWith("/")) ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && (path === null || path === void 0 ? void 0 : path.endsWith("/")) ? "/" : ""}`;
            const doubleEncoded = encodeURIComponent(normalizedPath);
            return doubleEncoded.replace(/%2F/g, "/");
        }
        return path;
    }
    async getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
        const stringToSign = await this.createStringToSign(longDate, credentialScope, canonicalRequest);
        const hash = new this.sha256(await keyPromise);
        hash.update((0, util_utf8_1.toUint8Array)(stringToSign));
        return (0, util_hex_encoding_1.toHex)(await hash.digest());
    }
    getSigningKey(credentials, region, shortDate, service) {
        return (0, credentialDerivation_1.getSigningKey)(this.sha256, credentials, shortDate, region, service || this.service);
    }
    validateResolvedCredentials(credentials) {
        if (typeof credentials !== "object" ||
            typeof credentials.accessKeyId !== "string" ||
            typeof credentials.secretAccessKey !== "string") {
            throw new Error("Resolved credential object is not valid");
        }
    }
}
exports.SignatureV4 = SignatureV4;
const formatDate = (now) => {
    const longDate = (0, utilDate_1.iso8601)(now).replace(/[\-:]/g, "");
    return {
        longDate,
        shortDate: longDate.slice(0, 8),
    };
};
const getCanonicalHeaderList = (headers) => Object.keys(headers).sort().join(";");


/***/ }),

/***/ 3141:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cloneQuery = exports.cloneRequest = void 0;
const cloneRequest = ({ headers, query, ...rest }) => ({
    ...rest,
    headers: { ...headers },
    query: query ? (0, exports.cloneQuery)(query) : undefined,
});
exports.cloneRequest = cloneRequest;
const cloneQuery = (query) => Object.keys(query).reduce((carry, paramName) => {
    const param = query[paramName];
    return {
        ...carry,
        [paramName]: Array.isArray(param) ? [...param] : param,
    };
}, {});
exports.cloneQuery = cloneQuery;


/***/ }),

/***/ 342:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MAX_PRESIGNED_TTL = exports.KEY_TYPE_IDENTIFIER = exports.MAX_CACHE_SIZE = exports.UNSIGNED_PAYLOAD = exports.EVENT_ALGORITHM_IDENTIFIER = exports.ALGORITHM_IDENTIFIER_V4A = exports.ALGORITHM_IDENTIFIER = exports.UNSIGNABLE_PATTERNS = exports.SEC_HEADER_PATTERN = exports.PROXY_HEADER_PATTERN = exports.ALWAYS_UNSIGNABLE_HEADERS = exports.HOST_HEADER = exports.TOKEN_HEADER = exports.SHA256_HEADER = exports.SIGNATURE_HEADER = exports.GENERATED_HEADERS = exports.DATE_HEADER = exports.AMZ_DATE_HEADER = exports.AUTH_HEADER = exports.REGION_SET_PARAM = exports.TOKEN_QUERY_PARAM = exports.SIGNATURE_QUERY_PARAM = exports.EXPIRES_QUERY_PARAM = exports.SIGNED_HEADERS_QUERY_PARAM = exports.AMZ_DATE_QUERY_PARAM = exports.CREDENTIAL_QUERY_PARAM = exports.ALGORITHM_QUERY_PARAM = void 0;
exports.ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
exports.CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
exports.AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
exports.SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
exports.EXPIRES_QUERY_PARAM = "X-Amz-Expires";
exports.SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
exports.TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
exports.REGION_SET_PARAM = "X-Amz-Region-Set";
exports.AUTH_HEADER = "authorization";
exports.AMZ_DATE_HEADER = exports.AMZ_DATE_QUERY_PARAM.toLowerCase();
exports.DATE_HEADER = "date";
exports.GENERATED_HEADERS = [exports.AUTH_HEADER, exports.AMZ_DATE_HEADER, exports.DATE_HEADER];
exports.SIGNATURE_HEADER = exports.SIGNATURE_QUERY_PARAM.toLowerCase();
exports.SHA256_HEADER = "x-amz-content-sha256";
exports.TOKEN_HEADER = exports.TOKEN_QUERY_PARAM.toLowerCase();
exports.HOST_HEADER = "host";
exports.ALWAYS_UNSIGNABLE_HEADERS = {
    authorization: true,
    "cache-control": true,
    connection: true,
    expect: true,
    from: true,
    "keep-alive": true,
    "max-forwards": true,
    pragma: true,
    referer: true,
    te: true,
    trailer: true,
    "transfer-encoding": true,
    upgrade: true,
    "user-agent": true,
    "x-amzn-trace-id": true,
};
exports.PROXY_HEADER_PATTERN = /^proxy-/;
exports.SEC_HEADER_PATTERN = /^sec-/;
exports.UNSIGNABLE_PATTERNS = [/^proxy-/i, /^sec-/i];
exports.ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
exports.ALGORITHM_IDENTIFIER_V4A = "AWS4-ECDSA-P256-SHA256";
exports.EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
exports.UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
exports.MAX_CACHE_SIZE = 50;
exports.KEY_TYPE_IDENTIFIER = "aws4_request";
exports.MAX_PRESIGNED_TTL = 60 * 60 * 24 * 7;


/***/ }),

/***/ 1424:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clearCredentialCache = exports.getSigningKey = exports.createScope = void 0;
const util_hex_encoding_1 = __nccwpck_require__(1968);
const util_utf8_1 = __nccwpck_require__(2855);
const constants_1 = __nccwpck_require__(342);
const signingKeyCache = {};
const cacheQueue = [];
const createScope = (shortDate, region, service) => `${shortDate}/${region}/${service}/${constants_1.KEY_TYPE_IDENTIFIER}`;
exports.createScope = createScope;
const getSigningKey = async (sha256Constructor, credentials, shortDate, region, service) => {
    const credsHash = await hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId);
    const cacheKey = `${shortDate}:${region}:${service}:${(0, util_hex_encoding_1.toHex)(credsHash)}:${credentials.sessionToken}`;
    if (cacheKey in signingKeyCache) {
        return signingKeyCache[cacheKey];
    }
    cacheQueue.push(cacheKey);
    while (cacheQueue.length > constants_1.MAX_CACHE_SIZE) {
        delete signingKeyCache[cacheQueue.shift()];
    }
    let key = `AWS4${credentials.secretAccessKey}`;
    for (const signable of [shortDate, region, service, constants_1.KEY_TYPE_IDENTIFIER]) {
        key = await hmac(sha256Constructor, key, signable);
    }
    return (signingKeyCache[cacheKey] = key);
};
exports.getSigningKey = getSigningKey;
const clearCredentialCache = () => {
    cacheQueue.length = 0;
    Object.keys(signingKeyCache).forEach((cacheKey) => {
        delete signingKeyCache[cacheKey];
    });
};
exports.clearCredentialCache = clearCredentialCache;
const hmac = (ctor, secret, data) => {
    const hash = new ctor(secret);
    hash.update((0, util_utf8_1.toUint8Array)(data));
    return hash.digest();
};


/***/ }),

/***/ 3590:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCanonicalHeaders = void 0;
const constants_1 = __nccwpck_require__(342);
const getCanonicalHeaders = ({ headers }, unsignableHeaders, signableHeaders) => {
    const canonical = {};
    for (const headerName of Object.keys(headers).sort()) {
        if (headers[headerName] == undefined) {
            continue;
        }
        const canonicalHeaderName = headerName.toLowerCase();
        if (canonicalHeaderName in constants_1.ALWAYS_UNSIGNABLE_HEADERS ||
            (unsignableHeaders === null || unsignableHeaders === void 0 ? void 0 : unsignableHeaders.has(canonicalHeaderName)) ||
            constants_1.PROXY_HEADER_PATTERN.test(canonicalHeaderName) ||
            constants_1.SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
            if (!signableHeaders || (signableHeaders && !signableHeaders.has(canonicalHeaderName))) {
                continue;
            }
        }
        canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
    }
    return canonical;
};
exports.getCanonicalHeaders = getCanonicalHeaders;


/***/ }),

/***/ 2019:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCanonicalQuery = void 0;
const util_uri_escape_1 = __nccwpck_require__(7952);
const constants_1 = __nccwpck_require__(342);
const getCanonicalQuery = ({ query = {} }) => {
    const keys = [];
    const serialized = {};
    for (const key of Object.keys(query).sort()) {
        if (key.toLowerCase() === constants_1.SIGNATURE_HEADER) {
            continue;
        }
        keys.push(key);
        const value = query[key];
        if (typeof value === "string") {
            serialized[key] = `${(0, util_uri_escape_1.escapeUri)(key)}=${(0, util_uri_escape_1.escapeUri)(value)}`;
        }
        else if (Array.isArray(value)) {
            serialized[key] = value
                .slice(0)
                .sort()
                .reduce((encoded, value) => encoded.concat([`${(0, util_uri_escape_1.escapeUri)(key)}=${(0, util_uri_escape_1.escapeUri)(value)}`]), [])
                .join("&");
        }
    }
    return keys
        .map((key) => serialized[key])
        .filter((serialized) => serialized)
        .join("&");
};
exports.getCanonicalQuery = getCanonicalQuery;


/***/ }),

/***/ 7080:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPayloadHash = void 0;
const is_array_buffer_1 = __nccwpck_require__(9126);
const util_hex_encoding_1 = __nccwpck_require__(1968);
const util_utf8_1 = __nccwpck_require__(2855);
const constants_1 = __nccwpck_require__(342);
const getPayloadHash = async ({ headers, body }, hashConstructor) => {
    for (const headerName of Object.keys(headers)) {
        if (headerName.toLowerCase() === constants_1.SHA256_HEADER) {
            return headers[headerName];
        }
    }
    if (body == undefined) {
        return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    }
    else if (typeof body === "string" || ArrayBuffer.isView(body) || (0, is_array_buffer_1.isArrayBuffer)(body)) {
        const hashCtor = new hashConstructor();
        hashCtor.update((0, util_utf8_1.toUint8Array)(body));
        return (0, util_hex_encoding_1.toHex)(await hashCtor.digest());
    }
    return constants_1.UNSIGNED_PAYLOAD;
};
exports.getPayloadHash = getPayloadHash;


/***/ }),

/***/ 4120:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteHeader = exports.getHeaderValue = exports.hasHeader = void 0;
const hasHeader = (soughtHeader, headers) => {
    soughtHeader = soughtHeader.toLowerCase();
    for (const headerName of Object.keys(headers)) {
        if (soughtHeader === headerName.toLowerCase()) {
            return true;
        }
    }
    return false;
};
exports.hasHeader = hasHeader;
const getHeaderValue = (soughtHeader, headers) => {
    soughtHeader = soughtHeader.toLowerCase();
    for (const headerName of Object.keys(headers)) {
        if (soughtHeader === headerName.toLowerCase()) {
            return headers[headerName];
        }
    }
    return undefined;
};
exports.getHeaderValue = getHeaderValue;
const deleteHeader = (soughtHeader, headers) => {
    soughtHeader = soughtHeader.toLowerCase();
    for (const headerName of Object.keys(headers)) {
        if (soughtHeader === headerName.toLowerCase()) {
            delete headers[headerName];
        }
    }
};
exports.deleteHeader = deleteHeader;


/***/ }),

/***/ 4275:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareRequest = exports.moveHeadersToQuery = exports.getPayloadHash = exports.getCanonicalQuery = exports.getCanonicalHeaders = void 0;
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(5086), exports);
var getCanonicalHeaders_1 = __nccwpck_require__(3590);
Object.defineProperty(exports, "getCanonicalHeaders", ({ enumerable: true, get: function () { return getCanonicalHeaders_1.getCanonicalHeaders; } }));
var getCanonicalQuery_1 = __nccwpck_require__(2019);
Object.defineProperty(exports, "getCanonicalQuery", ({ enumerable: true, get: function () { return getCanonicalQuery_1.getCanonicalQuery; } }));
var getPayloadHash_1 = __nccwpck_require__(7080);
Object.defineProperty(exports, "getPayloadHash", ({ enumerable: true, get: function () { return getPayloadHash_1.getPayloadHash; } }));
var moveHeadersToQuery_1 = __nccwpck_require__(8201);
Object.defineProperty(exports, "moveHeadersToQuery", ({ enumerable: true, get: function () { return moveHeadersToQuery_1.moveHeadersToQuery; } }));
var prepareRequest_1 = __nccwpck_require__(5772);
Object.defineProperty(exports, "prepareRequest", ({ enumerable: true, get: function () { return prepareRequest_1.prepareRequest; } }));
tslib_1.__exportStar(__nccwpck_require__(1424), exports);


/***/ }),

/***/ 8201:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.moveHeadersToQuery = void 0;
const cloneRequest_1 = __nccwpck_require__(3141);
const moveHeadersToQuery = (request, options = {}) => {
    var _a;
    const { headers, query = {} } = typeof request.clone === "function" ? request.clone() : (0, cloneRequest_1.cloneRequest)(request);
    for (const name of Object.keys(headers)) {
        const lname = name.toLowerCase();
        if (lname.slice(0, 6) === "x-amz-" && !((_a = options.unhoistableHeaders) === null || _a === void 0 ? void 0 : _a.has(lname))) {
            query[name] = headers[name];
            delete headers[name];
        }
    }
    return {
        ...request,
        headers,
        query,
    };
};
exports.moveHeadersToQuery = moveHeadersToQuery;


/***/ }),

/***/ 5772:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareRequest = void 0;
const cloneRequest_1 = __nccwpck_require__(3141);
const constants_1 = __nccwpck_require__(342);
const prepareRequest = (request) => {
    request = typeof request.clone === "function" ? request.clone() : (0, cloneRequest_1.cloneRequest)(request);
    for (const headerName of Object.keys(request.headers)) {
        if (constants_1.GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
            delete request.headers[headerName];
        }
    }
    return request;
};
exports.prepareRequest = prepareRequest;


/***/ }),

/***/ 4799:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toDate = exports.iso8601 = void 0;
const iso8601 = (time) => (0, exports.toDate)(time)
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z");
exports.iso8601 = iso8601;
const toDate = (time) => {
    if (typeof time === "number") {
        return new Date(time * 1000);
    }
    if (typeof time === "string") {
        if (Number(time)) {
            return new Date(Number(time) * 1000);
        }
        return new Date(time);
    }
    return time;
};
exports.toDate = toDate;


/***/ }),

/***/ 8571:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoOpLogger = void 0;
class NoOpLogger {
    trace() { }
    debug() { }
    info() { }
    warn() { }
    error() { }
}
exports.NoOpLogger = NoOpLogger;


/***/ }),

/***/ 6034:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Client = void 0;
const middleware_stack_1 = __nccwpck_require__(1461);
class Client {
    constructor(config) {
        this.middlewareStack = (0, middleware_stack_1.constructStack)();
        this.config = config;
    }
    send(command, optionsOrCb, cb) {
        const options = typeof optionsOrCb !== "function" ? optionsOrCb : undefined;
        const callback = typeof optionsOrCb === "function" ? optionsOrCb : cb;
        const handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
        if (callback) {
            handler(command)
                .then((result) => callback(null, result.output), (err) => callback(err))
                .catch(() => { });
        }
        else {
            return handler(command).then((result) => result.output);
        }
    }
    destroy() {
        if (this.config.requestHandler.destroy)
            this.config.requestHandler.destroy();
    }
}
exports.Client = Client;


/***/ }),

/***/ 4014:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Command = void 0;
const middleware_stack_1 = __nccwpck_require__(1461);
class Command {
    constructor() {
        this.middlewareStack = (0, middleware_stack_1.constructStack)();
    }
}
exports.Command = Command;


/***/ }),

/***/ 8392:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SENSITIVE_STRING = void 0;
exports.SENSITIVE_STRING = "***SensitiveInformation***";


/***/ }),

/***/ 4695:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseEpochTimestamp = exports.parseRfc7231DateTime = exports.parseRfc3339DateTimeWithOffset = exports.parseRfc3339DateTime = exports.dateToUtcString = void 0;
const parse_utils_1 = __nccwpck_require__(4809);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function dateToUtcString(date) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const dayOfWeek = date.getUTCDay();
    const dayOfMonthInt = date.getUTCDate();
    const hoursInt = date.getUTCHours();
    const minutesInt = date.getUTCMinutes();
    const secondsInt = date.getUTCSeconds();
    const dayOfMonthString = dayOfMonthInt < 10 ? `0${dayOfMonthInt}` : `${dayOfMonthInt}`;
    const hoursString = hoursInt < 10 ? `0${hoursInt}` : `${hoursInt}`;
    const minutesString = minutesInt < 10 ? `0${minutesInt}` : `${minutesInt}`;
    const secondsString = secondsInt < 10 ? `0${secondsInt}` : `${secondsInt}`;
    return `${DAYS[dayOfWeek]}, ${dayOfMonthString} ${MONTHS[month]} ${year} ${hoursString}:${minutesString}:${secondsString} GMT`;
}
exports.dateToUtcString = dateToUtcString;
const RFC3339 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/);
const parseRfc3339DateTime = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value !== "string") {
        throw new TypeError("RFC-3339 date-times must be expressed as strings");
    }
    const match = RFC3339.exec(value);
    if (!match) {
        throw new TypeError("Invalid RFC-3339 date-time value");
    }
    const [_, yearStr, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds] = match;
    const year = (0, parse_utils_1.strictParseShort)(stripLeadingZeroes(yearStr));
    const month = parseDateValue(monthStr, "month", 1, 12);
    const day = parseDateValue(dayStr, "day", 1, 31);
    return buildDate(year, month, day, { hours, minutes, seconds, fractionalMilliseconds });
};
exports.parseRfc3339DateTime = parseRfc3339DateTime;
const RFC3339_WITH_OFFSET = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/);
const parseRfc3339DateTimeWithOffset = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value !== "string") {
        throw new TypeError("RFC-3339 date-times must be expressed as strings");
    }
    const match = RFC3339_WITH_OFFSET.exec(value);
    if (!match) {
        throw new TypeError("Invalid RFC-3339 date-time value");
    }
    const [_, yearStr, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, offsetStr] = match;
    const year = (0, parse_utils_1.strictParseShort)(stripLeadingZeroes(yearStr));
    const month = parseDateValue(monthStr, "month", 1, 12);
    const day = parseDateValue(dayStr, "day", 1, 31);
    const date = buildDate(year, month, day, { hours, minutes, seconds, fractionalMilliseconds });
    if (offsetStr.toUpperCase() != "Z") {
        date.setTime(date.getTime() - parseOffsetToMilliseconds(offsetStr));
    }
    return date;
};
exports.parseRfc3339DateTimeWithOffset = parseRfc3339DateTimeWithOffset;
const IMF_FIXDATE = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
const RFC_850_DATE = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
const ASC_TIME = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/);
const parseRfc7231DateTime = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value !== "string") {
        throw new TypeError("RFC-7231 date-times must be expressed as strings");
    }
    let match = IMF_FIXDATE.exec(value);
    if (match) {
        const [_, dayStr, monthStr, yearStr, hours, minutes, seconds, fractionalMilliseconds] = match;
        return buildDate((0, parse_utils_1.strictParseShort)(stripLeadingZeroes(yearStr)), parseMonthByShortName(monthStr), parseDateValue(dayStr, "day", 1, 31), { hours, minutes, seconds, fractionalMilliseconds });
    }
    match = RFC_850_DATE.exec(value);
    if (match) {
        const [_, dayStr, monthStr, yearStr, hours, minutes, seconds, fractionalMilliseconds] = match;
        return adjustRfc850Year(buildDate(parseTwoDigitYear(yearStr), parseMonthByShortName(monthStr), parseDateValue(dayStr, "day", 1, 31), {
            hours,
            minutes,
            seconds,
            fractionalMilliseconds,
        }));
    }
    match = ASC_TIME.exec(value);
    if (match) {
        const [_, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, yearStr] = match;
        return buildDate((0, parse_utils_1.strictParseShort)(stripLeadingZeroes(yearStr)), parseMonthByShortName(monthStr), parseDateValue(dayStr.trimLeft(), "day", 1, 31), { hours, minutes, seconds, fractionalMilliseconds });
    }
    throw new TypeError("Invalid RFC-7231 date-time value");
};
exports.parseRfc7231DateTime = parseRfc7231DateTime;
const parseEpochTimestamp = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    let valueAsDouble;
    if (typeof value === "number") {
        valueAsDouble = value;
    }
    else if (typeof value === "string") {
        valueAsDouble = (0, parse_utils_1.strictParseDouble)(value);
    }
    else {
        throw new TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
    }
    if (Number.isNaN(valueAsDouble) || valueAsDouble === Infinity || valueAsDouble === -Infinity) {
        throw new TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
    }
    return new Date(Math.round(valueAsDouble * 1000));
};
exports.parseEpochTimestamp = parseEpochTimestamp;
const buildDate = (year, month, day, time) => {
    const adjustedMonth = month - 1;
    validateDayOfMonth(year, adjustedMonth, day);
    return new Date(Date.UTC(year, adjustedMonth, day, parseDateValue(time.hours, "hour", 0, 23), parseDateValue(time.minutes, "minute", 0, 59), parseDateValue(time.seconds, "seconds", 0, 60), parseMilliseconds(time.fractionalMilliseconds)));
};
const parseTwoDigitYear = (value) => {
    const thisYear = new Date().getUTCFullYear();
    const valueInThisCentury = Math.floor(thisYear / 100) * 100 + (0, parse_utils_1.strictParseShort)(stripLeadingZeroes(value));
    if (valueInThisCentury < thisYear) {
        return valueInThisCentury + 100;
    }
    return valueInThisCentury;
};
const FIFTY_YEARS_IN_MILLIS = 50 * 365 * 24 * 60 * 60 * 1000;
const adjustRfc850Year = (input) => {
    if (input.getTime() - new Date().getTime() > FIFTY_YEARS_IN_MILLIS) {
        return new Date(Date.UTC(input.getUTCFullYear() - 100, input.getUTCMonth(), input.getUTCDate(), input.getUTCHours(), input.getUTCMinutes(), input.getUTCSeconds(), input.getUTCMilliseconds()));
    }
    return input;
};
const parseMonthByShortName = (value) => {
    const monthIdx = MONTHS.indexOf(value);
    if (monthIdx < 0) {
        throw new TypeError(`Invalid month: ${value}`);
    }
    return monthIdx + 1;
};
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const validateDayOfMonth = (year, month, day) => {
    let maxDays = DAYS_IN_MONTH[month];
    if (month === 1 && isLeapYear(year)) {
        maxDays = 29;
    }
    if (day > maxDays) {
        throw new TypeError(`Invalid day for ${MONTHS[month]} in ${year}: ${day}`);
    }
};
const isLeapYear = (year) => {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};
const parseDateValue = (value, type, lower, upper) => {
    const dateVal = (0, parse_utils_1.strictParseByte)(stripLeadingZeroes(value));
    if (dateVal < lower || dateVal > upper) {
        throw new TypeError(`${type} must be between ${lower} and ${upper}, inclusive`);
    }
    return dateVal;
};
const parseMilliseconds = (value) => {
    if (value === null || value === undefined) {
        return 0;
    }
    return (0, parse_utils_1.strictParseFloat32)("0." + value) * 1000;
};
const parseOffsetToMilliseconds = (value) => {
    const directionStr = value[0];
    let direction = 1;
    if (directionStr == "+") {
        direction = 1;
    }
    else if (directionStr == "-") {
        direction = -1;
    }
    else {
        throw new TypeError(`Offset direction, ${directionStr}, must be "+" or "-"`);
    }
    const hour = Number(value.substring(1, 3));
    const minute = Number(value.substring(4, 6));
    return direction * (hour * 60 + minute) * 60 * 1000;
};
const stripLeadingZeroes = (value) => {
    let idx = 0;
    while (idx < value.length - 1 && value.charAt(idx) === "0") {
        idx++;
    }
    if (idx === 0) {
        return value;
    }
    return value.slice(idx);
};


/***/ }),

/***/ 7222:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.throwDefaultError = void 0;
const exceptions_1 = __nccwpck_require__(7778);
const throwDefaultError = ({ output, parsedBody, exceptionCtor, errorCode }) => {
    const $metadata = deserializeMetadata(output);
    const statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : undefined;
    const response = new exceptionCtor({
        name: (parsedBody === null || parsedBody === void 0 ? void 0 : parsedBody.code) || (parsedBody === null || parsedBody === void 0 ? void 0 : parsedBody.Code) || errorCode || statusCode || "UnknownError",
        $fault: "client",
        $metadata,
    });
    throw (0, exceptions_1.decorateServiceException)(response, parsedBody);
};
exports.throwDefaultError = throwDefaultError;
const deserializeMetadata = (output) => {
    var _a, _b;
    return ({
        httpStatusCode: output.statusCode,
        requestId: (_b = (_a = output.headers["x-amzn-requestid"]) !== null && _a !== void 0 ? _a : output.headers["x-amzn-request-id"]) !== null && _b !== void 0 ? _b : output.headers["x-amz-request-id"],
        extendedRequestId: output.headers["x-amz-id-2"],
        cfId: output.headers["x-amz-cf-id"],
    });
};


/***/ }),

/***/ 3088:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadConfigsForDefaultMode = void 0;
const loadConfigsForDefaultMode = (mode) => {
    switch (mode) {
        case "standard":
            return {
                retryMode: "standard",
                connectionTimeout: 3100,
            };
        case "in-region":
            return {
                retryMode: "standard",
                connectionTimeout: 1100,
            };
        case "cross-region":
            return {
                retryMode: "standard",
                connectionTimeout: 3100,
            };
        case "mobile":
            return {
                retryMode: "standard",
                connectionTimeout: 30000,
            };
        default:
            return {};
    }
};
exports.loadConfigsForDefaultMode = loadConfigsForDefaultMode;


/***/ }),

/***/ 2363:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.emitWarningIfUnsupportedVersion = void 0;
let warningEmitted = false;
const emitWarningIfUnsupportedVersion = (version) => {
    if (version && !warningEmitted && parseInt(version.substring(1, version.indexOf("."))) < 14) {
        warningEmitted = true;
    }
};
exports.emitWarningIfUnsupportedVersion = emitWarningIfUnsupportedVersion;


/***/ }),

/***/ 7778:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decorateServiceException = exports.ServiceException = void 0;
class ServiceException extends Error {
    constructor(options) {
        super(options.message);
        Object.setPrototypeOf(this, ServiceException.prototype);
        this.name = options.name;
        this.$fault = options.$fault;
        this.$metadata = options.$metadata;
    }
}
exports.ServiceException = ServiceException;
const decorateServiceException = (exception, additions = {}) => {
    Object.entries(additions)
        .filter(([, v]) => v !== undefined)
        .forEach(([k, v]) => {
        if (exception[k] == undefined || exception[k] === "") {
            exception[k] = v;
        }
    });
    const message = exception.message || exception.Message || "UnknownError";
    exception.message = message;
    delete exception.Message;
    return exception;
};
exports.decorateServiceException = decorateServiceException;


/***/ }),

/***/ 1927:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extendedEncodeURIComponent = void 0;
function extendedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
}
exports.extendedEncodeURIComponent = extendedEncodeURIComponent;


/***/ }),

/***/ 6457:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getArrayIfSingleItem = void 0;
const getArrayIfSingleItem = (mayBeArray) => Array.isArray(mayBeArray) ? mayBeArray : [mayBeArray];
exports.getArrayIfSingleItem = getArrayIfSingleItem;


/***/ }),

/***/ 5830:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getValueFromTextNode = void 0;
const getValueFromTextNode = (obj) => {
    const textNodeName = "#text";
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key][textNodeName] !== undefined) {
            obj[key] = obj[key][textNodeName];
        }
        else if (typeof obj[key] === "object" && obj[key] !== null) {
            obj[key] = (0, exports.getValueFromTextNode)(obj[key]);
        }
    }
    return obj;
};
exports.getValueFromTextNode = getValueFromTextNode;


/***/ }),

/***/ 4963:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(8571), exports);
tslib_1.__exportStar(__nccwpck_require__(6034), exports);
tslib_1.__exportStar(__nccwpck_require__(4014), exports);
tslib_1.__exportStar(__nccwpck_require__(8392), exports);
tslib_1.__exportStar(__nccwpck_require__(4695), exports);
tslib_1.__exportStar(__nccwpck_require__(7222), exports);
tslib_1.__exportStar(__nccwpck_require__(3088), exports);
tslib_1.__exportStar(__nccwpck_require__(2363), exports);
tslib_1.__exportStar(__nccwpck_require__(7778), exports);
tslib_1.__exportStar(__nccwpck_require__(1927), exports);
tslib_1.__exportStar(__nccwpck_require__(6457), exports);
tslib_1.__exportStar(__nccwpck_require__(5830), exports);
tslib_1.__exportStar(__nccwpck_require__(3613), exports);
tslib_1.__exportStar(__nccwpck_require__(1599), exports);
tslib_1.__exportStar(__nccwpck_require__(4809), exports);
tslib_1.__exportStar(__nccwpck_require__(308), exports);
tslib_1.__exportStar(__nccwpck_require__(8000), exports);
tslib_1.__exportStar(__nccwpck_require__(8730), exports);


/***/ }),

/***/ 3613:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LazyJsonString = exports.StringWrapper = void 0;
const StringWrapper = function () {
    const Class = Object.getPrototypeOf(this).constructor;
    const Constructor = Function.bind.apply(String, [null, ...arguments]);
    const instance = new Constructor();
    Object.setPrototypeOf(instance, Class.prototype);
    return instance;
};
exports.StringWrapper = StringWrapper;
exports.StringWrapper.prototype = Object.create(String.prototype, {
    constructor: {
        value: exports.StringWrapper,
        enumerable: false,
        writable: true,
        configurable: true,
    },
});
Object.setPrototypeOf(exports.StringWrapper, String);
class LazyJsonString extends exports.StringWrapper {
    deserializeJSON() {
        return JSON.parse(super.toString());
    }
    toJSON() {
        return super.toString();
    }
    static fromObject(object) {
        if (object instanceof LazyJsonString) {
            return object;
        }
        else if (object instanceof String || typeof object === "string") {
            return new LazyJsonString(object);
        }
        return new LazyJsonString(JSON.stringify(object));
    }
}
exports.LazyJsonString = LazyJsonString;


/***/ }),

/***/ 1599:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.take = exports.convertMap = exports.map = void 0;
function map(arg0, arg1, arg2) {
    let target;
    let filter;
    let instructions;
    if (typeof arg1 === "undefined" && typeof arg2 === "undefined") {
        target = {};
        instructions = arg0;
    }
    else {
        target = arg0;
        if (typeof arg1 === "function") {
            filter = arg1;
            instructions = arg2;
            return mapWithFilter(target, filter, instructions);
        }
        else {
            instructions = arg1;
        }
    }
    for (const key of Object.keys(instructions)) {
        if (!Array.isArray(instructions[key])) {
            target[key] = instructions[key];
            continue;
        }
        applyInstruction(target, null, instructions, key);
    }
    return target;
}
exports.map = map;
const convertMap = (target) => {
    const output = {};
    for (const [k, v] of Object.entries(target || {})) {
        output[k] = [, v];
    }
    return output;
};
exports.convertMap = convertMap;
const take = (source, instructions) => {
    const out = {};
    for (const key in instructions) {
        applyInstruction(out, source, instructions, key);
    }
    return out;
};
exports.take = take;
const mapWithFilter = (target, filter, instructions) => {
    return map(target, Object.entries(instructions).reduce((_instructions, [key, value]) => {
        if (Array.isArray(value)) {
            _instructions[key] = value;
        }
        else {
            if (typeof value === "function") {
                _instructions[key] = [filter, value()];
            }
            else {
                _instructions[key] = [filter, value];
            }
        }
        return _instructions;
    }, {}));
};
const applyInstruction = (target, source, instructions, targetKey) => {
    if (source !== null) {
        let instruction = instructions[targetKey];
        if (typeof instruction === "function") {
            instruction = [, instruction];
        }
        const [filter = nonNullish, valueFn = pass, sourceKey = targetKey] = instruction;
        if ((typeof filter === "function" && filter(source[sourceKey])) || (typeof filter !== "function" && !!filter)) {
            target[targetKey] = valueFn(source[sourceKey]);
        }
        return;
    }
    let [filter, value] = instructions[targetKey];
    if (typeof value === "function") {
        let _value;
        const defaultFilterPassed = filter === undefined && (_value = value()) != null;
        const customFilterPassed = (typeof filter === "function" && !!filter(void 0)) || (typeof filter !== "function" && !!filter);
        if (defaultFilterPassed) {
            target[targetKey] = _value;
        }
        else if (customFilterPassed) {
            target[targetKey] = value();
        }
    }
    else {
        const defaultFilterPassed = filter === undefined && value != null;
        const customFilterPassed = (typeof filter === "function" && !!filter(value)) || (typeof filter !== "function" && !!filter);
        if (defaultFilterPassed || customFilterPassed) {
            target[targetKey] = value;
        }
    }
};
const nonNullish = (_) => _ != null;
const pass = (_) => _;


/***/ }),

/***/ 4809:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.logger = exports.strictParseByte = exports.strictParseShort = exports.strictParseInt32 = exports.strictParseInt = exports.strictParseLong = exports.limitedParseFloat32 = exports.limitedParseFloat = exports.handleFloat = exports.limitedParseDouble = exports.strictParseFloat32 = exports.strictParseFloat = exports.strictParseDouble = exports.expectUnion = exports.expectString = exports.expectObject = exports.expectNonNull = exports.expectByte = exports.expectShort = exports.expectInt32 = exports.expectInt = exports.expectLong = exports.expectFloat32 = exports.expectNumber = exports.expectBoolean = exports.parseBoolean = void 0;
const parseBoolean = (value) => {
    switch (value) {
        case "true":
            return true;
        case "false":
            return false;
        default:
            throw new Error(`Unable to parse boolean value "${value}"`);
    }
};
exports.parseBoolean = parseBoolean;
const expectBoolean = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "number") {
        if (value === 0 || value === 1) {
            exports.logger.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
        }
        if (value === 0) {
            return false;
        }
        if (value === 1) {
            return true;
        }
    }
    if (typeof value === "string") {
        const lower = value.toLowerCase();
        if (lower === "false" || lower === "true") {
            exports.logger.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
        }
        if (lower === "false") {
            return false;
        }
        if (lower === "true") {
            return true;
        }
    }
    if (typeof value === "boolean") {
        return value;
    }
    throw new TypeError(`Expected boolean, got ${typeof value}: ${value}`);
};
exports.expectBoolean = expectBoolean;
const expectNumber = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "string") {
        const parsed = parseFloat(value);
        if (!Number.isNaN(parsed)) {
            if (String(parsed) !== String(value)) {
                exports.logger.warn(stackTraceWarning(`Expected number but observed string: ${value}`));
            }
            return parsed;
        }
    }
    if (typeof value === "number") {
        return value;
    }
    throw new TypeError(`Expected number, got ${typeof value}: ${value}`);
};
exports.expectNumber = expectNumber;
const MAX_FLOAT = Math.ceil(2 ** 127 * (2 - 2 ** -23));
const expectFloat32 = (value) => {
    const expected = (0, exports.expectNumber)(value);
    if (expected !== undefined && !Number.isNaN(expected) && expected !== Infinity && expected !== -Infinity) {
        if (Math.abs(expected) > MAX_FLOAT) {
            throw new TypeError(`Expected 32-bit float, got ${value}`);
        }
    }
    return expected;
};
exports.expectFloat32 = expectFloat32;
const expectLong = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (Number.isInteger(value) && !Number.isNaN(value)) {
        return value;
    }
    throw new TypeError(`Expected integer, got ${typeof value}: ${value}`);
};
exports.expectLong = expectLong;
exports.expectInt = exports.expectLong;
const expectInt32 = (value) => expectSizedInt(value, 32);
exports.expectInt32 = expectInt32;
const expectShort = (value) => expectSizedInt(value, 16);
exports.expectShort = expectShort;
const expectByte = (value) => expectSizedInt(value, 8);
exports.expectByte = expectByte;
const expectSizedInt = (value, size) => {
    const expected = (0, exports.expectLong)(value);
    if (expected !== undefined && castInt(expected, size) !== expected) {
        throw new TypeError(`Expected ${size}-bit integer, got ${value}`);
    }
    return expected;
};
const castInt = (value, size) => {
    switch (size) {
        case 32:
            return Int32Array.of(value)[0];
        case 16:
            return Int16Array.of(value)[0];
        case 8:
            return Int8Array.of(value)[0];
    }
};
const expectNonNull = (value, location) => {
    if (value === null || value === undefined) {
        if (location) {
            throw new TypeError(`Expected a non-null value for ${location}`);
        }
        throw new TypeError("Expected a non-null value");
    }
    return value;
};
exports.expectNonNull = expectNonNull;
const expectObject = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    const receivedType = Array.isArray(value) ? "array" : typeof value;
    throw new TypeError(`Expected object, got ${receivedType}: ${value}`);
};
exports.expectObject = expectObject;
const expectString = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "string") {
        return value;
    }
    if (["boolean", "number", "bigint"].includes(typeof value)) {
        exports.logger.warn(stackTraceWarning(`Expected string, got ${typeof value}: ${value}`));
        return String(value);
    }
    throw new TypeError(`Expected string, got ${typeof value}: ${value}`);
};
exports.expectString = expectString;
const expectUnion = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    const asObject = (0, exports.expectObject)(value);
    const setKeys = Object.entries(asObject)
        .filter(([, v]) => v != null)
        .map(([k]) => k);
    if (setKeys.length === 0) {
        throw new TypeError(`Unions must have exactly one non-null member. None were found.`);
    }
    if (setKeys.length > 1) {
        throw new TypeError(`Unions must have exactly one non-null member. Keys ${setKeys} were not null.`);
    }
    return asObject;
};
exports.expectUnion = expectUnion;
const strictParseDouble = (value) => {
    if (typeof value == "string") {
        return (0, exports.expectNumber)(parseNumber(value));
    }
    return (0, exports.expectNumber)(value);
};
exports.strictParseDouble = strictParseDouble;
exports.strictParseFloat = exports.strictParseDouble;
const strictParseFloat32 = (value) => {
    if (typeof value == "string") {
        return (0, exports.expectFloat32)(parseNumber(value));
    }
    return (0, exports.expectFloat32)(value);
};
exports.strictParseFloat32 = strictParseFloat32;
const NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g;
const parseNumber = (value) => {
    const matches = value.match(NUMBER_REGEX);
    if (matches === null || matches[0].length !== value.length) {
        throw new TypeError(`Expected real number, got implicit NaN`);
    }
    return parseFloat(value);
};
const limitedParseDouble = (value) => {
    if (typeof value == "string") {
        return parseFloatString(value);
    }
    return (0, exports.expectNumber)(value);
};
exports.limitedParseDouble = limitedParseDouble;
exports.handleFloat = exports.limitedParseDouble;
exports.limitedParseFloat = exports.limitedParseDouble;
const limitedParseFloat32 = (value) => {
    if (typeof value == "string") {
        return parseFloatString(value);
    }
    return (0, exports.expectFloat32)(value);
};
exports.limitedParseFloat32 = limitedParseFloat32;
const parseFloatString = (value) => {
    switch (value) {
        case "NaN":
            return NaN;
        case "Infinity":
            return Infinity;
        case "-Infinity":
            return -Infinity;
        default:
            throw new Error(`Unable to parse float value: ${value}`);
    }
};
const strictParseLong = (value) => {
    if (typeof value === "string") {
        return (0, exports.expectLong)(parseNumber(value));
    }
    return (0, exports.expectLong)(value);
};
exports.strictParseLong = strictParseLong;
exports.strictParseInt = exports.strictParseLong;
const strictParseInt32 = (value) => {
    if (typeof value === "string") {
        return (0, exports.expectInt32)(parseNumber(value));
    }
    return (0, exports.expectInt32)(value);
};
exports.strictParseInt32 = strictParseInt32;
const strictParseShort = (value) => {
    if (typeof value === "string") {
        return (0, exports.expectShort)(parseNumber(value));
    }
    return (0, exports.expectShort)(value);
};
exports.strictParseShort = strictParseShort;
const strictParseByte = (value) => {
    if (typeof value === "string") {
        return (0, exports.expectByte)(parseNumber(value));
    }
    return (0, exports.expectByte)(value);
};
exports.strictParseByte = strictParseByte;
const stackTraceWarning = (message) => {
    return String(new TypeError(message).stack || message)
        .split("\n")
        .slice(0, 5)
        .filter((s) => !s.includes("stackTraceWarning"))
        .join("\n");
};
exports.logger = {
    warn: console.warn,
};


/***/ }),

/***/ 308:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolvedPath = void 0;
const extended_encode_uri_component_1 = __nccwpck_require__(1927);
const resolvedPath = (resolvedPath, input, memberName, labelValueProvider, uriLabel, isGreedyLabel) => {
    if (input != null && input[memberName] !== undefined) {
        const labelValue = labelValueProvider();
        if (labelValue.length <= 0) {
            throw new Error("Empty value provided for input HTTP label: " + memberName + ".");
        }
        resolvedPath = resolvedPath.replace(uriLabel, isGreedyLabel
            ? labelValue
                .split("/")
                .map((segment) => (0, extended_encode_uri_component_1.extendedEncodeURIComponent)(segment))
                .join("/")
            : (0, extended_encode_uri_component_1.extendedEncodeURIComponent)(labelValue));
    }
    else {
        throw new Error("No value provided for input HTTP label: " + memberName + ".");
    }
    return resolvedPath;
};
exports.resolvedPath = resolvedPath;


/***/ }),

/***/ 8000:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.serializeFloat = void 0;
const serializeFloat = (value) => {
    if (value !== value) {
        return "NaN";
    }
    switch (value) {
        case Infinity:
            return "Infinity";
        case -Infinity:
            return "-Infinity";
        default:
            return value;
    }
};
exports.serializeFloat = serializeFloat;


/***/ }),

/***/ 8730:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.splitEvery = void 0;
function splitEvery(value, delimiter, numDelimiters) {
    if (numDelimiters <= 0 || !Number.isInteger(numDelimiters)) {
        throw new Error("Invalid number of delimiters (" + numDelimiters + ") for splitEvery.");
    }
    const segments = value.split(delimiter);
    if (numDelimiters === 1) {
        return segments;
    }
    const compoundSegments = [];
    let currentSegment = "";
    for (let i = 0; i < segments.length; i++) {
        if (currentSegment === "") {
            currentSegment = segments[i];
        }
        else {
            currentSegment += delimiter + segments[i];
        }
        if ((i + 1) % numDelimiters === 0) {
            compoundSegments.push(currentSegment);
            currentSegment = "";
        }
    }
    if (currentSegment !== "") {
        compoundSegments.push(currentSegment);
    }
    return compoundSegments;
}
exports.splitEvery = splitEvery;


/***/ }),

/***/ 2242:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.REFRESH_MESSAGE = exports.EXPIRE_WINDOW_MS = void 0;
exports.EXPIRE_WINDOW_MS = 5 * 60 * 1000;
exports.REFRESH_MESSAGE = `To refresh this SSO session run 'aws sso login' with the corresponding profile.`;


/***/ }),

/***/ 5125:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromSso = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const shared_ini_file_loader_1 = __nccwpck_require__(7387);
const constants_1 = __nccwpck_require__(2242);
const getNewSsoOidcToken_1 = __nccwpck_require__(3601);
const validateTokenExpiry_1 = __nccwpck_require__(8418);
const validateTokenKey_1 = __nccwpck_require__(2488);
const writeSSOTokenToFile_1 = __nccwpck_require__(8552);
const lastRefreshAttemptTime = new Date(0);
const fromSso = (init = {}) => async () => {
    const profiles = await (0, shared_ini_file_loader_1.parseKnownFiles)(init);
    const profileName = (0, shared_ini_file_loader_1.getProfileName)(init);
    const profile = profiles[profileName];
    if (!profile) {
        throw new property_provider_1.TokenProviderError(`Profile '${profileName}' could not be found in shared credentials file.`, false);
    }
    else if (!profile["sso_session"]) {
        throw new property_provider_1.TokenProviderError(`Profile '${profileName}' is missing required property 'sso_session'.`);
    }
    const ssoSessionName = profile["sso_session"];
    const ssoSessions = await (0, shared_ini_file_loader_1.loadSsoSessionData)(init);
    const ssoSession = ssoSessions[ssoSessionName];
    if (!ssoSession) {
        throw new property_provider_1.TokenProviderError(`Sso session '${ssoSessionName}' could not be found in shared credentials file.`, false);
    }
    for (const ssoSessionRequiredKey of ["sso_start_url", "sso_region"]) {
        if (!ssoSession[ssoSessionRequiredKey]) {
            throw new property_provider_1.TokenProviderError(`Sso session '${ssoSessionName}' is missing required property '${ssoSessionRequiredKey}'.`, false);
        }
    }
    const ssoStartUrl = ssoSession["sso_start_url"];
    const ssoRegion = ssoSession["sso_region"];
    let ssoToken;
    try {
        ssoToken = await (0, shared_ini_file_loader_1.getSSOTokenFromFile)(ssoSessionName);
    }
    catch (e) {
        throw new property_provider_1.TokenProviderError(`The SSO session token associated with profile=${profileName} was not found or is invalid. ${constants_1.REFRESH_MESSAGE}`, false);
    }
    (0, validateTokenKey_1.validateTokenKey)("accessToken", ssoToken.accessToken);
    (0, validateTokenKey_1.validateTokenKey)("expiresAt", ssoToken.expiresAt);
    const { accessToken, expiresAt } = ssoToken;
    const existingToken = { token: accessToken, expiration: new Date(expiresAt) };
    if (existingToken.expiration.getTime() - Date.now() > constants_1.EXPIRE_WINDOW_MS) {
        return existingToken;
    }
    if (Date.now() - lastRefreshAttemptTime.getTime() < 30 * 1000) {
        (0, validateTokenExpiry_1.validateTokenExpiry)(existingToken);
        return existingToken;
    }
    (0, validateTokenKey_1.validateTokenKey)("clientId", ssoToken.clientId, true);
    (0, validateTokenKey_1.validateTokenKey)("clientSecret", ssoToken.clientSecret, true);
    (0, validateTokenKey_1.validateTokenKey)("refreshToken", ssoToken.refreshToken, true);
    try {
        lastRefreshAttemptTime.setTime(Date.now());
        const newSsoOidcToken = await (0, getNewSsoOidcToken_1.getNewSsoOidcToken)(ssoToken, ssoRegion);
        (0, validateTokenKey_1.validateTokenKey)("accessToken", newSsoOidcToken.accessToken);
        (0, validateTokenKey_1.validateTokenKey)("expiresIn", newSsoOidcToken.expiresIn);
        const newTokenExpiration = new Date(Date.now() + newSsoOidcToken.expiresIn * 1000);
        try {
            await (0, writeSSOTokenToFile_1.writeSSOTokenToFile)(ssoSessionName, {
                ...ssoToken,
                accessToken: newSsoOidcToken.accessToken,
                expiresAt: newTokenExpiration.toISOString(),
                refreshToken: newSsoOidcToken.refreshToken,
            });
        }
        catch (error) {
        }
        return {
            token: newSsoOidcToken.accessToken,
            expiration: newTokenExpiration,
        };
    }
    catch (error) {
        (0, validateTokenExpiry_1.validateTokenExpiry)(existingToken);
        return existingToken;
    }
};
exports.fromSso = fromSso;


/***/ }),

/***/ 3258:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromStatic = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const fromStatic = ({ token }) => async () => {
    if (!token || !token.token) {
        throw new property_provider_1.TokenProviderError(`Please pass a valid token to fromStatic`, false);
    }
    return token;
};
exports.fromStatic = fromStatic;


/***/ }),

/***/ 3601:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getNewSsoOidcToken = void 0;
const client_sso_oidc_1 = __nccwpck_require__(4527);
const getSsoOidcClient_1 = __nccwpck_require__(9775);
const getNewSsoOidcToken = (ssoToken, ssoRegion) => {
    const ssoOidcClient = (0, getSsoOidcClient_1.getSsoOidcClient)(ssoRegion);
    return ssoOidcClient.send(new client_sso_oidc_1.CreateTokenCommand({
        clientId: ssoToken.clientId,
        clientSecret: ssoToken.clientSecret,
        refreshToken: ssoToken.refreshToken,
        grantType: "refresh_token",
    }));
};
exports.getNewSsoOidcToken = getNewSsoOidcToken;


/***/ }),

/***/ 9775:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSsoOidcClient = void 0;
const client_sso_oidc_1 = __nccwpck_require__(4527);
const ssoOidcClientsHash = {};
const getSsoOidcClient = (ssoRegion) => {
    if (ssoOidcClientsHash[ssoRegion]) {
        return ssoOidcClientsHash[ssoRegion];
    }
    const ssoOidcClient = new client_sso_oidc_1.SSOOIDCClient({ region: ssoRegion });
    ssoOidcClientsHash[ssoRegion] = ssoOidcClient;
    return ssoOidcClient;
};
exports.getSsoOidcClient = getSsoOidcClient;


/***/ }),

/***/ 2843:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(5125), exports);
tslib_1.__exportStar(__nccwpck_require__(3258), exports);
tslib_1.__exportStar(__nccwpck_require__(195), exports);


/***/ }),

/***/ 195:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.nodeProvider = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const fromSso_1 = __nccwpck_require__(5125);
const nodeProvider = (init = {}) => (0, property_provider_1.memoize)((0, property_provider_1.chain)((0, fromSso_1.fromSso)(init), async () => {
    throw new property_provider_1.TokenProviderError("Could not load token from any providers", false);
}), (token) => token.expiration !== undefined && token.expiration.getTime() - Date.now() < 300000, (token) => token.expiration !== undefined);
exports.nodeProvider = nodeProvider;


/***/ }),

/***/ 8418:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateTokenExpiry = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const constants_1 = __nccwpck_require__(2242);
const validateTokenExpiry = (token) => {
    if (token.expiration && token.expiration.getTime() < Date.now()) {
        throw new property_provider_1.TokenProviderError(`Token is expired. ${constants_1.REFRESH_MESSAGE}`, false);
    }
};
exports.validateTokenExpiry = validateTokenExpiry;


/***/ }),

/***/ 2488:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateTokenKey = void 0;
const property_provider_1 = __nccwpck_require__(4462);
const constants_1 = __nccwpck_require__(2242);
const validateTokenKey = (key, value, forRefresh = false) => {
    if (typeof value === "undefined") {
        throw new property_provider_1.TokenProviderError(`Value not present for '${key}' in SSO Token${forRefresh ? ". Cannot refresh" : ""}. ${constants_1.REFRESH_MESSAGE}`, false);
    }
};
exports.validateTokenKey = validateTokenKey;


/***/ }),

/***/ 8552:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.writeSSOTokenToFile = void 0;
const shared_ini_file_loader_1 = __nccwpck_require__(7387);
const fs_1 = __nccwpck_require__(7147);
const { writeFile } = fs_1.promises;
const writeSSOTokenToFile = (id, ssoToken) => {
    const tokenFilepath = (0, shared_ini_file_loader_1.getSSOTokenFilepath)(id);
    const tokenString = JSON.stringify(ssoToken, null, 2);
    return writeFile(tokenFilepath, tokenString);
};
exports.writeSSOTokenToFile = writeSSOTokenToFile;


/***/ }),

/***/ 2562:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 6913:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpAuthLocation = void 0;
var HttpAuthLocation;
(function (HttpAuthLocation) {
    HttpAuthLocation["HEADER"] = "header";
    HttpAuthLocation["QUERY"] = "query";
})(HttpAuthLocation = exports.HttpAuthLocation || (exports.HttpAuthLocation = {}));


/***/ }),

/***/ 5861:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 6527:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 8470:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 3213:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 820:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(3213), exports);
tslib_1.__exportStar(__nccwpck_require__(6781), exports);
tslib_1.__exportStar(__nccwpck_require__(4515), exports);


/***/ }),

/***/ 6781:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 4515:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 7736:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 3268:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 142:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HostAddressType = void 0;
var HostAddressType;
(function (HostAddressType) {
    HostAddressType["AAAA"] = "AAAA";
    HostAddressType["A"] = "A";
})(HostAddressType = exports.HostAddressType || (exports.HostAddressType = {}));


/***/ }),

/***/ 9385:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EndpointURLScheme = void 0;
var EndpointURLScheme;
(function (EndpointURLScheme) {
    EndpointURLScheme["HTTP"] = "http";
    EndpointURLScheme["HTTPS"] = "https";
})(EndpointURLScheme = exports.EndpointURLScheme || (exports.EndpointURLScheme = {}));


/***/ }),

/***/ 7521:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 1393:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 1821:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 2635:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 1301:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 1268:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 7192:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 640:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(1821), exports);
tslib_1.__exportStar(__nccwpck_require__(2635), exports);
tslib_1.__exportStar(__nccwpck_require__(1301), exports);
tslib_1.__exportStar(__nccwpck_require__(1268), exports);
tslib_1.__exportStar(__nccwpck_require__(7192), exports);


/***/ }),

/***/ 9029:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(2562), exports);
tslib_1.__exportStar(__nccwpck_require__(6913), exports);
tslib_1.__exportStar(__nccwpck_require__(5861), exports);
tslib_1.__exportStar(__nccwpck_require__(6527), exports);
tslib_1.__exportStar(__nccwpck_require__(8470), exports);
tslib_1.__exportStar(__nccwpck_require__(820), exports);
tslib_1.__exportStar(__nccwpck_require__(7736), exports);
tslib_1.__exportStar(__nccwpck_require__(3268), exports);
tslib_1.__exportStar(__nccwpck_require__(142), exports);
tslib_1.__exportStar(__nccwpck_require__(9385), exports);
tslib_1.__exportStar(__nccwpck_require__(7521), exports);
tslib_1.__exportStar(__nccwpck_require__(1393), exports);
tslib_1.__exportStar(__nccwpck_require__(640), exports);
tslib_1.__exportStar(__nccwpck_require__(9910), exports);
tslib_1.__exportStar(__nccwpck_require__(6678), exports);
tslib_1.__exportStar(__nccwpck_require__(9931), exports);
tslib_1.__exportStar(__nccwpck_require__(2620), exports);
tslib_1.__exportStar(__nccwpck_require__(9062), exports);
tslib_1.__exportStar(__nccwpck_require__(9546), exports);
tslib_1.__exportStar(__nccwpck_require__(316), exports);
tslib_1.__exportStar(__nccwpck_require__(7835), exports);
tslib_1.__exportStar(__nccwpck_require__(1678), exports);
tslib_1.__exportStar(__nccwpck_require__(3818), exports);
tslib_1.__exportStar(__nccwpck_require__(1991), exports);
tslib_1.__exportStar(__nccwpck_require__(4296), exports);
tslib_1.__exportStar(__nccwpck_require__(9416), exports);
tslib_1.__exportStar(__nccwpck_require__(134), exports);
tslib_1.__exportStar(__nccwpck_require__(4465), exports);


/***/ }),

/***/ 9910:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 6678:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 9931:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 2620:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 9062:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 9546:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 316:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 7835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 1678:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 3818:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 1991:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 4296:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 9416:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequestHandlerProtocol = void 0;
var RequestHandlerProtocol;
(function (RequestHandlerProtocol) {
    RequestHandlerProtocol["HTTP_0_9"] = "http/0.9";
    RequestHandlerProtocol["HTTP_1_0"] = "http/1.0";
    RequestHandlerProtocol["TDS_8_0"] = "tds/8.0";
})(RequestHandlerProtocol = exports.RequestHandlerProtocol || (exports.RequestHandlerProtocol = {}));


/***/ }),

/***/ 134:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 4465:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 2992:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseUrl = void 0;
const querystring_parser_1 = __nccwpck_require__(7424);
const parseUrl = (url) => {
    if (typeof url === "string") {
        return (0, exports.parseUrl)(new URL(url));
    }
    const { hostname, pathname, port, protocol, search } = url;
    let query;
    if (search) {
        query = (0, querystring_parser_1.parseQueryString)(search);
    }
    return {
        hostname,
        port: port ? parseInt(port) : undefined,
        protocol,
        path: pathname,
        query,
    };
};
exports.parseUrl = parseUrl;


/***/ }),

/***/ 8444:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromBase64 = void 0;
const util_buffer_from_1 = __nccwpck_require__(6010);
const BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
const fromBase64 = (input) => {
    if ((input.length * 3) % 4 !== 0) {
        throw new TypeError(`Incorrect padding on base64 string.`);
    }
    if (!BASE64_REGEX.exec(input)) {
        throw new TypeError(`Invalid base64 string.`);
    }
    const buffer = (0, util_buffer_from_1.fromString)(input, "base64");
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
};
exports.fromBase64 = fromBase64;


/***/ }),

/***/ 7727:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(8444), exports);
tslib_1.__exportStar(__nccwpck_require__(3439), exports);


/***/ }),

/***/ 3439:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toBase64 = void 0;
const util_buffer_from_1 = __nccwpck_require__(6010);
const toBase64 = (input) => (0, util_buffer_from_1.fromArrayBuffer)(input.buffer, input.byteOffset, input.byteLength).toString("base64");
exports.toBase64 = toBase64;


/***/ }),

/***/ 9190:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.calculateBodyLength = void 0;
const fs_1 = __nccwpck_require__(7147);
const calculateBodyLength = (body) => {
    if (!body) {
        return 0;
    }
    if (typeof body === "string") {
        return Buffer.from(body).length;
    }
    else if (typeof body.byteLength === "number") {
        return body.byteLength;
    }
    else if (typeof body.size === "number") {
        return body.size;
    }
    else if (typeof body.path === "string" || Buffer.isBuffer(body.path)) {
        return (0, fs_1.lstatSync)(body.path).size;
    }
    else if (typeof body.fd === "number") {
        return (0, fs_1.fstatSync)(body.fd).size;
    }
    throw new Error(`Body Length computation failed for ${body}`);
};
exports.calculateBodyLength = calculateBodyLength;


/***/ }),

/***/ 4147:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(9190), exports);


/***/ }),

/***/ 6010:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromString = exports.fromArrayBuffer = void 0;
const is_array_buffer_1 = __nccwpck_require__(9126);
const buffer_1 = __nccwpck_require__(4300);
const fromArrayBuffer = (input, offset = 0, length = input.byteLength - offset) => {
    if (!(0, is_array_buffer_1.isArrayBuffer)(input)) {
        throw new TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
    }
    return buffer_1.Buffer.from(input, offset, length);
};
exports.fromArrayBuffer = fromArrayBuffer;
const fromString = (input, encoding) => {
    if (typeof input !== "string") {
        throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
    }
    return encoding ? buffer_1.Buffer.from(input, encoding) : buffer_1.Buffer.from(input);
};
exports.fromString = fromString;


/***/ }),

/***/ 9509:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.booleanSelector = exports.SelectorType = void 0;
var SelectorType;
(function (SelectorType) {
    SelectorType["ENV"] = "env";
    SelectorType["CONFIG"] = "shared config entry";
})(SelectorType = exports.SelectorType || (exports.SelectorType = {}));
const booleanSelector = (obj, key, type) => {
    if (!(key in obj))
        return undefined;
    if (obj[key] === "true")
        return true;
    if (obj[key] === "false")
        return false;
    throw new Error(`Cannot load ${type} "${key}". Expected "true" or "false", got ${obj[key]}.`);
};
exports.booleanSelector = booleanSelector;


/***/ }),

/***/ 6168:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(9509), exports);


/***/ }),

/***/ 6488:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IMDS_REGION_PATH = exports.DEFAULTS_MODE_OPTIONS = exports.ENV_IMDS_DISABLED = exports.AWS_DEFAULT_REGION_ENV = exports.AWS_REGION_ENV = exports.AWS_EXECUTION_ENV = void 0;
exports.AWS_EXECUTION_ENV = "AWS_EXECUTION_ENV";
exports.AWS_REGION_ENV = "AWS_REGION";
exports.AWS_DEFAULT_REGION_ENV = "AWS_DEFAULT_REGION";
exports.ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
exports.DEFAULTS_MODE_OPTIONS = ["in-region", "cross-region", "mobile", "standard", "legacy"];
exports.IMDS_REGION_PATH = "/latest/meta-data/placement/region";


/***/ }),

/***/ 8450:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NODE_DEFAULTS_MODE_CONFIG_OPTIONS = void 0;
const AWS_DEFAULTS_MODE_ENV = "AWS_DEFAULTS_MODE";
const AWS_DEFAULTS_MODE_CONFIG = "defaults_mode";
exports.NODE_DEFAULTS_MODE_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => {
        return env[AWS_DEFAULTS_MODE_ENV];
    },
    configFileSelector: (profile) => {
        return profile[AWS_DEFAULTS_MODE_CONFIG];
    },
    default: "legacy",
};


/***/ }),

/***/ 4243:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(8238), exports);


/***/ }),

/***/ 8238:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveDefaultsModeConfig = void 0;
const config_resolver_1 = __nccwpck_require__(6153);
const credential_provider_imds_1 = __nccwpck_require__(5898);
const node_config_provider_1 = __nccwpck_require__(7684);
const property_provider_1 = __nccwpck_require__(4462);
const constants_1 = __nccwpck_require__(6488);
const defaultsModeConfig_1 = __nccwpck_require__(8450);
const resolveDefaultsModeConfig = ({ region = (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_REGION_CONFIG_OPTIONS), defaultsMode = (0, node_config_provider_1.loadConfig)(defaultsModeConfig_1.NODE_DEFAULTS_MODE_CONFIG_OPTIONS), } = {}) => (0, property_provider_1.memoize)(async () => {
    const mode = typeof defaultsMode === "function" ? await defaultsMode() : defaultsMode;
    switch (mode === null || mode === void 0 ? void 0 : mode.toLowerCase()) {
        case "auto":
            return resolveNodeDefaultsModeAuto(region);
        case "in-region":
        case "cross-region":
        case "mobile":
        case "standard":
        case "legacy":
            return Promise.resolve(mode === null || mode === void 0 ? void 0 : mode.toLocaleLowerCase());
        case undefined:
            return Promise.resolve("legacy");
        default:
            throw new Error(`Invalid parameter for "defaultsMode", expect ${constants_1.DEFAULTS_MODE_OPTIONS.join(", ")}, got ${mode}`);
    }
});
exports.resolveDefaultsModeConfig = resolveDefaultsModeConfig;
const resolveNodeDefaultsModeAuto = async (clientRegion) => {
    if (clientRegion) {
        const resolvedRegion = typeof clientRegion === "function" ? await clientRegion() : clientRegion;
        const inferredRegion = await inferPhysicalRegion();
        if (!inferredRegion) {
            return "standard";
        }
        if (resolvedRegion === inferredRegion) {
            return "in-region";
        }
        else {
            return "cross-region";
        }
    }
    return "standard";
};
const inferPhysicalRegion = async () => {
    var _a;
    if (process.env[constants_1.AWS_EXECUTION_ENV] && (process.env[constants_1.AWS_REGION_ENV] || process.env[constants_1.AWS_DEFAULT_REGION_ENV])) {
        return (_a = process.env[constants_1.AWS_REGION_ENV]) !== null && _a !== void 0 ? _a : process.env[constants_1.AWS_DEFAULT_REGION_ENV];
    }
    if (!process.env[constants_1.ENV_IMDS_DISABLED]) {
        try {
            const endpoint = await (0, credential_provider_imds_1.getInstanceMetadataEndpoint)();
            return (await (0, credential_provider_imds_1.httpRequest)({ ...endpoint, path: constants_1.IMDS_REGION_PATH })).toString();
        }
        catch (e) {
        }
    }
};


/***/ }),

/***/ 1809:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.debugId = void 0;
exports.debugId = "endpoints";


/***/ }),

/***/ 7617:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(1809), exports);
tslib_1.__exportStar(__nccwpck_require__(6833), exports);


/***/ }),

/***/ 6833:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toDebugString = void 0;
function toDebugString(input) {
    if (typeof input !== "object" || input == null) {
        return input;
    }
    if ("ref" in input) {
        return `$${toDebugString(input.ref)}`;
    }
    if ("fn" in input) {
        return `${input.fn}(${(input.argv || []).map(toDebugString).join(", ")})`;
    }
    return JSON.stringify(input, null, 2);
}
exports.toDebugString = toDebugString;


/***/ }),

/***/ 3350:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(7482), exports);
tslib_1.__exportStar(__nccwpck_require__(6563), exports);
tslib_1.__exportStar(__nccwpck_require__(7433), exports);


/***/ }),

/***/ 6835:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(8079), exports);
tslib_1.__exportStar(__nccwpck_require__(4711), exports);
tslib_1.__exportStar(__nccwpck_require__(7482), exports);


/***/ }),

/***/ 8079:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isVirtualHostableS3Bucket = void 0;
const isIpAddress_1 = __nccwpck_require__(3442);
const isValidHostLabel_1 = __nccwpck_require__(7373);
const isVirtualHostableS3Bucket = (value, allowSubDomains = false) => {
    if (allowSubDomains) {
        for (const label of value.split(".")) {
            if (!(0, exports.isVirtualHostableS3Bucket)(label)) {
                return false;
            }
        }
        return true;
    }
    if (!(0, isValidHostLabel_1.isValidHostLabel)(value)) {
        return false;
    }
    if (value.length < 3 || value.length > 63) {
        return false;
    }
    if (value !== value.toLowerCase()) {
        return false;
    }
    if ((0, isIpAddress_1.isIpAddress)(value)) {
        return false;
    }
    return true;
};
exports.isVirtualHostableS3Bucket = isVirtualHostableS3Bucket;


/***/ }),

/***/ 4711:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseArn = void 0;
const parseArn = (value) => {
    const segments = value.split(":");
    if (segments.length < 6)
        return null;
    const [arn, partition, service, region, accountId, ...resourceId] = segments;
    if (arn !== "arn" || partition === "" || service === "" || resourceId[0] === "")
        return null;
    return {
        partition,
        service,
        region,
        accountId,
        resourceId: resourceId[0].includes("/") ? resourceId[0].split("/") : resourceId,
    };
};
exports.parseArn = parseArn;


/***/ }),

/***/ 7482:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUserAgentPrefix = exports.useDefaultPartitionInfo = exports.setPartitionInfo = exports.partition = void 0;
const tslib_1 = __nccwpck_require__(4351);
const partitions_json_1 = tslib_1.__importDefault(__nccwpck_require__(5367));
let selectedPartitionsInfo = partitions_json_1.default;
let selectedUserAgentPrefix = "";
const partition = (value) => {
    const { partitions } = selectedPartitionsInfo;
    for (const partition of partitions) {
        const { regions, outputs } = partition;
        for (const [region, regionData] of Object.entries(regions)) {
            if (region === value) {
                return {
                    ...outputs,
                    ...regionData,
                };
            }
        }
    }
    for (const partition of partitions) {
        const { regionRegex, outputs } = partition;
        if (new RegExp(regionRegex).test(value)) {
            return {
                ...outputs,
            };
        }
    }
    const DEFAULT_PARTITION = partitions.find((partition) => partition.id === "aws");
    if (!DEFAULT_PARTITION) {
        throw new Error("Provided region was not found in the partition array or regex," +
            " and default partition with id 'aws' doesn't exist.");
    }
    return {
        ...DEFAULT_PARTITION.outputs,
    };
};
exports.partition = partition;
const setPartitionInfo = (partitionsInfo, userAgentPrefix = "") => {
    selectedPartitionsInfo = partitionsInfo;
    selectedUserAgentPrefix = userAgentPrefix;
};
exports.setPartitionInfo = setPartitionInfo;
const useDefaultPartitionInfo = () => {
    (0, exports.setPartitionInfo)(partitions_json_1.default, "");
};
exports.useDefaultPartitionInfo = useDefaultPartitionInfo;
const getUserAgentPrefix = () => selectedUserAgentPrefix;
exports.getUserAgentPrefix = getUserAgentPrefix;


/***/ }),

/***/ 5370:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.booleanEquals = void 0;
const booleanEquals = (value1, value2) => value1 === value2;
exports.booleanEquals = booleanEquals;


/***/ }),

/***/ 767:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAttr = void 0;
const types_1 = __nccwpck_require__(7433);
const getAttrPathList_1 = __nccwpck_require__(1844);
const getAttr = (value, path) => (0, getAttrPathList_1.getAttrPathList)(path).reduce((acc, index) => {
    if (typeof acc !== "object") {
        throw new types_1.EndpointError(`Index '${index}' in '${path}' not found in '${JSON.stringify(value)}'`);
    }
    else if (Array.isArray(acc)) {
        return acc[parseInt(index)];
    }
    return acc[index];
}, value);
exports.getAttr = getAttr;


/***/ }),

/***/ 1844:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAttrPathList = void 0;
const types_1 = __nccwpck_require__(7433);
const getAttrPathList = (path) => {
    const parts = path.split(".");
    const pathList = [];
    for (const part of parts) {
        const squareBracketIndex = part.indexOf("[");
        if (squareBracketIndex !== -1) {
            if (part.indexOf("]") !== part.length - 1) {
                throw new types_1.EndpointError(`Path: '${path}' does not end with ']'`);
            }
            const arrayIndex = part.slice(squareBracketIndex + 1, -1);
            if (Number.isNaN(parseInt(arrayIndex))) {
                throw new types_1.EndpointError(`Invalid array index: '${arrayIndex}' in path: '${path}'`);
            }
            if (squareBracketIndex !== 0) {
                pathList.push(part.slice(0, squareBracketIndex));
            }
            pathList.push(arrayIndex);
        }
        else {
            pathList.push(part);
        }
    }
    return pathList;
};
exports.getAttrPathList = getAttrPathList;


/***/ }),

/***/ 3188:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.aws = void 0;
const tslib_1 = __nccwpck_require__(4351);
exports.aws = tslib_1.__importStar(__nccwpck_require__(6835));
tslib_1.__exportStar(__nccwpck_require__(5370), exports);
tslib_1.__exportStar(__nccwpck_require__(767), exports);
tslib_1.__exportStar(__nccwpck_require__(8816), exports);
tslib_1.__exportStar(__nccwpck_require__(7373), exports);
tslib_1.__exportStar(__nccwpck_require__(9692), exports);
tslib_1.__exportStar(__nccwpck_require__(2780), exports);
tslib_1.__exportStar(__nccwpck_require__(5182), exports);
tslib_1.__exportStar(__nccwpck_require__(8305), exports);
tslib_1.__exportStar(__nccwpck_require__(6535), exports);


/***/ }),

/***/ 3442:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isIpAddress = void 0;
const IP_V4_REGEX = new RegExp(`^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$`);
const isIpAddress = (value) => IP_V4_REGEX.test(value) || (value.startsWith("[") && value.endsWith("]"));
exports.isIpAddress = isIpAddress;


/***/ }),

/***/ 8816:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isSet = void 0;
const isSet = (value) => value != null;
exports.isSet = isSet;


/***/ }),

/***/ 7373:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isValidHostLabel = void 0;
const VALID_HOST_LABEL_REGEX = new RegExp(`^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$`);
const isValidHostLabel = (value, allowSubDomains = false) => {
    if (!allowSubDomains) {
        return VALID_HOST_LABEL_REGEX.test(value);
    }
    const labels = value.split(".");
    for (const label of labels) {
        if (!(0, exports.isValidHostLabel)(label)) {
            return false;
        }
    }
    return true;
};
exports.isValidHostLabel = isValidHostLabel;


/***/ }),

/***/ 9692:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.not = void 0;
const not = (value) => !value;
exports.not = not;


/***/ }),

/***/ 2780:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseURL = void 0;
const types_1 = __nccwpck_require__(9029);
const isIpAddress_1 = __nccwpck_require__(3442);
const DEFAULT_PORTS = {
    [types_1.EndpointURLScheme.HTTP]: 80,
    [types_1.EndpointURLScheme.HTTPS]: 443,
};
const parseURL = (value) => {
    const whatwgURL = (() => {
        try {
            if (value instanceof URL) {
                return value;
            }
            if (typeof value === "object" && "hostname" in value) {
                const { hostname, port, protocol = "", path = "", query = {} } = value;
                const url = new URL(`${protocol}//${hostname}${port ? `:${port}` : ""}${path}`);
                url.search = Object.entries(query)
                    .map(([k, v]) => `${k}=${v}`)
                    .join("&");
                return url;
            }
            return new URL(value);
        }
        catch (error) {
            return null;
        }
    })();
    if (!whatwgURL) {
        console.error(`Unable to parse ${JSON.stringify(value)} as a whatwg URL.`);
        return null;
    }
    const urlString = whatwgURL.href;
    const { host, hostname, pathname, protocol, search } = whatwgURL;
    if (search) {
        return null;
    }
    const scheme = protocol.slice(0, -1);
    if (!Object.values(types_1.EndpointURLScheme).includes(scheme)) {
        return null;
    }
    const isIp = (0, isIpAddress_1.isIpAddress)(hostname);
    const inputContainsDefaultPort = urlString.includes(`${host}:${DEFAULT_PORTS[scheme]}`) ||
        (typeof value === "string" && value.includes(`${host}:${DEFAULT_PORTS[scheme]}`));
    const authority = `${host}${inputContainsDefaultPort ? `:${DEFAULT_PORTS[scheme]}` : ``}`;
    return {
        scheme,
        authority,
        path: pathname,
        normalizedPath: pathname.endsWith("/") ? pathname : `${pathname}/`,
        isIp,
    };
};
exports.parseURL = parseURL;


/***/ }),

/***/ 5182:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stringEquals = void 0;
const stringEquals = (value1, value2) => value1 === value2;
exports.stringEquals = stringEquals;


/***/ }),

/***/ 8305:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.substring = void 0;
const substring = (input, start, stop, reverse) => {
    if (start >= stop || input.length < stop) {
        return null;
    }
    if (!reverse) {
        return input.substring(start, stop);
    }
    return input.substring(input.length - stop, input.length - start);
};
exports.substring = substring;


/***/ }),

/***/ 6535:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uriEncode = void 0;
const uriEncode = (value) => encodeURIComponent(value).replace(/[!*'()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
exports.uriEncode = uriEncode;


/***/ }),

/***/ 6563:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveEndpoint = void 0;
const debug_1 = __nccwpck_require__(7617);
const types_1 = __nccwpck_require__(7433);
const utils_1 = __nccwpck_require__(1114);
const resolveEndpoint = (ruleSetObject, options) => {
    var _a, _b, _c, _d, _e, _f;
    const { endpointParams, logger } = options;
    const { parameters, rules } = ruleSetObject;
    (_b = (_a = options.logger) === null || _a === void 0 ? void 0 : _a.debug) === null || _b === void 0 ? void 0 : _b.call(_a, debug_1.debugId, `Initial EndpointParams: ${(0, debug_1.toDebugString)(endpointParams)}`);
    const paramsWithDefault = Object.entries(parameters)
        .filter(([, v]) => v.default != null)
        .map(([k, v]) => [k, v.default]);
    if (paramsWithDefault.length > 0) {
        for (const [paramKey, paramDefaultValue] of paramsWithDefault) {
            endpointParams[paramKey] = (_c = endpointParams[paramKey]) !== null && _c !== void 0 ? _c : paramDefaultValue;
        }
    }
    const requiredParams = Object.entries(parameters)
        .filter(([, v]) => v.required)
        .map(([k]) => k);
    for (const requiredParam of requiredParams) {
        if (endpointParams[requiredParam] == null) {
            throw new types_1.EndpointError(`Missing required parameter: '${requiredParam}'`);
        }
    }
    const endpoint = (0, utils_1.evaluateRules)(rules, { endpointParams, logger, referenceRecord: {} });
    if ((_d = options.endpointParams) === null || _d === void 0 ? void 0 : _d.Endpoint) {
        try {
            const givenEndpoint = new URL(options.endpointParams.Endpoint);
            const { protocol, port } = givenEndpoint;
            endpoint.url.protocol = protocol;
            endpoint.url.port = port;
        }
        catch (e) {
        }
    }
    (_f = (_e = options.logger) === null || _e === void 0 ? void 0 : _e.debug) === null || _f === void 0 ? void 0 : _f.call(_e, debug_1.debugId, `Resolved endpoint: ${(0, debug_1.toDebugString)(endpoint)}`);
    return endpoint;
};
exports.resolveEndpoint = resolveEndpoint;


/***/ }),

/***/ 2605:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EndpointError = void 0;
class EndpointError extends Error {
    constructor(message) {
        super(message);
        this.name = "EndpointError";
    }
}
exports.EndpointError = EndpointError;


/***/ }),

/***/ 1261:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 312:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 6083:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 1767:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 7433:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(2605), exports);
tslib_1.__exportStar(__nccwpck_require__(1261), exports);
tslib_1.__exportStar(__nccwpck_require__(312), exports);
tslib_1.__exportStar(__nccwpck_require__(6083), exports);
tslib_1.__exportStar(__nccwpck_require__(1767), exports);
tslib_1.__exportStar(__nccwpck_require__(1811), exports);


/***/ }),

/***/ 1811:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 5075:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.callFunction = void 0;
const tslib_1 = __nccwpck_require__(4351);
const lib = tslib_1.__importStar(__nccwpck_require__(3188));
const evaluateExpression_1 = __nccwpck_require__(2980);
const callFunction = ({ fn, argv }, options) => {
    const evaluatedArgs = argv.map((arg) => ["boolean", "number"].includes(typeof arg) ? arg : (0, evaluateExpression_1.evaluateExpression)(arg, "arg", options));
    return fn.split(".").reduce((acc, key) => acc[key], lib)(...evaluatedArgs);
};
exports.callFunction = callFunction;


/***/ }),

/***/ 7851:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateCondition = void 0;
const debug_1 = __nccwpck_require__(7617);
const types_1 = __nccwpck_require__(7433);
const callFunction_1 = __nccwpck_require__(5075);
const evaluateCondition = ({ assign, ...fnArgs }, options) => {
    var _a, _b;
    if (assign && assign in options.referenceRecord) {
        throw new types_1.EndpointError(`'${assign}' is already defined in Reference Record.`);
    }
    const value = (0, callFunction_1.callFunction)(fnArgs, options);
    (_b = (_a = options.logger) === null || _a === void 0 ? void 0 : _a.debug) === null || _b === void 0 ? void 0 : _b.call(_a, debug_1.debugId, `evaluateCondition: ${(0, debug_1.toDebugString)(fnArgs)} = ${(0, debug_1.toDebugString)(value)}`);
    return {
        result: value === "" ? true : !!value,
        ...(assign != null && { toAssign: { name: assign, value } }),
    };
};
exports.evaluateCondition = evaluateCondition;


/***/ }),

/***/ 9169:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateConditions = void 0;
const debug_1 = __nccwpck_require__(7617);
const evaluateCondition_1 = __nccwpck_require__(7851);
const evaluateConditions = (conditions = [], options) => {
    var _a, _b;
    const conditionsReferenceRecord = {};
    for (const condition of conditions) {
        const { result, toAssign } = (0, evaluateCondition_1.evaluateCondition)(condition, {
            ...options,
            referenceRecord: {
                ...options.referenceRecord,
                ...conditionsReferenceRecord,
            },
        });
        if (!result) {
            return { result };
        }
        if (toAssign) {
            conditionsReferenceRecord[toAssign.name] = toAssign.value;
            (_b = (_a = options.logger) === null || _a === void 0 ? void 0 : _a.debug) === null || _b === void 0 ? void 0 : _b.call(_a, debug_1.debugId, `assign: ${toAssign.name} := ${(0, debug_1.toDebugString)(toAssign.value)}`);
        }
    }
    return { result: true, referenceRecord: conditionsReferenceRecord };
};
exports.evaluateConditions = evaluateConditions;


/***/ }),

/***/ 5324:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateEndpointRule = void 0;
const debug_1 = __nccwpck_require__(7617);
const evaluateConditions_1 = __nccwpck_require__(9169);
const getEndpointHeaders_1 = __nccwpck_require__(8268);
const getEndpointProperties_1 = __nccwpck_require__(4973);
const getEndpointUrl_1 = __nccwpck_require__(3602);
const evaluateEndpointRule = (endpointRule, options) => {
    var _a, _b;
    const { conditions, endpoint } = endpointRule;
    const { result, referenceRecord } = (0, evaluateConditions_1.evaluateConditions)(conditions, options);
    if (!result) {
        return;
    }
    const endpointRuleOptions = {
        ...options,
        referenceRecord: { ...options.referenceRecord, ...referenceRecord },
    };
    const { url, properties, headers } = endpoint;
    (_b = (_a = options.logger) === null || _a === void 0 ? void 0 : _a.debug) === null || _b === void 0 ? void 0 : _b.call(_a, debug_1.debugId, `Resolving endpoint from template: ${(0, debug_1.toDebugString)(endpoint)}`);
    return {
        ...(headers != undefined && {
            headers: (0, getEndpointHeaders_1.getEndpointHeaders)(headers, endpointRuleOptions),
        }),
        ...(properties != undefined && {
            properties: (0, getEndpointProperties_1.getEndpointProperties)(properties, endpointRuleOptions),
        }),
        url: (0, getEndpointUrl_1.getEndpointUrl)(url, endpointRuleOptions),
    };
};
exports.evaluateEndpointRule = evaluateEndpointRule;


/***/ }),

/***/ 2110:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateErrorRule = void 0;
const types_1 = __nccwpck_require__(7433);
const evaluateConditions_1 = __nccwpck_require__(9169);
const evaluateExpression_1 = __nccwpck_require__(2980);
const evaluateErrorRule = (errorRule, options) => {
    const { conditions, error } = errorRule;
    const { result, referenceRecord } = (0, evaluateConditions_1.evaluateConditions)(conditions, options);
    if (!result) {
        return;
    }
    throw new types_1.EndpointError((0, evaluateExpression_1.evaluateExpression)(error, "Error", {
        ...options,
        referenceRecord: { ...options.referenceRecord, ...referenceRecord },
    }));
};
exports.evaluateErrorRule = evaluateErrorRule;


/***/ }),

/***/ 2980:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateExpression = void 0;
const types_1 = __nccwpck_require__(7433);
const callFunction_1 = __nccwpck_require__(5075);
const evaluateTemplate_1 = __nccwpck_require__(7535);
const getReferenceValue_1 = __nccwpck_require__(8810);
const evaluateExpression = (obj, keyName, options) => {
    if (typeof obj === "string") {
        return (0, evaluateTemplate_1.evaluateTemplate)(obj, options);
    }
    else if (obj["fn"]) {
        return (0, callFunction_1.callFunction)(obj, options);
    }
    else if (obj["ref"]) {
        return (0, getReferenceValue_1.getReferenceValue)(obj, options);
    }
    throw new types_1.EndpointError(`'${keyName}': ${String(obj)} is not a string, function or reference.`);
};
exports.evaluateExpression = evaluateExpression;


/***/ }),

/***/ 9738:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateRules = void 0;
const types_1 = __nccwpck_require__(7433);
const evaluateEndpointRule_1 = __nccwpck_require__(5324);
const evaluateErrorRule_1 = __nccwpck_require__(2110);
const evaluateTreeRule_1 = __nccwpck_require__(6587);
const evaluateRules = (rules, options) => {
    for (const rule of rules) {
        if (rule.type === "endpoint") {
            const endpointOrUndefined = (0, evaluateEndpointRule_1.evaluateEndpointRule)(rule, options);
            if (endpointOrUndefined) {
                return endpointOrUndefined;
            }
        }
        else if (rule.type === "error") {
            (0, evaluateErrorRule_1.evaluateErrorRule)(rule, options);
        }
        else if (rule.type === "tree") {
            const endpointOrUndefined = (0, evaluateTreeRule_1.evaluateTreeRule)(rule, options);
            if (endpointOrUndefined) {
                return endpointOrUndefined;
            }
        }
        else {
            throw new types_1.EndpointError(`Unknown endpoint rule: ${rule}`);
        }
    }
    throw new types_1.EndpointError(`Rules evaluation failed`);
};
exports.evaluateRules = evaluateRules;


/***/ }),

/***/ 7535:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateTemplate = void 0;
const lib_1 = __nccwpck_require__(3188);
const evaluateTemplate = (template, options) => {
    const evaluatedTemplateArr = [];
    const templateContext = {
        ...options.endpointParams,
        ...options.referenceRecord,
    };
    let currentIndex = 0;
    while (currentIndex < template.length) {
        const openingBraceIndex = template.indexOf("{", currentIndex);
        if (openingBraceIndex === -1) {
            evaluatedTemplateArr.push(template.slice(currentIndex));
            break;
        }
        evaluatedTemplateArr.push(template.slice(currentIndex, openingBraceIndex));
        const closingBraceIndex = template.indexOf("}", openingBraceIndex);
        if (closingBraceIndex === -1) {
            evaluatedTemplateArr.push(template.slice(openingBraceIndex));
            break;
        }
        if (template[openingBraceIndex + 1] === "{" && template[closingBraceIndex + 1] === "}") {
            evaluatedTemplateArr.push(template.slice(openingBraceIndex + 1, closingBraceIndex));
            currentIndex = closingBraceIndex + 2;
        }
        const parameterName = template.substring(openingBraceIndex + 1, closingBraceIndex);
        if (parameterName.includes("#")) {
            const [refName, attrName] = parameterName.split("#");
            evaluatedTemplateArr.push((0, lib_1.getAttr)(templateContext[refName], attrName));
        }
        else {
            evaluatedTemplateArr.push(templateContext[parameterName]);
        }
        currentIndex = closingBraceIndex + 1;
    }
    return evaluatedTemplateArr.join("");
};
exports.evaluateTemplate = evaluateTemplate;


/***/ }),

/***/ 6587:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateTreeRule = void 0;
const evaluateConditions_1 = __nccwpck_require__(9169);
const evaluateRules_1 = __nccwpck_require__(9738);
const evaluateTreeRule = (treeRule, options) => {
    const { conditions, rules } = treeRule;
    const { result, referenceRecord } = (0, evaluateConditions_1.evaluateConditions)(conditions, options);
    if (!result) {
        return;
    }
    return (0, evaluateRules_1.evaluateRules)(rules, {
        ...options,
        referenceRecord: { ...options.referenceRecord, ...referenceRecord },
    });
};
exports.evaluateTreeRule = evaluateTreeRule;


/***/ }),

/***/ 8268:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getEndpointHeaders = void 0;
const types_1 = __nccwpck_require__(7433);
const evaluateExpression_1 = __nccwpck_require__(2980);
const getEndpointHeaders = (headers, options) => Object.entries(headers).reduce((acc, [headerKey, headerVal]) => ({
    ...acc,
    [headerKey]: headerVal.map((headerValEntry) => {
        const processedExpr = (0, evaluateExpression_1.evaluateExpression)(headerValEntry, "Header value entry", options);
        if (typeof processedExpr !== "string") {
            throw new types_1.EndpointError(`Header '${headerKey}' value '${processedExpr}' is not a string`);
        }
        return processedExpr;
    }),
}), {});
exports.getEndpointHeaders = getEndpointHeaders;


/***/ }),

/***/ 4973:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getEndpointProperties = void 0;
const getEndpointProperty_1 = __nccwpck_require__(2978);
const getEndpointProperties = (properties, options) => Object.entries(properties).reduce((acc, [propertyKey, propertyVal]) => ({
    ...acc,
    [propertyKey]: (0, getEndpointProperty_1.getEndpointProperty)(propertyVal, options),
}), {});
exports.getEndpointProperties = getEndpointProperties;


/***/ }),

/***/ 2978:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getEndpointProperty = void 0;
const types_1 = __nccwpck_require__(7433);
const evaluateTemplate_1 = __nccwpck_require__(7535);
const getEndpointProperties_1 = __nccwpck_require__(4973);
const getEndpointProperty = (property, options) => {
    if (Array.isArray(property)) {
        return property.map((propertyEntry) => (0, exports.getEndpointProperty)(propertyEntry, options));
    }
    switch (typeof property) {
        case "string":
            return (0, evaluateTemplate_1.evaluateTemplate)(property, options);
        case "object":
            if (property === null) {
                throw new types_1.EndpointError(`Unexpected endpoint property: ${property}`);
            }
            return (0, getEndpointProperties_1.getEndpointProperties)(property, options);
        case "boolean":
            return property;
        default:
            throw new types_1.EndpointError(`Unexpected endpoint property type: ${typeof property}`);
    }
};
exports.getEndpointProperty = getEndpointProperty;


/***/ }),

/***/ 3602:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getEndpointUrl = void 0;
const types_1 = __nccwpck_require__(7433);
const evaluateExpression_1 = __nccwpck_require__(2980);
const getEndpointUrl = (endpointUrl, options) => {
    const expression = (0, evaluateExpression_1.evaluateExpression)(endpointUrl, "Endpoint URL", options);
    if (typeof expression === "string") {
        try {
            return new URL(expression);
        }
        catch (error) {
            console.error(`Failed to construct URL with ${expression}`, error);
            throw error;
        }
    }
    throw new types_1.EndpointError(`Endpoint URL must be a string, got ${typeof expression}`);
};
exports.getEndpointUrl = getEndpointUrl;


/***/ }),

/***/ 8810:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getReferenceValue = void 0;
const getReferenceValue = ({ ref }, options) => {
    const referenceRecord = {
        ...options.endpointParams,
        ...options.referenceRecord,
    };
    return referenceRecord[ref];
};
exports.getReferenceValue = getReferenceValue;


/***/ }),

/***/ 1114:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(9738), exports);


/***/ }),

/***/ 1968:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toHex = exports.fromHex = void 0;
const SHORT_TO_HEX = {};
const HEX_TO_SHORT = {};
for (let i = 0; i < 256; i++) {
    let encodedByte = i.toString(16).toLowerCase();
    if (encodedByte.length === 1) {
        encodedByte = `0${encodedByte}`;
    }
    SHORT_TO_HEX[i] = encodedByte;
    HEX_TO_SHORT[encodedByte] = i;
}
function fromHex(encoded) {
    if (encoded.length % 2 !== 0) {
        throw new Error("Hex encoded strings must have an even number length");
    }
    const out = new Uint8Array(encoded.length / 2);
    for (let i = 0; i < encoded.length; i += 2) {
        const encodedByte = encoded.slice(i, i + 2).toLowerCase();
        if (encodedByte in HEX_TO_SHORT) {
            out[i / 2] = HEX_TO_SHORT[encodedByte];
        }
        else {
            throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
        }
    }
    return out;
}
exports.fromHex = fromHex;
function toHex(bytes) {
    let out = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        out += SHORT_TO_HEX[bytes[i]];
    }
    return out;
}
exports.toHex = toHex;


/***/ }),

/***/ 236:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(7776), exports);


/***/ }),

/***/ 7776:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeProvider = void 0;
const normalizeProvider = (input) => {
    if (typeof input === "function")
        return input;
    const promisified = Promise.resolve(input);
    return () => promisified;
};
exports.normalizeProvider = normalizeProvider;


/***/ }),

/***/ 6968:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdaptiveRetryStrategy = void 0;
const config_1 = __nccwpck_require__(6514);
const DefaultRateLimiter_1 = __nccwpck_require__(258);
const StandardRetryStrategy_1 = __nccwpck_require__(3449);
class AdaptiveRetryStrategy {
    constructor(maxAttemptsProvider, options) {
        this.maxAttemptsProvider = maxAttemptsProvider;
        this.mode = config_1.RETRY_MODES.ADAPTIVE;
        const { rateLimiter } = options !== null && options !== void 0 ? options : {};
        this.rateLimiter = rateLimiter !== null && rateLimiter !== void 0 ? rateLimiter : new DefaultRateLimiter_1.DefaultRateLimiter();
        this.standardRetryStrategy = new StandardRetryStrategy_1.StandardRetryStrategy(maxAttemptsProvider);
    }
    async acquireInitialRetryToken(retryTokenScope) {
        await this.rateLimiter.getSendToken();
        return this.standardRetryStrategy.acquireInitialRetryToken(retryTokenScope);
    }
    async refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
        this.rateLimiter.updateClientSendingRate(errorInfo);
        return this.standardRetryStrategy.refreshRetryTokenForRetry(tokenToRenew, errorInfo);
    }
    recordSuccess(token) {
        this.rateLimiter.updateClientSendingRate({});
        this.standardRetryStrategy.recordSuccess(token);
    }
}
exports.AdaptiveRetryStrategy = AdaptiveRetryStrategy;


/***/ }),

/***/ 258:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultRateLimiter = void 0;
const service_error_classification_1 = __nccwpck_require__(1921);
class DefaultRateLimiter {
    constructor(options) {
        var _a, _b, _c, _d, _e;
        this.currentCapacity = 0;
        this.enabled = false;
        this.lastMaxRate = 0;
        this.measuredTxRate = 0;
        this.requestCount = 0;
        this.lastTimestamp = 0;
        this.timeWindow = 0;
        this.beta = (_a = options === null || options === void 0 ? void 0 : options.beta) !== null && _a !== void 0 ? _a : 0.7;
        this.minCapacity = (_b = options === null || options === void 0 ? void 0 : options.minCapacity) !== null && _b !== void 0 ? _b : 1;
        this.minFillRate = (_c = options === null || options === void 0 ? void 0 : options.minFillRate) !== null && _c !== void 0 ? _c : 0.5;
        this.scaleConstant = (_d = options === null || options === void 0 ? void 0 : options.scaleConstant) !== null && _d !== void 0 ? _d : 0.4;
        this.smooth = (_e = options === null || options === void 0 ? void 0 : options.smooth) !== null && _e !== void 0 ? _e : 0.8;
        const currentTimeInSeconds = this.getCurrentTimeInSeconds();
        this.lastThrottleTime = currentTimeInSeconds;
        this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
        this.fillRate = this.minFillRate;
        this.maxCapacity = this.minCapacity;
    }
    getCurrentTimeInSeconds() {
        return Date.now() / 1000;
    }
    async getSendToken() {
        return this.acquireTokenBucket(1);
    }
    async acquireTokenBucket(amount) {
        if (!this.enabled) {
            return;
        }
        this.refillTokenBucket();
        if (amount > this.currentCapacity) {
            const delay = ((amount - this.currentCapacity) / this.fillRate) * 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
        this.currentCapacity = this.currentCapacity - amount;
    }
    refillTokenBucket() {
        const timestamp = this.getCurrentTimeInSeconds();
        if (!this.lastTimestamp) {
            this.lastTimestamp = timestamp;
            return;
        }
        const fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
        this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + fillAmount);
        this.lastTimestamp = timestamp;
    }
    updateClientSendingRate(response) {
        let calculatedRate;
        this.updateMeasuredRate();
        if ((0, service_error_classification_1.isThrottlingError)(response)) {
            const rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
            this.lastMaxRate = rateToUse;
            this.calculateTimeWindow();
            this.lastThrottleTime = this.getCurrentTimeInSeconds();
            calculatedRate = this.cubicThrottle(rateToUse);
            this.enableTokenBucket();
        }
        else {
            this.calculateTimeWindow();
            calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
        }
        const newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
        this.updateTokenBucketRate(newRate);
    }
    calculateTimeWindow() {
        this.timeWindow = this.getPrecise(Math.pow((this.lastMaxRate * (1 - this.beta)) / this.scaleConstant, 1 / 3));
    }
    cubicThrottle(rateToUse) {
        return this.getPrecise(rateToUse * this.beta);
    }
    cubicSuccess(timestamp) {
        return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
    }
    enableTokenBucket() {
        this.enabled = true;
    }
    updateTokenBucketRate(newRate) {
        this.refillTokenBucket();
        this.fillRate = Math.max(newRate, this.minFillRate);
        this.maxCapacity = Math.max(newRate, this.minCapacity);
        this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity);
    }
    updateMeasuredRate() {
        const t = this.getCurrentTimeInSeconds();
        const timeBucket = Math.floor(t * 2) / 2;
        this.requestCount++;
        if (timeBucket > this.lastTxRateBucket) {
            const currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
            this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
            this.requestCount = 0;
            this.lastTxRateBucket = timeBucket;
        }
    }
    getPrecise(num) {
        return parseFloat(num.toFixed(8));
    }
}
exports.DefaultRateLimiter = DefaultRateLimiter;


/***/ }),

/***/ 3449:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StandardRetryStrategy = void 0;
const config_1 = __nccwpck_require__(6514);
const constants_1 = __nccwpck_require__(5056);
const defaultRetryToken_1 = __nccwpck_require__(1360);
class StandardRetryStrategy {
    constructor(maxAttemptsProvider) {
        this.maxAttemptsProvider = maxAttemptsProvider;
        this.mode = config_1.RETRY_MODES.STANDARD;
        this.retryToken = (0, defaultRetryToken_1.getDefaultRetryToken)(constants_1.INITIAL_RETRY_TOKENS, constants_1.DEFAULT_RETRY_DELAY_BASE);
        this.maxAttemptsProvider = maxAttemptsProvider;
    }
    async acquireInitialRetryToken(retryTokenScope) {
        return this.retryToken;
    }
    async refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
        const maxAttempts = await this.getMaxAttempts();
        if (this.shouldRetry(tokenToRenew, errorInfo, maxAttempts)) {
            tokenToRenew.getRetryTokenCount(errorInfo);
            return tokenToRenew;
        }
        throw new Error("No retry token available");
    }
    recordSuccess(token) {
        this.retryToken.releaseRetryTokens(token.getLastRetryCost());
    }
    async getMaxAttempts() {
        let maxAttempts;
        try {
            return await this.maxAttemptsProvider();
        }
        catch (error) {
            console.warn(`Max attempts provider could not resolve. Using default of ${config_1.DEFAULT_MAX_ATTEMPTS}`);
            return config_1.DEFAULT_MAX_ATTEMPTS;
        }
    }
    shouldRetry(tokenToRenew, errorInfo, maxAttempts) {
        const attempts = tokenToRenew.getRetryCount();
        return (attempts < maxAttempts &&
            tokenToRenew.hasRetryTokens(errorInfo.errorType) &&
            this.isRetryableError(errorInfo.errorType));
    }
    isRetryableError(errorType) {
        return errorType === "THROTTLING" || errorType === "TRANSIENT";
    }
}
exports.StandardRetryStrategy = StandardRetryStrategy;


/***/ }),

/***/ 6514:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_RETRY_MODE = exports.DEFAULT_MAX_ATTEMPTS = exports.RETRY_MODES = void 0;
var RETRY_MODES;
(function (RETRY_MODES) {
    RETRY_MODES["STANDARD"] = "standard";
    RETRY_MODES["ADAPTIVE"] = "adaptive";
})(RETRY_MODES = exports.RETRY_MODES || (exports.RETRY_MODES = {}));
exports.DEFAULT_MAX_ATTEMPTS = 3;
exports.DEFAULT_RETRY_MODE = "STANDARD";


/***/ }),

/***/ 5056:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.REQUEST_HEADER = exports.INVOCATION_ID_HEADER = exports.NO_RETRY_INCREMENT = exports.TIMEOUT_RETRY_COST = exports.RETRY_COST = exports.INITIAL_RETRY_TOKENS = exports.THROTTLING_RETRY_DELAY_BASE = exports.MAXIMUM_RETRY_DELAY = exports.DEFAULT_RETRY_DELAY_BASE = void 0;
exports.DEFAULT_RETRY_DELAY_BASE = 100;
exports.MAXIMUM_RETRY_DELAY = 20 * 1000;
exports.THROTTLING_RETRY_DELAY_BASE = 500;
exports.INITIAL_RETRY_TOKENS = 500;
exports.RETRY_COST = 5;
exports.TIMEOUT_RETRY_COST = 10;
exports.NO_RETRY_INCREMENT = 1;
exports.INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
exports.REQUEST_HEADER = "amz-sdk-request";


/***/ }),

/***/ 4763:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDefaultRetryBackoffStrategy = void 0;
const constants_1 = __nccwpck_require__(5056);
const getDefaultRetryBackoffStrategy = () => {
    let delayBase = constants_1.DEFAULT_RETRY_DELAY_BASE;
    const computeNextBackoffDelay = (attempts) => {
        return Math.floor(Math.min(constants_1.MAXIMUM_RETRY_DELAY, Math.random() * 2 ** attempts * delayBase));
    };
    const setDelayBase = (delay) => {
        delayBase = delay;
    };
    return {
        computeNextBackoffDelay,
        setDelayBase,
    };
};
exports.getDefaultRetryBackoffStrategy = getDefaultRetryBackoffStrategy;


/***/ }),

/***/ 1360:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDefaultRetryToken = void 0;
const constants_1 = __nccwpck_require__(5056);
const defaultRetryBackoffStrategy_1 = __nccwpck_require__(4763);
const getDefaultRetryToken = (initialRetryTokens, initialRetryDelay, initialRetryCount, options) => {
    var _a, _b, _c;
    const MAX_CAPACITY = initialRetryTokens;
    const retryCost = (_a = options === null || options === void 0 ? void 0 : options.retryCost) !== null && _a !== void 0 ? _a : constants_1.RETRY_COST;
    const timeoutRetryCost = (_b = options === null || options === void 0 ? void 0 : options.timeoutRetryCost) !== null && _b !== void 0 ? _b : constants_1.TIMEOUT_RETRY_COST;
    const retryBackoffStrategy = (_c = options === null || options === void 0 ? void 0 : options.retryBackoffStrategy) !== null && _c !== void 0 ? _c : (0, defaultRetryBackoffStrategy_1.getDefaultRetryBackoffStrategy)();
    let availableCapacity = initialRetryTokens;
    let retryDelay = Math.min(constants_1.MAXIMUM_RETRY_DELAY, initialRetryDelay);
    let lastRetryCost = undefined;
    let retryCount = initialRetryCount !== null && initialRetryCount !== void 0 ? initialRetryCount : 0;
    const getCapacityAmount = (errorType) => (errorType === "TRANSIENT" ? timeoutRetryCost : retryCost);
    const getRetryCount = () => retryCount;
    const getRetryDelay = () => retryDelay;
    const getLastRetryCost = () => lastRetryCost;
    const hasRetryTokens = (errorType) => getCapacityAmount(errorType) <= availableCapacity;
    const getRetryTokenCount = (errorInfo) => {
        const errorType = errorInfo.errorType;
        if (!hasRetryTokens(errorType)) {
            throw new Error("No retry token available");
        }
        const capacityAmount = getCapacityAmount(errorType);
        const delayBase = errorType === "THROTTLING" ? constants_1.THROTTLING_RETRY_DELAY_BASE : constants_1.DEFAULT_RETRY_DELAY_BASE;
        retryBackoffStrategy.setDelayBase(delayBase);
        const delayFromErrorType = retryBackoffStrategy.computeNextBackoffDelay(retryCount);
        if (errorInfo.retryAfterHint) {
            const delayFromRetryAfterHint = errorInfo.retryAfterHint.getTime() - Date.now();
            retryDelay = Math.max(delayFromRetryAfterHint || 0, delayFromErrorType);
        }
        else {
            retryDelay = delayFromErrorType;
        }
        retryCount++;
        lastRetryCost = capacityAmount;
        availableCapacity -= capacityAmount;
        return capacityAmount;
    };
    const releaseRetryTokens = (releaseAmount) => {
        availableCapacity += releaseAmount !== null && releaseAmount !== void 0 ? releaseAmount : constants_1.NO_RETRY_INCREMENT;
        availableCapacity = Math.min(availableCapacity, MAX_CAPACITY);
    };
    return {
        getRetryCount,
        getRetryDelay,
        getLastRetryCost,
        hasRetryTokens,
        getRetryTokenCount,
        releaseRetryTokens,
    };
};
exports.getDefaultRetryToken = getDefaultRetryToken;


/***/ }),

/***/ 9395:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(6968), exports);
tslib_1.__exportStar(__nccwpck_require__(258), exports);
tslib_1.__exportStar(__nccwpck_require__(3449), exports);
tslib_1.__exportStar(__nccwpck_require__(6514), exports);
tslib_1.__exportStar(__nccwpck_require__(5056), exports);
tslib_1.__exportStar(__nccwpck_require__(1318), exports);


/***/ }),

/***/ 1318:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 5774:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.escapeUriPath = void 0;
const escape_uri_1 = __nccwpck_require__(4652);
const escapeUriPath = (uri) => uri.split("/").map(escape_uri_1.escapeUri).join("/");
exports.escapeUriPath = escapeUriPath;


/***/ }),

/***/ 4652:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.escapeUri = void 0;
const escapeUri = (uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
exports.escapeUri = escapeUri;
const hexEncode = (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`;


/***/ }),

/***/ 7952:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(4652), exports);
tslib_1.__exportStar(__nccwpck_require__(5774), exports);


/***/ }),

/***/ 8095:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultUserAgent = exports.UA_APP_ID_INI_NAME = exports.UA_APP_ID_ENV_NAME = void 0;
const node_config_provider_1 = __nccwpck_require__(7684);
const os_1 = __nccwpck_require__(2037);
const process_1 = __nccwpck_require__(7282);
const is_crt_available_1 = __nccwpck_require__(8390);
exports.UA_APP_ID_ENV_NAME = "AWS_SDK_UA_APP_ID";
exports.UA_APP_ID_INI_NAME = "sdk-ua-app-id";
const defaultUserAgent = ({ serviceId, clientVersion }) => {
    const sections = [
        ["aws-sdk-js", clientVersion],
        [`os/${(0, os_1.platform)()}`, (0, os_1.release)()],
        ["lang/js"],
        ["md/nodejs", `${process_1.versions.node}`],
    ];
    const crtAvailable = (0, is_crt_available_1.isCrtAvailable)();
    if (crtAvailable) {
        sections.push(crtAvailable);
    }
    if (serviceId) {
        sections.push([`api/${serviceId}`, clientVersion]);
    }
    if (process_1.env.AWS_EXECUTION_ENV) {
        sections.push([`exec-env/${process_1.env.AWS_EXECUTION_ENV}`]);
    }
    const appIdPromise = (0, node_config_provider_1.loadConfig)({
        environmentVariableSelector: (env) => env[exports.UA_APP_ID_ENV_NAME],
        configFileSelector: (profile) => profile[exports.UA_APP_ID_INI_NAME],
        default: undefined,
    })();
    let resolvedUserAgent = undefined;
    return async () => {
        if (!resolvedUserAgent) {
            const appId = await appIdPromise;
            resolvedUserAgent = appId ? [...sections, [`app/${appId}`]] : [...sections];
        }
        return resolvedUserAgent;
    };
};
exports.defaultUserAgent = defaultUserAgent;


/***/ }),

/***/ 8390:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isCrtAvailable = void 0;
const isCrtAvailable = () => {
    try {
        if ( true && __nccwpck_require__(7578)) {
            return ["md/crt-avail"];
        }
        return null;
    }
    catch (e) {
        return null;
    }
};
exports.isCrtAvailable = isCrtAvailable;


/***/ }),

/***/ 255:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fromUtf8 = void 0;
const util_buffer_from_1 = __nccwpck_require__(6010);
const fromUtf8 = (input) => {
    const buf = (0, util_buffer_from_1.fromString)(input, "utf8");
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};
exports.fromUtf8 = fromUtf8;


/***/ }),

/***/ 2855:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __nccwpck_require__(4351);
tslib_1.__exportStar(__nccwpck_require__(255), exports);
tslib_1.__exportStar(__nccwpck_require__(1287), exports);
tslib_1.__exportStar(__nccwpck_require__(5544), exports);


/***/ }),

/***/ 1287:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toUint8Array = void 0;
const fromUtf8_1 = __nccwpck_require__(255);
const toUint8Array = (data) => {
    if (typeof data === "string") {
        return (0, fromUtf8_1.fromUtf8)(data);
    }
    if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    }
    return new Uint8Array(data);
};
exports.toUint8Array = toUint8Array;


/***/ }),

/***/ 5544:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toUtf8 = void 0;
const util_buffer_from_1 = __nccwpck_require__(6010);
const toUtf8 = (input) => (0, util_buffer_from_1.fromArrayBuffer)(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
exports.toUtf8 = toUtf8;


/***/ }),

/***/ 2603:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const validator = __nccwpck_require__(1739);
const XMLParser = __nccwpck_require__(2380);
const XMLBuilder = __nccwpck_require__(660);

module.exports = {
  XMLParser: XMLParser,
  XMLValidator: validator,
  XMLBuilder: XMLBuilder
}

/***/ }),

/***/ 8280:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const nameStartChar = ':A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
const nameChar = nameStartChar + '\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040';
const nameRegexp = '[' + nameStartChar + '][' + nameChar + ']*'
const regexName = new RegExp('^' + nameRegexp + '$');

const getAllMatches = function(string, regex) {
  const matches = [];
  let match = regex.exec(string);
  while (match) {
    const allmatches = [];
    allmatches.startIndex = regex.lastIndex - match[0].length;
    const len = match.length;
    for (let index = 0; index < len; index++) {
      allmatches.push(match[index]);
    }
    matches.push(allmatches);
    match = regex.exec(string);
  }
  return matches;
};

const isName = function(string) {
  const match = regexName.exec(string);
  return !(match === null || typeof match === 'undefined');
};

exports.isExist = function(v) {
  return typeof v !== 'undefined';
};

exports.isEmptyObject = function(obj) {
  return Object.keys(obj).length === 0;
};

/**
 * Copy all the properties of a into b.
 * @param {*} target
 * @param {*} a
 */
exports.merge = function(target, a, arrayMode) {
  if (a) {
    const keys = Object.keys(a); // will return an array of own properties
    const len = keys.length; //don't make it inline
    for (let i = 0; i < len; i++) {
      if (arrayMode === 'strict') {
        target[keys[i]] = [ a[keys[i]] ];
      } else {
        target[keys[i]] = a[keys[i]];
      }
    }
  }
};
/* exports.merge =function (b,a){
  return Object.assign(b,a);
} */

exports.getValue = function(v) {
  if (exports.isExist(v)) {
    return v;
  } else {
    return '';
  }
};

// const fakeCall = function(a) {return a;};
// const fakeCallNoReturn = function() {};

exports.isName = isName;
exports.getAllMatches = getAllMatches;
exports.nameRegexp = nameRegexp;


/***/ }),

/***/ 1739:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const util = __nccwpck_require__(8280);

const defaultOptions = {
  allowBooleanAttributes: false, //A tag can have attributes without any value
  unpairedTags: []
};

//const tagsPattern = new RegExp("<\\/?([\\w:\\-_\.]+)\\s*\/?>","g");
exports.validate = function (xmlData, options) {
  options = Object.assign({}, defaultOptions, options);

  //xmlData = xmlData.replace(/(\r\n|\n|\r)/gm,"");//make it single line
  //xmlData = xmlData.replace(/(^\s*<\?xml.*?\?>)/g,"");//Remove XML starting tag
  //xmlData = xmlData.replace(/(<!DOCTYPE[\s\w\"\.\/\-\:]+(\[.*\])*\s*>)/g,"");//Remove DOCTYPE
  const tags = [];
  let tagFound = false;

  //indicates that the root tag has been closed (aka. depth 0 has been reached)
  let reachedRoot = false;

  if (xmlData[0] === '\ufeff') {
    // check for byte order mark (BOM)
    xmlData = xmlData.substr(1);
  }
  
  for (let i = 0; i < xmlData.length; i++) {

    if (xmlData[i] === '<' && xmlData[i+1] === '?') {
      i+=2;
      i = readPI(xmlData,i);
      if (i.err) return i;
    }else if (xmlData[i] === '<') {
      //starting of tag
      //read until you reach to '>' avoiding any '>' in attribute value
      let tagStartPos = i;
      i++;
      
      if (xmlData[i] === '!') {
        i = readCommentAndCDATA(xmlData, i);
        continue;
      } else {
        let closingTag = false;
        if (xmlData[i] === '/') {
          //closing tag
          closingTag = true;
          i++;
        }
        //read tagname
        let tagName = '';
        for (; i < xmlData.length &&
          xmlData[i] !== '>' &&
          xmlData[i] !== ' ' &&
          xmlData[i] !== '\t' &&
          xmlData[i] !== '\n' &&
          xmlData[i] !== '\r'; i++
        ) {
          tagName += xmlData[i];
        }
        tagName = tagName.trim();
        //console.log(tagName);

        if (tagName[tagName.length - 1] === '/') {
          //self closing tag without attributes
          tagName = tagName.substring(0, tagName.length - 1);
          //continue;
          i--;
        }
        if (!validateTagName(tagName)) {
          let msg;
          if (tagName.trim().length === 0) {
            msg = "Invalid space after '<'.";
          } else {
            msg = "Tag '"+tagName+"' is an invalid name.";
          }
          return getErrorObject('InvalidTag', msg, getLineNumberForPosition(xmlData, i));
        }

        const result = readAttributeStr(xmlData, i);
        if (result === false) {
          return getErrorObject('InvalidAttr', "Attributes for '"+tagName+"' have open quote.", getLineNumberForPosition(xmlData, i));
        }
        let attrStr = result.value;
        i = result.index;

        if (attrStr[attrStr.length - 1] === '/') {
          //self closing tag
          const attrStrStart = i - attrStr.length;
          attrStr = attrStr.substring(0, attrStr.length - 1);
          const isValid = validateAttributeString(attrStr, options);
          if (isValid === true) {
            tagFound = true;
            //continue; //text may presents after self closing tag
          } else {
            //the result from the nested function returns the position of the error within the attribute
            //in order to get the 'true' error line, we need to calculate the position where the attribute begins (i - attrStr.length) and then add the position within the attribute
            //this gives us the absolute index in the entire xml, which we can use to find the line at last
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
          }
        } else if (closingTag) {
          if (!result.tagClosed) {
            return getErrorObject('InvalidTag', "Closing tag '"+tagName+"' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
          } else if (attrStr.trim().length > 0) {
            return getErrorObject('InvalidTag', "Closing tag '"+tagName+"' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
          } else {
            const otg = tags.pop();
            if (tagName !== otg.tagName) {
              let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
              return getErrorObject('InvalidTag',
                "Expected closing tag '"+otg.tagName+"' (opened in line "+openPos.line+", col "+openPos.col+") instead of closing tag '"+tagName+"'.",
                getLineNumberForPosition(xmlData, tagStartPos));
            }

            //when there are no more tags, we reached the root level.
            if (tags.length == 0) {
              reachedRoot = true;
            }
          }
        } else {
          const isValid = validateAttributeString(attrStr, options);
          if (isValid !== true) {
            //the result from the nested function returns the position of the error within the attribute
            //in order to get the 'true' error line, we need to calculate the position where the attribute begins (i - attrStr.length) and then add the position within the attribute
            //this gives us the absolute index in the entire xml, which we can use to find the line at last
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
          }

          //if the root level has been reached before ...
          if (reachedRoot === true) {
            return getErrorObject('InvalidXml', 'Multiple possible root nodes found.', getLineNumberForPosition(xmlData, i));
          } else if(options.unpairedTags.indexOf(tagName) !== -1){
            //don't push into stack
          } else {
            tags.push({tagName, tagStartPos});
          }
          tagFound = true;
        }

        //skip tag text value
        //It may include comments and CDATA value
        for (i++; i < xmlData.length; i++) {
          if (xmlData[i] === '<') {
            if (xmlData[i + 1] === '!') {
              //comment or CADATA
              i++;
              i = readCommentAndCDATA(xmlData, i);
              continue;
            } else if (xmlData[i+1] === '?') {
              i = readPI(xmlData, ++i);
              if (i.err) return i;
            } else{
              break;
            }
          } else if (xmlData[i] === '&') {
            const afterAmp = validateAmpersand(xmlData, i);
            if (afterAmp == -1)
              return getErrorObject('InvalidChar', "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
            i = afterAmp;
          }else{
            if (reachedRoot === true && !isWhiteSpace(xmlData[i])) {
              return getErrorObject('InvalidXml', "Extra text at the end", getLineNumberForPosition(xmlData, i));
            }
          }
        } //end of reading tag text value
        if (xmlData[i] === '<') {
          i--;
        }
      }
    } else {
      if ( isWhiteSpace(xmlData[i])) {
        continue;
      }
      return getErrorObject('InvalidChar', "char '"+xmlData[i]+"' is not expected.", getLineNumberForPosition(xmlData, i));
    }
  }

  if (!tagFound) {
    return getErrorObject('InvalidXml', 'Start tag expected.', 1);
  }else if (tags.length == 1) {
      return getErrorObject('InvalidTag', "Unclosed tag '"+tags[0].tagName+"'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
  }else if (tags.length > 0) {
      return getErrorObject('InvalidXml', "Invalid '"+
          JSON.stringify(tags.map(t => t.tagName), null, 4).replace(/\r?\n/g, '')+
          "' found.", {line: 1, col: 1});
  }

  return true;
};

function isWhiteSpace(char){
  return char === ' ' || char === '\t' || char === '\n'  || char === '\r';
}
/**
 * Read Processing insstructions and skip
 * @param {*} xmlData
 * @param {*} i
 */
function readPI(xmlData, i) {
  const start = i;
  for (; i < xmlData.length; i++) {
    if (xmlData[i] == '?' || xmlData[i] == ' ') {
      //tagname
      const tagname = xmlData.substr(start, i - start);
      if (i > 5 && tagname === 'xml') {
        return getErrorObject('InvalidXml', 'XML declaration allowed only at the start of the document.', getLineNumberForPosition(xmlData, i));
      } else if (xmlData[i] == '?' && xmlData[i + 1] == '>') {
        //check if valid attribut string
        i++;
        break;
      } else {
        continue;
      }
    }
  }
  return i;
}

function readCommentAndCDATA(xmlData, i) {
  if (xmlData.length > i + 5 && xmlData[i + 1] === '-' && xmlData[i + 2] === '-') {
    //comment
    for (i += 3; i < xmlData.length; i++) {
      if (xmlData[i] === '-' && xmlData[i + 1] === '-' && xmlData[i + 2] === '>') {
        i += 2;
        break;
      }
    }
  } else if (
    xmlData.length > i + 8 &&
    xmlData[i + 1] === 'D' &&
    xmlData[i + 2] === 'O' &&
    xmlData[i + 3] === 'C' &&
    xmlData[i + 4] === 'T' &&
    xmlData[i + 5] === 'Y' &&
    xmlData[i + 6] === 'P' &&
    xmlData[i + 7] === 'E'
  ) {
    let angleBracketsCount = 1;
    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === '<') {
        angleBracketsCount++;
      } else if (xmlData[i] === '>') {
        angleBracketsCount--;
        if (angleBracketsCount === 0) {
          break;
        }
      }
    }
  } else if (
    xmlData.length > i + 9 &&
    xmlData[i + 1] === '[' &&
    xmlData[i + 2] === 'C' &&
    xmlData[i + 3] === 'D' &&
    xmlData[i + 4] === 'A' &&
    xmlData[i + 5] === 'T' &&
    xmlData[i + 6] === 'A' &&
    xmlData[i + 7] === '['
  ) {
    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === ']' && xmlData[i + 1] === ']' && xmlData[i + 2] === '>') {
        i += 2;
        break;
      }
    }
  }

  return i;
}

const doubleQuote = '"';
const singleQuote = "'";

/**
 * Keep reading xmlData until '<' is found outside the attribute value.
 * @param {string} xmlData
 * @param {number} i
 */
function readAttributeStr(xmlData, i) {
  let attrStr = '';
  let startChar = '';
  let tagClosed = false;
  for (; i < xmlData.length; i++) {
    if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
      if (startChar === '') {
        startChar = xmlData[i];
      } else if (startChar !== xmlData[i]) {
        //if vaue is enclosed with double quote then single quotes are allowed inside the value and vice versa
      } else {
        startChar = '';
      }
    } else if (xmlData[i] === '>') {
      if (startChar === '') {
        tagClosed = true;
        break;
      }
    }
    attrStr += xmlData[i];
  }
  if (startChar !== '') {
    return false;
  }

  return {
    value: attrStr,
    index: i,
    tagClosed: tagClosed
  };
}

/**
 * Select all the attributes whether valid or invalid.
 */
const validAttrStrRegxp = new RegExp('(\\s*)([^\\s=]+)(\\s*=)?(\\s*([\'"])(([\\s\\S])*?)\\5)?', 'g');

//attr, ="sd", a="amit's", a="sd"b="saf", ab  cd=""

function validateAttributeString(attrStr, options) {
  //console.log("start:"+attrStr+":end");

  //if(attrStr.trim().length === 0) return true; //empty string

  const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
  const attrNames = {};

  for (let i = 0; i < matches.length; i++) {
    if (matches[i][1].length === 0) {
      //nospace before attribute name: a="sd"b="saf"
      return getErrorObject('InvalidAttr', "Attribute '"+matches[i][2]+"' has no space in starting.", getPositionFromMatch(matches[i]))
    } else if (matches[i][3] !== undefined && matches[i][4] === undefined) {
      return getErrorObject('InvalidAttr', "Attribute '"+matches[i][2]+"' is without value.", getPositionFromMatch(matches[i]));
    } else if (matches[i][3] === undefined && !options.allowBooleanAttributes) {
      //independent attribute: ab
      return getErrorObject('InvalidAttr', "boolean attribute '"+matches[i][2]+"' is not allowed.", getPositionFromMatch(matches[i]));
    }
    /* else if(matches[i][6] === undefined){//attribute without value: ab=
                    return { err: { code:"InvalidAttr",msg:"attribute " + matches[i][2] + " has no value assigned."}};
                } */
    const attrName = matches[i][2];
    if (!validateAttrName(attrName)) {
      return getErrorObject('InvalidAttr', "Attribute '"+attrName+"' is an invalid name.", getPositionFromMatch(matches[i]));
    }
    if (!attrNames.hasOwnProperty(attrName)) {
      //check for duplicate attribute.
      attrNames[attrName] = 1;
    } else {
      return getErrorObject('InvalidAttr', "Attribute '"+attrName+"' is repeated.", getPositionFromMatch(matches[i]));
    }
  }

  return true;
}

function validateNumberAmpersand(xmlData, i) {
  let re = /\d/;
  if (xmlData[i] === 'x') {
    i++;
    re = /[\da-fA-F]/;
  }
  for (; i < xmlData.length; i++) {
    if (xmlData[i] === ';')
      return i;
    if (!xmlData[i].match(re))
      break;
  }
  return -1;
}

function validateAmpersand(xmlData, i) {
  // https://www.w3.org/TR/xml/#dt-charref
  i++;
  if (xmlData[i] === ';')
    return -1;
  if (xmlData[i] === '#') {
    i++;
    return validateNumberAmpersand(xmlData, i);
  }
  let count = 0;
  for (; i < xmlData.length; i++, count++) {
    if (xmlData[i].match(/\w/) && count < 20)
      continue;
    if (xmlData[i] === ';')
      break;
    return -1;
  }
  return i;
}

function getErrorObject(code, message, lineNumber) {
  return {
    err: {
      code: code,
      msg: message,
      line: lineNumber.line || lineNumber,
      col: lineNumber.col,
    },
  };
}

function validateAttrName(attrName) {
  return util.isName(attrName);
}

// const startsWithXML = /^xml/i;

function validateTagName(tagname) {
  return util.isName(tagname) /* && !tagname.match(startsWithXML) */;
}

//this function returns the line number for the character at the given index
function getLineNumberForPosition(xmlData, index) {
  const lines = xmlData.substring(0, index).split(/\r?\n/);
  return {
    line: lines.length,

    // column number is last line's length + 1, because column numbering starts at 1:
    col: lines[lines.length - 1].length + 1
  };
}

//this function returns the position of the first character of match within attrStr
function getPositionFromMatch(match) {
  return match.startIndex + match[1].length;
}


/***/ }),

/***/ 660:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

//parse Empty Node as self closing node
const buildFromOrderedJs = __nccwpck_require__(2462);

const defaultOptions = {
  attributeNamePrefix: '@_',
  attributesGroupName: false,
  textNodeName: '#text',
  ignoreAttributes: true,
  cdataPropName: false,
  format: false,
  indentBy: '  ',
  suppressEmptyNode: false,
  suppressUnpairedNode: true,
  suppressBooleanAttributes: true,
  tagValueProcessor: function(key, a) {
    return a;
  },
  attributeValueProcessor: function(attrName, a) {
    return a;
  },
  preserveOrder: false,
  commentPropName: false,
  unpairedTags: [],
  entities: [
    { regex: new RegExp("&", "g"), val: "&amp;" },//it must be on top
    { regex: new RegExp(">", "g"), val: "&gt;" },
    { regex: new RegExp("<", "g"), val: "&lt;" },
    { regex: new RegExp("\'", "g"), val: "&apos;" },
    { regex: new RegExp("\"", "g"), val: "&quot;" }
  ],
  processEntities: true,
  stopNodes: [],
  // transformTagName: false,
  // transformAttributeName: false,
};

function Builder(options) {
  this.options = Object.assign({}, defaultOptions, options);
  if (this.options.ignoreAttributes || this.options.attributesGroupName) {
    this.isAttribute = function(/*a*/) {
      return false;
    };
  } else {
    this.attrPrefixLen = this.options.attributeNamePrefix.length;
    this.isAttribute = isAttribute;
  }

  this.processTextOrObjNode = processTextOrObjNode

  if (this.options.format) {
    this.indentate = indentate;
    this.tagEndChar = '>\n';
    this.newLine = '\n';
  } else {
    this.indentate = function() {
      return '';
    };
    this.tagEndChar = '>';
    this.newLine = '';
  }
}

Builder.prototype.build = function(jObj) {
  if(this.options.preserveOrder){
    return buildFromOrderedJs(jObj, this.options);
  }else {
    if(Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1){
      jObj = {
        [this.options.arrayNodeName] : jObj
      }
    }
    return this.j2x(jObj, 0).val;
  }
};

Builder.prototype.j2x = function(jObj, level) {
  let attrStr = '';
  let val = '';
  for (let key in jObj) {
    if (typeof jObj[key] === 'undefined') {
      // supress undefined node
    } else if (jObj[key] === null) {
      if(key[0] === "?") val += this.indentate(level) + '<' + key + '?' + this.tagEndChar;
      else val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
      // val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
    } else if (jObj[key] instanceof Date) {
      val += this.buildTextValNode(jObj[key], key, '', level);
    } else if (typeof jObj[key] !== 'object') {
      //premitive type
      const attr = this.isAttribute(key);
      if (attr) {
        attrStr += this.buildAttrPairStr(attr, '' + jObj[key]);
      }else {
        //tag value
        if (key === this.options.textNodeName) {
          let newval = this.options.tagValueProcessor(key, '' + jObj[key]);
          val += this.replaceEntitiesValue(newval);
        } else {
          val += this.buildTextValNode(jObj[key], key, '', level);
        }
      }
    } else if (Array.isArray(jObj[key])) {
      //repeated nodes
      const arrLen = jObj[key].length;
      for (let j = 0; j < arrLen; j++) {
        const item = jObj[key][j];
        if (typeof item === 'undefined') {
          // supress undefined node
        } else if (item === null) {
          if(key[0] === "?") val += this.indentate(level) + '<' + key + '?' + this.tagEndChar;
          else val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
          // val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
        } else if (typeof item === 'object') {
          val += this.processTextOrObjNode(item, key, level)
        } else {
          val += this.buildTextValNode(item, key, '', level);
        }
      }
    } else {
      //nested node
      if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
        const Ks = Object.keys(jObj[key]);
        const L = Ks.length;
        for (let j = 0; j < L; j++) {
          attrStr += this.buildAttrPairStr(Ks[j], '' + jObj[key][Ks[j]]);
        }
      } else {
        val += this.processTextOrObjNode(jObj[key], key, level)
      }
    }
  }
  return {attrStr: attrStr, val: val};
};

Builder.prototype.buildAttrPairStr = function(attrName, val){
  val = this.options.attributeValueProcessor(attrName, '' + val);
  val = this.replaceEntitiesValue(val);
  if (this.options.suppressBooleanAttributes && val === "true") {
    return ' ' + attrName;
  } else return ' ' + attrName + '="' + val + '"';
}

function processTextOrObjNode (object, key, level) {
  const result = this.j2x(object, level + 1);
  if (object[this.options.textNodeName] !== undefined && Object.keys(object).length === 1) {
    return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
  } else {
    return this.buildObjectNode(result.val, key, result.attrStr, level);
  }
}

Builder.prototype.buildObjectNode = function(val, key, attrStr, level) {
  if(val === ""){
    if(key[0] === "?") return  this.indentate(level) + '<' + key + attrStr+ '?' + this.tagEndChar;
    else {
      return this.indentate(level) + '<' + key + attrStr + this.closeTag(key) + this.tagEndChar;
    }
  }else{

    let tagEndExp = '</' + key + this.tagEndChar;
    let piClosingChar = "";
    
    if(key[0] === "?") {
      piClosingChar = "?";
      tagEndExp = "";
    }
  
    if (attrStr && val.indexOf('<') === -1) {
      return ( this.indentate(level) + '<' +  key + attrStr + piClosingChar + '>' + val + tagEndExp );
    } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
      return this.indentate(level) + `<!--${val}-->` + this.newLine;
    }else {
      return (
        this.indentate(level) + '<' + key + attrStr + piClosingChar + this.tagEndChar +
        val +
        this.indentate(level) + tagEndExp    );
    }
  }
}

Builder.prototype.closeTag = function(key){
  let closeTag = "";
  if(this.options.unpairedTags.indexOf(key) !== -1){ //unpaired
    if(!this.options.suppressUnpairedNode) closeTag = "/"
  }else if(this.options.suppressEmptyNode){ //empty
    closeTag = "/";
  }else{
    closeTag = `></${key}`
  }
  return closeTag;
}

function buildEmptyObjNode(val, key, attrStr, level) {
  if (val !== '') {
    return this.buildObjectNode(val, key, attrStr, level);
  } else {
    if(key[0] === "?") return  this.indentate(level) + '<' + key + attrStr+ '?' + this.tagEndChar;
    else {
      return  this.indentate(level) + '<' + key + attrStr + '/' + this.tagEndChar;
      // return this.buildTagStr(level,key, attrStr);
    }
  }
}

Builder.prototype.buildTextValNode = function(val, key, attrStr, level) {
  if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
    return this.indentate(level) + `<![CDATA[${val}]]>` +  this.newLine;
  }else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
    return this.indentate(level) + `<!--${val}-->` +  this.newLine;
  }else if(key[0] === "?") {//PI tag
    return  this.indentate(level) + '<' + key + attrStr+ '?' + this.tagEndChar; 
  }else{
    let textValue = this.options.tagValueProcessor(key, val);
    textValue = this.replaceEntitiesValue(textValue);
  
    if( textValue === ''){
      return this.indentate(level) + '<' + key + attrStr + this.closeTag(key) + this.tagEndChar;
    }else{
      return this.indentate(level) + '<' + key + attrStr + '>' +
         textValue +
        '</' + key + this.tagEndChar;
    }
  }
}

Builder.prototype.replaceEntitiesValue = function(textValue){
  if(textValue && textValue.length > 0 && this.options.processEntities){
    for (let i=0; i<this.options.entities.length; i++) {
      const entity = this.options.entities[i];
      textValue = textValue.replace(entity.regex, entity.val);
    }
  }
  return textValue;
}

function indentate(level) {
  return this.options.indentBy.repeat(level);
}

function isAttribute(name /*, options*/) {
  if (name.startsWith(this.options.attributeNamePrefix)) {
    return name.substr(this.attrPrefixLen);
  } else {
    return false;
  }
}

module.exports = Builder;


/***/ }),

/***/ 2462:
/***/ ((module) => {

const EOL = "\n";

/**
 * 
 * @param {array} jArray 
 * @param {any} options 
 * @returns 
 */
function toXml(jArray, options) {
    let indentation = "";
    if (options.format && options.indentBy.length > 0) {
        indentation = EOL;
    }
    return arrToStr(jArray, options, "", indentation);
}

function arrToStr(arr, options, jPath, indentation) {
    let xmlStr = "";
    let isPreviousElementTag = false;

    for (let i = 0; i < arr.length; i++) {
        const tagObj = arr[i];
        const tagName = propName(tagObj);
        let newJPath = "";
        if (jPath.length === 0) newJPath = tagName
        else newJPath = `${jPath}.${tagName}`;

        if (tagName === options.textNodeName) {
            let tagText = tagObj[tagName];
            if (!isStopNode(newJPath, options)) {
                tagText = options.tagValueProcessor(tagName, tagText);
                tagText = replaceEntitiesValue(tagText, options);
            }
            if (isPreviousElementTag) {
                xmlStr += indentation;
            }
            xmlStr += tagText;
            isPreviousElementTag = false;
            continue;
        } else if (tagName === options.cdataPropName) {
            if (isPreviousElementTag) {
                xmlStr += indentation;
            }
            xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
            isPreviousElementTag = false;
            continue;
        } else if (tagName === options.commentPropName) {
            xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
            isPreviousElementTag = true;
            continue;
        } else if (tagName[0] === "?") {
            const attStr = attr_to_str(tagObj[":@"], options);
            const tempInd = tagName === "?xml" ? "" : indentation;
            let piTextNodeName = tagObj[tagName][0][options.textNodeName];
            piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : ""; //remove extra spacing
            xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr}?>`;
            isPreviousElementTag = true;
            continue;
        }
        let newIdentation = indentation;
        if (newIdentation !== "") {
            newIdentation += options.indentBy;
        }
        const attStr = attr_to_str(tagObj[":@"], options);
        const tagStart = indentation + `<${tagName}${attStr}`;
        const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
        if (options.unpairedTags.indexOf(tagName) !== -1) {
            if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
            else xmlStr += tagStart + "/>";
        } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
            xmlStr += tagStart + "/>";
        } else if (tagValue && tagValue.endsWith(">")) {
            xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
        } else {
            xmlStr += tagStart + ">";
            if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
                xmlStr += indentation + options.indentBy + tagValue + indentation;
            } else {
                xmlStr += tagValue;
            }
            xmlStr += `</${tagName}>`;
        }
        isPreviousElementTag = true;
    }

    return xmlStr;
}

function propName(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== ":@") return key;
    }
}

function attr_to_str(attrMap, options) {
    let attrStr = "";
    if (attrMap && !options.ignoreAttributes) {
        for (let attr in attrMap) {
            let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
            attrVal = replaceEntitiesValue(attrVal, options);
            if (attrVal === true && options.suppressBooleanAttributes) {
                attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
            } else {
                attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
            }
        }
    }
    return attrStr;
}

function isStopNode(jPath, options) {
    jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
    let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
    for (let index in options.stopNodes) {
        if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName) return true;
    }
    return false;
}

function replaceEntitiesValue(textValue, options) {
    if (textValue && textValue.length > 0 && options.processEntities) {
        for (let i = 0; i < options.entities.length; i++) {
            const entity = options.entities[i];
            textValue = textValue.replace(entity.regex, entity.val);
        }
    }
    return textValue;
}
module.exports = toXml;


/***/ }),

/***/ 6072:
/***/ ((module) => {

//TODO: handle comments
function readDocType(xmlData, i){
    
    const entities = {};
    if( xmlData[i + 3] === 'O' &&
         xmlData[i + 4] === 'C' &&
         xmlData[i + 5] === 'T' &&
         xmlData[i + 6] === 'Y' &&
         xmlData[i + 7] === 'P' &&
         xmlData[i + 8] === 'E')
    {    
        i = i+9;
        let angleBracketsCount = 1;
        let hasBody = false, entity = false, comment = false;
        let exp = "";
        for(;i<xmlData.length;i++){
            if (xmlData[i] === '<' && !comment) {
                if( hasBody && 
                     xmlData[i+1] === '!' &&
                     xmlData[i+2] === 'E' &&
                     xmlData[i+3] === 'N' &&
                     xmlData[i+4] === 'T' &&
                     xmlData[i+5] === 'I' &&
                     xmlData[i+6] === 'T' &&
                     xmlData[i+7] === 'Y'
                ){
                    i += 7;
                    entity = true;
                }else if( hasBody && 
                    xmlData[i+1] === '!' &&
                     xmlData[i+2] === 'E' &&
                     xmlData[i+3] === 'L' &&
                     xmlData[i+4] === 'E' &&
                     xmlData[i+5] === 'M' &&
                     xmlData[i+6] === 'E' &&
                     xmlData[i+7] === 'N' &&
                     xmlData[i+8] === 'T'
                ){
                    //Not supported
                    i += 8;
                }else if( hasBody && 
                    xmlData[i+1] === '!' &&
                    xmlData[i+2] === 'A' &&
                    xmlData[i+3] === 'T' &&
                    xmlData[i+4] === 'T' &&
                    xmlData[i+5] === 'L' &&
                    xmlData[i+6] === 'I' &&
                    xmlData[i+7] === 'S' &&
                    xmlData[i+8] === 'T'
                ){
                    //Not supported
                    i += 8;
                }else if( hasBody && 
                    xmlData[i+1] === '!' &&
                    xmlData[i+2] === 'N' &&
                    xmlData[i+3] === 'O' &&
                    xmlData[i+4] === 'T' &&
                    xmlData[i+5] === 'A' &&
                    xmlData[i+6] === 'T' &&
                    xmlData[i+7] === 'I' &&
                    xmlData[i+8] === 'O' &&
                    xmlData[i+9] === 'N'
                ){
                    //Not supported
                    i += 9;
                }else if( //comment
                    xmlData[i+1] === '!' &&
                    xmlData[i+2] === '-' &&
                    xmlData[i+3] === '-'
                ){
                    comment = true;
                }else{
                    throw new Error("Invalid DOCTYPE");
                }
                angleBracketsCount++;
                exp = "";
            } else if (xmlData[i] === '>') {
                if(comment){
                    if( xmlData[i - 1] === "-" && xmlData[i - 2] === "-"){
                        comment = false;
                        angleBracketsCount--;
                    }
                }else{
                    if(entity) {
                        parseEntityExp(exp, entities);
                        entity = false;
                    }
                    angleBracketsCount--;
                }
                if (angleBracketsCount === 0) {
                  break;
                }
            }else if( xmlData[i] === '['){
                hasBody = true;
            }else{
                exp += xmlData[i];
            }
        }
        if(angleBracketsCount !== 0){
            throw new Error(`Unclosed DOCTYPE`);
        }
    }else{
        throw new Error(`Invalid Tag instead of DOCTYPE`);
    }
    return {entities, i};
}

const entityRegex = RegExp("^\\s([a-zA-z0-0]+)[ \t](['\"])([^&]+)\\2");
function parseEntityExp(exp, entities){
    const match = entityRegex.exec(exp);
    if(match){
        entities[ match[1] ] = {
            regx : RegExp( `&${match[1]};`,"g"),
            val: match[3]
        };
    }
}
module.exports = readDocType;

/***/ }),

/***/ 6993:
/***/ ((__unused_webpack_module, exports) => {


const defaultOptions = {
    preserveOrder: false,
    attributeNamePrefix: '@_',
    attributesGroupName: false,
    textNodeName: '#text',
    ignoreAttributes: true,
    removeNSPrefix: false, // remove NS from tag name or attribute name if true
    allowBooleanAttributes: false, //a tag can have attributes without any value
    //ignoreRootElement : false,
    parseTagValue: true,
    parseAttributeValue: false,
    trimValues: true, //Trim string values of tag and attributes
    cdataPropName: false,
    numberParseOptions: {
      hex: true,
      leadingZeros: true,
      eNotation: true
    },
    tagValueProcessor: function(tagName, val) {
      return val;
    },
    attributeValueProcessor: function(attrName, val) {
      return val;
    },
    stopNodes: [], //nested tags will not be parsed even for errors
    alwaysCreateTextNode: false,
    isArray: () => false,
    commentPropName: false,
    unpairedTags: [],
    processEntities: true,
    htmlEntities: false,
    ignoreDeclaration: false,
    ignorePiTags: false,
    transformTagName: false,
    transformAttributeName: false,
};
   
const buildOptions = function(options) {
    return Object.assign({}, defaultOptions, options);
};

exports.buildOptions = buildOptions;
exports.defaultOptions = defaultOptions;

/***/ }),

/***/ 5832:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

///@ts-check

const util = __nccwpck_require__(8280);
const xmlNode = __nccwpck_require__(7462);
const readDocType = __nccwpck_require__(6072);
const toNumber = __nccwpck_require__(4526);

const regx =
  '<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|((NAME:)?(NAME))([^>]*)>|((\\/)(NAME)\\s*>))([^<]*)'
  .replace(/NAME/g, util.nameRegexp);

//const tagsRegx = new RegExp("<(\\/?[\\w:\\-\._]+)([^>]*)>(\\s*"+cdataRegx+")*([^<]+)?","g");
//const tagsRegx = new RegExp("<(\\/?)((\\w*:)?([\\w:\\-\._]+))([^>]*)>([^<]*)("+cdataRegx+"([^<]*))*([^<]+)?","g");

class OrderedObjParser{
  constructor(options){
    this.options = options;
    this.currentNode = null;
    this.tagsNodeStack = [];
    this.docTypeEntities = {};
    this.lastEntities = {
      "apos" : { regex: /&(apos|#39|#x27);/g, val : "'"},
      "gt" : { regex: /&(gt|#62|#x3E);/g, val : ">"},
      "lt" : { regex: /&(lt|#60|#x3C);/g, val : "<"},
      "quot" : { regex: /&(quot|#34|#x22);/g, val : "\""},
    };
    this.ampEntity = { regex: /&(amp|#38|#x26);/g, val : "&"};
    this.htmlEntities = {
      "space": { regex: /&(nbsp|#160);/g, val: " " },
      // "lt" : { regex: /&(lt|#60);/g, val: "<" },
      // "gt" : { regex: /&(gt|#62);/g, val: ">" },
      // "amp" : { regex: /&(amp|#38);/g, val: "&" },
      // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
      // "apos" : { regex: /&(apos|#39);/g, val: "'" },
      "cent" : { regex: /&(cent|#162);/g, val: "¢" },
      "pound" : { regex: /&(pound|#163);/g, val: "£" },
      "yen" : { regex: /&(yen|#165);/g, val: "¥" },
      "euro" : { regex: /&(euro|#8364);/g, val: "€" },
      "copyright" : { regex: /&(copy|#169);/g, val: "©" },
      "reg" : { regex: /&(reg|#174);/g, val: "®" },
      "inr" : { regex: /&(inr|#8377);/g, val: "₹" },
    };
    this.addExternalEntities = addExternalEntities;
    this.parseXml = parseXml;
    this.parseTextData = parseTextData;
    this.resolveNameSpace = resolveNameSpace;
    this.buildAttributesMap = buildAttributesMap;
    this.isItStopNode = isItStopNode;
    this.replaceEntitiesValue = replaceEntitiesValue;
    this.readStopNodeData = readStopNodeData;
    this.saveTextToParentTag = saveTextToParentTag;
  }

}

function addExternalEntities(externalEntities){
  const entKeys = Object.keys(externalEntities);
  for (let i = 0; i < entKeys.length; i++) {
    const ent = entKeys[i];
    this.lastEntities[ent] = {
       regex: new RegExp("&"+ent+";","g"),
       val : externalEntities[ent]
    }
  }
}

/**
 * @param {string} val
 * @param {string} tagName
 * @param {string} jPath
 * @param {boolean} dontTrim
 * @param {boolean} hasAttributes
 * @param {boolean} isLeafNode
 * @param {boolean} escapeEntities
 */
function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
  if (val !== undefined) {
    if (this.options.trimValues && !dontTrim) {
      val = val.trim();
    }
    if(val.length > 0){
      if(!escapeEntities) val = this.replaceEntitiesValue(val);
      
      const newval = this.options.tagValueProcessor(tagName, val, jPath, hasAttributes, isLeafNode);
      if(newval === null || newval === undefined){
        //don't parse
        return val;
      }else if(typeof newval !== typeof val || newval !== val){
        //overwrite
        return newval;
      }else if(this.options.trimValues){
        return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
      }else{
        const trimmedVal = val.trim();
        if(trimmedVal === val){
          return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
        }else{
          return val;
        }
      }
    }
  }
}

function resolveNameSpace(tagname) {
  if (this.options.removeNSPrefix) {
    const tags = tagname.split(':');
    const prefix = tagname.charAt(0) === '/' ? '/' : '';
    if (tags[0] === 'xmlns') {
      return '';
    }
    if (tags.length === 2) {
      tagname = prefix + tags[1];
    }
  }
  return tagname;
}

//TODO: change regex to capture NS
//const attrsRegx = new RegExp("([\\w\\-\\.\\:]+)\\s*=\\s*(['\"])((.|\n)*?)\\2","gm");
const attrsRegx = new RegExp('([^\\s=]+)\\s*(=\\s*([\'"])([\\s\\S]*?)\\3)?', 'gm');

function buildAttributesMap(attrStr, jPath) {
  if (!this.options.ignoreAttributes && typeof attrStr === 'string') {
    // attrStr = attrStr.replace(/\r?\n/g, ' ');
    //attrStr = attrStr || attrStr.trim();

    const matches = util.getAllMatches(attrStr, attrsRegx);
    const len = matches.length; //don't make it inline
    const attrs = {};
    for (let i = 0; i < len; i++) {
      const attrName = this.resolveNameSpace(matches[i][1]);
      let oldVal = matches[i][4];
      let aName = this.options.attributeNamePrefix + attrName;
      if (attrName.length) {
        if (this.options.transformAttributeName) {
          aName = this.options.transformAttributeName(aName);
        }
        if(aName === "__proto__") aName  = "#__proto__";
        if (oldVal !== undefined) {
          if (this.options.trimValues) {
            oldVal = oldVal.trim();
          }
          oldVal = this.replaceEntitiesValue(oldVal);
          const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
          if(newVal === null || newVal === undefined){
            //don't parse
            attrs[aName] = oldVal;
          }else if(typeof newVal !== typeof oldVal || newVal !== oldVal){
            //overwrite
            attrs[aName] = newVal;
          }else{
            //parse
            attrs[aName] = parseValue(
              oldVal,
              this.options.parseAttributeValue,
              this.options.numberParseOptions
            );
          }
        } else if (this.options.allowBooleanAttributes) {
          attrs[aName] = true;
        }
      }
    }
    if (!Object.keys(attrs).length) {
      return;
    }
    if (this.options.attributesGroupName) {
      const attrCollection = {};
      attrCollection[this.options.attributesGroupName] = attrs;
      return attrCollection;
    }
    return attrs;
  }
}

const parseXml = function(xmlData) {
  xmlData = xmlData.replace(/\r\n?/g, "\n"); //TODO: remove this line
  const xmlObj = new xmlNode('!xml');
  let currentNode = xmlObj;
  let textData = "";
  let jPath = "";
  for(let i=0; i< xmlData.length; i++){//for each char in XML data
    const ch = xmlData[i];
    if(ch === '<'){
      // const nextIndex = i+1;
      // const _2ndChar = xmlData[nextIndex];
      if( xmlData[i+1] === '/') {//Closing Tag
        const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.")
        let tagName = xmlData.substring(i+2,closeIndex).trim();

        if(this.options.removeNSPrefix){
          const colonIndex = tagName.indexOf(":");
          if(colonIndex !== -1){
            tagName = tagName.substr(colonIndex+1);
          }
        }

        if(this.options.transformTagName) {
          tagName = this.options.transformTagName(tagName);
        }

        if(currentNode){
          textData = this.saveTextToParentTag(textData, currentNode, jPath);
        }

        jPath = jPath.substr(0, jPath.lastIndexOf("."));
        
        currentNode = this.tagsNodeStack.pop();//avoid recurssion, set the parent tag scope
        textData = "";
        i = closeIndex;
      } else if( xmlData[i+1] === '?') {

        let tagData = readTagExp(xmlData,i, false, "?>");
        if(!tagData) throw new Error("Pi Tag is not closed.");

        textData = this.saveTextToParentTag(textData, currentNode, jPath);
        if( (this.options.ignoreDeclaration && tagData.tagName === "?xml") || this.options.ignorePiTags){

        }else{
  
          const childNode = new xmlNode(tagData.tagName);
          childNode.add(this.options.textNodeName, "");
          
          if(tagData.tagName !== tagData.tagExp && tagData.attrExpPresent){
            childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath);
          }
          currentNode.addChild(childNode);

        }


        i = tagData.closeIndex + 1;
      } else if(xmlData.substr(i + 1, 3) === '!--') {
        const endIndex = findClosingIndex(xmlData, "-->", i+4, "Comment is not closed.")
        if(this.options.commentPropName){
          const comment = xmlData.substring(i + 4, endIndex - 2);

          textData = this.saveTextToParentTag(textData, currentNode, jPath);

          currentNode.add(this.options.commentPropName, [ { [this.options.textNodeName] : comment } ]);
        }
        i = endIndex;
      } else if( xmlData.substr(i + 1, 2) === '!D') {
        const result = readDocType(xmlData, i);
        this.docTypeEntities = result.entities;
        i = result.i;
      }else if(xmlData.substr(i + 1, 2) === '![') {
        const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
        const tagExp = xmlData.substring(i + 9,closeIndex);

        textData = this.saveTextToParentTag(textData, currentNode, jPath);

        //cdata should be set even if it is 0 length string
        if(this.options.cdataPropName){
          // let val = this.parseTextData(tagExp, this.options.cdataPropName, jPath + "." + this.options.cdataPropName, true, false, true);
          // if(!val) val = "";
          currentNode.add(this.options.cdataPropName, [ { [this.options.textNodeName] : tagExp } ]);
        }else{
          let val = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true);
          if(val == undefined) val = "";
          currentNode.add(this.options.textNodeName, val);
        }
        
        i = closeIndex + 2;
      }else {//Opening tag
        let result = readTagExp(xmlData,i, this.options.removeNSPrefix);
        let tagName= result.tagName;
        let tagExp = result.tagExp;
        let attrExpPresent = result.attrExpPresent;
        let closeIndex = result.closeIndex;

        if (this.options.transformTagName) {
          tagName = this.options.transformTagName(tagName);
        }
        
        //save text as child node
        if (currentNode && textData) {
          if(currentNode.tagname !== '!xml'){
            //when nested tag is found
            textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
          }
        }

        if(tagName !== xmlObj.tagname){
          jPath += jPath ? "." + tagName : tagName;
        }

        //check if last tag was unpaired tag
        const lastTag = currentNode;
        if(lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1 ){
          currentNode = this.tagsNodeStack.pop();
        }

        if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) { //TODO: namespace
          let tagContent = "";
          //self-closing tag
          if(tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1){
            i = result.closeIndex;
          }
          //boolean tag
          else if(this.options.unpairedTags.indexOf(tagName) !== -1){
            i = result.closeIndex;
          }
          //normal tag
          else{
            //read until closing tag is found
            const result = this.readStopNodeData(xmlData, tagName, closeIndex + 1);
            if(!result) throw new Error(`Unexpected end of ${tagName}`);
            i = result.i;
            tagContent = result.tagContent;
          }

          const childNode = new xmlNode(tagName);
          if(tagName !== tagExp && attrExpPresent){
            childNode[":@"] = this.buildAttributesMap(tagExp, jPath);
          }
          if(tagContent) {
            tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
          }
          
          jPath = jPath.substr(0, jPath.lastIndexOf("."));
          childNode.add(this.options.textNodeName, tagContent);
          
          currentNode.addChild(childNode);
        }else{
  //selfClosing tag
          if(tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1){
            if(tagName[tagName.length - 1] === "/"){ //remove trailing '/'
              tagName = tagName.substr(0, tagName.length - 1);
              tagExp = tagName;
            }else{
              tagExp = tagExp.substr(0, tagExp.length - 1);
            }
            
            if(this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }

            const childNode = new xmlNode(tagName);
            if(tagName !== tagExp && attrExpPresent){
              childNode[":@"] = this.buildAttributesMap(tagExp, jPath);
            }
            jPath = jPath.substr(0, jPath.lastIndexOf("."));
            currentNode.addChild(childNode);
          }
    //opening tag
          else{
            const childNode = new xmlNode( tagName);
            this.tagsNodeStack.push(currentNode);
            
            if(tagName !== tagExp && attrExpPresent){
              childNode[":@"] = this.buildAttributesMap(tagExp, jPath);
            }
            currentNode.addChild(childNode);
            currentNode = childNode;
          }
          textData = "";
          i = closeIndex;
        }
      }
    }else{
      textData += xmlData[i];
    }
  }
  return xmlObj.child;
}

const replaceEntitiesValue = function(val){

  if(this.options.processEntities){
    for(let entityName in this.docTypeEntities){
      const entity = this.docTypeEntities[entityName];
      val = val.replace( entity.regx, entity.val);
    }
    for(let entityName in this.lastEntities){
      const entity = this.lastEntities[entityName];
      val = val.replace( entity.regex, entity.val);
    }
    if(this.options.htmlEntities){
      for(let entityName in this.htmlEntities){
        const entity = this.htmlEntities[entityName];
        val = val.replace( entity.regex, entity.val);
      }
    }
    val = val.replace( this.ampEntity.regex, this.ampEntity.val);
  }
  return val;
}
function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
  if (textData) { //store previously collected data as textNode
    if(isLeafNode === undefined) isLeafNode = Object.keys(currentNode.child).length === 0
    
    textData = this.parseTextData(textData,
      currentNode.tagname,
      jPath,
      false,
      currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
      isLeafNode);

    if (textData !== undefined && textData !== "")
      currentNode.add(this.options.textNodeName, textData);
    textData = "";
  }
  return textData;
}

//TODO: use jPath to simplify the logic
/**
 * 
 * @param {string[]} stopNodes 
 * @param {string} jPath
 * @param {string} currentTagName 
 */
function isItStopNode(stopNodes, jPath, currentTagName){
  const allNodesExp = "*." + currentTagName;
  for (const stopNodePath in stopNodes) {
    const stopNodeExp = stopNodes[stopNodePath];
    if( allNodesExp === stopNodeExp || jPath === stopNodeExp  ) return true;
  }
  return false;
}

/**
 * Returns the tag Expression and where it is ending handling single-dobule quotes situation
 * @param {string} xmlData 
 * @param {number} i starting index
 * @returns 
 */
function tagExpWithClosingIndex(xmlData, i, closingChar = ">"){
  let attrBoundary;
  let tagExp = "";
  for (let index = i; index < xmlData.length; index++) {
    let ch = xmlData[index];
    if (attrBoundary) {
        if (ch === attrBoundary) attrBoundary = "";//reset
    } else if (ch === '"' || ch === "'") {
        attrBoundary = ch;
    } else if (ch === closingChar[0]) {
      if(closingChar[1]){
        if(xmlData[index + 1] === closingChar[1]){
          return {
            data: tagExp,
            index: index
          }
        }
      }else{
        return {
          data: tagExp,
          index: index
        }
      }
    } else if (ch === '\t') {
      ch = " "
    }
    tagExp += ch;
  }
}

function findClosingIndex(xmlData, str, i, errMsg){
  const closingIndex = xmlData.indexOf(str, i);
  if(closingIndex === -1){
    throw new Error(errMsg)
  }else{
    return closingIndex + str.length - 1;
  }
}

function readTagExp(xmlData,i, removeNSPrefix, closingChar = ">"){
  const result = tagExpWithClosingIndex(xmlData, i+1, closingChar);
  if(!result) return;
  let tagExp = result.data;
  const closeIndex = result.index;
  const separatorIndex = tagExp.search(/\s/);
  let tagName = tagExp;
  let attrExpPresent = true;
  if(separatorIndex !== -1){//separate tag name and attributes expression
    tagName = tagExp.substr(0, separatorIndex).replace(/\s\s*$/, '');
    tagExp = tagExp.substr(separatorIndex + 1);
  }

  if(removeNSPrefix){
    const colonIndex = tagName.indexOf(":");
    if(colonIndex !== -1){
      tagName = tagName.substr(colonIndex+1);
      attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
    }
  }

  return {
    tagName: tagName,
    tagExp: tagExp,
    closeIndex: closeIndex,
    attrExpPresent: attrExpPresent,
  }
}
/**
 * find paired tag for a stop node
 * @param {string} xmlData 
 * @param {string} tagName 
 * @param {number} i 
 */
function readStopNodeData(xmlData, tagName, i){
  const startIndex = i;
  // Starting at 1 since we already have an open tag
  let openTagCount = 1;

  for (; i < xmlData.length; i++) {
    if( xmlData[i] === "<"){ 
      if (xmlData[i+1] === "/") {//close tag
          const closeIndex = findClosingIndex(xmlData, ">", i, `${tagName} is not closed`);
          let closeTagName = xmlData.substring(i+2,closeIndex).trim();
          if(closeTagName === tagName){
            openTagCount--;
            if (openTagCount === 0) {
              return {
                tagContent: xmlData.substring(startIndex, i),
                i : closeIndex
              }
            }
          }
          i=closeIndex;
        } else if(xmlData[i+1] === '?') { 
          const closeIndex = findClosingIndex(xmlData, "?>", i+1, "StopNode is not closed.")
          i=closeIndex;
        } else if(xmlData.substr(i + 1, 3) === '!--') { 
          const closeIndex = findClosingIndex(xmlData, "-->", i+3, "StopNode is not closed.")
          i=closeIndex;
        } else if(xmlData.substr(i + 1, 2) === '![') { 
          const closeIndex = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
          i=closeIndex;
        } else {
          const tagData = readTagExp(xmlData, i, '>')

          if (tagData) {
            const openTagName = tagData && tagData.tagName;
            if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length-1] !== "/") {
              openTagCount++;
            }
            i=tagData.closeIndex;
          }
        }
      }
  }//end for loop
}

function parseValue(val, shouldParse, options) {
  if (shouldParse && typeof val === 'string') {
    //console.log(options)
    const newval = val.trim();
    if(newval === 'true' ) return true;
    else if(newval === 'false' ) return false;
    else return toNumber(val, options);
  } else {
    if (util.isExist(val)) {
      return val;
    } else {
      return '';
    }
  }
}


module.exports = OrderedObjParser;


/***/ }),

/***/ 2380:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { buildOptions} = __nccwpck_require__(6993);
const OrderedObjParser = __nccwpck_require__(5832);
const { prettify} = __nccwpck_require__(2882);
const validator = __nccwpck_require__(1739);

class XMLParser{
    
    constructor(options){
        this.externalEntities = {};
        this.options = buildOptions(options);
        
    }
    /**
     * Parse XML dats to JS object 
     * @param {string|Buffer} xmlData 
     * @param {boolean|Object} validationOption 
     */
    parse(xmlData,validationOption){
        if(typeof xmlData === "string"){
        }else if( xmlData.toString){
            xmlData = xmlData.toString();
        }else{
            throw new Error("XML data is accepted in String or Bytes[] form.")
        }
        if( validationOption){
            if(validationOption === true) validationOption = {}; //validate with default options
            
            const result = validator.validate(xmlData, validationOption);
            if (result !== true) {
              throw Error( `${result.err.msg}:${result.err.line}:${result.err.col}` )
            }
          }
        const orderedObjParser = new OrderedObjParser(this.options);
        orderedObjParser.addExternalEntities(this.externalEntities);
        const orderedResult = orderedObjParser.parseXml(xmlData);
        if(this.options.preserveOrder || orderedResult === undefined) return orderedResult;
        else return prettify(orderedResult, this.options);
    }

    /**
     * Add Entity which is not by default supported by this library
     * @param {string} key 
     * @param {string} value 
     */
    addEntity(key, value){
        if(value.indexOf("&") !== -1){
            throw new Error("Entity value can't have '&'")
        }else if(key.indexOf("&") !== -1 || key.indexOf(";") !== -1){
            throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'")
        }else if(value === "&"){
            throw new Error("An entity with value '&' is not permitted");
        }else{
            this.externalEntities[key] = value;
        }
    }
}

module.exports = XMLParser;

/***/ }),

/***/ 2882:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * 
 * @param {array} node 
 * @param {any} options 
 * @returns 
 */
function prettify(node, options){
  return compress( node, options);
}

/**
 * 
 * @param {array} arr 
 * @param {object} options 
 * @param {string} jPath 
 * @returns object
 */
function compress(arr, options, jPath){
  let text;
  const compressedObj = {};
  for (let i = 0; i < arr.length; i++) {
    const tagObj = arr[i];
    const property = propName(tagObj);
    let newJpath = "";
    if(jPath === undefined) newJpath = property;
    else newJpath = jPath + "." + property;

    if(property === options.textNodeName){
      if(text === undefined) text = tagObj[property];
      else text += "" + tagObj[property];
    }else if(property === undefined){
      continue;
    }else if(tagObj[property]){
      
      let val = compress(tagObj[property], options, newJpath);
      const isLeaf = isLeafTag(val, options);

      if(tagObj[":@"]){
        assignAttributes( val, tagObj[":@"], newJpath, options);
      }else if(Object.keys(val).length === 1 && val[options.textNodeName] !== undefined && !options.alwaysCreateTextNode){
        val = val[options.textNodeName];
      }else if(Object.keys(val).length === 0){
        if(options.alwaysCreateTextNode) val[options.textNodeName] = "";
        else val = "";
      }

      if(compressedObj[property] !== undefined && compressedObj.hasOwnProperty(property)) {
        if(!Array.isArray(compressedObj[property])) {
            compressedObj[property] = [ compressedObj[property] ];
        }
        compressedObj[property].push(val);
      }else{
        //TODO: if a node is not an array, then check if it should be an array
        //also determine if it is a leaf node
        if (options.isArray(property, newJpath, isLeaf )) {
          compressedObj[property] = [val];
        }else{
          compressedObj[property] = val;
        }
      }
    }
    
  }
  // if(text && text.length > 0) compressedObj[options.textNodeName] = text;
  if(typeof text === "string"){
    if(text.length > 0) compressedObj[options.textNodeName] = text;
  }else if(text !== undefined) compressedObj[options.textNodeName] = text;
  return compressedObj;
}

function propName(obj){
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if(key !== ":@") return key;
  }
}

function assignAttributes(obj, attrMap, jpath, options){
  if (attrMap) {
    const keys = Object.keys(attrMap);
    const len = keys.length; //don't make it inline
    for (let i = 0; i < len; i++) {
      const atrrName = keys[i];
      if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
        obj[atrrName] = [ attrMap[atrrName] ];
      } else {
        obj[atrrName] = attrMap[atrrName];
      }
    }
  }
}

function isLeafTag(obj, options){
  const propCount = Object.keys(obj).length;
  if( propCount === 0 || (propCount === 1 && obj[options.textNodeName]) ) return true;
  return false;
}
exports.prettify = prettify;


/***/ }),

/***/ 7462:
/***/ ((module) => {

"use strict";


class XmlNode{
  constructor(tagname) {
    this.tagname = tagname;
    this.child = []; //nested tags, text, cdata, comments in order
    this[":@"] = {}; //attributes map
  }
  add(key,val){
    // this.child.push( {name : key, val: val, isCdata: isCdata });
    if(key === "__proto__") key = "#__proto__";
    this.child.push( {[key]: val });
  }
  addChild(node) {
    if(node.tagname === "__proto__") node.tagname = "#__proto__";
    if(node[":@"] && Object.keys(node[":@"]).length > 0){
      this.child.push( { [node.tagname]: node.child, [":@"]: node[":@"] });
    }else{
      this.child.push( { [node.tagname]: node.child });
    }
  };
};


module.exports = XmlNode;

/***/ }),

/***/ 4526:
/***/ ((module) => {

const hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
const numRegex = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
// const octRegex = /0x[a-z0-9]+/;
// const binRegex = /0x[a-z0-9]+/;


//polyfill
if (!Number.parseInt && window.parseInt) {
    Number.parseInt = window.parseInt;
}
if (!Number.parseFloat && window.parseFloat) {
    Number.parseFloat = window.parseFloat;
}

  
const consider = {
    hex :  true,
    leadingZeros: true,
    decimalPoint: "\.",
    eNotation: true
    //skipLike: /regex/
};

function toNumber(str, options = {}){
    // const options = Object.assign({}, consider);
    // if(opt.leadingZeros === false){
    //     options.leadingZeros = false;
    // }else if(opt.hex === false){
    //     options.hex = false;
    // }

    options = Object.assign({}, consider, options );
    if(!str || typeof str !== "string" ) return str;
    
    let trimmedStr  = str.trim();
    // if(trimmedStr === "0.0") return 0;
    // else if(trimmedStr === "+0.0") return 0;
    // else if(trimmedStr === "-0.0") return -0;

    if(options.skipLike !== undefined && options.skipLike.test(trimmedStr)) return str;
    else if (options.hex && hexRegex.test(trimmedStr)) {
        return Number.parseInt(trimmedStr, 16);
    // } else if (options.parseOct && octRegex.test(str)) {
    //     return Number.parseInt(val, 8);
    // }else if (options.parseBin && binRegex.test(str)) {
    //     return Number.parseInt(val, 2);
    }else{
        //separate negative sign, leading zeros, and rest number
        const match = numRegex.exec(trimmedStr);
        if(match){
            const sign = match[1];
            const leadingZeros = match[2];
            let numTrimmedByZeros = trimZeros(match[3]); //complete num without leading zeros
            //trim ending zeros for floating number
            
            const eNotation = match[4] || match[6];
            if(!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".") return str; //-0123
            else if(!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".") return str; //0123
            else{//no leading zeros or leading zeros are allowed
                const num = Number(trimmedStr);
                const numStr = "" + num;
                if(numStr.search(/[eE]/) !== -1){ //given number is long and parsed to eNotation
                    if(options.eNotation) return num;
                    else return str;
                }else if(eNotation){ //given number has enotation
                    if(options.eNotation) return num;
                    else return str;
                }else if(trimmedStr.indexOf(".") !== -1){ //floating number
                    // const decimalPart = match[5].substr(1);
                    // const intPart = trimmedStr.substr(0,trimmedStr.indexOf("."));

                    
                    // const p = numStr.indexOf(".");
                    // const givenIntPart = numStr.substr(0,p);
                    // const givenDecPart = numStr.substr(p+1);
                    if(numStr === "0" && (numTrimmedByZeros === "") ) return num; //0.0
                    else if(numStr === numTrimmedByZeros) return num; //0.456. 0.79000
                    else if( sign && numStr === "-"+numTrimmedByZeros) return num;
                    else return str;
                }
                
                if(leadingZeros){
                    // if(numTrimmedByZeros === numStr){
                    //     if(options.leadingZeros) return num;
                    //     else return str;
                    // }else return str;
                    if(numTrimmedByZeros === numStr) return num;
                    else if(sign+numTrimmedByZeros === numStr) return num;
                    else return str;
                }

                if(trimmedStr === numStr) return num;
                else if(trimmedStr === sign+numStr) return num;
                // else{
                //     //number with +/- sign
                //     trimmedStr.test(/[-+][0-9]);

                // }
                return str;
            }
            // else if(!eNotation && trimmedStr && trimmedStr !== Number(trimmedStr) ) return str;
            
        }else{ //non-numeric string
            return str;
        }
    }
}

/**
 * 
 * @param {string} numStr without leading zeros
 * @returns 
 */
function trimZeros(numStr){
    if(numStr && numStr.indexOf(".") !== -1){//float
        numStr = numStr.replace(/0+$/, ""); //remove ending zeros
        if(numStr === ".")  numStr = "0";
        else if(numStr[0] === ".")  numStr = "0"+numStr;
        else if(numStr[numStr.length-1] === ".")  numStr = numStr.substr(0,numStr.length-1);
        return numStr;
    }
    return numStr;
}
module.exports = toNumber


/***/ }),

/***/ 4351:
/***/ ((module) => {

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __esDecorate;
var __runInitializers;
var __propKey;
var __setFunctionName;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __classPrivateFieldIn;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __esDecorate = function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
        function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
        var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
        var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
        var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
        var _, done = false;
        for (var i = decorators.length - 1; i >= 0; i--) {
            var context = {};
            for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
            for (var p in contextIn.access) context.access[p] = contextIn.access[p];
            context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
            var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
            if (kind === "accessor") {
                if (result === void 0) continue;
                if (result === null || typeof result !== "object") throw new TypeError("Object expected");
                if (_ = accept(result.get)) descriptor.get = _;
                if (_ = accept(result.set)) descriptor.set = _;
                if (_ = accept(result.init)) initializers.push(_);
            }
            else if (_ = accept(result)) {
                if (kind === "field") initializers.push(_);
                else descriptor[key] = _;
            }
        }
        if (target) Object.defineProperty(target, contextIn.name, descriptor);
        done = true;
    };

    __runInitializers = function (thisArg, initializers, value) {
        var useValue = arguments.length > 2;
        for (var i = 0; i < initializers.length; i++) {
            value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
        }
        return useValue ? value : void 0;
    };

    __propKey = function (x) {
        return typeof x === "symbol" ? x : "".concat(x);
    };

    __setFunctionName = function (f, name, prefix) {
        if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
        return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
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

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
            desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    __classPrivateFieldIn = function (state, receiver) {
        if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
        return typeof state === "function" ? receiver === state : state.has(receiver);
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__esDecorate", __esDecorate);
    exporter("__runInitializers", __runInitializers);
    exporter("__propKey", __propKey);
    exporter("__setFunctionName", __setFunctionName);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
    exporter("__classPrivateFieldIn", __classPrivateFieldIn);
});


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 7578:
/***/ ((module) => {

module.exports = eval("require")("aws-crt");


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 4300:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ 2081:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5158:
/***/ ((module) => {

"use strict";
module.exports = require("http2");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 7282:
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ 2781:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 7310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 9276:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"@aws-sdk/client-apprunner","description":"AWS SDK for JavaScript Apprunner Client for Node.js, Browser and React Native","version":"3.309.0","scripts":{"build":"concurrently \'yarn:build:cjs\' \'yarn:build:es\' \'yarn:build:types\'","build:cjs":"tsc -p tsconfig.cjs.json","build:docs":"typedoc","build:es":"tsc -p tsconfig.es.json","build:include:deps":"lerna run --scope $npm_package_name --include-dependencies build","build:types":"tsc -p tsconfig.types.json","build:types:downlevel":"downlevel-dts dist-types dist-types/ts3.4","clean":"rimraf ./dist-* && rimraf *.tsbuildinfo","extract:docs":"api-extractor run --local","generate:client":"node ../../scripts/generate-clients/single-service --solo apprunner"},"main":"./dist-cjs/index.js","types":"./dist-types/index.d.ts","module":"./dist-es/index.js","sideEffects":false,"dependencies":{"@aws-crypto/sha256-browser":"3.0.0","@aws-crypto/sha256-js":"3.0.0","@aws-sdk/client-sts":"3.309.0","@aws-sdk/config-resolver":"3.306.0","@aws-sdk/credential-provider-node":"3.309.0","@aws-sdk/fetch-http-handler":"3.306.0","@aws-sdk/hash-node":"3.306.0","@aws-sdk/invalid-dependency":"3.306.0","@aws-sdk/middleware-content-length":"3.306.0","@aws-sdk/middleware-endpoint":"3.306.0","@aws-sdk/middleware-host-header":"3.306.0","@aws-sdk/middleware-logger":"3.306.0","@aws-sdk/middleware-recursion-detection":"3.306.0","@aws-sdk/middleware-retry":"3.306.0","@aws-sdk/middleware-serde":"3.306.0","@aws-sdk/middleware-signing":"3.306.0","@aws-sdk/middleware-stack":"3.306.0","@aws-sdk/middleware-user-agent":"3.306.0","@aws-sdk/node-config-provider":"3.306.0","@aws-sdk/node-http-handler":"3.306.0","@aws-sdk/protocol-http":"3.306.0","@aws-sdk/smithy-client":"3.309.0","@aws-sdk/types":"3.306.0","@aws-sdk/url-parser":"3.306.0","@aws-sdk/util-base64":"3.303.0","@aws-sdk/util-body-length-browser":"3.303.0","@aws-sdk/util-body-length-node":"3.303.0","@aws-sdk/util-defaults-mode-browser":"3.309.0","@aws-sdk/util-defaults-mode-node":"3.309.0","@aws-sdk/util-endpoints":"3.306.0","@aws-sdk/util-retry":"3.306.0","@aws-sdk/util-user-agent-browser":"3.306.0","@aws-sdk/util-user-agent-node":"3.306.0","@aws-sdk/util-utf8":"3.303.0","tslib":"^2.5.0"},"devDependencies":{"@aws-sdk/service-client-documentation-generator":"3.303.0","@tsconfig/node14":"1.0.3","@types/node":"^14.14.31","concurrently":"7.0.0","downlevel-dts":"0.10.1","rimraf":"3.0.2","typedoc":"0.23.23","typescript":"~4.9.5"},"engines":{"node":">=14.0.0"},"typesVersions":{"<4.0":{"dist-types/*":["dist-types/ts3.4/*"]}},"files":["dist-*"],"author":{"name":"AWS SDK for JavaScript Team","url":"https://aws.amazon.com/javascript/"},"license":"Apache-2.0","browser":{"./dist-es/runtimeConfig":"./dist-es/runtimeConfig.browser"},"react-native":{"./dist-es/runtimeConfig":"./dist-es/runtimeConfig.native"},"homepage":"https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-apprunner","repository":{"type":"git","url":"https://github.com/aws/aws-sdk-js-v3.git","directory":"clients/client-apprunner"}}');

/***/ }),

/***/ 9722:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"@aws-sdk/client-sso-oidc","description":"AWS SDK for JavaScript Sso Oidc Client for Node.js, Browser and React Native","version":"3.309.0","scripts":{"build":"concurrently \'yarn:build:cjs\' \'yarn:build:es\' \'yarn:build:types\'","build:cjs":"tsc -p tsconfig.cjs.json","build:docs":"typedoc","build:es":"tsc -p tsconfig.es.json","build:include:deps":"lerna run --scope $npm_package_name --include-dependencies build","build:types":"tsc -p tsconfig.types.json","build:types:downlevel":"downlevel-dts dist-types dist-types/ts3.4","clean":"rimraf ./dist-* && rimraf *.tsbuildinfo","extract:docs":"api-extractor run --local","generate:client":"node ../../scripts/generate-clients/single-service --solo sso-oidc"},"main":"./dist-cjs/index.js","types":"./dist-types/index.d.ts","module":"./dist-es/index.js","sideEffects":false,"dependencies":{"@aws-crypto/sha256-browser":"3.0.0","@aws-crypto/sha256-js":"3.0.0","@aws-sdk/config-resolver":"3.306.0","@aws-sdk/fetch-http-handler":"3.306.0","@aws-sdk/hash-node":"3.306.0","@aws-sdk/invalid-dependency":"3.306.0","@aws-sdk/middleware-content-length":"3.306.0","@aws-sdk/middleware-endpoint":"3.306.0","@aws-sdk/middleware-host-header":"3.306.0","@aws-sdk/middleware-logger":"3.306.0","@aws-sdk/middleware-recursion-detection":"3.306.0","@aws-sdk/middleware-retry":"3.306.0","@aws-sdk/middleware-serde":"3.306.0","@aws-sdk/middleware-stack":"3.306.0","@aws-sdk/middleware-user-agent":"3.306.0","@aws-sdk/node-config-provider":"3.306.0","@aws-sdk/node-http-handler":"3.306.0","@aws-sdk/protocol-http":"3.306.0","@aws-sdk/smithy-client":"3.309.0","@aws-sdk/types":"3.306.0","@aws-sdk/url-parser":"3.306.0","@aws-sdk/util-base64":"3.303.0","@aws-sdk/util-body-length-browser":"3.303.0","@aws-sdk/util-body-length-node":"3.303.0","@aws-sdk/util-defaults-mode-browser":"3.309.0","@aws-sdk/util-defaults-mode-node":"3.309.0","@aws-sdk/util-endpoints":"3.306.0","@aws-sdk/util-retry":"3.306.0","@aws-sdk/util-user-agent-browser":"3.306.0","@aws-sdk/util-user-agent-node":"3.306.0","@aws-sdk/util-utf8":"3.303.0","tslib":"^2.5.0"},"devDependencies":{"@aws-sdk/service-client-documentation-generator":"3.303.0","@tsconfig/node14":"1.0.3","@types/node":"^14.14.31","concurrently":"7.0.0","downlevel-dts":"0.10.1","rimraf":"3.0.2","typedoc":"0.23.23","typescript":"~4.9.5"},"engines":{"node":">=14.0.0"},"typesVersions":{"<4.0":{"dist-types/*":["dist-types/ts3.4/*"]}},"files":["dist-*"],"author":{"name":"AWS SDK for JavaScript Team","url":"https://aws.amazon.com/javascript/"},"license":"Apache-2.0","browser":{"./dist-es/runtimeConfig":"./dist-es/runtimeConfig.browser"},"react-native":{"./dist-es/runtimeConfig":"./dist-es/runtimeConfig.native"},"homepage":"https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso-oidc","repository":{"type":"git","url":"https://github.com/aws/aws-sdk-js-v3.git","directory":"clients/client-sso-oidc"}}');

/***/ }),

/***/ 1092:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"@aws-sdk/client-sso","description":"AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native","version":"3.309.0","scripts":{"build":"concurrently \'yarn:build:cjs\' \'yarn:build:es\' \'yarn:build:types\'","build:cjs":"tsc -p tsconfig.cjs.json","build:docs":"typedoc","build:es":"tsc -p tsconfig.es.json","build:include:deps":"lerna run --scope $npm_package_name --include-dependencies build","build:types":"tsc -p tsconfig.types.json","build:types:downlevel":"downlevel-dts dist-types dist-types/ts3.4","clean":"rimraf ./dist-* && rimraf *.tsbuildinfo","extract:docs":"api-extractor run --local","generate:client":"node ../../scripts/generate-clients/single-service --solo sso"},"main":"./dist-cjs/index.js","types":"./dist-types/index.d.ts","module":"./dist-es/index.js","sideEffects":false,"dependencies":{"@aws-crypto/sha256-browser":"3.0.0","@aws-crypto/sha256-js":"3.0.0","@aws-sdk/config-resolver":"3.306.0","@aws-sdk/fetch-http-handler":"3.306.0","@aws-sdk/hash-node":"3.306.0","@aws-sdk/invalid-dependency":"3.306.0","@aws-sdk/middleware-content-length":"3.306.0","@aws-sdk/middleware-endpoint":"3.306.0","@aws-sdk/middleware-host-header":"3.306.0","@aws-sdk/middleware-logger":"3.306.0","@aws-sdk/middleware-recursion-detection":"3.306.0","@aws-sdk/middleware-retry":"3.306.0","@aws-sdk/middleware-serde":"3.306.0","@aws-sdk/middleware-stack":"3.306.0","@aws-sdk/middleware-user-agent":"3.306.0","@aws-sdk/node-config-provider":"3.306.0","@aws-sdk/node-http-handler":"3.306.0","@aws-sdk/protocol-http":"3.306.0","@aws-sdk/smithy-client":"3.309.0","@aws-sdk/types":"3.306.0","@aws-sdk/url-parser":"3.306.0","@aws-sdk/util-base64":"3.303.0","@aws-sdk/util-body-length-browser":"3.303.0","@aws-sdk/util-body-length-node":"3.303.0","@aws-sdk/util-defaults-mode-browser":"3.309.0","@aws-sdk/util-defaults-mode-node":"3.309.0","@aws-sdk/util-endpoints":"3.306.0","@aws-sdk/util-retry":"3.306.0","@aws-sdk/util-user-agent-browser":"3.306.0","@aws-sdk/util-user-agent-node":"3.306.0","@aws-sdk/util-utf8":"3.303.0","tslib":"^2.5.0"},"devDependencies":{"@aws-sdk/service-client-documentation-generator":"3.303.0","@tsconfig/node14":"1.0.3","@types/node":"^14.14.31","concurrently":"7.0.0","downlevel-dts":"0.10.1","rimraf":"3.0.2","typedoc":"0.23.23","typescript":"~4.9.5"},"engines":{"node":">=14.0.0"},"typesVersions":{"<4.0":{"dist-types/*":["dist-types/ts3.4/*"]}},"files":["dist-*"],"author":{"name":"AWS SDK for JavaScript Team","url":"https://aws.amazon.com/javascript/"},"license":"Apache-2.0","browser":{"./dist-es/runtimeConfig":"./dist-es/runtimeConfig.browser"},"react-native":{"./dist-es/runtimeConfig":"./dist-es/runtimeConfig.native"},"homepage":"https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso","repository":{"type":"git","url":"https://github.com/aws/aws-sdk-js-v3.git","directory":"clients/client-sso"}}');

/***/ }),

/***/ 7947:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"@aws-sdk/client-sts","description":"AWS SDK for JavaScript Sts Client for Node.js, Browser and React Native","version":"3.309.0","scripts":{"build":"concurrently \'yarn:build:cjs\' \'yarn:build:es\' \'yarn:build:types\'","build:cjs":"tsc -p tsconfig.cjs.json","build:docs":"typedoc","build:es":"tsc -p tsconfig.es.json","build:include:deps":"lerna run --scope $npm_package_name --include-dependencies build","build:types":"tsc -p tsconfig.types.json","build:types:downlevel":"downlevel-dts dist-types dist-types/ts3.4","clean":"rimraf ./dist-* && rimraf *.tsbuildinfo","extract:docs":"api-extractor run --local","generate:client":"node ../../scripts/generate-clients/single-service --solo sts","test":"yarn test:unit","test:unit":"jest"},"main":"./dist-cjs/index.js","types":"./dist-types/index.d.ts","module":"./dist-es/index.js","sideEffects":false,"dependencies":{"@aws-crypto/sha256-browser":"3.0.0","@aws-crypto/sha256-js":"3.0.0","@aws-sdk/config-resolver":"3.306.0","@aws-sdk/credential-provider-node":"3.309.0","@aws-sdk/fetch-http-handler":"3.306.0","@aws-sdk/hash-node":"3.306.0","@aws-sdk/invalid-dependency":"3.306.0","@aws-sdk/middleware-content-length":"3.306.0","@aws-sdk/middleware-endpoint":"3.306.0","@aws-sdk/middleware-host-header":"3.306.0","@aws-sdk/middleware-logger":"3.306.0","@aws-sdk/middleware-recursion-detection":"3.306.0","@aws-sdk/middleware-retry":"3.306.0","@aws-sdk/middleware-sdk-sts":"3.306.0","@aws-sdk/middleware-serde":"3.306.0","@aws-sdk/middleware-signing":"3.306.0","@aws-sdk/middleware-stack":"3.306.0","@aws-sdk/middleware-user-agent":"3.306.0","@aws-sdk/node-config-provider":"3.306.0","@aws-sdk/node-http-handler":"3.306.0","@aws-sdk/protocol-http":"3.306.0","@aws-sdk/smithy-client":"3.309.0","@aws-sdk/types":"3.306.0","@aws-sdk/url-parser":"3.306.0","@aws-sdk/util-base64":"3.303.0","@aws-sdk/util-body-length-browser":"3.303.0","@aws-sdk/util-body-length-node":"3.303.0","@aws-sdk/util-defaults-mode-browser":"3.309.0","@aws-sdk/util-defaults-mode-node":"3.309.0","@aws-sdk/util-endpoints":"3.306.0","@aws-sdk/util-retry":"3.306.0","@aws-sdk/util-user-agent-browser":"3.306.0","@aws-sdk/util-user-agent-node":"3.306.0","@aws-sdk/util-utf8":"3.303.0","fast-xml-parser":"4.1.2","tslib":"^2.5.0"},"devDependencies":{"@aws-sdk/service-client-documentation-generator":"3.303.0","@tsconfig/node14":"1.0.3","@types/node":"^14.14.31","concurrently":"7.0.0","downlevel-dts":"0.10.1","rimraf":"3.0.2","typedoc":"0.23.23","typescript":"~4.9.5"},"engines":{"node":">=14.0.0"},"typesVersions":{"<4.0":{"dist-types/*":["dist-types/ts3.4/*"]}},"files":["dist-*"],"author":{"name":"AWS SDK for JavaScript Team","url":"https://aws.amazon.com/javascript/"},"license":"Apache-2.0","browser":{"./dist-es/runtimeConfig":"./dist-es/runtimeConfig.browser"},"react-native":{"./dist-es/runtimeConfig":"./dist-es/runtimeConfig.native"},"homepage":"https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sts","repository":{"type":"git","url":"https://github.com/aws/aws-sdk-js-v3.git","directory":"clients/client-sts"}}');

/***/ }),

/***/ 5367:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"partitions":[{"id":"aws","outputs":{"dnsSuffix":"amazonaws.com","dualStackDnsSuffix":"api.aws","name":"aws","supportsDualStack":true,"supportsFIPS":true},"regionRegex":"^(us|eu|ap|sa|ca|me|af)\\\\-\\\\w+\\\\-\\\\d+$","regions":{"af-south-1":{"description":"Africa (Cape Town)"},"ap-east-1":{"description":"Asia Pacific (Hong Kong)"},"ap-northeast-1":{"description":"Asia Pacific (Tokyo)"},"ap-northeast-2":{"description":"Asia Pacific (Seoul)"},"ap-northeast-3":{"description":"Asia Pacific (Osaka)"},"ap-south-1":{"description":"Asia Pacific (Mumbai)"},"ap-south-2":{"description":"Asia Pacific (Hyderabad)"},"ap-southeast-1":{"description":"Asia Pacific (Singapore)"},"ap-southeast-2":{"description":"Asia Pacific (Sydney)"},"ap-southeast-3":{"description":"Asia Pacific (Jakarta)"},"ap-southeast-4":{"description":"Asia Pacific (Melbourne)"},"aws-global":{"description":"AWS Standard global region"},"ca-central-1":{"description":"Canada (Central)"},"eu-central-1":{"description":"Europe (Frankfurt)"},"eu-central-2":{"description":"Europe (Zurich)"},"eu-north-1":{"description":"Europe (Stockholm)"},"eu-south-1":{"description":"Europe (Milan)"},"eu-south-2":{"description":"Europe (Spain)"},"eu-west-1":{"description":"Europe (Ireland)"},"eu-west-2":{"description":"Europe (London)"},"eu-west-3":{"description":"Europe (Paris)"},"me-central-1":{"description":"Middle East (UAE)"},"me-south-1":{"description":"Middle East (Bahrain)"},"sa-east-1":{"description":"South America (Sao Paulo)"},"us-east-1":{"description":"US East (N. Virginia)"},"us-east-2":{"description":"US East (Ohio)"},"us-west-1":{"description":"US West (N. California)"},"us-west-2":{"description":"US West (Oregon)"}}},{"id":"aws-cn","outputs":{"dnsSuffix":"amazonaws.com.cn","dualStackDnsSuffix":"api.amazonwebservices.com.cn","name":"aws-cn","supportsDualStack":true,"supportsFIPS":true},"regionRegex":"^cn\\\\-\\\\w+\\\\-\\\\d+$","regions":{"aws-cn-global":{"description":"AWS China global region"},"cn-north-1":{"description":"China (Beijing)"},"cn-northwest-1":{"description":"China (Ningxia)"}}},{"id":"aws-us-gov","outputs":{"dnsSuffix":"amazonaws.com","dualStackDnsSuffix":"api.aws","name":"aws-us-gov","supportsDualStack":true,"supportsFIPS":true},"regionRegex":"^us\\\\-gov\\\\-\\\\w+\\\\-\\\\d+$","regions":{"aws-us-gov-global":{"description":"AWS GovCloud (US) global region"},"us-gov-east-1":{"description":"AWS GovCloud (US-East)"},"us-gov-west-1":{"description":"AWS GovCloud (US-West)"}}},{"id":"aws-iso","outputs":{"dnsSuffix":"c2s.ic.gov","dualStackDnsSuffix":"c2s.ic.gov","name":"aws-iso","supportsDualStack":false,"supportsFIPS":true},"regionRegex":"^us\\\\-iso\\\\-\\\\w+\\\\-\\\\d+$","regions":{"aws-iso-global":{"description":"AWS ISO (US) global region"},"us-iso-east-1":{"description":"US ISO East"},"us-iso-west-1":{"description":"US ISO WEST"}}},{"id":"aws-iso-b","outputs":{"dnsSuffix":"sc2s.sgov.gov","dualStackDnsSuffix":"sc2s.sgov.gov","name":"aws-iso-b","supportsDualStack":false,"supportsFIPS":true},"regionRegex":"^us\\\\-isob\\\\-\\\\w+\\\\-\\\\d+$","regions":{"aws-iso-b-global":{"description":"AWS ISOB (US) global region"},"us-isob-east-1":{"description":"US ISOB East (Ohio)"}}}],"version":"1.1"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && !queue.d) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__nccwpck_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = 1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nccwpck_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nccwpck_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(2932);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;