'use strict';

//TODO: consider moving these settings into app.js

/*
 * This module contains settings used for building forms for creating and/or modifying resources.  It mostly
 * provides restrictions to ranges of valid values the API will accept.
 */
angular.module('resourceSettings', [])
  .value('apiBaseUrl', 'http://ayamel.americancouncils.org/api/')
  .value('resourceSettings', {
    types: ['video', 'audio', 'image', 'document', 'data', 'collection'],
    categories: ['Politics', 'Culture', 'Sports']
  })
  .value('relationSettings', {
    types: ['part_of', 'depends_on', 'requires']
  })
  .value('fileSettings', {

  })
;
