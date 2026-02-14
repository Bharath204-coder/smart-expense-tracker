pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "bharathcm"
        IMAGE_BACKEND = "expense-backend"
        IMAGE_FRONTEND = "expense-frontend"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                docker build -t $DOCKERHUB_USER/$IMAGE_BACKEND:$IMAGE_TAG ./backend
                docker tag $DOCKERHUB_USER/$IMAGE_BACKEND:$IMAGE_TAG $DOCKERHUB_USER/$IMAGE_BACKEND:latest
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                docker build -t $DOCKERHUB_USER/$IMAGE_FRONTEND:$IMAGE_TAG ./frontend
                docker tag $DOCKERHUB_USER/$IMAGE_FRONTEND:$IMAGE_TAG $DOCKERHUB_USER/$IMAGE_FRONTEND:latest
                '''
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {
                    sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                docker push $DOCKERHUB_USER/$IMAGE_BACKEND:$IMAGE_TAG
                docker push $DOCKERHUB_USER/$IMAGE_BACKEND:latest

                docker push $DOCKERHUB_USER/$IMAGE_FRONTEND:$IMAGE_TAG
                docker push $DOCKERHUB_USER/$IMAGE_FRONTEND:latest
                '''
            }
        }
    }

    post {
        success {
            echo "✅ CI pipeline successful — images built & pushed!"
        }
        failure {
            echo "❌ CI failed — check logs."
        }
    }
}
