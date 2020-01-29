node {
    stage('Build') {
        if (env.BRANCH_NAME == 'dev') {
            echo 'Hello from dev branch'
            checkout scm
            def myImage = docker.build("clinics:latest", '.')
            sh 'docker container run --rm --detach --name clinics --publish 3001:3001 clinics:latest' 
        } else {
            echo 'Another branches'
        }
    }
}