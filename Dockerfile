FROM docker.aa.com/prod/aa.com/node:23@sha256:bfab58dd339d7eb55f95f0d02e842c1c0ea65d989f26d60bf0b0004d32ee1ab3

WORKDIR /app

COPY --chown=node:node . /app

RUN npm install && npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start" ]