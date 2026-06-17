import { jest } from '@jest/globals';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import companyConfig from '../../config/company.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const HAS_SOLR = !!process.env.SOLR_AUTH;

function itIfSolr(name, fn, timeout) {
  if (HAS_SOLR) return it(name, fn, timeout);
  return it.skip(`${name} (skipped: SOLR_AUTH not set)`, fn, timeout);
}

const TEST_CIF = companyConfig.cif;
const TEST_BRAND = companyConfig.brand;
const CAREERS_URL = companyConfig.careerUrl;

describe('E2E: MEJIX scraping pipeline', () => {
  describe('mejix.com/jobs — real HTML fetch', () => {
    let html;
    let index;

    beforeAll(async () => {
      const res = await fetch(CAREERS_URL, {
        headers: {
          'User-Agent': 'job_seeker_ro_spider',
          'Accept': 'text/html'
        }
      });
      expect(res.ok).toBe(true);
      html = await res.text();
      index = await import('../../index.js');
    }, 30000);

    it('returns HTML containing #open-positions', () => {
      expect(html).toContain('open-positions');
    });

    it('parses at least one job with expected shape', () => {
      const { jobs, total } = index.parseHtmlJobs(html);
      expect(total).toBeGreaterThan(0);
      const sample = jobs[0];
      expect(sample).toHaveProperty('url');
      expect(sample).toHaveProperty('title');
      expect(sample.url.startsWith('https://www.mejix.com')).toBe(true);
      expect(['remote', 'on-site', 'hybrid']).toContain(sample.workmode);
    });

    it('every parsed job has a non-empty title', () => {
      const { jobs } = index.parseHtmlJobs(html);
      for (const job of jobs) {
        expect(job.title.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Job model mapping', () => {
    it('maps a scraped job to the SOLR model with required fields', async () => {
      const index = await import('../../index.js');
      const raw = {
        url: 'https://www.mejix.com/jobs/test-position',
        title: 'Test Position',
        location: ['Cluj-Napoca'],
        workmode: 'hybrid',
        tags: []
      };
      const mapped = index.mapToJobModel(raw, TEST_CIF, 'MEJIX SRL');
      expect(mapped.url).toBe(raw.url);
      expect(mapped.title).toBe(raw.title);
      expect(mapped.cif).toBe(TEST_CIF);
      expect(mapped.company).toBe('MEJIX SRL');
      expect(mapped.status).toBe('scraped');
      expect(mapped.date).toBeDefined();
    });
  });

  describe('Transform for SOLR', () => {
    it('uppercases company name and keeps Cluj-Napoca location', async () => {
      const index = await import('../../index.js');
      const payload = {
        source: 'mejix.com',
        company: 'mejix srl',
        cif: TEST_CIF,
        jobs: [
          { url: 'https://www.mejix.com/jobs/a', title: 'A', location: ['Cluj-Napoca'], workmode: 'remote' }
        ]
      };
      const result = index.transformJobsForSOLR(payload);
      expect(result.company).toBe('MEJIX SRL');
      expect(result.jobs[0].location).toEqual(['Cluj-Napoca']);
      expect(result.jobs[0].workmode).toBe('remote');
    });
  });
});
