# Source registry

All repositories are reviewed as untrusted research. Enzo never executes upstream scripts or loads remote skills at runtime. Exact pins live in `research/upstream-manifest.json`.

| Source               | License                              | Useful pattern                                                            | Risk                                      | Disposition                      |
| -------------------- | ------------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------- | -------------------------------- |
| Agent Skills         | Apache-2.0                           | Portable skill structure and progressive disclosure                       | Standard may evolve                       | Adopt the standard               |
| Google DESIGN.md     | Apache-2.0                           | Machine-readable tokens with design rationale                             | Young format                              | Adapt into Broadsheet documentation  |
| Nuwa                 | MIT                                  | Distill heuristics, limits, failures, and transfer rules instead of voice | Persona fidelity can become impersonation | Adapt the method only            |
| Huashu Design        | MIT                                  | Inspect assets and context before visual invention                        | External facts can stale                  | Adapt the research sequence      |
| Taste Skill          | MIT                                  | Anti-slop visual review                                                   | Taste claims can become subjective        | Adapt evaluable checks           |
| Skill Fidelity Bench | MIT                                  | Cognition, boundary, and trigger evaluation                               | Judge bias                                | Adapt benchmark structure        |
| Darwin Skill         | No repository-level license detected | Baseline/ratchet concepts                                                 | Reuse rights unclear                      | Pattern-only pending file review |
| Anthropic Skills     | No repository-level license detected | Skill organization examples                                               | Mixed or file-specific terms possible     | Pattern-only pending file review |

Named-lens source material uses primary public archives wherever possible. Enzo stores source URLs, access date, historical cutoff, derived rule IDs, and prohibited claims. It does not copy books, transcripts, or proprietary datasets.

## Mind catalog gate

| Mind | Primary public source | Status | Production use |
| --- | --- | --- | --- |
| Steve Jobs | Apple archive and Stanford address | Production | Enabled with bounded competence |
| Charlie Munger | Berkshire Hathaway public archive | Production | Enabled with bounded competence |
| Alex Hormozi | Acquisition.com public training | Research | Disabled pending evaluation |
| Paul Graham | Public essay archive | Research | Disabled pending evaluation |
| Naval Ravikant | Public archive at nav.al | Research | Disabled pending evaluation |
| Nassim Taleb | Author public archive | Research | Disabled pending evaluation |
| Andrej Karpathy | Public site and technical material | Research | Disabled pending evaluation |
| Richard Feynman | Caltech public archive | Research | Disabled pending evaluation |
| MrBeast | Official public channel | Research | Disabled pending evaluation |
| Rob Pike | Official Go project talks | Research | Disabled pending evaluation |

Catalog visibility does not imply production readiness. A research-stage pack remains inspectable but cannot be selected by the production workroom state machine.
