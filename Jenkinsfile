pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "vishal1326/number-game"
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/Vishal5205/number-guessing-game.git'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:$BUILD_NUMBER .'
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push $DOCKER_IMAGE:$BUILD_NUMBER
                    '''
                }
            }
        }
    }
}
