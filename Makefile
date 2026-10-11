# Local dev with kind: https://kind.sigs.k8s.io
.PHONY: cluster build load deploy all test-local clean

cluster:
	kind create cluster --name demo

build:
	docker build -t node-service:local ./node-service
	docker build -t python-service:local ./python-service

load: build
	kind load docker-image node-service:local python-service:local --name demo

deploy:
	kubectl apply -k k8s/
	kubectl -n demo rollout status deploy/python-service
	kubectl -n demo rollout status deploy/node-service

all: cluster load deploy

test-local:
	kubectl -n demo port-forward svc/node-service 8080:80 &
	sleep 2 && curl -s localhost:8080/api/greet; echo

clean:
	kind delete cluster --name demo
