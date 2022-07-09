FROM node:15
WORKDIR /app
RUN npm install -g serve
COPY ./package.json .
RUN npm install
COPY . .
RUN npm run build
ENV PORT=3000
ENV REACT_APP_ENV=production
EXPOSE 3000
CMD ["serve","-s", "build"]
