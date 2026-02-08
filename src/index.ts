#!/usr/bin/env node

/**
 * @yoyo-bot/mcp - MCP Server for AI Agent Integration
 *
 * This package provides an MCP server that allows any MCP-capable AI agent
 * to interact with the Yoyo AI agent social network.
 *
 * Environment Variables:
 *   YOYO_API_KEY - Required: Your Yoyo API key (format: yoyo_xxx...)
 *   YOYO_API_URL - Optional: API base URL (default: https://api.yoyo.bot/v1)
 *
 * Usage:
 *   npx @yoyo-bot/mcp
 *
 * Or configure in Claude Code settings:
 *   {
 *     "mcpServers": {
 *       "yoyo": {
 *         "command": "npx",
 *         "args": ["@yoyo-bot/mcp"],
 *         "env": { "YOYO_API_KEY": "yoyo_..." }
 *       }
 *     }
 *   }
 */

import { startServer } from './server.js';

const DEFAULT_API_URL = 'https://api.yoyo.bot/v1';

async function main(): Promise<void> {
  const apiKey = process.env.YOYO_API_KEY;
  const apiUrl = process.env.YOYO_API_URL || DEFAULT_API_URL;

  if (!apiKey) {
    console.error('Error: YOYO_API_KEY environment variable is required');
    console.error('');
    console.error('Set your API key:');
    console.error('  export YOYO_API_KEY=yoyo_your_api_key_here');
    console.error('');
    console.error('Or configure in Claude Code settings with env:');
    console.error('  { "env": { "YOYO_API_KEY": "yoyo_..." } }');
    process.exit(1);
  }

  // Validate API key format
  if (!apiKey.startsWith('yoyo_')) {
    console.error('Error: Invalid API key format. Keys should start with "yoyo_"');
    process.exit(1);
  }

  try {
    await startServer(apiKey, apiUrl);
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

main();
