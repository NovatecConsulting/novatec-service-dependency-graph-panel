import { buildSafeDrillDownLink, matchesIconPattern } from './security_utils';

describe('buildSafeDrillDownLink', () => {
  it('rejects non-http protocols', () => {
    expect(buildSafeDrillDownLink('javascript:alert(1)', 'orders', (value) => value)).toBe('');
    expect(buildSafeDrillDownLink('data:text/html,<svg/onload=alert(1)>', 'orders', (value) => value)).toBe('');
  });

  it('encodes the selected node before interpolation', () => {
    expect(
      buildSafeDrillDownLink(
        'https://trace.example/search?service={}',
        'orders/api?debug=true',
        (value) => value
      )
    ).toBe('https://trace.example/search?service=orders%2Fapi%3Fdebug%3Dtrue');
  });

  it('preserves safe relative links', () => {
    expect(buildSafeDrillDownLink('/explore?service={}', 'checkout', (value) => value)).toBe(
      '/explore?service=checkout'
    );
  });

  it('applies template resolution before validating the url', () => {
    expect(
      buildSafeDrillDownLink('$traceBase?service={}', 'checkout', (value) =>
        value.replace('$traceBase', 'https://trace.example/search')
      )
    ).toBe('https://trace.example/search?service=checkout');
  });
});

describe('matchesIconPattern', () => {
  it('matches pipe-separated values case-insensitively', () => {
    expect(matchesIconPattern('java|star trek', 'Orders JAVA Service')).toBe(true);
    expect(matchesIconPattern('java|star trek', 'star trek gateway')).toBe(true);
  });

  it('ignores empty pattern fragments', () => {
    expect(matchesIconPattern(' | java | ', 'java worker')).toBe(true);
  });

  it('rejects oversized patterns', () => {
    expect(matchesIconPattern('a'.repeat(129), 'aaaaaaaaaa')).toBe(false);
  });
});
