#!/usr/bin/env bash

set -ex

rsync examples/specs/* site/examples/
rsync examples/compiled/*.png site/examples/
rsync examples/compiled/*.svg site/examples/

scripts/create-example-pages
