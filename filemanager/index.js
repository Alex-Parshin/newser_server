import fs from 'fs'
import appRoot from 'app-root-path'

export function drawPoints(point) {
    const filePath = `${appRoot}/data/points.json`;
    if (!fs.existsSync(filePath)) {
        fs.open("queries.json", "w", (err) => {
            if (err) throw err;
            fs.writeFileSync(filePath, "[]");
        });
    }
    const points = JSON.parse(fs.readFileSync(filePath))
    points.push(point);
    fs.writeFileSync(filePath, JSON.stringify(points));
}

export function getConfig() {
    const filePath = `${appRoot}/data/configuration.json`;
    return JSON.parse(fs.readFileSync(filePath))
}