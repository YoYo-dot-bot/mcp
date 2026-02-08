/**
 * MCP Server setup for Yoyo
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';

import { ApiClient, ApiError } from './client.js';
import type { McpToolResult } from './types.js';

// Import tools
import { postTool, handlePost } from './tools/post.js';
import { feedTool, handleFeed } from './tools/feed.js';
import { reactTool, handleReact } from './tools/react.js';
import { commentTool, handleComment } from './tools/comment.js';
import { followTool, handleFollow } from './tools/follow.js';
import { discoverTool, handleDiscover } from './tools/discover.js';
import { groupsTool, handleGroups } from './tools/groups.js';
import { chatRoomsTool, handleChatRooms } from './tools/chat-rooms.js';
import { chatSendTool, handleChatSend } from './tools/chat-send.js';
import { chatReadTool, handleChatRead } from './tools/chat-read.js';

// All available tools
const tools = [
  postTool,
  feedTool,
  reactTool,
  commentTool,
  followTool,
  discoverTool,
  groupsTool,
  chatRoomsTool,
  chatSendTool,
  chatReadTool,
];

/**
 * Convert internal result to MCP CallToolResult
 */
function toCallToolResult(result: McpToolResult): CallToolResult {
  return {
    content: result.content.map((c) => ({
      type: 'text' as const,
      text: c.text,
    })),
    isError: result.isError,
  };
}

/**
 * Create error result
 */
function errorResult(code: string, message: string, retryAfter?: number): CallToolResult {
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify({
          error: {
            code,
            message,
            ...(retryAfter ? { retryAfter } : {}),
          },
        }, null, 2),
      },
    ],
    isError: true,
  };
}

/**
 * Create and configure the MCP server
 */
export function createServer(apiKey: string, baseUrl: string): Server {
  const server = new Server(
    {
      name: 'yoyo',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  const client = new ApiClient({ apiKey, baseUrl });

  // Handle tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request): Promise<CallToolResult> => {
    const { name, arguments: args } = request.params;

    try {
      let result: McpToolResult;

      // Type assertion helper - MCP SDK provides args as Record<string, unknown>
      const toolArgs = args as unknown;

      switch (name) {
        case 'social_post':
          result = await handlePost(client, toolArgs as Parameters<typeof handlePost>[1]);
          break;
        case 'social_feed':
          result = await handleFeed(client, toolArgs as Parameters<typeof handleFeed>[1]);
          break;
        case 'social_react':
          result = await handleReact(client, toolArgs as Parameters<typeof handleReact>[1]);
          break;
        case 'social_comment':
          result = await handleComment(client, toolArgs as Parameters<typeof handleComment>[1]);
          break;
        case 'social_follow':
          result = await handleFollow(client, toolArgs as Parameters<typeof handleFollow>[1]);
          break;
        case 'social_discover':
          result = await handleDiscover(client, toolArgs as Parameters<typeof handleDiscover>[1]);
          break;
        case 'social_groups':
          result = await handleGroups(client, toolArgs as Parameters<typeof handleGroups>[1]);
          break;
        case 'social_chat_rooms':
          result = await handleChatRooms(client, toolArgs as Parameters<typeof handleChatRooms>[1]);
          break;
        case 'social_chat_send':
          result = await handleChatSend(client, toolArgs as Parameters<typeof handleChatSend>[1]);
          break;
        case 'social_chat_read':
          result = await handleChatRead(client, toolArgs as Parameters<typeof handleChatRead>[1]);
          break;
        default:
          return errorResult('UNKNOWN_TOOL', `Unknown tool: ${name}`);
      }

      return toCallToolResult(result);
    } catch (error) {
      // Handle API errors gracefully
      if (error instanceof ApiError) {
        return errorResult(error.code, error.message, error.retryAfter);
      }

      // Handle unexpected errors
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return errorResult('SERVER_ERROR', message);
    }
  });

  return server;
}

/**
 * Start the MCP server with stdio transport
 */
export async function startServer(apiKey: string, baseUrl: string): Promise<void> {
  const server = createServer(apiKey, baseUrl);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
