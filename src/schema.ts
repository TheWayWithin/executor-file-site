// Shared schema.org / JSON-LD builders. Every value is drawn from config and
// pin data so the structured data cannot claim a version, licence or URL the
// repository does not actually hold. Pages pass these to Base's jsonLd prop.
import { SITE_URL, REPO_URL, PIN, DOWNLOAD_ENABLED, RELEASE_TAG } from './config';

export const HOMEPAGE_DESCRIPTION =
  'Everything your executor will need, in one encrypted file. A free, open-source register of every account, asset and liability you own, and one printed page that tells your executor how to open it.';

// The tool itself. softwareVersion is emitted only while the site is pinned to
// a tagged release, wired to the same flag as the download so it cannot lie.
export const softwareApplicationLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Executor File',
  applicationCategory: 'UtilitiesApplication',
  applicationSubCategory: 'Digital estate planning',
  operatingSystem: 'macOS, Linux, Windows (WSL)',
  description: HOMEPAGE_DESCRIPTION,
  url: SITE_URL,
  sameAs: REPO_URL,
  isAccessibleForFree: true,
  license: `${REPO_URL}/blob/${PIN.ref}/LICENSE`,
  author: {
    '@type': 'Person',
    name: 'Jamie Watters',
    url: 'https://jamiewatters.work',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  ...(DOWNLOAD_ENABLED ? { softwareVersion: RELEASE_TAG.replace(/^v/, '') } : {}),
};
