const fs = require("fs");
const md5File = require("md5-file");
const md5 = require("md5");
const path = require("path");
let cache = {};
if(fs.existsSync("./cache.json")) cache = JSON.parse(fs.readFileSync("./cache.json", "utf8"));


const getPathHash = (path) => {
    // From a path to a folder, get the hash of all the files in that folder, and all the files in all the subfolders EXCEPT FOR ANYTHING IN OUR BLACKLIST
    // Once we have an array of all the hashes, hash all the hashes together and return that

    const BLACKLIST = ["node_modules", "package-lock.json"];

    let hashes = [];
    const _hashPath = (path) => {
        const files = fs.readdirSync(path);
        files.forEach(file => {
            const filePath = `${path}/${file}`;
            const stat = fs.statSync(filePath);
            if(BLACKLIST.includes(file)) return;
            
            if(stat.isDirectory()) {
                _hashPath(filePath);
            } else {
                hashes.push(md5File.sync(filePath));
            }
        });
    }

    _hashPath(path);

    return md5(hashes.join(""));
}


// returns boolean whether path has changed since the last time we looked at that path with the same id
const hasChanged = (id, path, doLog) => {
    const newHash = getPathHash(path);

    const saveCache = () => {
        if(!cache[id]) cache[id] = {};
        cache[id][path] = newHash;
        fs.writeFileSync("./cache.json", JSON.stringify(cache, null, 4));
    }


    // Never cache'd before
    if (!cache[id]) {
        if(doLog) console.log("ID Never cached before");
        saveCache();
        return true;
    }
    
    const idCache = cache[id];

    if(!idCache[path]) {
        if(doLog) console.log("Path never cached before under this ID");
        saveCache();
        return true;
    }

    const lastHash = idCache[path];

    if(lastHash !== newHash) {
        if(doLog) console.log("Hashes don't match", lastHash, newHash);
        saveCache();
        return true;
    }

    return false;
}


module.exports = {
    hasChanged
};