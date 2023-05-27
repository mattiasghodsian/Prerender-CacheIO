/**
 * Name: Prerender-CacheIO
 * Author: Mattias Ghodsian
 * License: MIT License
 * Url: https://github.com/mattiasghodsian/Prerender-CacheIO
 */
var url = require("url");
var fs = require('fs');
var fsPromises = require('fs').promises;
var { mkdirp } = require('mkdirp');
const path = require('path');

const fileIsOlderThan = async (path, hours) => {
    try {
        const { mtime } = await fsPromises.stat(path);
        const differenceInHours = (Date.now() - mtime.getTime()) / (1000 * 60 * 60);
        return differenceInHours > hours;
    } catch (error) {
        console.error(`cacheIO: Failed to check file age: ${path}`, error);
        throw error;
    }
}

const readFile = async (path) => {
    try {
        const contents = await fsPromises.readFile(path, 'utf-8');
        console.log(`cacheIO: Contents read from: ${path}`);
        return contents;
    } catch (error) {
        console.error(`cacheIO: Failed to read contents from: ${path}`, error);
        throw error;
    }
}

const writeFile = async (path, content) => {
    try {
        await fsPromises.writeFile(path, content);
        console.log(`cacheIO: Contents written to: ${path}`);
    } catch (error) {
        console.error(`cacheIO: Failed to write contents to: ${path}`, error);
        throw error;
    }
}

const createDirectory = async (path) => {
    try {
        if (!fs.existsSync(path)) {
            const made = await mkdirp(path);
            console.log(`cacheIO: Directory created for request: ${made}`);
        }
    } catch (error) {
        console.error(`cacheIO: Failed to create directory: ${path}`, error);
        throw error;
    }
}

const getFilePathFromRequest = (requestUrl) => {
    const parsed = url.parse(requestUrl);
    const reqHostPath = `/srv/cache/${parsed.host}`;
    const path = parsed.path.substr(0, parsed.path.lastIndexOf("/")) ?? "";
    const fullPath = `${reqHostPath}${path}`;
    let lastPathSegment = parsed.path.substr(parsed.path.lastIndexOf('/') + 1) || 'index';

    if (!lastPathSegment.endsWith('.html')) {
        lastPathSegment += '.html';
    }

    return `${fullPath}/${lastPathSegment}`;
}

module.exports = {
    requestReceived: async (req, res, next) => {
        try {
            const filePath = getFilePathFromRequest(req.prerender.url);
            if (fs.existsSync(filePath)){
                if (await fileIsOlderThan(filePath, 24)) {
                    await fsPromises.unlink(filePath);
                    console.log(`cacheIO: Deleted file ${filePath}`);
                    next();
                }else{
                    const contents = await fsPromises.readFile(filePath, 'utf-8');
                    console.log(`cacheIO: Contents read from: ${filePath}`);
                    res.send(200, contents);
                }
            } else {
                next();
            }
        } catch (error) {
            console.error(`cacheIO: Failed to handle request: ${req.prerender.url}`, error);
            throw error;
        }
    },
    beforeSend: async (req, res, next) => {
        if (req.prerender.statusCode !== 200) {
            return next();
        }

        try {
            const filePath = getFilePathFromRequest(req.prerender.url);
            if (!fs.existsSync(filePath)) {
                await createDirectory(path.dirname(filePath));
                await writeFile(filePath, req.prerender.content);
            }
        } catch (error) {
            console.error(`cacheIO: Failed to handle request: ${req.prerender.url}`, error);
            throw error;
        }

        return next();
    }
}