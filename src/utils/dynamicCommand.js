const { verifyPrefix, hasTypeOrCommand } = require("../middlewares");
const { checkPermission } = require("../middlewares/checkPermission");
const { DangerError, InvalidParameterError, WarningError } = require("../errors");
const { findCommandImport } = require(".");

exports.dynamicCommand = async () => {

    const { commandName, prefix, sendWarningReply, sendErrorReply } = paramsHandler;
    const { type, command } = findCommandImport();

    if (!verifyPrefix(prefix) || !hasTypeOrCommand({ type, command })) {
        return;
    }

    if (!(await checkPermission({ type, ...paramsHandler }))) {
        return sendErrorReply("Você não tem permissão para acessar este comando!");
    }

    try {
        await command.handle({ ...paramsHandler, type });
    } catch (error) {
        console.log(error);

        if (error instanceof InvalidParameterError) {
            await sendWarningReply(`Parâmetros inválidos! ${error.message}`);
        } else if (error instanceof WarningError) {
            await sendWarningReply(error.message);
        } else if (error instanceof DangerError) {
            await sendErrorReply(error.message);
        } else {
            await sendErrorReply(
                `Ocorreu um erro ao executar o comando ${command.name}! O desenvolvedor foi notificado!
                *Detalhes:* ${error.message}`
            );
        }
    }

};