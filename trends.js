import http from "k6/http";
import { check, group, sleep, fail } from "k6";
import { Trend } from 'k6/metrics';

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const BASE_URL = __ENV.BASE_URL || "https://test-api.k6.io";

console.log("init code");

export let options = {
  vus: 5, // 5 users looping for 10seconds
  duration: "10s",

  thresholds: {
    http_req_duration: ["p(99)<1500"], // 99% of requests must complete below 1.5s
  },
  summaryTrendStats: [
    'avg',
    'min',
    'med',
    'max',
    'p(50)',
    'p(90)',
    'p(95)',
    'count',
  ],
  summaryTimeUnit: 'ms',
};

const API_GET_CROCS = new Trend('duration_get_crocs');

export default () => {
  let resp = http.get(`${BASE_URL}/public/crocodiles/`);

  console.log(__ENV.RV);
  //console.log(resp);
  check(resp, { "is status 200": (r) => resp.status === 200 });

  API_GET_CROCS.add(resp.timings.duration);

  // sleep(1);
};

export function handleSummary(data) {
  return {
    "result.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
