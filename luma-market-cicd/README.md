# Automated Website Deployment using Jenkins, Docker & GitHub

A CI/CD pipeline for the **Luma Market** website (React + Vite front end, Express server).
Every `git push` to GitHub triggers Jenkins, which builds a Docker image, tests it,
pushes it to Docker Hub and redeploys the running container.

```
Developer ──push──▶ GitHub ──webhook──▶ Jenkins ──▶ docker build ──▶ smoke test
                                                         │
                                          Docker Hub ◀───┤ push
                                                         ▼
                                              docker run  (port 8081)
```

## Project layout

| File | Purpose |
|---|---|
| `client/`, `server/`, `shared/` | Website source |
| `Dockerfile` | Multi-stage build: build app, then ship a small production image |
| `docker-compose.yml` | Run the site locally with one command |
| `Jenkinsfile` | Pipeline: Checkout → Build → Smoke test → Push → Deploy → Verify |
| `jenkins/` | Dockerfile + compose file to run Jenkins itself (with Docker access) |

## 1. Run the site locally (no Jenkins)

```bash
docker compose up -d --build
# open http://localhost:8081
```

## 2. Push the project to GitHub

```bash
git init
git add .
git commit -m "Luma Market CI/CD pipeline"
git branch -M main
git remote add origin https://github.com/<you>/Automated-Website-Deployment-using-Docker.git
git push -u origin main --force      # --force only because this replaces the old repo layout
```

## 3. Start Jenkins

Requires Docker on the machine (Linux server / EC2 / local).

```bash
cd jenkins
docker compose up -d --build
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Open `http://<server-ip>:8080`, paste the password, choose **Install suggested plugins**, create an admin user.

## 4. Add Docker Hub credentials

1. Create an access token at hub.docker.com → Account Settings → Security.
2. Jenkins → **Manage Jenkins → Credentials → (global) → Add Credentials**
   - Kind: *Username with password*
   - Username: your Docker Hub username, Password: the access token
   - ID: `dockerhub-credentials` (must match the Jenkinsfile)
3. Edit `DOCKERHUB_USER` at the top of the `Jenkinsfile` to your Docker Hub username.

## 5. Create the pipeline job

1. **New Item** → name `luma-market` → **Pipeline** → OK
2. Build Triggers → tick **GitHub hook trigger for GITScm polling**
3. Pipeline → Definition: **Pipeline script from SCM** → SCM: **Git**
   - Repository URL: your GitHub repo URL
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
4. Save → **Build Now** for the first run.

## 6. Automatic builds on push (GitHub webhook)

GitHub repo → **Settings → Webhooks → Add webhook**
- Payload URL: `http://<jenkins-public-ip>:8080/github-webhook/`
- Content type: `application/json`
- Event: *Just the push event*

Jenkins must be reachable from the internet. On a laptop, expose it with a tunnel such as
`ngrok http 8080` and use that URL. If you can't, set *Poll SCM* (`H/2 * * * *`) in the job instead.

## 7. See it work

After a successful build the site is live at `http://<server-ip>:8081`.
Edit something in `client/src/pages/Home.tsx`, commit, push — Jenkins rebuilds and redeploys on its own.

## Notes

- Open ports 8080 (Jenkins) and 8081 (website) in your firewall / cloud security group.
- Image tags: each build is tagged with its build number plus `latest`, so you can roll back with
  `docker run -d -p 8081:3000 <user>/luma-market:<build-number>`.
- The Jenkins container mounts the host's `/var/run/docker.sock`. This is convenient for a demo,
  but gives Jenkins root-level control of the host; harden it for production.
- To skip Docker Hub, untick **PUSH_IMAGE** when running "Build with Parameters".
