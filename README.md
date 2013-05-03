# README #

This UI is a frontend for a client system of the Ayamel Resource API.  It's intended to be used as a basic CRUD app to allow
managing resources owned by a particular client.  This is mostly useful for client institutions which do not have 
3rd party applications for use as a client, but wish to share media resources with the broader community.

## Development ##

For developing, in `app/index.html` you can switch `ng-app` to use `ayamelAdminAppMock` instead of `ayamelAdminApp`.  This will include
an extra module that fakes all requests and responses to the media API.

