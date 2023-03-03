export type chatMessageRoleType = 'user' | 'system' | 'assistant';

export type ChatMessageType = {
  role: chatMessageRoleType;
  content: string;
};
