export const PLAN_LIMITS = {
  FREE:       { messagesPerDay: 20, imagesPerDay: 5,  videosPerMonth: 0,  maxContextLength: 8192 },
  PRO:        { messagesPerDay: 500, imagesPerDay: 100, videosPerMonth: 20, maxContextLength: 128000 },
  ENTERPRISE: { messagesPerDay: -1,  imagesPerDay: -1,  videosPerMonth: -1,  maxContextLength: 200000 },
} as const;
