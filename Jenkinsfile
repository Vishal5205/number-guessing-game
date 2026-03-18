pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "vishal1326/guessing-game"
    }

    stages {

        stage('SonarCloud Analysis') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                    sonar-scanner \
                    -Dsonar.projectKey=Vishal5205_number-guessing-game \
                    -Dsonar.organization=vishal5205 \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=https://sonarcloud.io \
                    -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                docker build -t $DOCKER_IMAGE:$BUILD_NUMBER .
                docker tag $DOCKER_IMAGE:$BUILD_NUMBER $DOCKER_IMAGE:latest
                '''
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push $DOCKER_IMAGE:$BUILD_NUMBER
                    docker push $DOCKER_IMAGE:latest
                    '''
                }
            }
        }
    }
}
