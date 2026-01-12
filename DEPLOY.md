# How to Deploy on AWS EC2

This guide will walk you through hosting your full-stack URL Shortener on an AWS EC2 instance.

## Prerequisites

- An AWS Account
- A Terminal with SSH capabilities

## Step 1: Launch an EC2 Instance

1. Log in to the [AWS Console](https://console.aws.amazon.com/).
2. Go to **EC2** -> **Launch Instance**.
3. **Name**: `URL-Shortener-Server`
4. **OS Image**: **Ubuntu Server 24.04 LTS** (Free Tier available).
5. **Instance Type**: `t2.micro` (Free Tier) or `t3.micro`.
6. **Key Pair**: Create a new key pair (e.g., `my-app-key`). Download the `.pem` file.
7. **Network Settings**:
   - Check **Allow SSH traffic**.
   - Check **Allow HTTP traffic from the internet**.
   - Check **Allow HTTPS traffic from the internet**.
8. Click **Launch Instance**.

## Step 2: Prepare Your Key

1. Open your terminal.
2. Locate your downloaded key (e.g., `~/Downloads/my-app-key.pem`).
3. Set permissions:
   ```bash
   chmod 400 ~/Downloads/my-app-key.pem
   ```

## Step 3: Connect to Your Instance

1. Go to your EC2 Dashboard and copy the **Public IPv4 address** of your instance.
2. Connect via SSH:
   ```bash
   ssh -i ~/Downloads/my-app-key.pem ubuntu@<YOUR-EC2-PUBLIC-IP>
   ```

## Step 4: Install Docker & Git

Run the following commands inside your EC2 terminal:

```bash
# Update packages
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Install Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group (avoids needing sudo for docker commands)
sudo usermod -aG docker $USER
newgrp docker
```

## Step 5: Deploy the Application

1. **Clone your repository** (or copy your files).

   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd url-shortener
   ```

   _(If you haven't pushed code to GitHub yet, you can use `scp` to copy files from your local machine)_:

   ```bash
   # From your LOCAL machine
   scp -i ~/Downloads/my-app-key.pem -r . ubuntu@<YOUR-EC2-IP>:~/url-shortener
   ```

2. **Start the Application**:

   ```bash
   docker compose up -d --build
   ```

3. **Verify**:
   - Open your browser and visit `http://<YOUR-EC2-PUBLIC-IP>`.
   - You should see your React App!

## Step 6: Post-Deployment Steps

- **Database Schema**: You might need to run migrations.
  ```bash
  docker compose exec backend npm run test
  ```
  _(Note: `npm run test` in your package.json runs `drizzle-kit push`)_

## Troubleshooting

- **Cannot connect?** Check your EC2 Security Group inbound rules. Ensure Port 80 is open to `0.0.0.0/0`.
- **Logs**: Run `docker compose logs -f` to see what's happening.
