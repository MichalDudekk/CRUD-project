FROM node:22-alpine

WORKDIR /usr/src/app

# kopiuje tylko zależności najpierw (szybsze buildy dzięki cache)
COPY package*.json ./

# instalacja zależności (fallback do npm install gdy brak lockfile)
# RUN npm ci --only=production || npm install --production
RUN npm ci || npm install

# kopiuje resztę aplikacji
COPY . .

# uruchamianie jako nie-root (proces nie działa z uprawnieniami administratora (root))
RUN chown -R node:node /usr/src/app
USER node

# ENV NODE_ENV=production
ENV VITE_APP_PORT=3001
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]