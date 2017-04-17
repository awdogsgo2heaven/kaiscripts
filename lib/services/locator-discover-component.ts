'use strict';

import LocatorComponent from './locator-component';
import {GeoDiscovery} from '../data/geo-discovery';
import {ILocationSql} from '../data/account';
import {BadRequestError} from '../errors';
import WeightMachine from '../objects/weight-machine';
import * as _ from 'underscore';
import {ICoord} from '../helpers/common';
import * as pg from 'pg-promise';

export default class LocatorDiscoverComponent extends LocatorComponent {

  async find(location: ILocationSql, discoveryType: string = 'item') {
    //remove any empty strings

    const query = {
      weather: '*',
      timeOfDay: '*',
      season: '*',
      category: '',
      key: '*',
      region: '',
      country: '',
      temp: 0,
      discoveryType: discoveryType
    }
    query.weather = location.weather.weather;
    query.timeOfDay = location.time;
    if (location.features) {
      query.category = pg.as.csv(location.features);
    }
    query.region = location.region.region;
    query.country = location.region.country;
    query.temp = location.weather.temp;

    const discoveries = await GeoDiscovery.findByQuery(query);
    if (discoveries.length > 0) {
      return this.sample(location, discoveries);
    }
    else {
      throw new BadRequestError('Discovered nothing');
    }

  }

  sample(location: ILocationSql, discoveries: GeoDiscovery[]): GeoDiscovery {
    var self = this;
    var weightedList = [];

    // Loop over weights
    discoveries.forEach(function(discovery) {
      var weight = discovery.weight;
      // Loop over the list of items
      weightedList.push({ weight: weight, option: discovery });
    });

    var machine = new WeightMachine(weightedList);

    return machine.pickOne();
  }
}
