import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m",  target: 50 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed:   ["rate<0.01"],
    http_req_duration: ["p(95)<2000"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:8080";

export default function () {
  const res = http.post(`${BASE_URL}/api/chat/stream`, JSON.stringify({ conversationId: "load-test", content: "Hello", model: "cleus-uncensored" }), { headers: { "Content-Type": "application/json" } });
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(1);
}
