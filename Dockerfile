FROM docker.aa.com/prod/aa.com/node:23@sha256:78a9b6a146278e1186f5a0c8a94e8aae74dc20a8ea863195ef795e505e9a70fa

WORKDIR /app

COPY --chown=node:node . /app

RUN npm install && npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start" ]