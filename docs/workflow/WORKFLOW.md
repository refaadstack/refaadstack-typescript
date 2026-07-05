# RefaadStack — Copywriting & Redesign Workflow
> Dibuat: 2026-07-05 | Oleh: Jelly

## Timing
```
[0:00] Mercury start (research)
[0:00] Athena start (design direction — parallel)
[1:00] Mercury deliver → Luna notifikasi
[1:00–2:00] Luna drafting copy (depend on Mercury)
[2:00] Progress report ke #office
```

## Dependency Graph
```
Mercury (riset)
   └── Luna (copy draft) — WAIT until Mercury done
Athena (design direction) — PARALLEL, no wait
```

## Agent Dispatch

### Mercury (@1514945165444382720) — Research Analyst
- Tugas: Brand voice research + pain points + keywords + tagline options
- Input: Logo (hitam+pink), layanan, portfolio
- Output: `/docs/copywriting/mercury-research.md`
- Channel: #mercury

### Luna (@1514944764104147104) — Content Creator
- Tugas: TUNGGU riset Mercury selesai
- Input: Mercury's research output
- Output: Copy draft all sections → `/docs/copywriting/luna-copy.md`
- Channel: #luna

### Athena (@1514943781626187837) — Lead Designer
- Tugas: Design direction REDESIGN parallel (palette LOCKED: hitam + pink #FF69B4)
- Skill: WAJIB load `design-taste-frontend` sebelum touch code
- Output: Design spec → `/docs/design/athena-spec.md`
- Channel: #athena

### Artur (@1514495600932950078) — Frontend Dev
- Tugas: Implementasi copy + redesign components (Phase 2, after copy+design locked)
- Output: Code change di `src/components/sections/`
- Channel: #artur

## Rules
- No emoji in deliverables
- Bahasa Indonesia untuk all copy
- No jargon (scalable, robust, enterprise-grade, cutting-edge)
- Research-first: cek existing code/files sebelum buat baru
- Report blocker >4 jam ke Jelly

## Status Tracker
| Agent | Status | ETA | Dependence |
|-------|--------|-----|------------|
| Mercury | IN PROGRESS | T+1h | — |
| Athena | IN PROGRESS | T+2h | — |
| Luna | PENDING (wait Mercury) | T+1–2h | Mercury |
| Artur | PENDING (Phase 2) | TBD | Athena+Luna |

## Log
- 2026-07-05 — Jelly: Dispatch Mercury + Athena paralel. Luna pending Mercury done.
