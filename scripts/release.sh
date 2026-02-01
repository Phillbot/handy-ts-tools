#!/bin/bash

# Simple release script for handy-ts-tools

if [ -z "$1" ]; then
  echo "Usage: ./scripts/release.sh [patch|minor|major]"
  exit 1
fi

VERSION_TYPE=$1

# 1. Run tests
echo "Running tests..."
pnpm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Aborting release."
  exit 1
fi

# 2. Bump version
echo "Bumping version ($VERSION_TYPE)..."
pnpm version $VERSION_TYPE -m "chore: release v%s"

# 3. Build
echo "Building..."
pnpm run build

# 4. Success message
NEW_VERSION=$(node -p "require('./package.json').version")
echo "Successfully bumped to v$NEW_VERSION"
echo "To finish, run: git push && git push --tags"
