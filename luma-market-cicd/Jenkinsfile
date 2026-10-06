pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 20, unit: 'MINUTES')
    }

    // Fires when GitHub sends a push webhook to  http://<jenkins>/github-webhook/
    triggers {
        githubPush()
    }

    parameters {
        booleanParam(name: 'PUSH_IMAGE', defaultValue: true,
                     description: 'Push the image to Docker Hub after a successful test')
    }

    environment {
        // >>> EDIT THIS to your Docker Hub username <<<
        DOCKERHUB_USER = 'srilekhauradi'

        IMAGE_NAME     = 'luma-market'
        IMAGE_REPO     = "${DOCKERHUB_USER}/${IMAGE_NAME}"
        CONTAINER_NAME = 'luma-market'
        HOST_PORT      = '8081'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                sh 'git log -1 --oneline'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                      -t ${IMAGE_REPO}:${BUILD_NUMBER} \
                      -t ${IMAGE_REPO}:latest .
                '''
            }
        }

        stage('Smoke Test Image') {
            steps {
                sh '''
                    docker rm -f ${CONTAINER_NAME}-test 2>/dev/null || true
                    docker run -d --name ${CONTAINER_NAME}-test ${IMAGE_REPO}:${BUILD_NUMBER}

                    # Wait up to ~30s for the site to answer (checked from inside the container)
                    for i in $(seq 1 15); do
                      if docker exec ${CONTAINER_NAME}-test wget -qO- http://localhost:3000/ > /dev/null 2>&1; then
                        echo "Smoke test passed"
                        exit 0
                      fi
                      sleep 2
                    done

                    echo "Smoke test FAILED"
                    docker logs ${CONTAINER_NAME}-test
                    exit 1
                '''
            }
            post {
                always {
                    sh 'docker rm -f ${CONTAINER_NAME}-test 2>/dev/null || true'
                }
            }
        }

        stage('Push to Docker Hub') {
            when { expression { params.PUSH_IMAGE } }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials',
                                                  usernameVariable: 'DH_USER',
                                                  passwordVariable: 'DH_PASS')]) {
                    sh '''
                        echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
                        docker push ${IMAGE_REPO}:${BUILD_NUMBER}
                        docker push ${IMAGE_REPO}:latest
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker rm -f ${CONTAINER_NAME} 2>/dev/null || true
                    docker run -d \
                      --name ${CONTAINER_NAME} \
                      --restart unless-stopped \
                      -p ${HOST_PORT}:3000 \
                      ${IMAGE_REPO}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    for i in $(seq 1 15); do
                      STATUS=$(docker inspect --format='{{.State.Health.Status}}' ${CONTAINER_NAME})
                      echo "Container health: $STATUS"
                      [ "$STATUS" = "healthy" ] && exit 0
                      sleep 3
                    done
                    docker logs ${CONTAINER_NAME}
                    exit 1
                '''
            }
        }
    }

    post {
        success {
            echo "Deployed ${IMAGE_REPO}:${BUILD_NUMBER} -> http://<server-ip>:${HOST_PORT}"
        }
        failure {
            echo 'Pipeline failed - check the stage logs above.'
        }
        always {
            sh 'docker image prune -f || true'
        }
    }
}
