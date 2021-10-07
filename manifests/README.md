# demo-man/k8s

This directory contains all files required to deploy the demo-man to your Kubernetes cluster.

## A note on secrets

### API Tokens

First of all, you'd need to create a Kubernetes secret for the API token. This solution is only an 
alpha state, as we ultimately want to use our own SSO service.

```bash
kubectl create secret generic demo-man-api-token --from-literal=token="API_TOKEN"
```

### SSH Keys and SFTP User authentication

We need a whole lot of authentication for the SFTP server running inside the same domain as all other services.
This is simply due to the way SSH/SFTP works, as it requires (a) a host key, (b) username and password for the
SFTP user and (c) a pubkey for that same SFTP user to authenticate without using the password explicitly.

```bash
# Generate the SSH hostkey for the SSH server to provide
ssh-keygen -t ed25519 -f ssh_host_ed25519 -q -N ''
ssh-keygen -t rsa -b 4096 -f ssh_host_rsa -q -N ''

# Store these keys inside a Kubernetes secret
kubectl create secret generic demo-man-ssh-host-keys --from-file=ssh_host_ed25519_key=ssh_host_ed25519 --from-file=ssh_host_rsa_key=ssh_host_rsa

# Create a Kubernetes secret for the user account we want to use inside the container 
SFTP_USERNAME=<USERNAME>
SFTP_PASSWORD=<PASSWORD>
kubectl create secret generic demo-man-sftp-user --from-literal=users.conf="$SFTP_USERNAME:$SFTP_PASSWORD:::"

# Create an SSH key for the local user you want to use to authenticate using an SFTP-capable client (e.g. FileZilla)
ssh-keygen -q -t rsa -b 4069 -f ssh_user_rsa -N ''

# Create a Kubernetes secret from these SSH keys as well
kubectl create secret generic demo-man-ssh-user-keys --from-file=id_rsa=ssh_user_rsa --from-file=id_rsa.pub=ssh_user_rsa.pub
```

The deployment spec for the SFTP server will pick up these secrets to create the container

## Deployment

Then, after creating all required secrets, you can deploy all other resources to your cluster:

```bash
kubectl apply -f .
```