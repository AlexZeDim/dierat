FROM node:14
# create working dir
WORKDIR /usr/dierat

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN yarn install

# Bundle app source
COPY . .

CMD [ "node", "bot.js" ]
