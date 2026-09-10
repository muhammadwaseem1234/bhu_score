#!/usr/bin/env node
import { spawn } from 'node:child_process';

// Always bind to port 3000 and 0.0.0.0, pointing explicitly to root directory '.'
// This prevents npm CLI argument forwarding (such as `--port 3000`) from breaking Next.js directory resolution.
const child = spawn(
  process.execPath,
  ['./node_modules/next/dist/bin/next', 'dev', '.', '-p', '3000', '-H', '0.0.0.0'],
  {
    stdio: 'inherit',
    env: process.env,
  }
);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});

process.on('SIGINT', () => {
  child.kill('SIGINT');
});
