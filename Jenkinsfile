pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    environment {
        SONAR_SCANNER_HOME = tool 'SonarQubeScanner' //the same as the scanner name in Jenkins configuration tools
        SONAR_PROJECT_KEY = 'incomplete-cicd-01' //the same as the project key in SonarQube
        JOB_NAME_NOW = 'cicd02' //the same as the project name in Jenkins
        ECR_REPO = 'devopsorojectrepo' //the same as the repository name in ECR
        IMAGE_TAG = 'latest'
        ECR_REGISTRY = '417738508223.dkr.ecr.us-east-1.amazonaws.com' // the uri before the repository name in ECR
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
                    docker.build("${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}")
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
        stage('Loging to AWS ECR') {
            steps {
                sh '''
            aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 417738508223.dkr.ecr.us-east-1.amazonaws.com
            '''
            }
        }
        stage('PUSH IMAGE TO ECR') {
            steps {
                script {
                    sh """
                docker.image("${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}").push()
                docker tag devopsorojectrepo:latest 417738508223.dkr.ecr.us-east-1.amazonaws.com/devopsorojectrepo:latest
                """
                }
            }
        }
    }
}
