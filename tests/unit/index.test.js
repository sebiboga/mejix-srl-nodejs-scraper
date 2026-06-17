import { jest } from '@jest/globals';

describe('index.js Component Tests', () => {
  let index;

  beforeAll(async () => {
    index = await import('../../index.js');
  });

  describe('transformJobsForSOLR', () => {
    it('should filter locations to only Romanian cities', () => {
      const payload = {
        jobs: [
          { url: 'https://test.com/1', title: 'Job 1', location: ['România'] },
          { url: 'https://test.com/2', title: 'Job 2', location: ['Bucharest'] },
          { url: 'https://test.com/3', title: 'Job 3', location: ['Bulgaria'] },
          { url: 'https://test.com/4', title: 'Job 4', location: ['Cluj-Napoca'] },
          { url: 'https://test.com/5', title: 'Job 5', location: [] }
        ]
      };

      const result = index.transformJobsForSOLR(payload);

      expect(result.jobs[0].location).toEqual(['România']);
      expect(result.jobs[1].location).toEqual(['Bucharest']);
      expect(result.jobs[2].location).toEqual(['România']);
      expect(result.jobs[3].location).toEqual(['Cluj-Napoca']);
      expect(result.jobs[4].location).toEqual(['România']);
    });

    it('should keep company uppercase', () => {
      const payload = {
        source: 'mejix.com',
        company: 'mejix srl',
        cif: '17372688',
        jobs: [
          { url: 'https://test.com/1', title: 'Job 1', company: 'mejix systems', cif: '17372688' }
        ]
      };

      const result = index.transformJobsForSOLR(payload);

      expect(result.company).toBe('MEJIX SRL');
    });

    it('should normalize workmode values', () => {
      const payload = {
        jobs: [
          { url: 'https://test.com/1', title: 'Job 1', workmode: 'Remote' },
          { url: 'https://test.com/2', title: 'Job 2', workmode: 'ON-SITE' },
          { url: 'https://test.com/3', title: 'Job 3', workmode: 'Hybrid' },
          { url: 'https://test.com/4', title: 'Job 4', workmode: 'hybrid' }
        ]
      };

      const result = index.transformJobsForSOLR(payload);

      expect(result.jobs[0].workmode).toBe('remote');
      expect(result.jobs[1].workmode).toBe('on-site');
      expect(result.jobs[2].workmode).toBe('hybrid');
      expect(result.jobs[3].workmode).toBe('hybrid');
    });

    it('should handle empty jobs array', () => {
      const result = index.transformJobsForSOLR({ jobs: [] });
      expect(result.jobs).toEqual([]);
    });
  });

  describe('mapToJobModel', () => {
    it('should map raw job to job model format', () => {
      const rawJob = {
        url: 'https://www.mejix.com/job/123',
        title: 'Senior Developer',
        location: ['Bucharest'],
        tags: ['Java', 'Spring'],
        workmode: 'hybrid'
      };

      const COMPANY_NAME = 'MEJIX SRL';
      const COMPANY_CIF = '17372688';

      const result = index.mapToJobModel(rawJob, COMPANY_CIF, COMPANY_NAME);

      expect(result.url).toBe(rawJob.url);
      expect(result.title).toBe(rawJob.title);
      expect(result.company).toBe(COMPANY_NAME);
      expect(result.cif).toBe(COMPANY_CIF);
      expect(result.location).toEqual(rawJob.location);
      expect(result.tags).toEqual(rawJob.tags);
      expect(result.workmode).toBe(rawJob.workmode);
      expect(result.status).toBe('scraped');
      expect(result.date).toBeDefined();
    });

    it('should remove undefined fields', () => {
      const rawJob = {
        url: 'https://test.com/1',
        title: 'Job 1'
      };

      const result = index.mapToJobModel(rawJob, '17372688');

      expect(result.location).toBeUndefined();
      expect(result.tags).toBeUndefined();
      expect(result.workmode).toBeUndefined();
    });

    it('should handle missing title', () => {
      const rawJob = { url: 'https://test.com/1' };

      const result = index.mapToJobModel(rawJob, '17372688');

      expect(result.title).toBeUndefined();
      expect(result.url).toBe('https://test.com/1');
    });
  });

  describe('parseHtmlJobs (MEJIX HTML scraping)', () => {
    const sampleHtml = `
      <html><body>
        <section id="open-positions">
          <a href="/jobs/senior-developer">
            <h3>Senior Developer</h3>
            <div><div><span>Remote · Cluj-Napoca</span></div></div>
          </a>
          <a href="/jobs/qa-engineer">
            <h3>QA Engineer</h3>
            <div><div><span>On-site · Cluj-Napoca</span></div></div>
          </a>
          <a href="/jobs/ux-designer">
            <h3>UX Designer</h3>
            <div><div><span>Hybrid</span></div></div>
          </a>
          <a href="/jobs/">Back to all</a>
        </section>
      </body></html>
    `;

    it('parses titles and absolute URLs', () => {
      const { jobs, total } = index.parseHtmlJobs(sampleHtml);
      expect(total).toBe(3);
      expect(jobs[0].title).toBe('Senior Developer');
      expect(jobs[0].url).toBe('https://www.mejix.com/jobs/senior-developer');
    });

    it('derives workmode from location text', () => {
      const { jobs } = index.parseHtmlJobs(sampleHtml);
      expect(jobs[0].workmode).toBe('remote');
      expect(jobs[1].workmode).toBe('on-site');
      expect(jobs[2].workmode).toBe('hybrid');
    });

    it('detects Cluj-Napoca and defaults to it when missing', () => {
      const { jobs } = index.parseHtmlJobs(sampleHtml);
      expect(jobs[0].location).toEqual(['Cluj-Napoca']);
      expect(jobs[2].location).toEqual(['Cluj-Napoca']);
    });

    it('skips the "back to all" self-link', () => {
      const { jobs } = index.parseHtmlJobs(sampleHtml);
      expect(jobs.find(j => j.url.endsWith('/jobs/'))).toBeUndefined();
    });

    it('returns empty when no jobs are listed', () => {
      const { jobs, total } = index.parseHtmlJobs('<html><body></body></html>');
      expect(jobs).toEqual([]);
      expect(total).toBe(0);
    });
  });
});
