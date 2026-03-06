# --- STAGE 1: Build frontendu ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# --- STAGE 2: Serwowanie przez Nginx ---
FROM nginx:alpine

# Usuń domyślną konfigurację
RUN rm /etc/nginx/conf.d/default.conf

# Skopiuj naszą konfigurację
COPY my.conf /etc/nginx/conf.d/default.conf

# Skopiuj zbudowany frontend
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
