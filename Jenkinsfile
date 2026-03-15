pipeline {
 agent any

 stages {

  stage('Clone') {
   steps {
    git 'https://github.com/Vishal5205/number-guessing-game.git'
   }
  }

  stage('Docker Build') {
   steps {
    sh 'docker build -t guessing-game .'
   }
  }

  stage('Deploy') {
   steps {
    sh 'docker run -d -p 80:80 guessing-game'
   }
  }

 }

}
