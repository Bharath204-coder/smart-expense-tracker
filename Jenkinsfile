pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "bharathcm"
        IMAGE_BACKEND = "expense-backend"
        IMAGE_FRONTEND = "expense-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t $DOCKERHUB_USER/$IMAGE_BACKEND:latest ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $DOCKERHUB_USER/$IMAGE_FRONTEND:latest ./frontend'
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
                sh 'docker push $DOCKERHUB_USER/$IMAGE_BACKEND:latest'
                sh 'docker push $DOCKERHUB_USER/$IMAGE_FRONTEND:latest'
            }
        }
    }
}
