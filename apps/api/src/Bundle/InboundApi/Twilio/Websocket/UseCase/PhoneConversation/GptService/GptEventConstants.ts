export const GPT_EVENT = {
  REPLY: 'gpt_event.reply',
} as const;

export type GptEvent = (typeof GPT_EVENT)[keyof typeof GPT_EVENT];
