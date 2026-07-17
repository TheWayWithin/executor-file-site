import pin from '../pin.json';
import stats from './mirrored/stats.json';

export const SITE_NAME = 'Executor File';
export const SITE_URL = 'https://executorfile.com';
export const PLAUSIBLE_DOMAIN = 'executorfile.com';

// The tool repo pin. All mirrored content and computed stats come from this
// commit; see pin.json and scripts/fetch-mirror.mjs.
export const PIN = pin;
export const STATS = stats;
export const REPO_URL = `https://github.com/${pin.repo}`;
export const REPO_TREE_URL = `${REPO_URL}/tree/${pin.ref}`;

// Flip to true when the v0.3.0 release exists and pin.json is re-pinned to
// the tag. Until then the download section shows a plain waiting state.
// Listed in NOTES.md as a launch step.
export const DOWNLOAD_ENABLED = false;
export const RELEASE_TAG = 'v0.3.0';
export const RELEASE_URL = `${REPO_URL}/releases/tag/${RELEASE_TAG}`;
export const RELEASE_TARBALL_URL = `${REPO_URL}/archive/refs/tags/${RELEASE_TAG}.tar.gz`;
