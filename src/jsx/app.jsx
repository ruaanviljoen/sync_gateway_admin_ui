/**
 * @jsx React.DOM
 */
 /* global Davis */
 /* global Zepto */

var PageWrap = require("./page.jsx"),
  channels = require("./channels.jsx"),
  ChannelsWatchPage = channels.ChannelsWatchPage,
  ChannelInfoPage = channels.ChannelInfoPage,
  SyncPage = require("./sync.jsx").SyncPage,
  UsersPage = require("./users.jsx"),
  AllDatabases = require("./databases.jsx"),
  documents = require("./documents.jsx"),
  DocumentsPage = documents.DocumentsPage;

Davis.$ = Zepto;

exports.start = function() {
  console.log("start")
  Davis(function() {
    this.settings.generateRequestOnPageLoad = true;
    this.settings.handleRouteNotFound = true;

    // global handlers
    this.bind("routeNotFound", routeNotFound)
    this.bind("lookupRoute", lookupRoute)

    // bind controllers to URL paths
    this.scope("/_utils", function() {
      this.get('/', drawIndexPage)
      this.get('/db/:db', drawDocsPage)
      this.get('/db/:db/documents/:id', drawDocsPage)
      this.get('/db/:db/sync', drawSyncPage)
      this.get('/db/:db/channels', drawChannelWatchPage)
      this.get('/db/:db/channels/:id', drawChannelInfoPage)
      this.get('/db/:db/users', drawUserPage)
      this.get('/db/:db/users/:id', drawUserPage)
      // todo this.get('/db/:db/users/:id/channels', userChannelsPage)
    })
  });
}

function draw(component, container) {
  React.renderComponent(
    component,
    container || document.getElementById('container')
  );
}

/*  /_utils/
    The home page, list and create databases.
*/
function drawIndexPage(req) {
    draw(
      <PageWrap page="home">
        <p>Welcome to Couchbase Sync Gateway. You are connected to the admin
        port at <a href={location.toString()}>{location.toString()}</a></p>
        <AllDatabases title="Please select a database:"/>
        <p>Link to docs. Architecture diagram. cloud signup, downloads. Click
        here to install sample datasets: beerdb, todos... </p>
      </PageWrap>)
  }

/*  /_utils/db/myDatabase
    /_utils/db/myDatabase/documents/myDocID
    The index page for myDatabase, list and edit documents.
*/
function drawDocsPage(req) {
  draw(
    <PageWrap db={req.params.db} page="documents">
      <DocumentsPage db={req.params.db} docID={req.params.id}/>
    </PageWrap>);
}

/*  /_utils/db/myDatabase/sync
    Sync function editor for myDatabase
*/
function drawSyncPage(req) {
  draw(
    <PageWrap db={req.params.db} page="sync">
      <SyncPage db={req.params.db}/>
    </PageWrap>);
}

/*  /_utils/db/myDatabase/channels
    Channel watcher page for myDatabase
*/
function drawChannelWatchPage (req) {
  var watch = (req.params.watch && req.params.watch.split(',') || []);
  draw(
    <PageWrap db={req.params.db} page="channels">
        <ChannelsWatchPage db={req.params.db} watch={watch} title={req.params.title}/>
    </PageWrap>);
}

/*
    /_utils/db/myDatabase/channels/myChannel
    Channel detail page
*/
function drawChannelInfoPage(req) {
  draw(
    <PageWrap db={req.params.db} page="channels">
      <ChannelInfoPage db={req.params.db} id={req.params.id}/>
    </PageWrap>);
}


/*  /_utils/db/myDatabase/users
    /_utils/db/myDatabase/users/userID
    List and edit users.
*/
function drawUserPage(req) {
  draw(
    <PageWrap page="users" db={req.params.db}>
      <UsersPage db={req.params.db} userID={req.params.id}/>
    </PageWrap>);
}

/*  404 handlers
    If the 404 is in-app, redirect to the index page.
    Otherwise make a server request for the new page.
*/
function routeNotFound(r) {
  setTimeout(function(){ // required sleep
    window.location = "/_utils"
  },100)
}
function lookupRoute(req) {
  if (req.path.indexOf("/_utils") !== 0) {
    window.location = req.path;
    req.delegateToServer()
  }
}
