pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    environment {
        SONAR_SCANNER_HOME = tool 'SonarQubeScanner' //the same as the scanner name in Jenkins configuration tools
        SONAR_PROJECT_KEY = 'incomplete-cicd-01' //the same as the project key in SonarQube
        JOB_NAME_NOW = 'cicd02' //the same as the project name in Jenkins
    }
    stages {
        stage('GitHub') {
            steps {
                git credentialsId: 'jen-git-dind', url: 'https://github.com/mariemMoula/Incomplete_CICD_02.git'
            }
        }
        stage('Unit Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'incomplete-cicd-02-SonarQubetoken', variable: 'SONAR_TOKEN')]) {
                    withSonarQubeEnv('SonarQube') {
                        sh """
                    ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                    -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://sonarqube:9000 \
                    -Dsonar.login=${SONAR_TOKEN}
                    """
                    }
                }
            }
        }
        stage('Docker Image') {
            steps {
                script {
                    docker.build("${JOB_NAME_NOW}:latest")
                }
            }
        }
        stage('Trivy Scan') {
            steps {
                script {
                    sh "trivy --severity HIGH,CRITICAL --no-progress --format table -o trivy-report.html image ${JOB_NAME_NOW}:latest"       
                 }
        }
    }
}
}