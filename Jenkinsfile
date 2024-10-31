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
        stage('Login to AWS ECR') {
        steps {
                withCredentials([file(credentialsId: 'aws-credentials', variable: 'AWS_CREDENTIALS_FILE')]) {
                script {
                    def awsCredentials = readFile(AWS_CREDENTIALS_FILE).trim().split("\n")
                    env.AWS_ACCESS_KEY_ID = awsCredentials.find { it.startsWith("aws_access_key_id") }.split("=")[1].trim()
                    env.AWS_SECRET_ACCESS_KEY = awsCredentials.find { it.startsWith("aws_secret_access_key") }.split("=")[1].trim()
                    env.AWS_SESSION_TOKEN = awsCredentials.find { it.startsWith("aws_session_token") }?.split("=")[1]?.trim()

                    echo "AWS Access Key ID: ${env.AWS_ACCESS_KEY_ID}"

                    sh '''
                    aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
                    aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
                    aws configure set aws_session_token $AWS_SESSION_TOKEN
                    aws sts get-caller-identity
                    echo "Logging into AWS ECR registry ${ECR_REGISTRY}"
                    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ECR_REGISTRY} || exit 1
                    '''
                    }
                }
            }
        }
        stage('PUSH IMAGE TO ECR') {
            steps {
                script {
                    sh """
                docker.image("${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}").push()
                """
                }
            }
        }
        stage('Debugging') {
        steps {
            sh 'aws sts get-caller-identity'
            sh 'echo "Docker images:"'
            sh 'docker images'
        }
        }

        }
    }
