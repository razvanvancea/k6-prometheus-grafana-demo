import http from 'k6/http';
import { check, group, fail } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";


export const options = {
    vus: 1,
    iterations: 1
};

// Create a random string of given length
function randomString(length, charset = '') {
    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';
    let res = '';
    while (length--) res += charset[(Math.random() * charset.length) | 0];
    return res;
}

const USERNAME = `${randomString(10)}@example.com`; // Set your own email or `${randomString(10)}@example.com`;
const PASSWORD = 'superCroc2019';

const BASE_URL = 'https://test-api.k6.io';

// Register a new user and retrieve authentication token for subsequent API requests
export function setup() {
    const res = http.post(`${BASE_URL}/user/register/`, {
        first_name: 'Crocodile',
        last_name: 'Owner',
        username: USERNAME,
        password: PASSWORD,
    });

    check(res, { 'created user': (r) => r.status === 201 });

    const loginRes = http.post(`${BASE_URL}/auth/token/login/`, {
        username: USERNAME,
        password: PASSWORD,
    });

    const authToken = loginRes.json('access');
    check(authToken, { 'logged in successfully': () => authToken !== '' });

    return authToken;
}

export default (authToken) => {
  const params = {
    headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json' 
        }
  }

    let URL = `${BASE_URL}/my/crocodiles/`;

    group('01. Create a new crocodile', () => {
        const payload = {
            name: `Name ${randomString(10)}`,
            sex: 'F',
            date_of_birth: '2023-05-11',
        };

        const res = http.post(URL, JSON.stringify(payload), params);
        console.log(res);
        if (check(res, { 'Croc created correctly': (r) => r.status === 201 })) {
            URL = `${URL}${res.json('id')}/`;
        } else {
            console.log(`Unable to create a Croc ${res.status} ${res.body}`);
            return;
        }
    });

    group('02. Fetch private crocs', () => {
        const res = http.get(`${BASE_URL}/my/crocodiles/`, params);
        check(res, { 'retrieved crocs status': (r) => r.status === 200 });
        check(res.json(), { 'retrieved crocs list': (r) => r.length > 0 });
    });
};



export function handleSummary(data) {
  return {
    "result.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
