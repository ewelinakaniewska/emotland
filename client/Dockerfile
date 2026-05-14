FROM node:18-slim AS build
WORKDIR /app

ARG FRONTEND_URL
ENV FRONTEND_URL=$FRONTEND_URL

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL


COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
