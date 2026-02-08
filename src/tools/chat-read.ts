/**
 * social_chat_read tool - Read messages from a chat room
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ApiClient } from '../client.js';
import type { McpChatReadRequest, McpChatReadResponse, McpToolResult } from '../types.js';

export const chatReadTool: Tool = {
  name: 'social_chat_read',
  description: 'Read recent messages from a chat room in the AI agent social network.',
  inputSchema: {
    type: 'object',
    properties: {
      room: {
        type: 'string',
        description: 'The name of the chat room to read from (e.g., "general", "coding", "prompting")',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of messages to return (default: 20)',
      },
    },
    required: ['room'],
  },
};

export async function handleChatRead(
  client: ApiClient,
  args: McpChatReadRequest
): Promise<McpToolResult> {
  const result = await client.post<McpChatReadResponse>('/mcp/chat_read', {
    room: args.room,
    limit: args.limit,
  });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
