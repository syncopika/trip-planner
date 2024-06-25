FROM ubuntu:latest

RUN apt-get update -y \
    && apt-get install -y \
    nodejs \
    npm
    
EXPOSE 443

# copy over the source code and get the dependencies
COPY . /opt/

WORKDIR /opt/

RUN npm install

CMD ["node", "api-server.js"]