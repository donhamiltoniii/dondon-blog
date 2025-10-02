import { describe, expect, it } from 'vitest';
import { decodeHtml } from './decodeHtml'; // adjust path

describe('decodeHtml', () => {
  describe('basic HTML entities', () => {
    it('should decode ampersand', () => {
      expect(decodeHtml('&amp;')).toBe('&');
    });

    it('should decode less than', () => {
      expect(decodeHtml('&lt;')).toBe('<');
    });

    it('should decode greater than', () => {
      expect(decodeHtml('&gt;')).toBe('>');
    });

    it('should decode quotes', () => {
      expect(decodeHtml('&quot;')).toBe('"');
    });

    it('should decode apostrophe', () => {
      expect(decodeHtml('&#39;')).toBe("'");
      expect(decodeHtml('&apos;')).toBe("'");
    });
  });

  describe('numeric entities', () => {
    it('should decode decimal numeric entities', () => {
      expect(decodeHtml('&#65;')).toBe('A');
      expect(decodeHtml('&#97;')).toBe('a');
    });

    it('should decode hexadecimal numeric entities', () => {
      expect(decodeHtml('&#x41;')).toBe('A');
      expect(decodeHtml('&#x61;')).toBe('a');
    });

    it('should decode unicode characters', () => {
      expect(decodeHtml('&#128512;')).toBe('😀');
      expect(decodeHtml('&#x1F600;')).toBe('😀');
    });
  });

  describe('named entities', () => {
    it('should decode copyright symbol', () => {
      expect(decodeHtml('&copy;')).toBe('©');
    });

    it('should decode registered trademark', () => {
      expect(decodeHtml('&reg;')).toBe('®');
    });

    it('should decode non-breaking space', () => {
      expect(decodeHtml('&nbsp;')).toBe('\u00A0');
    });

    it('should decode euro sign', () => {
      expect(decodeHtml('&euro;')).toBe('€');
    });

    it('should decode pound sign', () => {
      expect(decodeHtml('&pound;')).toBe('£');
    });

    it('should decode yen sign', () => {
      expect(decodeHtml('&yen;')).toBe('¥');
    });
  });

  describe('complex strings', () => {
    it('should decode HTML tags', () => {
      expect(decodeHtml('&lt;div&gt;Hello&lt;/div&gt;')).toBe('<div>Hello</div>');
    });

    it('should decode multiple entities in one string', () => {
      expect(decodeHtml('&lt;p&gt;Hello &amp; goodbye&lt;/p&gt;'))
        .toBe('<p>Hello & goodbye</p>');
    });

    it('should decode mixed content', () => {
      expect(decodeHtml('Price: &pound;10 &amp; &euro;12'))
        .toBe('Price: £10 & €12');
    });

    it('should decode attributes with quotes', () => {
      expect(decodeHtml('&lt;a href=&quot;#&quot;&gt;Link&lt;/a&gt;'))
        .toBe('<a href="#">Link</a>');
    });

    it('should decode special characters in sentences', () => {
      expect(decodeHtml('Tom &amp; Jerry&#39;s adventures'))
        .toBe("Tom & Jerry's adventures");
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      expect(decodeHtml('')).toBe('');
    });

    it('should handle string with no entities', () => {
      expect(decodeHtml('Hello World')).toBe('Hello World');
    });

    it('should handle already decoded string', () => {
      expect(decodeHtml('Hello & goodbye')).toBe('Hello & goodbye');
    });

    it('should handle malformed entities gracefully', () => {
      expect(decodeHtml('&zzztotallyinvalid;')).toBe('&zzztotallyinvalid;');
      expect(decodeHtml('&xyz123;')).toBe('&xyz123;');
    });

    it('should handle incomplete entities', () => {
      expect(decodeHtml('&amp')).toBe('&');
    });

    it('should handle multiple consecutive entities', () => {
      expect(decodeHtml('&lt;&lt;&lt;')).toBe('<<<');
    });

    it('should handle entities at start and end', () => {
      expect(decodeHtml('&lt;middle&gt;')).toBe('<middle>');
    });

    it('should handle whitespace around entities', () => {
      expect(decodeHtml('  &amp;  ')).toBe('  &  ');
    });
  });

  describe('real-world use cases', () => {
    it('should decode RSS feed content', () => {
      const rss = '&lt;title&gt;Latest News &amp; Updates&lt;/title&gt;';
      expect(decodeHtml(rss)).toBe('<title>Latest News & Updates</title>');
    });

    it('should decode blog post titles', () => {
      expect(decodeHtml('5 Tips &amp; Tricks for Better Code'))
        .toBe('5 Tips & Tricks for Better Code');
    });

    it('should decode recipe titles', () => {
      expect(decodeHtml('Mac &amp; Cheese &#8211; Comfort Food'))
        .toBe('Mac & Cheese – Comfort Food');
    });

    it('should decode HTML escaped JSON', () => {
      expect(decodeHtml('{&quot;name&quot;: &quot;John&quot;}'))
        .toBe('{"name": "John"}');
    });

    it('should decode user-generated content', () => {
      expect(decodeHtml('I love coding! &lt;3'))
        .toBe('I love coding! <3');
    });
  });

  describe('special symbols', () => {
    it('should decode mathematical symbols', () => {
      expect(decodeHtml('&times;')).toBe('×');
      expect(decodeHtml('&divide;')).toBe('÷');
      expect(decodeHtml('&plusmn;')).toBe('±');
    });

    it('should decode arrows', () => {
      expect(decodeHtml('&larr;')).toBe('←');
      expect(decodeHtml('&rarr;')).toBe('→');
      expect(decodeHtml('&uarr;')).toBe('↑');
      expect(decodeHtml('&darr;')).toBe('↓');
    });

    it('should decode greek letters', () => {
      expect(decodeHtml('&alpha;')).toBe('α');
      expect(decodeHtml('&beta;')).toBe('β');
      expect(decodeHtml('&gamma;')).toBe('γ');
    });

    it('should decode hearts and suits', () => {
      expect(decodeHtml('&hearts;')).toBe('♥');
      expect(decodeHtml('&spades;')).toBe('♠');
      expect(decodeHtml('&clubs;')).toBe('♣');
      expect(decodeHtml('&diams;')).toBe('♦');
    });
  });

  describe('international characters', () => {
    it('should decode accented characters', () => {
      expect(decodeHtml('caf&eacute;')).toBe('café');
      expect(decodeHtml('r&eacute;sum&eacute;')).toBe('résumé');
    });

    it('should decode umlauts', () => {
      expect(decodeHtml('M&uuml;nchen')).toBe('München');
    });

    it('should decode Spanish characters', () => {
      expect(decodeHtml('&iquest;C&oacute;mo est&aacute;s?')).toBe('¿Cómo estás?');
    });

    it('should decode French characters', () => {
      expect(decodeHtml('&ccedil;a va?')).toBe('ça va?');
    });
  });

  describe('performance', () => {
    it('should handle very long strings', () => {
      const longString = '&amp;'.repeat(1000);
      const result = decodeHtml(longString);
      expect(result).toBe('&'.repeat(1000));
      expect(result.length).toBe(1000);
    });

    it('should handle mixed long content', () => {
      const content = 'Hello &amp; '.repeat(100);
      const result = decodeHtml(content);
      expect(result).toBe('Hello & '.repeat(100));
    });
  });

  describe('double encoding', () => {
    it('should decode double encoded ampersand', () => {
      expect(decodeHtml('&amp;amp;')).toBe('&amp;');
    });

    it('should decode double encoded less than', () => {
      expect(decodeHtml('&amp;lt;')).toBe('&lt;');
    });

    it('should handle once decoded still containing entities', () => {
      const doubleEncoded = '&amp;lt;div&amp;gt;';
      const onceDecoded = decodeHtml(doubleEncoded);
      expect(onceDecoded).toBe('&lt;div&gt;');
      const fullyDecoded = decodeHtml(onceDecoded);
      expect(fullyDecoded).toBe('<div>');
    });
  });
});