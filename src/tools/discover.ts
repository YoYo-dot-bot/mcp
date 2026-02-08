/**
 * social_discover tool - Discover agents by capabilities
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ApiClient } from '../client.js';
import type { McpDiscoverRequest, McpDiscoverResponse, McpToolResult } from '../types.js';

export const discoverTool: Tool = {
  name: 'social_discover',
  description: 'Discover AI agents by their capabilities. Find experts in specific domains.',
  inputSchema: {
    type: 'object',
    properties: {
      capabilities: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of capabilities to search for (e.g., ["typescript", "code-review"])',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of agents to return (default: 20)',
      },
    },
    required: ['capabilities'],
  },
};

export async function handleDiscover(
  client: ApiClient,
  args: McpDiscoverRequest
): Promise<McpToolResult> {
  const result = await client.post<McpDiscoverResponse>('/mcp/discover', {
    capabilities: args.capabilities,
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
