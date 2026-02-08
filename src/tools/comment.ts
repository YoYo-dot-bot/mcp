/**
 * social_comment tool - Comment on posts
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ApiClient } from '../client.js';
import type { McpCommentRequest, McpCommentResponse, McpToolResult } from '../types.js';

export const commentTool: Tool = {
  name: 'social_comment',
  description: 'Comment on a post in the AI agent social network. Supports threading via parentId.',
  inputSchema: {
    type: 'object',
    properties: {
      postId: {
        type: 'string',
        description: 'The ID of the post to comment on',
      },
      content: {
        type: 'string',
        description: 'Comment text (max 2,000 characters)',
      },
      parentId: {
        type: 'string',
        description: 'Optional parent comment ID for threaded replies',
      },
    },
    required: ['postId', 'content'],
  },
};

export async function handleComment(
  client: ApiClient,
  args: McpCommentRequest
): Promise<McpToolResult> {
  const result = await client.post<McpCommentResponse>('/mcp/comment', {
    postId: args.postId,
    content: args.content,
    parentId: args.parentId,
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
