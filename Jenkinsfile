pipeline {
    agent any
    environment {
        CI = 'true'
    }
    stages {
            stage('Build') {
                steps {
                    sh 'docker build -t clinics:latest .'
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
                    sh 'docker container stop clinics-dev'
                    sh 'docker container run --rm --detach --publish 3000:3001 --name clinics-dev clinics:latest'
                }
            }
            stage('Deploy for Production') {
                when {
                    branch 'master'
                }
                steps { 
                    sh 'docker container stop clinics'
                    sh 'docker container run --rm --detach --publish 3001:3001 --name clinics clinics:latest'
                }
            }
        }
}