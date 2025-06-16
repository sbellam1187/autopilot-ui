FROM docker.aa.com/prod/aa.com/node:23@sha256:45b369695cdd0f08844b6fa0aaeadfd8367f9a90a2da41621d1f9850fc7e50a1

WORKDIR /app

COPY --chown=node:node . /app

RUN npm install && npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start" ]