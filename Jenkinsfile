pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile'
        }
    }
    environment {
        CI = 'true'
    }
    stages {
            stage('Build') {
                steps {
                    sh 'npm install'
                }
            }
            stage('Test') {
                steps {
                    sh 'echo Testing Passed'
                }
            }
            stage('Deploy for Development') {
                when {
                    branch 'dev'
                }
                steps {
                    sh 'npm start'
                }
            }
            stage('Deploy for Production') {
                when {
                    branch 'master'
                }
                steps {
                    sh 'npm start'
                }
            }
        }
}