FROM node:22-alpine

WORKDIR /usr/src/app

# kopiuje tylko zależności najpierw (szybsze buildy dzięki cache)
COPY package*.json ./

# instalacja zależności
RUN npm ci || npm install

# kopiuje resztę aplikacji
COPY . .

# uruchamianie jako nie-root (proces nie działa z uprawnieniami administratora (root))
RUN chown -R node:node /usr/src/app
USER node

EXPOSE 3001

CMD ["npm", "start"]