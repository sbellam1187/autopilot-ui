FROM docker.aa.com/prod/aa.com/node:23@sha256:0025ab187b567fff29a3a4534d8a048d57c7034cac081db43ffcccfb5874eeb2

WORKDIR /app

COPY --chown=node:node . /app

RUN npm install && npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start" ]