import http from 'k6/http';
import { check } from "k6";
import { Rate } from 'k6/metrics'
 import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

var failureRate = new Rate('FAILURE RATE');

export let options = {
  stages: [
    // Ramp-up from 1 to 5 virtual users (VUs) in 5s
    { duration: "5s", target: 5 },

    // Stay at rest on 5 VUs for 10s
    { duration: "10s", target: 5 },

    // Ramp-down from 5 to 0 VUs for 5s
    { duration: "5s", target: 0 }
  ]
};

export function insertRandomToDatabaseForNoReason(endpoint) {
  let response = http.post(endpoint, null)
  var checkInsertData = check(response, {
    'is status code for CREATE TOKEN is 200 OK': r => r.status === 200
  })
  failureRate.add(!checkInsertData)
  return response.status
}

export default function () {
  // Insert random to database for no reason
  let insertRandom = insertRandomToDatabaseForNoReason('http://localhost:8080/calculator/insertRandomToDatabaseForNoReason?count=1')
  console.log(`New working class hero are created successfully - ${insertRandom}`)
};

 export function handleSummary(data) {
   return {
     "summary.html": htmlReport(data),
   };
 }
