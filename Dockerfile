FROM docker.aa.com/prod/aa.com/node:23@sha256:fc8d5295278fd5c66d5eb74d4b7f58ba69d3944a6109e6e429c1e605d3591649

WORKDIR /app

COPY --chown=node:node . /app

RUN npm install && npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start" ]