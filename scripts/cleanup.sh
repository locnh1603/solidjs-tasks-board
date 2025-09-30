#!/bin/bash

# Force remove node_modules from the root directory
rm -rf node_modules

# Force remove node_modules from any subdirectory of /apps
rm -rf apps/*/node_modules

# Force remove dist folders from any subdirectory of /apps
rm -rf apps/*/dist

# Force remove Vitest coverage artifacts from any subdirectory of /apps
rm -rf apps/*/coverage

# Force remove temp folders from any subdirectory of /apps
rm -rf apps/*/temp
