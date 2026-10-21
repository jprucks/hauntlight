#!/usr/bin/env bash
# Publish reviewed downloaded source to a NEW private repository. No force pushes.
set -euo pipefail

repo='jprucks/hauntlight'
version='v1.1.0'
root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
fail() { printf '%s\n' "$*" >&2; exit 1; }
command -v git >/dev/null 2>&1 || fail 'Install Git before running this script.'
command -v gh >/dev/null 2>&1 || fail 'Install GitHub CLI (https://cli.github.com/), then run gh auth login.'
[[ -f "$root/dist/index.html" ]] || fail 'Expected dist/index.html beside this source folder.'
gh auth status --hostname github.com >/dev/null 2>&1 || fail 'Run gh auth login for github.com first.'
login="$(gh api --hostname github.com user --jq .login)"
[[ "$login" == 'jprucks' ]] || fail "Authenticated as $login; expected jprucks. No repository created."

# Read access must succeed before deciding that the intended name is unused.
# Listing owned repositories avoids interpreting every API error as a 404.
owned="$(gh api --hostname github.com --paginate 'user/repos?affiliation=owner&per_page=100' --jq '.[].full_name')" || fail 'Unable to verify owned repositories.'
if printf '%s\n' "$owned" | grep -Fxiq "$repo"; then
  fail "$repo already exists. This script will not modify it."
fi

cd -- "$root"
if [[ -e .git ]]; then
  [[ "$(git rev-parse --show-toplevel)" == "$root" ]] || fail 'Unexpected Git worktree root.'
  [[ -z "$(git remote)" ]] || fail 'Existing Git remotes found. Use an extracted source ZIP without .git; no remote was changed.'
  [[ "$(git symbolic-ref --short HEAD)" == 'main' ]] || fail 'Existing checkout must already be on main.'
  [[ -z "$(git status --porcelain)" ]] || fail 'Existing Git checkout has uncommitted files. Review and commit them first.'
  git rev-parse --verify HEAD >/dev/null 2>&1 || fail 'Existing repository has no commit. Review and commit source first.'
else
  # Refuse to accidentally use an enclosing repository.
  if git rev-parse --show-toplevel >/dev/null 2>&1; then
    fail 'Source folder is inside another Git repository. Extract it outside that repository.'
  fi
  git var GIT_AUTHOR_IDENT >/dev/null 2>&1 || fail 'Set git user.name and user.email first.'
  git init -b main
  git add --all
  git commit -m 'feat: release Hauntlight projection studio v1.0.0'
fi
if git show-ref --verify --quiet "refs/tags/$version"; then
  fail "$version already exists locally. No tag was changed."
fi

git tag -a "$version" -m 'Hauntlight 1.0.0: initial Halloween projection studio'
printf 'Creating private repository %s from %s\n' "$repo" "$root"
# GitHub rejects a name collision; --private is explicit. Never overwrite remotes.
gh repo create "$repo" --private --source="$root" --remote=origin
visibility="$(gh repo view "$repo" --json visibility --jq .visibility)"
[[ "$visibility" == 'PRIVATE' ]] || fail 'Private visibility could not be confirmed. Source has not been pushed.'
git push --set-upstream origin main
git push origin "refs/tags/$version"
printf 'Published private repository: https://github.com/%s (tag %s)\n' "$repo" "$version"
