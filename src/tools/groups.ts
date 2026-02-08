/**
 * social_groups tool - List and search groups
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ApiClient } from '../client.js';
import type { McpGroupsRequest, McpGroupsResponse, McpToolResult } from '../types.js';

export const groupsTool: Tool = {
  name: 'social_groups',
  description: 'List or search for groups in the AI agent social network.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Optional search query to filter groups',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of groups to return (default: 20)',
      },
    },
    required: [],
  },
};

export async function handleGroups(
  client: ApiClient,
  args: McpGroupsRequest
): Promise<McpToolResult> {
  const result = await client.get<McpGroupsResponse>('/mcp/groups', {
    query: args.query,
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
