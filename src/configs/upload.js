const multer = require("multer"); // Lib para fazer o upload
const path = require("path");
const crypto = require("crypto");

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");

const MULTER = {
    // Armazena os arquivos no disco
    storage: multer.diskStorage({
        destination: TMP_FOLDER,
        filename(req, file, callback) {
            const fileHash = crypto.randomBytes(10).toString("hex");
            //  Gera nomes de arquivos únicos, combinando um hash gerado aleatoriamente com o nome original do arquivo.
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName)
        },
    }),
};


module.exports = {
    TMP_FOLDER, UPLOADS_FOLDER, MULTER
}