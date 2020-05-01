#!/bin/sh
yarn dist
yarn publish --access public
yarn dist-clean