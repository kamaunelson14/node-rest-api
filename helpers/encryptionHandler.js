const crypto = require('crypto');
const iv = crypto.randomBytes(16);

const encrypt = (text, secretKey) => {
    if(text == undefined || text == null || text == '') return text;
    if(text.startsWith('{"iv":')) return text;
    const cipher = crypto.createCipheriv('aes-256-ctr', secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return JSON.stringify({
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    });
};

const decrypt = (hash, secretKey) => {
    return new Promise((resolve, reject) => {
        try {
            if(hash == undefined || hash == null || !hash || hash == "") return hash;
            if(!hash.startsWith('{"iv":')) return resolve(hash);
            hash = JSON.parse(hash);
            const decipher = crypto.createDecipheriv('aes-256-ctr', secretKey, Buffer.from(hash.iv, 'hex'));
            const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
            return resolve(decrypted.toString());
        } catch (error) {
            return reject(error);
        }
    });
};

module.exports = {
    encrypt,
    decrypt
};