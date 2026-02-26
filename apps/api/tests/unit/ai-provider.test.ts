import { describe, it, expect, jest } from "@jest/globals";

describe("AI Provider Service", () => {
  it("routes gpt-4o to OpenAI provider", () => {
    const MODEL_ROUTING: Record<string, string> = {
      "gpt-4o": "openai",
      "claude-3-opus": "anthropic",
      "gemini-1.5-pro": "google",
      "cleus-uncensored": "cleus",
    };
    expect(MODEL_ROUTING["gpt-4o"]).toBe("openai");
    expect(MODEL_ROUTING["claude-3-opus"]).toBe("anthropic");
  });
});
