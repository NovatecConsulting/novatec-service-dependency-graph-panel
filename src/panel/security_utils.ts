const HTTP_PROTOCOLS = new Set(['http:', 'https:']);
const MAX_ICON_PATTERN_LENGTH = 128;

export function buildSafeDrillDownLink(
  drillDownLink: string | undefined,
  selectionId: string,
  resolveTemplate: (value: string) => string,
  baseUrl?: string
): string {
  if (!drillDownLink) {
    return '';
  }

  const encodedSelectionId = encodeURIComponent(selectionId);
  const resolvedLink = resolveTemplate(drillDownLink.split('{}').join(encodedSelectionId)).trim();

  if (resolvedLink.length === 0) {
    return '';
  }

  const hasExplicitScheme = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(resolvedLink);
  const isProtocolRelative = resolvedLink.startsWith('//');

  try {
    const url = new URL(resolvedLink, baseUrl ?? 'http://localhost/');
    if (!HTTP_PROTOCOLS.has(url.protocol)) {
      return '';
    }

    if (hasExplicitScheme || isProtocolRelative) {
      return url.toString();
    }

    return resolvedLink;
  } catch {
    return '';
  }
}

export function matchesIconPattern(pattern: string | undefined, nodeId: string): boolean {
  if (!pattern || pattern.length > MAX_ICON_PATTERN_LENGTH) {
    return false;
  }

  const normalizedNodeId = nodeId.toLowerCase();
  const patternTokens = pattern
    .split('|')
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.length > 0);

  if (patternTokens.length === 0) {
    return false;
  }

  return patternTokens.some((value) => normalizedNodeId.includes(value));
}
