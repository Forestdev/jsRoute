'use strict';

import Route from './route.model';
import { completeRouteChange, failRouteChange } from '../router/router.events';
import * as utils from '../utils/utils';
import $http from '../http/http';
import * as $history from '../history/history';
import { getCurrentLocation, setCurrentLocation, locationFactory } from '../location/location.factory';

var routes: Array<Route> = [];
var fallback = '/';

function monitorRouteChange(): void {
  let root = utils.getRoot();

  root.addEventListener('routeChangeStart', startChange, false);
}

function loadTemplate(route: Route, callback): void {
  const cachedTemplate = route.getCachedTemplate();
  var view = utils.getView();

  if (!cachedTemplate) {
    $http.get(route.options.templateUrl, (err, data) => {
      if (err) { return callback(err); }
      if (!data) { return callback(); }

      view.innerHTML = data;

      if (route.options.cache && !cachedTemplate) {
        route.setCachedTemplate(data);
      }

      return callback(null, true);
    });
  } else {
    view.innerHTML = cachedTemplate;
    return callback(null, true);
  }
}

function startChange(ev): void {
  if (ev.defaultPrevented) { return; }

  let routeList = ev.detail;
  let prevLocation = getCurrentLocation();
  let nextLocation = locationFactory(routeList.next.path);

  if (prevLocation && (prevLocation.host !== nextLocation.host)) {
    return window.location.assign(nextLocation.href);
  }

  findMatch(nextLocation, (match) => {
    if (!match) { return nextLocation.path(fallback); }

    loadTemplate(match, (err, success) => {
      if (err) { return console.error(err); }
      if (!success) {
        routeList.err = 'Failed to retrieve template from templateUrl';
        failRouteChange(routeList);
        return console.error(routeList.err);
      }

      nextLocation.matchingPath = routeList.next.match = match.path;
      nextLocation.params = match.getParams(nextLocation.pathname);

      $history.push(match, nextLocation.pathname);
      setCurrentLocation(nextLocation);

      if (match.options.onLoad) { match.options.onLoad(utils.getRoot(), nextLocation); }

      completeRouteChange(routeList);
    });
  });
}

function findMatch(next, callback): void {
  for (let i = 0, ii = routes.length; i < ii; i++) {
    if (routes[i].matchRoute(next.pathname)) {
        return callback(routes[i]);
    }
  }

  return callback();
}

function addRoute(route): void {
  route.options.cache = !route.options.cache ? false : true;
  routes.push(route);
}

function addFallback(redirectTo): void {
  fallback = redirectTo;
}

function start(): void {
  monitorRouteChange();
  $history.monitorBrowserNavigation();
}

export { start };
export { addRoute };
export { addFallback };
