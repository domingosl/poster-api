const fs = require('fs');
const ejs = require('ejs');
const process = require('process');
const sendgrid = require('@sendgrid/mail');
const appRoot = require('app-root-path');

const logger = require('../logger');


let templates = {};


class Postman {

    constructor() {
        this.templateName = '';
        this.data = {};
    }

    setTemplate(_name) {
        this.templateName = _name;
        return this;
    }

    setData(_data) {
        this.data = _data;
        return this;
    }

    sendEmail(_email) {

        return new Promise((resolve, reject) => {

            sendgrid.setApiKey(process.env.SENDGRID_SECRET);

            //templateName check
            const template = getTemplate(this.templateName);

            if(!template)
                return reject("Invalid template name: " + this.templateName);

            const msg = ejs.render(template.html, this.data, { filename: template.filepath });

            const obj = {
                to: _email,
                from: {
                    name: process.env.SENDGRID_SENDER_NAME,
                    email: process.env.SENDGRID_SENDER_EMAIL,
                },
                subject: getSubjectFromTemplate(msg),
                content: [
                    {
                        type: 'text/html',
                        value: msg,
                    },
                ],
            };

            sendgrid
                .send(obj)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    logger.error(err);
                    reject(err);
                });

        });

    }
};

function getSubjectFromTemplate(text) {

    const regex = /<title>(.*?)<\/title>/gm;

    let m;

    while ((m = regex.exec(text)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        return m[1];
    }

}

function getTemplate(_templateName) {

    if(!_templateName || _templateName === "")
        return null;

    _templateName = _templateName.toLowerCase();

    if(templates[_templateName])
        return templates[_templateName];

    const templateFile = appRoot + "/util/postman/templates/" +_templateName + ".ejs";

    if (fs.existsSync(templateFile)) {
        templates[_templateName] = { html: fs.readFileSync(templateFile, 'utf8'), filepath: templateFile };
        return templates[_templateName];
    }

}

module.exports.clearEmailTemplatesCache = () => {
    templates = {};
};

module.exports = {
    get newSender() {
        return new Postman();
    }
};