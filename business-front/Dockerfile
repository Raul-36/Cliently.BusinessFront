FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

ARG VITE_API_GATEWAY_URL

ENV VITE_API_GATEWAY_URL=$VITE_API_GATEWAY_URL

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 4173

ENTRYPOINT ["npm", "run", "preview", "--"]

CMD ["--host", "0.0.0.0"]
