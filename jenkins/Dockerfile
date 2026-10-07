FROM docker:cli AS dockercli

FROM jenkins/jenkins:lts-jdk17
USER root
# Docker CLI only - the daemon is the host's, reached through /var/run/docker.sock
COPY --from=dockercli /usr/local/bin/docker /usr/local/bin/docker
USER jenkins
