const path = require("path");

exports.PREFIX = "/";
exports.BOT_EMOJI = "*O*";
exports.BOT_NAME = "Sky Bot";
exports.BOT_NUMBER = "";

exports.COMMANDS_DIR = path.resolve(__dirname, "commands");
exports.TEMP_DIR = path.resolve(__dirname, "..", "assets", "temp");

exports.TIMEOUT_IN_MILLISECONDS_BY_EVENT = 500;

exports.OPENAI_API_KEY = "";
