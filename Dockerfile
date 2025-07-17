FROM docker.aa.com/prod/aa.com/node:23@sha256:5b5487ddf2b65e67af2070a770705bbf874e1c71d5088111e942ee3ef6e41e53

WORKDIR /app

COPY --chown=node:node . /app

RUN npm install && npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start" ]