# ---------- Build Stage ----------
FROM node:20-alpine AS build

WORKDIR /student-web

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_BACKEND_BASE_URL
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL

RUN npm run build


# ---------- Production Stage ----------
FROM nginx:alpine

# Remove default nginx static config
RUN rm -rf /usr/share/nginx/html/*

# Copy Vite build output
COPY --from=build /student-web/dist /usr/share/nginx/html

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
