# robots.txt — MEJIX SRL

[mejix.com/robots.txt](https://www.mejix.com/robots.txt)

```
User-agent: *
Allow: /
```

## Analiză

- **Allow: /** — toate path-urile sunt permise
- **Niciun Disallow** pe `/jobs`, `/jobs/*`, `/api/*`
- **Fără Crawl-Delay** declarat
- **Fără sitemap** indicat

## Politica scraper-ului

Risc minim — site-ul nu restricționează scraping. Totuși scraper-ul rămâne politicos:

- Un singur GET la `https://www.mejix.com/jobs/`
- Niciun fetch pentru paginile individuale de job (URL-urile sunt deja vizibile pe pagina principală)
- User-Agent identificabil: `job_seeker_ro_spider`
- Niciun concurrency, niciun retry agresiv

## Diferență față de EPAM template

EPAM (template-ul de la care a fost derivat acest scraper) are `Disallow: /api/*` și `Disallow: /*/vacancy/*` în robots.txt. MEJIX nu are nicio constrângere — scraping-ul este complet permis.
