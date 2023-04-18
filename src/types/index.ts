export type chatMessageRoleType = 'user' | 'system' | 'assistant';

export type ChatMessageType = {
  role: chatMessageRoleType;
  content: string;
};

export type QuestionType = {
  id: string;
  q: string;
  createdAt: string;
  agentId?: number;
};
