FROM docker.aa.com/prod/aa.com/node:23@sha256:e2f60bd580a726a32891095c765da85e0ff311a8b495a8411f358d358d310ba4

WORKDIR /app

COPY --chown=node:node . /app

RUN npm install && npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start" ]