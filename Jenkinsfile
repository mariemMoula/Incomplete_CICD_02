pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    stages{
        stage('GitHub'){
            steps{
                git credentialsId: 'jen-git-dind', url: 'https://github.com/mariemMoula/Incomplete_CICD_02.git'
                }
                }
        stage('Unit Test'){
            steps{
                sh 'npm install'
                sh 'npm test'
            }
        }

}
}

