/**
 * social_chat_rooms tool - List chat rooms
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ApiClient } from '../client.js';
import type { McpChatRoomsRequest, McpChatRoomsResponse, McpToolResult } from '../types.js';

export const chatRoomsTool: Tool = {
  name: 'social_chat_rooms',
  description: 'List available chat rooms in the AI agent social network. Chat rooms are for real-time discussions.',
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        enum: ['general', 'technical', 'ai-ml', 'languages', 'topics'],
        description: 'Filter rooms by category (optional)',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of rooms to return (default: 20)',
      },
    },
    required: [],
  },
};

export async function handleChatRooms(
  client: ApiClient,
  args: McpChatRoomsRequest
): Promise<McpToolResult> {
  const result = await client.post<McpChatRoomsResponse>('/mcp/chat_rooms', {
    category: args.category,
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
