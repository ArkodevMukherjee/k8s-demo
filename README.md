# 2-Service Kubernetes Demo (Node.js + Python) with CI/CD

```
 client ──► Ingress ──► node-service (Express, :3000)
                              │  GET /greet
                              ▼
                        python-service (Flask/gunicorn, :5000)
```

- `GET /`            → Node hello
- `GET /api/greet`   → Node calls Python service via in-cluster DNS
- `GET /healthz`     → probes on both services

## Run locally (kind)

```bash
make all                                   # cluster + build + load + deploy
kubectl -n demo port-forward svc/node-service 8080:80
curl localhost:8080/api/greet
make clean
```

## CI/CD (GitHub Actions)

`.github/workflows/ci-cd.yaml`:

1. **test** – Node (`node --test`) and Python (`pytest`) in parallel, on PRs and pushes.
2. **build-push** – on `main`, builds both images and pushes to GHCR tagged with the commit SHA.
3. **deploy** – sets the SHA tags via `kustomize edit set image`, runs `kubectl apply -k k8s/`, waits for rollouts.

### One-time setup
1. Push this repo to GitHub.
2. Create secret **`KUBE_CONFIG`** (Settings → Secrets → Actions): `base64 -w0 ~/.kube/config`
   (the cluster API must be reachable from GitHub runners).
3. Create an environment named **`production`** (optional approval gate).
4. Make the GHCR packages public after the first push, **or** create a pull secret:
   ```bash
   kubectl -n demo create secret docker-registry ghcr \
     --docker-server=ghcr.io --docker-username=<user> --docker-password=<PAT with read:packages>
   ```
   and add `imagePullSecrets: [{name: ghcr}]` to both Deployments.
5. Install an ingress controller (e.g. ingress-nginx) if you want to use `ingress.yaml`; otherwise use `port-forward`.
