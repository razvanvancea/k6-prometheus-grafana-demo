# k6 - Load Testing with Prometheus + Grafana

## Prerequisites:

Docker & Docker Compose

k6

git


## Start

Run: docker-compose up -d


Grafana: http://localhost:3000


## Run test


## Run with docker
docker run -i --network=default_network grafana/k6:latest run -e BASE_URL=http://quickpizza:3333  - <test.js


## Run test with prometheus and grafana

k6 run --out=experimental-prometheus-rw test.js

## Run test with prometheus and grafana and docker
docker run -i --network=default_network grafana/k6:latest run --out=experimental-prometheus-rw -e BASE_URL=http://quickpizza:3333 -e K6_PROMETHEUS_RW_SERVER_URL=http://prometheus:9090/api/v1/write - <test.js


