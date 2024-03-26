const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');

// Promisify fs functions and exec
const readdirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);
const execAsync = promisify(exec);

// Function to read dependencies from package.json
async function getDependencies(packageName) {
    const packageJson = await readFileAsync(`packages/${packageName}/package.json`, 'utf8');
    const { dependencies = {}, devDependencies = {} } = JSON.parse(packageJson);
    return { ...dependencies, ...devDependencies };
}

// Function to update and build a package
async function updateAndBuildPackage(packageName) {
    console.log(`Updating and building package ${packageName}...`);
    try {
        process.chdir(`packages/${packageName}`);
        await execAsync('pnpm run build');
        process.chdir('../..');
        console.log(`Package ${packageName} updated and built successfully.`);
    } catch (error) {
        console.error(`Error updating and building package ${packageName}:`, error);
    }
}

function solveDeps(inDeg, prereq) {
    const queue = []
    const topoOrder = []

    Object.keys(inDeg).forEach(key => {
        if (inDeg[key] === 0) {
            queue.push(key)
        }
    })
    while (queue.length) {
        let node = queue.pop()
        topoOrder.push(node)
        for (let neighbor of prereq[node]) {
            inDeg[neighbor]--
            if (inDeg[neighbor] === 0) {
                queue.push(neighbor)
            }
        }
    }
    if (topoOrder.length < Object.keys(inDeg).length ) {
        return []
    }
    return topoOrder
}

// Function to topologically sort packages based on dependencies
async function topologicalSort(workspacePackages) {
    const visited = new Set();
    const inDeg = {}
    const prereq = {}
    const reg = /^\d+$/

    async function visit(packageName) {
        if (!/^\d+$/.test(inDeg[packageName])) {
            inDeg[packageName] = 0
        } else {
            return
        };
        if (!prereq[packageName]) {
            prereq[packageName] = []
        }
        const _deps = await getDependencies(packageName)
        const dependencies = Object.keys(_deps).filter(dep => workspacePackages.has(dep));
        inDeg[packageName] = dependencies.length
        for (const dependency of dependencies) {
            if (!prereq[dependency]) {
                prereq[dependency] = []
            }
            prereq[dependency].push(packageName)
            await visit(dependency);
        }
        // sortedPackages.push(packageName);
    }

    for (const packageName of workspacePackages) {
        await visit(packageName);
    }

    const sortedPackages = solveDeps(inDeg, prereq)

    return sortedPackages;
}

// Main function
async function main() {
    try {
        // Get list of workspace packages
        const workspacePackages = new Set(fs.readdirSync('packages'));
        const sortedPackages = await topologicalSort(workspacePackages);

        for (const packageName of sortedPackages) {
            await updateAndBuildPackage(packageName);
        }
        console.log('All workspace packages updated and built successfully.');
    } catch (error) {
        console.error('Error updating and building workspace packages:', error);
    }
}

// Run main function
main();
