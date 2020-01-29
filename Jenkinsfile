node {
    stage('Build') {
        if (env.BRANCH_NAME == 'dev') {
            echo 'Hello from dev branch'
            checkout scm
            def myImage = docker.build("clinics:latest", '.')
            sh 'docker stop clinics'
            sh 'docker rm clinics'
            sh 'docker run -d --name clinics -p 3001:3001 clinics:latest' 
        } else {
            echo 'Another branches'
        }
    }
}