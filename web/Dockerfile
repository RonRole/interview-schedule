FROM python:3.11

WORKDIR /app

# install nginx
RUN apt update && apt-get install -y nginx

RUN pip install flask pymysql uwsgi

ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ARG APP_SECRET_KEY

ENV DB_HOST ${DB_HOST}
ENV DB_PORT ${DB_PORT}
ENV DB_USER ${DB_USER}
ENV DB_PASSWORD ${DB_PASSWORD}
ENV DB_NAME ${DB_NAME}
ENV APP_SECRET_KEY ${APP_SECRET_KEY}

COPY ./nginx/* /etc/nginx/conf.d/
COPY . /app/

#CMD ["flask","--app","main","run","--host=0.0.0.0"]
RUN chmod 744 /app/startup.sh
CMD ["/app/startup.sh"]