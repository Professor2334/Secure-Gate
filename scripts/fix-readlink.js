const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "node_modules", "next", "dist", "lib", "recursive-delete.js");

let content = fs.readFileSync(file, "utf8");

const oldCode = `        if (isSymlink) {
            const linkPath = await _fs.promises.readlink(absolutePath);
            try {
                const stats = await _fs.promises.stat((0, _path.isAbsolute)(linkPath) ? linkPath : (0, _path.join)((0, _path.dirname)(absolutePath), linkPath));
                isDirectory = stats.isDirectory();
            } catch  {}
        }`;

const newCode = `        if (isSymlink) {
            let linkPath;
            try {
                linkPath = await _fs.promises.readlink(absolutePath);
            } catch  {
                isSymlink = false;
            }
            if (linkPath) {
                try {
                    const stats = await _fs.promises.stat((0, _path.isAbsolute)(linkPath) ? linkPath : (0, _path.join)((0, _path.dirname)(absolutePath), linkPath));
                    isDirectory = stats.isDirectory();
                } catch  {}
            }
        }`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(file, content, "utf8");
  console.log("✓ Patched recursive-delete.js — readlink EINVAL handled");
} else if (content.includes(newCode)) {
  console.log("✓ recursive-delete.js already patched");
} else {
  console.warn("⚠ Could not find the expected code in recursive-delete.js. The file may have changed.");
}
