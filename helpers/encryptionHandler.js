const crypto = require('crypto');
const iv = crypto.randomBytes(16);

//Encryption function
const encrypt = (text, secretKey) => {
    // if text is undefined, null, or an empty string, return without encryption
    if(text == undefined || text == null || text == '') return text;
    //it text is already encrypted, return as is
    if(text.startsWith('{"iv":')) return text;
    //create a cipher and encrypt
    const cipher = crypto.createCipheriv('aes-256-ctr', secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    //concatenate results
    return JSON.stringify({
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    });
};

//Decryption function
const decrypt = (hash, secretKey) => {
    return new Promise((resolve, reject) => {
        try {
            //if hash is undefined, null or empty, return hash as is
            if(hash == undefined || hash == null || !hash || hash == ""){
                return hash;
            };
            //it hash lacks the correct format, return as is
            if(!hash.startsWith('{"iv":')){
                return resolve(hash);
            };
            hash = JSON.parse(hash);
            //create a decipher and decrypt the content
            const decipher = crypto.createDecipheriv('aes-256-ctr', secretKey, Buffer.from(hash.iv, 'hex'));
            const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
            //resolve promise with decrypted text
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