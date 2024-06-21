# this is untested atm and will probably almost definitely not work straightaway

FROM ubuntu:latest

RUN apt-get update -y \
    && apt-get install -y \
    nginx \
    nodejs \
    npm
    
EXPOSE 443

# copy nginx files + entrypoint
COPY docker/entrypoint.sh /opt/trip-planner/entrypoint.sh
COPY docker/nginx.conf /etc/nginx/nginx.conf

# TODO: do we need this?
RUN useradd -s /sbin/nologin -M nginx

RUN chmod -R o-w /etc/nginx
RUN chmod +x /opt/trip-planner/entrypoint.sh

# point log output to stdout and stderr
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

# copy over the source code and run npm install + build
COPY . /opt/trip-planner/

WORKDIR /opt/trip-planner/

RUN npm install
RUN npm run setup-map-dev
RUN npm run build

CMD ["entrypoint.sh"]