FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html
COPY . /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/.git /usr/share/nginx/html/.github
EXPOSE 80
