FROM node:20-alpine

WORKDIR /student-web

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# ---- VITE ENV VARIABLE (IMPORTANT) ----
ARG VITE_BACKEND_BASE_URL
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL

# Build-time exposure (Vite reads env during build)
RUN npm run build

EXPOSE 5173

CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173"]