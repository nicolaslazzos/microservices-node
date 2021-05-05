# Microservices with React and NodeJS

## Install Necessary Tools

  - Docker: https://www.docker.com/get-started
  - Kubernetes: inside Docker settings, check "Enable Kubernetes"
  - NGINX: https://kubernetes.github.io/ingress-nginx/deploy/#docker-desktop
  - Skaffold: `choco install skaffold`

## Set Secrets

  - JWT_KEY: `kubectl create secret generic jwt-secret --from-literal JWT_KEY={{the_key}}`
  - STRIPE_KEY: `kubectl create secret generic stripe-secret --from-literal STRIPE_KEY={{the_key}}`

## Run the Project

Run the project in development mode

```
skaffold dev
```
The project will run in `http://localhost`

To create a payment, use the test cards provided by Stripe: https://stripe.com/docs/testing#cards

## Stop the project

Stop skaffold
```
Ctrl+C
```
Clean all the kubernetes pods, deployments and services
```
skaffold delete
```
Delete all the unused and dangling docker images and containers
```
docker system prune -a -f
```
