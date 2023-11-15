#!/usr/bin/bash
service nginx start
uwsgi --ini /app/wsgi.ini
