#!/usr/bin/env node

// Debug wrapper to log CLI invocations
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const logFile = path.join(__dirname, 'cli-debug.log');
const args = process.argv.slice(2);

// ALWAYS log the invocation
try {
  fs.appendFileSync(logFile, `\n\n========== CLI Invocation ${new Date().toISOString()} ==========\n`);
  fs.appendFileSync(logFile, `CWD: ${process.cwd()}\n`);
  fs.appendFileSync(logFile, `__dirname: ${__dirname}\n`);
  fs.appendFileSync(logFile, `Args: ${JSON.stringify(args)}\n`);
  fs.appendFileSync(logFile, `Arg[0]: ${args[0]}\n`);
  fs.appendFileSync(logFile, `Is config command: ${args.includes('config')}\n`);
} catch (e) {
  // ignore logging errors
}

// If this is a config command, provide the config directly
if (args.includes('config')) {
  try {
    fs.appendFileSync(logFile, `Handling config command\n`);

    const config = {
      root: __dirname,
      reactNativePath: path.join(__dirname, 'node_modules', 'react-native'),
      reactNativeVersion: '0.85',
      project: {
        android: {
          sourceDir: path.join(__dirname, 'android'),
          appName: 'app',
          packageName: 'com.carsltv',
          applicationId: 'com.carsltv',
          mainActivity: '.MainActivity',
          assets: []
        }
      },
      dependencies: {},
      commands: [],
      healthChecks: [],
      platforms: {
        android: {}
      },
      assets: []
    };

    // Also run the actual React Native CLI to get dependencies and commands
    const cliPath = path.join(__dirname, 'node_modules', 'react-native', 'cli.js');
    const result = spawnSync('node', [cliPath, ...args], {
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf-8',
      cwd: __dirname,
      timeout: 30000
    });

    fs.appendFileSync(logFile, `CLI execution completed with status: ${result.status}\n`);
    fs.appendFileSync(logFile, `CLI stdout length: ${result.stdout ? result.stdout.length : 0}\n`);
    fs.appendFileSync(logFile, `CLI stderr length: ${result.stderr ? result.stderr.length : 0}\n`);

    if (result.stdout) {
      try {
        const json = JSON.parse(result.stdout);
        // Merge the CLI output with our config, ensuring packageName is present
        if (json.dependencies) config.dependencies = json.dependencies;
        if (json.commands) config.commands = json.commands;
        if (json.healthChecks) config.healthChecks = json.healthChecks;
        if (json.platforms) config.platforms = json.platforms;
        if (json.assets) config.assets = json.assets;
        fs.appendFileSync(logFile, `Successfully merged CLI output\n`);
      } catch (e) {
        fs.appendFileSync(logFile, `Failed to parse CLI output: ${e.message}\n`);
      }
    }

    fs.appendFileSync(logFile, `Returning config with packageName: ${config.project.android.packageName}\n`);
    fs.appendFileSync(logFile, `Full config: ${JSON.stringify(config).substring(0, 500)}...\n`);

    // Output the config - this is what Gradle will read
    process.stdout.write(JSON.stringify(config) + '\n');
    fs.appendFileSync(logFile, `Config written to stdout\n`);
  } catch (e) {
    fs.appendFileSync(logFile, `Config command error: ${e.message}\n${e.stack}\n`);
    process.exit(1);
  }
} else {
  // Run the actual React Native CLI for other commands
  const cliPath = path.join(__dirname, 'node_modules', 'react-native', 'cli.js');

  const result = spawnSync('node', [cliPath, ...args], {
    stdio: ['pipe', 'pipe', 'pipe'],
    encoding: 'utf-8',
    cwd: __dirname
  });

  // Log the output
  fs.appendFileSync(logFile, `Non-config command completed\n`);
  fs.appendFileSync(logFile, `Stdout length: ${result.stdout ? result.stdout.length : 0}\n`);
  fs.appendFileSync(logFile, `Stderr length: ${result.stderr ? result.stderr.length : 0}\n`);
  fs.appendFileSync(logFile, `Status: ${result.status}\n`);

  process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  process.exit(result.status || 0);
}


