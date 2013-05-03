'use strict';

angular.module('ayamelServerFake', ['ngMockE2E'])
  .run(function($httpBackend, appSettings) {

    //hard-code an initial data structure for testing
    var resources = [
      {
        id: '2387fdas2345323sdf23d',
        title: 'A plane',
        type: 'video',
        description: 'A man walks through a hallway, thinking about food'
      },
      {
        id: '2387fdas2345323sdf23000',
        title: 'A train',
        type: 'document',
        description: 'A man walks through a hallway, thinking about cars'
      },
      {
        id: '2387fdas2345323sdf23001',
        title: 'An automobile',
        type: 'video',
        description: 'A man walks through a hallway, thinking about stem cell research'
      }
    ];

    //hard code some error response structures
    var responseOk = { code: 200, message: 'ok'};
    var responseNotFound = { code: 404, message: 'Not Found' };
    var responseNotAuthorized = { code: 403, message: 'Access Denied' };
    var responseNotAuthenticated = { code: 401, message: 'Authentication Required' };
    var responseResourceDeleted = { code: 410, message: 'Deleted' };

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

    //ignore requests to static resources, just let them through
    $httpBackend.whenGET(/\.html$/).passThrough();
    $httpBackend.whenGET(/\.css$/).passThrough();
    $httpBackend.whenGET(/\.js$/).passThrough();

    //intercept API requests
    $httpBackend.whenGET(/\/api\/resources/).respond(function() {
      return [200, { response: responseOk, resources: resources }];
    });

    //when getting a specific resource
    $httpBackend.whenGET(/\/api\/resources(\/\d*)*/).respond(function(method, url, data) {
      var id = '';
      var resource = getResourceIndex(id);

      if (!resource) {
        return [404, { response: responseNotFound }];
      }

      return [200, {
        response: responseOk,
        resource: resource
      }];
    });

    //when modifying a specific resource
    $httpBackend.whenPUT(/\/api\/resources(\/\d*)*/).respond(function(method, url, data) {
      throw new Error('TODO');
    });

    //when deleting a resource
    $httpBackend.whenDELETE(/\/api\/resources(\/\d*)*/).respond(function(method, url, data) {
      var id = '';
      var index = getResourceIndex(id);

      if (!resource) {
        return [404, { response: responseNotFound }];
      }

      throw new Error('TODO: splice array');

      return [200, {response: responseOk}]
    });

    //when creating a new resource
    $httpBackend.whenPOST('/api/resources').respond(function(method, url, data) {

      return [201, {response: responseOk}]
    });

    $httpBackend.whenPOST('/api/resources/ID/content/ID').respond(function(method, url, data) {
      throw new Error("not implemented");
    });

    $httpBackend.whenGET(new RegExp("/\b"+appSettings.apiBaseUrl+"\b/")).passThrough();
    $httpBackend.whenPUT(new RegExp("/\b"+appSettings.apiBaseUrl+"\b/")).passThrough();
    $httpBackend.whenPOST(new RegExp("/\b"+appSettings.apiBaseUrl+"\b/")).passThrough();
    $httpBackend.whenPATCH(new RegExp("/\b"+appSettings.apiBaseUrl+"\b/")).passThrough();
    $httpBackend.whenDELETE(new RegExp("/\b"+appSettings.apiBaseUrl+"\b/")).passThrough();
    $httpBackend.when('HEAD', new RegExp("/\b"+appSettings.apiBaseUrl+"\b/")).passThrough();
    $httpBackend.when('OPTIONS', new RegExp("/\b"+appSettings.apiBaseUrl+"\b/")).passThrough();
  })
;
