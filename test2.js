import http from "k6/http";
import { check, group, sleep, fail } from "k6";

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
};

export function setup() {
  console.log("setup");
}

export function teardown(data) {
  console.log("teardown");
}

// export let options = {
//   vus: 5,
//   iterations: 20,
// };

// export let options = {
//   stages: [
//     { duration: '5s', target: 5 },
//     { duration: '10s', target: 5 },
//     { duration: '10s', target: 20 },
//     { duration: '5s', target: 0 }, //5m
//   ]
// };

// export const options = {
//   scenarios: {
//     default: {
//       executor: "constant-arrival-rate",

//       // How long the test lasts
//       duration: "10s",

//       // Iterations rate. By default, the `timeUnit` rate is 1s.
//       rate: 20,

//       // Required. The value can be the same as the rate.
//       // k6 warns during execution if more VUs are needed.
//       preAllocatedVUs: 2000,
//     },
//   },
// };

export default () => {
  let resp = http.get(`${BASE_URL}/public/crocodiles/`);

  console.log(__ENV.RV);
  //console.log(resp);
  check(resp, { "is status 200": (r) => resp.status === 200 });

  // sleep(1);
};

export function handleSummary(data) {
  return {
    "result.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
