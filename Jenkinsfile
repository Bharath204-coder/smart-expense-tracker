pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo "Pulling latest code from Github..."
                git branch: 'main',
                    url: 'https://github.com/Bharath204-coder/smart-expense-tracker.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building backedn and frontend iamges..."
                sh 'docker-compose build'
            }
        }

        stage('Stop Existing containers') {
            steps {
                echo "Stopping old containers..."
                sh 'docker-compose down'
            }
        }
        stage('Deploy Application') {
            steps {
                echo "Starting new containers..."
                sh 'docker-compose up -d'
            }
        }

        stage('Verify deployment'){
            steps {
                echo "Verifying running containers..."
                sh 'docker ps'
            }
        }
    }
}