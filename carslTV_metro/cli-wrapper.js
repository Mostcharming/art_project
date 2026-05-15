#!/usr/bin/env node

// Debug wrapper to log CLI invocations
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const logFile = path.join(__dirname, 'cli-debug.log');
const args = process.argv.slice(2);

// Log the invocation
fs.appendFileSync(logFile, `\n=== CLI Invocation ===\nArgs: ${JSON.stringify(args)}\nCWD: ${process.cwd()}\n`);

// Run the actual React Native CLI
const cliPath = path.join(__dirname, 'node_modules', 'react-native', 'cli.js');

const result = spawnSync('node', [cliPath, ...args], {
  stdio: 'pipe',
  encoding: 'utf-8',
  cwd: __dirname,
  shell: true
});

// Log the output
fs.appendFileSync(logFile, `Stdout: ${result.stdout}\n`);
fs.appendFileSync(logFile, `Stderr: ${result.stderr}\n`);
fs.appendFileSync(logFile, `Code: ${result.status}\n`);

// If this is a config command, ensure packageName is in the output
if (args.includes('config')) {
  try {
    const json = JSON.parse(result.stdout);
    if (!json.project) json.project = {};
    if (!json.project.android) json.project.android = {};
    if (!json.project.android.packageName) {
      json.project.android.packageName = 'com.carsltv';
      fs.appendFileSync(logFile, `Added packageName to config\n`);
    }
    console.log(JSON.stringify(json, null, 2));
  } catch (e) {
    console.log(result.stdout);
  }
} else {
  console.log(result.stdout);
  if (result.stderr) console.error(result.stderr);
}

process.exit(result.status || 0);


