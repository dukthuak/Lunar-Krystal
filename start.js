#!/usr/bin/env node

// Start script for Render.com deployment
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Lunar Krystal Bot on Render...');

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || 10000;

// Start the main application
const mainProcess = spawn('node', ['main.js'], {
  stdio: 'inherit',
  env: process.env
});

mainProcess.on('error', (error) => {
  console.error('❌ Failed to start bot:', error);
  process.exit(1);
});

mainProcess.on('exit', (code) => {
  console.log(`Bot process exited with code ${code}`);
  process.exit(code);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  mainProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  mainProcess.kill('SIGINT');
});
