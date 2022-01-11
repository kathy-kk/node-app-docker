FROM node:15
WORKDIR /app
COPY package.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV"="development"]; \
        then npm install; \
        else npm install --only=production; \
        fi
COPY . ./
ENV PRORT 3000
EXPOSE $PRORT
CMD ["node", "index.js"]