FROM docker.aa.com/prod/aa.com/node:23@sha256:da273289d1742d2c13929327c8e88eb21cd639b14ee433cdc4546bd8d78a3fba

WORKDIR /app

COPY --chown=node:node . /app

RUN npm install && npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start" ]