# README #

This UI is a frontend for a client system of the Ayamel Resource API.  It's intended to be used as a basic CRUD app to allow
managing resources owned by a particular client.  This is mostly useful for client institutions which do not have 
3rd party applications for use as a client, but wish to share media resources with the broader community.

## TODO ##

* browse view
	* filter based on resource.status
	* configurable # items per page
	* show pagination if too many items
	* show icon based on resource.type
* create view:
	* allow multiple drag/drop files
	* better done in a directive, but: http://jsfiddle.net/danielzen/utp7j/
	* for each file dropped, create a form for the resource
		* upon save, make api call to save resource
		* on successful save, use resource.id to schedule actual file upload job via upload service
	* when a file is dropped, prefill as much of the creation form as you can
		* use the filename as default for resource.title
		* try and select the resource.type based on the file extension
			* probably need a big config array somewhere for this
* modify view:
	* Same as create view, but no file uploading, can modify resource values already entered
* upon delete, show modal to confirm
* view view, hehe:
	* show placeholder for embedded media player
	* for now just show list of resource values
* resource file upload service:
	* schedule file uploads based on resource ID - 
	* run configurable # of simultaneous jobs
	* maintain state between reloads
		* restart failed jobs on load
		* track and advance to pending jobs when others complete

## Using the API ##

Look at `app/scripts/controllers/view.js` to see an example of calling the api & dealing w/ errors.

If there's a failure, use the scope to emit a `notification` message, there's a notification area built-in already, but it may need some work.

Routes (for now):

* `GET: /resources/{resourceId}` - get specific resource
* `PUT: /resources/{resourceId}` - modify resource, send object in same format as resource structure
* `DELETE: /resources/{resourceId}` - delete a resource
* `POST: /resources` - create new resource
* `GET: /resources/{resourceId}/request-upload-url` - request a url for uploading content
* `POST: /resources/{resourceId}/content/{token}` - post actual content

For uploading files via the `uploadManager` service, you'll have to do a 2-step process:

1. Request a valid upload url for the resource
2. Post a file (as if submitted from a form) to that url
