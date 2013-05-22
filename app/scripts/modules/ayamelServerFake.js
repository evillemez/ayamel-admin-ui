'use strict';

angular.module('ayamelServerFake', ['ngMockE2E'])
  .run(function($httpBackend, appSettings) {

    //hard code some commonly used data structures
    var baseId = '234sdfsd30';
    var idInc = 0;
    var testClient = { id: 'test_client' };
    var responseOk = { code: 200, message: 'ok'};
    var responseNotFound = { code: 404, message: 'Not Found' };
    var responseNotAuthorized = { code: 403, message: 'Access Denied' };
    var responseNotAuthenticated = { code: 401, message: 'Authentication Required' };
    var responseResourceDeleted = { code: 410, message: 'Deleted' };

    //hard-code an initial data structures for testing
    var resources = [
      {
        id: '2387fdas2345323sdf23d',
        title: 'A plane', //text field
        type: 'video',  //select
        description: 'A man walks through a hallway, thinking about food',  //textarea
        categories: ['Food', 'Culture'],  //select
        keywords: 'fast food, hamburgers, other things',  //textarea
        license: 'Creative Commons',  //text field w/ default value
        copyright: 'Test Client Inc. 1997-2012',  //text field w/ default value
        visibility: ['test_client'],  //text field
        status: 'awaiting_content',
        dateAdded: [],
        dateModified: [],
        client: testClient,
        origin: {
          creator: 'Batman',    //textfield
          location: 'Gotham City',  //textfield
          date: 'Late 20th Century',  //text field
          format: 'Latex and polyester', //text field
          note: 'This cape fragment was discovered after the incident...', //textarea
          uri: 'http://smithsonian.org/heros/batman/cape.html' //text field
        },
        content: {},
        relations: []
      },
      {
        id: '2387fdas2345323sdf23000',
        title: 'A train',
        type: 'document',
        description: "A man walks through a hallway, thinking about cars and other things that may or may not involve cars - but he can't quite remember...",
        categories: ['Food', 'Culture'],
        keywords: 'fast food, hamburgers, other things',
        license: 'Creative Commons',
        copyright: 'Test Client Inc. 1997-2012',
        visibility: [],
        status: 'awaiting_content',
        dateAdded: [],
        dateModified: [],
        client: testClient,
        origin: {
          creator: 'Batman',
          location: 'Gotham City',
          date: 'Late 20th Century',
          format: 'Latex and polyester',
          note: 'This cape fragment was discovered after the incident...',
          uri: 'http://smithsonian.org/heros/batman/cape.html'
        },
        content: {},
        relations: []
      },
      {
        id: '2387fdas2345323sdf23001',
        title: 'An automobile',
        type: 'video',
        description: 'A man walks through a hallway, thinking about stem cell research',
        categories: ['Food', 'Culture'],
        keywords: 'fast food, hamburgers, other things',
        license: 'Creative Commons',
        copyright: 'Test Client Inc. 1997-2012',
        visibility: ['test_client', 'other_client'],
        status: 'awaiting_content',
        dateAdded: [],
        dateModified: [],
        client: testClient,
        origin: {
          creator: 'Batman',
          location: 'Gotham City',
          date: 'Late 20th Century',
          format: 'Latex and polyester',
          note: 'This cape fragment was discovered after the incident...',
          uri: 'http://smithsonian.org/heros/batman/cape.html'
        },
        content: {},
        relations: []
      }
    ];


    //utility function to find a resource by its ID in the
    //test structure above
    function getResourceIndex(id) {
      for (var i=0; i < resources.length; i++) {
        if (resources[i].id === id) {
          return i;
        }
      }

      return false;
    }

    function getResourceIdFromPath(path, url) {
      //this would be much nicer w/ regex
      var parts = url.replace(appSettings.apiEndpoint + "/resources", "").split("/");
      if (parts.length != 3) {
          return false;
      }

      return parts[1];
    }

    function matchRoute(string) {
      return new RegExp(appSettings.apiEndpoint + string);
    }

    //ignore requests to static resources, just let them through
    $httpBackend.whenGET(/\.html$/).passThrough();
    $httpBackend.whenGET(/\.css$/).passThrough();
    $httpBackend.whenGET(/\.js$/).passThrough();

    /* Intercepting API requests below */

    //get a specific resource
    $httpBackend.whenGET(matchRoute('/resources/(\w*)')).respond(function (method, url, data) {
      var id = getResourceIdFromPath('/resources', url);
      var index = getResourceIndex(id);

      var resource = resources[index] || false;

      if (!resource) {
        return [404, { response: responseNotFound }];
      }

      return [200, {
        response: responseOk,
        resource: resource
      }];
    });

    //modify a specific resource
    $httpBackend.whenPUT(matchRoute('/resources/(\w*)')).respond(function (method, url, data) {
      var id = getResourceIdFromPath('/resources', url);
      var index = getResourceIndex(id);

      var resource = resources[index] || false;

      if (!resource) {
        return [404, { response: responseNotFound }];
      }

      //set new values on resource
      var items = angular.fromJson(data);
      for (var key in items) {
        resource[key] = items[key];
      }
      resource.dateModified = new Date();

      resources[index] = resource;

      return [200, { response: responseOk, resource: resource }];
    });

    //delete a resource
    $httpBackend.whenDELETE(matchRoute('/resources/(\w*)')).respond(function (method, url, data) {
      var id = getResourceIdFromPath('/resources', url);
      var index = getResourceIndex(id);

      var resource = resources[index] || false;

      if (!resource) {
        return [404, { response: responseNotFound }];
      }

      resources.splice(index, 1);

      return [200, { response: responseOk }];
    });

    //get list of resources - TODO: implement filters
    $httpBackend.whenGET(matchRoute('/resources$')).respond(function () {
      return [200, { response: responseOk, resources: resources }];
    });

    //when creating a new resource
    $httpBackend.whenPOST(matchRoute('/resources$')).respond(function(method, url, data) {
      idInc++;
      var resource = angular.fromJson(data);
      resource.id = baseId + idInc;
      resource.client = testClient;
      resource.status = 'awaiting_content';
      resource.dateAdded = new Date();
      resource.dateModified = new Date();

      resources.push(resource);

      var uploadUrl = appSettings.apiEndpoint + '/resources/' + resource.id + '/content/h543dfakkdshf56789';

      return [201, { response: responseOk, resource: resource , content_upload_url: uploadUrl }];
    });

    //to get a content upload url for a resource
    $httpBackend.whenGET(matchRoute('/resources/(\w*)/request-upload-url')).respond(function(method, url, data) {
      var id = getResourceIdFromPath('/resources', url);
      var index = getResourceIndex(id);

      var resource = resources[index] || false;

      if (!resource) {
        return [404, { response: responseNotFound }];
      }

      var uploadUrl = appSettings.apiEndpoint + '/resources/' + resource.id + '/content/hashfadshf56789'
      
      return [200, { response: responseOk, content_upload_url: uploadUrl }];
    });

    //to upload actual content
    $httpBackend.whenPOST(matchRoute('/resources/(\w*)/content/(\w*)')).respond(function(method, url, data) {
      console.log('content uploading not yet properly faked :(');
    });

    //404 on all other api requests
    $httpBackend.whenGET(matchRoute('')).respond(function(method, url, data) {
      return [404, { response: { code: 404, message: 'Unknown API route.' } }];
    });

  })
;
