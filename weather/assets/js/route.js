/**
 * @license MIT
 * @fileoverview Menage all routes
 * @copyright codewithsadee 2023 All rights reserved
 * @author codewithsadee <mohammadsadee24@gmail.com>
 */
/*
  'use strict';
  
 import { updateWeather, error404 } from "./app.js";
 const defaultLocation = "#/weather?lat=51.5073219&lon=-0.1276474"
 
 const currentLocation = function () {
   window.navigator.geolocation.getCurrentPosition(res => {
     const { latitude, longitude } = res.coords;
     
     updateWeather(`lat=${latitude}`, `lon=${longitude}`);
   }, err => {
     window.location.hash = defaultLocation;
   });
 }
 
 const searchedLocation = query => updateWeather(...query.split("&"));
 
 const routes = new Map([
   ["/current-location", currentLocation],
   ["/weather", searchedLocation]
]);
   
   const checkHash = function () {
     const requestURL = window.location.hash.slice(1);
     
     const [route, query] = requestURL.includes ? requestURL.split("?") : [requestURL];
     
     routes.get(route) ? routes.get(route)(query) : error404();
   }
   
   window.addEventListener("hashchange", checkHash);
   
   window.addEventListener("load", function () {
     if (!window.location.hash) {
       window.location.hash = "#/current-location";
     } else {
       checkHash();
     }
   });*/ 
   
   
   /**
 * @license MIT
 * @fileoverview Manage all routes
 * @copyright codewithsadee 2023 All rights reserved
 * @author codewithsadee <mohammadsadee24@gmail.com>
 */

'use strict';

import { updateWeather, error404 } from "./app.js";

// Местоположение по умолчанию (Лондон)
const defaultLocation = "#/weather?lat=51.5073219&lon=-0.1276474";

// Функция для получения местоположения по IP (GeoIP)
const getLocationByIP = () => {
  const token = 'c6c7e688c82f01'; // Замените на ваш токен от ipinfo.io
  const url = `https://ipinfo.io/json?token=${token}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.loc) {
        // Извлекаем широту и долготу из поля `loc`
        const [latitude, longitude] = data.loc.split(',');
        updateWeather(`lat=${latitude}`, `lon=${longitude}`);
      } else {
        // Если данные о местоположении недоступны, используем местоположение по умолчанию
        window.location.hash = defaultLocation;
      }
    })
    .catch(() => {
      // Если запрос к API не удался, используем местоположение по умолчанию
      window.location.hash = defaultLocation;
    });
};

// Функция для получения текущего местоположения через геолокацию
const currentLocation = function () {
  if ("geolocation" in navigator) {
    window.navigator.geolocation.getCurrentPosition(
      res => {
        const { latitude, longitude } = res.coords;
        updateWeather(`lat=${latitude}`, `lon=${longitude}`);
      },
      err => {
        // Если геолокация недоступна или пользователь отклонил запрос, используем GeoIP
        getLocationByIP();
      }
    );
  } else {
    // Если браузер не поддерживает геолокацию, используем GeoIP
    getLocationByIP();
  }
};

// Функция для обработки поиска местоположения по запросу
const searchedLocation = query => updateWeather(...query.split("&"));

// Маршруты
const routes = new Map([
  ["/current-location", currentLocation],
  ["/weather", searchedLocation]
]);

// Функция для проверки хэша и выбора маршрута
const checkHash = function () {
  const requestURL = window.location.hash.slice(1);
  const [route, query] = requestURL.includes("?") ? requestURL.split("?") : [requestURL];

  if (routes.has(route)) {
    routes.get(route)(query);
  } else {
    error404();
  }
};

// Обработчики событий
window.addEventListener("hashchange", checkHash);
window.addEventListener("load", function () {
  if (!window.location.hash) {
    // Если хэш пуст, запрашиваем текущее местоположение
    window.location.hash = "#/current-location";
  } else {
    // Иначе проверяем хэш
    checkHash();
  }
});