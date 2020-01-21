var express = require('express');
var path = require('path'); // модуль работы с путями в файловой системе
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// подключаем модули роутеров
var indexRouter = require('./routes/index'); 
var usersRouter = require('./routes/users');
var clientsRouter = require('./routes/client');
var filmsRouter = require('./routes/films');
var doctorsRouter = require('./routes/doctors');
var clinicsRouter = require('./routes/clinics');
// var appointmentsRouter = require('./routes/appointments')

var app = express();

app.use(logger('dev')); // логгирование
app.use(express.json()); // парсинг запросов с JSON
app.use(express.urlencoded({ extended: false })); // парсинг запросы с urlencoded данными
app.use(cookieParser()); // обработка файлов cookie
app.use(express.static(path.join(__dirname, 'public'))); // сервируем статические файлы нашего веб-cайта из папки <путь к северу>/public 

app.use('/', indexRouter); // используем роутер indexRouter для путей /*
app.use('/users', usersRouter); // используем роутер usersRouter для путей /users/*
app.use('/films', filmsRouter);
app.use('/users/:_id/client', clientsRouter);
app.use('/users/:_id/doctor', doctorsRouter);
app.use('/clinics', clinicsRouter);
// app.use('/users/:_id/client', appointmentsRouter);
module.exports = app;
