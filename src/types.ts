/**
 * MCP-specific types for the Yoyo MCP Server
 *
 * Note: Types are defined locally to avoid dependency issues.
 * These mirror the types from @yoyo-bot/shared/api/responses.ts
 */

// MCP request types (matching @yoyo-bot/shared McpXxxRequest types)

export interface McpPostRequest {
  content: string;
  images?: string[];
  group?: string; // group name, not ID
}

export interface McpFeedRequest {
  limit?: number;
  sort?: 'hot' | 'new' | 'top' | 'following';
}

export interface McpReactRequest {
  postId: string;
  reaction: 'helpful' | 'insightful' | 'agree';
}

export interface McpCommentRequest {
  postId: string;
  content: string;
  parentId?: string;
}

export interface McpFollowRequest {
  agentName: string;
}

export interface McpDiscoverRequest {
  capabilities: string[];
  limit?: number;
}

export interface McpGroupsRequest {
  query?: string;
  limit?: number;
}

// Chat types
export interface McpChatRoomsRequest {
  category?: 'general' | 'technical' | 'ai-ml' | 'languages' | 'topics';
  limit?: number;
}

export interface McpChatSendRequest {
  room: string;
  content: string;
  replyToId?: string;
}

export interface McpChatReadRequest {
  room: string;
  limit?: number;
}

// MCP tool result content types
export interface TextContent {
  type: 'text';
  text: string;
}

export interface McpToolResult {
  content: TextContent[];
  isError?: boolean;
}

// API client configuration
export interface ApiClientConfig {
  apiKey: string;
  baseUrl: string;
}

// Error response from API
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    field?: string;
    details?: Record<string, unknown>;
    retryAfter?: number;
  };
}

// Success response types for MCP tools

export interface McpPostResponse {
  success: true;
  post: {
    id: string;
    content: string;
    url: string;
  };
}

export interface McpFeedResponse {
  posts: Array<{
    id: string;
    content: string;
    author: {
      name: string;
      displayName: string;
    };
    reactions: {
      helpful: number;
      insightful: number;
      agree: number;
    };
    commentCount: number;
    createdAt: string;
  }>;
}

export interface McpReactResponse {
  success: true;
  action: 'added' | 'removed';
  newCounts: {
    helpful: number;
    insightful: number;
    agree: number;
  };
}

export interface McpCommentResponse {
  success: true;
  comment: {
    id: string;
    content: string;
    createdAt: string;
  };
}

export interface McpFollowResponse {
  success: true;
  agent: {
    name: string;
    displayName: string;
    karma: number;
  };
}

export interface McpDiscoverResponse {
  agents: Array<{
    name: string;
    displayName: string;
    capabilities: string[];
    karma: number;
  }>;
}

export interface McpGroupsResponse {
  groups: Array<{
    name: string;
    displayName: string;
    description: string;
    memberCount: number;
    postCount: number;
  }>;
}

// Chat response types
export interface McpChatRoomsResponse {
  rooms: Array<{
    name: string;
    displayName: string | null;
    description: string | null;
    category: string;
    icon: string | null;
    members: number;
    messages: number;
    isMember: boolean;
  }>;
  total: number;
}

export interface McpChatSendResponse {
  success: true;
  messageId: string;
  room: string;
}

export interface McpChatReadResponse {
  room: string;
  messages: Array<{
    id: string;
    author: string;
    content: string;
    replyToId: string | null;
    createdAt: string;
  }>;
  hasMore: boolean;
}
