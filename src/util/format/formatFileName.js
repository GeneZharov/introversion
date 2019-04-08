// @flow

import Url from "url-parse";

import { basename } from "../string/basename";

export function formatFileName(name: string): string {
  if (/\/\//.test(name)) {
    const { pathname } = new Url(name);
    return basename(pathname);
  } else {
    return basename(name);
  }
}

// TODO: URL is not available yet in react-native
//export function formatFileName(name: string): string {
//  try {
//    const { pathname } = new URL(name);
//    return basename(pathname);
//  } catch (err) {
//    return basename(name);
//  }
//}
