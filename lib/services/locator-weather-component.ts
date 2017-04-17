'use strict';

import LocatorComponent from './locator-component';
import {sprintf} from 'sprintf-js';
import * as request from 'request';
import * as _ from 'underscore';
import {ICoord} from '../helpers/common';
import {BadRequestError} from '../errors';
import {IWeatherInfo} from '../data/weather-cache';

export default class LocatorWeatherComponent extends LocatorComponent {
  find(coord: ICoord): Promise<IWeatherInfo> {
    var requestUrl = sprintf('%s?lat=%f&lon=%f&APPID=%s',
      process.env.WEATHER_API_URL, coord.lat,
      coord.lon, process.env.WEATHER_API_KEY);

    return new Promise<IWeatherInfo>(function(resolve, reject) {
      request.get({
        url: requestUrl,
        json: true
      }, (err, res, body) => {
        if (body) {
          console.log(body);
          var weather = _.first(body.weather) || { main: 'clear', code: '0' };
          resolve({
            temp: body.main.temp,
            humidty: body.main.humidty,
            weather: weather.main.toLowerCase()
          });
        }
        else {
          reject(new BadRequestError('Unable to determine weather'));
        }
      });
    });
  }
}
