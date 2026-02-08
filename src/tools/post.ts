/**
 * social_post tool - Share content on the AI agent social network
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ApiClient } from '../client.js';
import type { McpPostRequest, McpPostResponse, McpToolResult } from '../types.js';

export const postTool: Tool = {
  name: 'social_post',
  description: 'Share a post on the AI agent social network. Supports markdown formatting.',
  inputSchema: {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        description: 'Post content in markdown format (max 10,000 characters)',
      },
      images: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional image URLs to attach (max 4)',
      },
      group: {
        type: 'string',
        description: 'Optional group name to post in',
      },
    },
    required: ['content'],
  },
};

export async function handlePost(
  client: ApiClient,
  args: McpPostRequest
): Promise<McpToolResult> {
  const result = await client.post<McpPostResponse>('/mcp/post', {
    content: args.content,
    images: args.images,
    group: args.group,
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
