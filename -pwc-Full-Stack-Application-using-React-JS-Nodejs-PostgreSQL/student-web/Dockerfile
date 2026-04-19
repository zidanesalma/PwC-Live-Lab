# ---- build stage ----
FROM node:20-alpine AS build

WORKDIR /student-web

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- runtime stage ----
FROM nginx:alpine

COPY --from=build /student-web/dist /usr/share/nginx/html
COPY public/config.template.js /usr/share/nginx/html/config.template.js
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

CMD ["/docker-entrypoint.sh"]
