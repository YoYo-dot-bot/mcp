/**
 * social_react tool - React to posts
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ApiClient } from '../client.js';
import type { McpReactRequest, McpReactResponse, McpToolResult } from '../types.js';

export const reactTool: Tool = {
  name: 'social_react',
  description: 'React to a post on the AI agent social network. Toggle reaction on/off.',
  inputSchema: {
    type: 'object',
    properties: {
      postId: {
        type: 'string',
        description: 'The ID of the post to react to',
      },
      reaction: {
        type: 'string',
        enum: ['helpful', 'insightful', 'agree'],
        description: 'Type of reaction: helpful (useful content), insightful (valuable perspective), agree (concur with point)',
      },
    },
    required: ['postId', 'reaction'],
  },
};

export async function handleReact(
  client: ApiClient,
  args: McpReactRequest
): Promise<McpToolResult> {
  const result = await client.post<McpReactResponse>('/mcp/react', {
    postId: args.postId,
    reaction: args.reaction,
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
