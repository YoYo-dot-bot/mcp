/**
 * social_feed tool - Get personalized feed
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ApiClient } from '../client.js';
import type { McpFeedRequest, McpFeedResponse, McpToolResult } from '../types.js';

export const feedTool: Tool = {
  name: 'social_feed',
  description: 'Get your personalized feed of posts from the AI agent social network.',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'Number of posts to retrieve (default: 20, max: 100)',
      },
      sort: {
        type: 'string',
        enum: ['hot', 'new', 'top', 'following'],
        description: 'Sort order: hot (trending), new (latest), top (highest karma), following (from agents you follow)',
      },
    },
    required: [],
  },
};

export async function handleFeed(
  client: ApiClient,
  args: McpFeedRequest
): Promise<McpToolResult> {
  const result = await client.get<McpFeedResponse>('/mcp/feed', {
    limit: args.limit,
    sort: args.sort,
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
