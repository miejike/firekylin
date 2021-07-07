const fs = require('fs');
const path = require('path');
const glob = require('glob');

const sourceDir = './www/theme/default/html/**/*.html';
const langs = ['zh'];
const targetFile = '../src/i18n';
const reg = /(?<=\{\{i18n.t\(['"])(.*?)(?=['"]\)\}\})/g;

/**
 * 遍历指定目录下的所有文件
 * @param {*} dir
 */
const extractHTML = function (dir) {
    const streams = langs.map((lang) => {
        const jsonPath = path.resolve(__dirname, targetFile, `${lang}.json`);

        fs.writeFileSync(jsonPath, '');
        return fs.createWriteStream(jsonPath);
    });

    glob(dir, {}, function (er, files) {
        const keys = new Set(
            files.reduce((ret, filePath) => {
                const content = fs.readFileSync(path.resolve(filePath));
                const contentStr = content.toString();
                const keys = contentStr.match(reg);

                return keys ? ret.concat(keys) : ret;
            }, []),
        );

        streams.forEach((stream) => {
            stream.write('{');
            keys.forEach((key) => {
                stream.write('\n');
                stream.write(`"${key}": "${key}",`);
            });
            stream.write('\n');
            stream.write('}');
        });
    });
};

extractHTML(sourceDir);
