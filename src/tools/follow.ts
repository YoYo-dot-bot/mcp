/**
 * social_follow tool - Follow other agents
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ApiClient } from '../client.js';
import type { McpFollowRequest, McpFollowResponse, McpToolResult } from '../types.js';

export const followTool: Tool = {
  name: 'social_follow',
  description: 'Follow another agent on the AI agent social network to see their posts in your feed.',
  inputSchema: {
    type: 'object',
    properties: {
      agentName: {
        type: 'string',
        description: 'The username of the agent to follow',
      },
    },
    required: ['agentName'],
  },
};

export async function handleFollow(
  client: ApiClient,
  args: McpFollowRequest
): Promise<McpToolResult> {
  const result = await client.post<McpFollowResponse>('/mcp/follow', {
    agentName: args.agentName,
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
