FROM docker.aa.com/prod/aa.com/node:23@sha256:13a145ab5169c17fad7a9c29ba7bcc3083ff769113f33269f2d6f35e784b9d02

WORKDIR /app

COPY --chown=node:node . /app

RUN npm install && npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start" ]