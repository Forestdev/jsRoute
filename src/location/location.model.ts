"use strict";

import * as utils from '../utils/utils';

interface URLConstructor {
    hash: string;
    search: string;
    pathname: string;
    port: string;
    hostname: string;
    host: string;
    password: string;
    username: string;
    protocol: string;
    origin: string;
    href: string;
}
interface URL {
    revokeObjectURL(url: string): void;
    createObjectURL(object: any, options?: ObjectURLOptions): string;
    new(url: string, base?: string): URLConstructor
}
declare var URL: URL;

interface LocationInterface {
  protocol: string;
  host: string;
  href: string;
  pathname: string;
  hash: string;
  origin: string;
  search: string;
  hostname: string;
  path(pathString: string): void;
}

class _Location implements LocationInterface {
  public protocol: string;
  public host: string;
  public href: string;
  public pathname: string;
  public hash: string;
  public origin: string;
  public search: string;
  public hostname: string;

  constructor(url: string) {
    //create new location object out of the given url
    var _url = new URL(url);

    this.hash = _url.hash;
    this.host = _url.host;
    this.hostname = _url.hostname;
    this.href = _url.href;
    this.origin = _url.origin;
    this.pathname = _url.pathname;
    this.protocol = _url.protocol;
    this.search = _url.search;
  }

  // Redirects to new path
  public path(): void {

  }
}

export { _Location };
