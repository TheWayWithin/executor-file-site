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

// True while pin.json is pinned to a tagged release: the download section
// shows the release tarball with its SHA-256, both pulled from the release
// assets at build time (see fetch-mirror.mjs).
export const DOWNLOAD_ENABLED = stats.release !== null;
export const RELEASE = stats.release;
export const RELEASE_TAG = stats.release?.tag ?? 'v0.3.0';
export const RELEASE_URL = `${REPO_URL}/releases/tag/${RELEASE_TAG}`;
