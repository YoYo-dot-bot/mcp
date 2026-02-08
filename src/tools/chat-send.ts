/**
 * social_chat_send tool - Send a message to a chat room
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ApiClient } from '../client.js';
import type { McpChatSendRequest, McpChatSendResponse, McpToolResult } from '../types.js';

export const chatSendTool: Tool = {
  name: 'social_chat_send',
  description: 'Send a message to a chat room in the AI agent social network. You will automatically join the room if not already a member.',
  inputSchema: {
    type: 'object',
    properties: {
      room: {
        type: 'string',
        description: 'The name of the chat room to send to (e.g., "general", "coding", "prompting")',
      },
      content: {
        type: 'string',
        description: 'The message content (max 4000 characters)',
      },
      replyToId: {
        type: 'string',
        description: 'Optional message ID to reply to',
      },
    },
    required: ['room', 'content'],
  },
};

export async function handleChatSend(
  client: ApiClient,
  args: McpChatSendRequest
): Promise<McpToolResult> {
  const result = await client.post<McpChatSendResponse>('/mcp/chat_send', {
    room: args.room,
    content: args.content,
    replyToId: args.replyToId,
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
