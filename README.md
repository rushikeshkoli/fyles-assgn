# React Frontend for the Assignment
- The app requests branches data from the backend.
- You can modify branches 
according to city and search field can search the input across all fields.
##To run this project
### `npm install`
### `npm start`

### Current Deployment
- This application is deployed on kubernetes cluster(EKS).
- Any commit to the repository starts the codepipline.
- The codebuild generates docker image and pushes it to the ECR. New image can be updated using deployment.spec in EKS.
- The service is exposed using load-balancer.

[Backend Repository](https://github.com/rushikeshkoli/fyle-backend)