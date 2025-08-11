FROM docker.aa.com/prod/aa.com/node:23@sha256:a1fe67013389d0601e08e1ad49e671ad88de2f3de003f9b81e1245b7d4b28fb3

WORKDIR /app

COPY --chown=node:node . /app

RUN npm install && npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start" ]