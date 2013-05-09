'use strict';

angular.module('ayamelServerFake', ['ngMockE2E'])
  .run(function($httpBackend, appSettings) {

    //hard code some commonly used data structures
    var baseId = '234sdf423d34asd30';
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
        title: 'A plane',
        type: 'video',
        description: 'A man walks through a hallway, thinking about food',
        categories: ['Food', 'Culture'],
        keywords: 'fast food, hamburgers, other things',
        license: 'Creative Commons',
        copyright: 'Tesk Client Inc. 1997-2012',
        visibility: ['test_client'],
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
        id: '2387fdas2345323sdf23000',
        title: 'A train',
        type: 'document',
        description: "A man walks through a hallway, thinking about cars and other things that may or may not involve cars - but he can't quite remember...",
        categories: ['Food', 'Culture'],
        keywords: 'fast food, hamburgers, other things',
        license: 'Creative Commons',
        copyright: 'Tesk Client Inc. 1997-2012',
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
        copyright: 'Tesk Client Inc. 1997-2012',
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
      var parts = url.replace(appSettings.apiEndpoint + "/resources", "").split("/");
      if (parts.length != 2) {
          return false;
      }

      return parts[1];
    }

    function createRegex(string) {
      return new RegExp('/'+ appSettings.apiEndpoint + string);
    }

    //ignore requests to static resources, just let them through
    $httpBackend.whenGET(/\.html$/).passThrough();
    $httpBackend.whenGET(/\.css$/).passThrough();
    $httpBackend.whenGET(/\.js$/).passThrough();

    //intercept API requests
    $httpBackend.whenGET(/\/resources$/).respond(function () {
      return [200, { response: responseOk, resources: resources }];
    });

    //when getting a specific resource
    $httpBackend.whenGET(/\/resources(\/\d*)*/).respond(function (method, url, data) {
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

    //when modifying a specific resource
    $httpBackend.whenPUT(/\/resources(\/\d*)*/).respond(function (method, url, data) {
      throw new Error('TODO');
    });

    //when deleting a resource
    $httpBackend.whenDELETE(/\/resources(\/\d*)*/).respond(function (method, url, data) {
      var id = '';
      var index = getResourceIndex(id);

      if (!resource) {
        return [404, { response: responseNotFound }];
      }

      throw new Error('TODO: splice array');

      return [200, {response: responseOk}]
    });

    //when creating a new resource
    $httpBackend.whenPOST('/resources').respond(function(method, url, data) {
      idInc++;
      var resource = angular.fromJson(data);
      resource.id = baseId + idInc;
      resource.client = testClient;
      resource.status = 'awaiting_content';
      resource.dateAdded = new Date();
      resource.dateModified = new Date();

      resources.push(resource);

      return [201, { response: responseOk }]
    });

    $httpBackend.whenPOST('/resources/ID/content/ID').respond(function(method, url, data) {
      throw new Error("not implemented");
    });

    //pass through all other API requests
    /*
    $httpBackend.whenGET(new RegExp("/\b"+appSettings.apiEndpoint+"\b/")).passThrough();
    $httpBackend.whenPUT(new RegExp("/\b"+appSettings.apiEndpoint+"\b/")).passThrough();
    $httpBackend.whenPOST(new RegExp("/\b"+appSettings.apiEndpoint+"\b/")).passThrough();
    $httpBackend.whenPATCH(new RegExp("/\b"+appSettings.apiEndpoint+"\b/")).passThrough();
    $httpBackend.whenDELETE(new RegExp("/\b"+appSettings.apiEndpoint+"\b/")).passThrough();
    $httpBackend.when('HEAD', new RegExp("/\b"+appSettings.apiEndpoint+"\b/")).passThrough();
    $httpBackend.when('OPTIONS', new RegExp("/\b"+appSettings.apiEndpoint+"\b/")).passThrough();
    */
  })
;
