#---------------------
# Задаем базовый образ, поверх которого будем создавать полноценный образ нашего приложения
FROM node:lts-alpine

# ADD - копирование + разархивирование
# Команда копирования
COPY . /app

# WORKDIR - установить текущую рабочую дерикторию в образе (cd)
WORKDIR /app

# RUN - запустить sh скрипт
RUN npm install

# EXPOSE - какой порт сделать доступным
EXPOSE 3001 8080

# CMD - какой командой запускать приложение
CMD ["node", "./www"]

# Команды для сборки и запуска
# docker build -t <название образа> -f <путь к докерфайлу>
# docker images -a - посмотреть образы и их слои
# docker rmi <id или название образа>
# docker image history <id или название образа>
# docker create <имя или id образа> - создать контейнер из образа
# docker run -d --name <имя контейнера> -p 3000:3001 <имя образа>
# docker ps - список запущенных контейнеров
# docker stop/start/restart <имя контейнера>
# docker logs <имя контейнера> - логи контейнера