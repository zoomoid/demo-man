# demo-man/k8s

This directory contains all files required to deploy the demo-man to your Kubernetes cluster.

First of all, you'd need to create a Kubernetes secret for the API token. This solution is only an 
alpha state, as we ultimately want to use our own SSO service.

```bash
kubectl create secret generic demo-zoomoid-de-api-token-secret --from-literal=token='<TOKEN>'
```

Then, afterwards, you would deploy all other resources to your cluster:

```bash
kubectl apply -f .
```