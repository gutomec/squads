# तुम अकेले लड़ रहे हो। और यह दिखता है।

एक AI agent सब कुछ कर रहा है। Code लिखना, review करना, test करना, deploy करना, architecture plan करना, backlog manage करना, DevOps संभालना।

यह कोई system नहीं है। यह chaos है — बस एक prompt पहनाया हुआ है।

जानते हो क्या होता है जब एक agent 10 काम करता है? वही जो तब होता है जब एक इंसान 10 काम करता है। सब कुछ होता है। कुछ भी ठीक से नहीं होता।

---

## AI coding में असली समस्या

सब AI agents की बात करते हैं। कोई नहीं बताता कि use कैसे करें।

ज़्यादातर लोग यही करते हैं: Claude Code खोलो, एक बड़ा सा prompt दो, और दुआ करो। Agent code लिखता है, खुद review करता है, खुद test करता है, खुद अपनी गंदगी deploy करता है। कोई separation of concerns नहीं। कोई boundary नहीं। कोई accountability नहीं।

यह ऐसा है जैसे एक ही इंसान को CEO, accountant, janitor, और head of security बना दो। एक ही दिन। एक ही salary।

तब तक चलता है जब तक नहीं चलता। और जब बिगड़ता है, पता नहीं चलता कि कौन सी "role" ने तोड़ा — क्योंकि असली role थी ही नहीं।

---

## Squads इसे ठीक करते हैं

Squad एक team है। एक agent जो team का नाटक करे — वो नहीं। एक असली structured group जहाँ हर agent का नाम है, काम है, boundary है, और ज़िम्मेदारी है।

इस तरह सोचो: एक AI जो सब करे उसकी जगह, एक team बनाओ जहाँ हर agent specialist हो।

- Writer जो सिर्फ लिखे
- Reviewer जो सिर्फ review करे
- Orchestrator जो coordinate करे
- Validator जो quality check करे

हर agent का अपना markdown file — persona, commands, rules। हर task के pre-conditions और post-conditions। हर workflow define करता है कि agents कैसे काम करते हैं — पहले कौन, review कौन करे, sign off कौन दे।

किसी proprietary platform पर config नहीं। कोई seat नहीं खरीदना। कोई नया tool नहीं सीखना।

यह एक directory है। तुम्हारे project में। Markdown files के साथ।

```
squads/my-squad/
├── squad.yaml          # manifest — team में कौन है
├── agents/             # हर agent का एक .md file
├── tasks/              # हर task का एक .md file
├── workflows/          # collaboration patterns
├── config/             # squad-level settings
└── README.md           # documentation
```

Directory को दूसरे project में copy करो। Squad साथ आता है। कोई install नहीं, कोई config migration नहीं, कोई API keys नहीं। Agents, tasks और workflows — सब उसी folder में।

यही portability है। असली portability। "JSON में export करो और दुआ करो" वाली नहीं।

---

## यह असल में कैसे काम करता है

Squads एक skill है [Claude Code](https://docs.anthropic.com/en/docs/claude-code) के लिए। एक बार install करो। फिर teams बनाओ।

### Install (30 seconds)

```bash
cp -r squads-skill/ your-project/.claude/skills/squads/
mkdir -p your-project/squads/
```

बस। कोई npm install नहीं। कोई pip install नहीं। कोई Docker नहीं। कोई YAML hell नहीं। Skill native Claude Code tools इस्तेमाल करती है — Read, Write, Edit, Glob, Grep, Bash। कुछ external नहीं।

### पहला squad बनाओ

```bash
/squads *create-squad content-pipeline
```

यह पूरी directory structure scaffold करता है, squad.yaml manifest generate करता है, config set up करता है। अब तुम्हारे पास एक खाली team है। Agents जोड़ना शुरू करो।

```bash
/squads *add-agent content-pipeline writer
/squads *add-agent content-pipeline reviewer
/squads *add-agent content-pipeline publisher
```

तीन agents। हर एक को अपना .md file — persona, expertise definition और commands के साथ। Writer लिखता है। Reviewer review करता है। Publisher publish करता है। कोई किसी का काम नहीं करता।

### Slash commands के लिए register करो

```bash
/squads *register-squad content-pipeline
```

अब किसी भी agent को directly invoke कर सकते हो:

```bash
/SQUADS:content-pipeline:cp-writer
/SQUADS:content-pipeline:cp-reviewer
```

कोई extra config नहीं। कोई routing logic नहीं। एक बार register करो, हमेशा use करो।

---

## 7 चीज़ें जो तुम कर सकते हो

| Command | क्या करता है |
|---------|-------------|
| `*create-squad {name}` | पूरी squad directory scaffold करता है |
| `*list-squads` | सभी squads और agent counts दिखाता है |
| `*add-agent {squad} {role}` | Team में specialist जोड़ता है |
| `*validate-squad {name}` | 20 integrity checks चलाता है |
| `*register-squad {name}` | Squad के लिए slash commands enable करता है |
| `*install-squad-deps {name}` | Node (pnpm) और Python (uv) deps install करता है |
| `*run-workflow {squad} {name}` | Collaboration workflow execute करता है |

और भी commands हैं। ये वो हैं जो रोज़ काम आएंगे।

---

## Workflows — agents असल में कैसे collaborate करते हैं

अकेला agent useful है। Collaborate करने वाले agents खतरनाक हैं — अच्छे मायने में।

5 patterns built-in:

**Pipeline** — Agent A output देता है, Agent B transform करता है, Agent C finalize करता है। Sequential। Assembly line की तरह। Content production, data processing, जहाँ भी clear stages हों — यहाँ use करो।

**Hub-and-Spoke** — एक orchestrator, कई specialists। Orchestrator delegate करता है, results collect करता है, synthesize करता है। Coordinator चाहिए तो यह लो।

**Review** — Agent काम करता है, reviewer check करता है, fail हो तो loop back। Quality gate pattern। Reviewer approve करे बिना कुछ ship नहीं। जहाँ सही होना ज़रूरी हो वहाँ यह use करो।

**Parallel** — कई agents एक साथ independent tasks पर, फिर results merge। जब tasks एक-दूसरे पर depend न करें।

**Teams** — Claude Code Agent Teams के ज़रिए real-time coordination। Execution के दौरान agents आपस में communicate करते हैं। Complex multi-step काम के लिए जहाँ agents को एक-दूसरे पर react करना हो।

जो pattern fit हो वो लो। या combine करो। Pipeline जिसके हर step में review loop हो। Hub-and-spoke जिसमें specialists parallel में चलें। Mix and match करो।

---

## Zero context pollution

यह वो हिस्सा है जो कोई और ठीक से नहीं करता।

ज़्यादातर multi-agent setups startup पर हर agent definition context window में ठूंस देते हैं। 10 agents? यानी 10 markdown files तुम्हारे tokens खा रही हैं — सवाल पूछने से पहले ही।

Squads कुछ भी load नहीं करता जब तक तुम माँगो नहीं।

`*create-squad` creation protocol load करता है। `*validate-squad` validation checklist load करता है। `/SQUADS:my-squad:my-agent` सिर्फ उस एक agent की .md file load करता है। बस।

10 squads तुम्हारे project में? 100 squads? Context window में zero extra tokens — जब तक तुम किसी को call न करो। Skill surgically read करती है — सिर्फ वो reference file जो चाहिए, ठीक उसी वक्त।

तुम्हारा context window हमेशा साफ रहता है।

---

## Dependencies बिना सिरदर्द के

Squads 7 dependency types support करते हैं। Installation lazy है — कुछ install नहीं होता जब तक तुम न कहो।

| Type | Manager | Status |
|------|---------|--------|
| Node | pnpm | Active |
| Python | uv | Active |
| System | — | Docs only |
| Squads (cross-squad) | — | Active |
| MCP tools | — | Docs only |
| Go | go modules | Reserved |
| Rust | cargo | Reserved |

हर squad का अपना `node_modules/` और `.venv/`। Squads के बीच कोई conflict नहीं। कोई global pollution नहीं।

```bash
/squads *install-squad-deps my-squad    # सब कुछ install करता है
/squads *check-squad-deps my-squad      # install किए बिना check करता है
```

---

## Validation — ship करने से पहले 20 checks

```bash
/squads *validate-squad my-squad
```

9 blocking checks जो pass होने चाहिए: valid squad.yaml, naming conventions, files exist, registration complete।

11 advisory checks जो होने चाहिए: coding standards, README present, collaboration documented, dependencies installed।

इसे अपनी agent team के लिए linter समझो। Structural problems को runtime problem बनने से पहले पकड़ता है।

---

## सब कुछ के साथ काम करता है (या बिना किसी के भी)

Squads framework-agnostic है। Standalone use करो। oh-my-claudecode, GSD, BMad Method, या जो भी orchestration framework पसंद हो — उसके साथ।

| Framework | Integration |
|-----------|-------------|
| Standalone | अकेले काम करता है, कोई dependency नहीं |
| oh-my-claudecode | `team`, `ralph`, `autopilot` के ज़रिए multi-squad orchestration |
| GSD | `execute-phase` के ज़रिए Squads as phase executors |
| BMad Method | BMad pipeline में squad provider के रूप में compatible |
| Custom | जो भी Claude Code slash commands use करे |

Framework coordination handle करता है। Squads team structure handle करता है। Clean separation।

---

## यह किसके लिए है

Solo developers जो platform खरीदे बिना structured AI teams चाहते हैं।

Small teams जिन्हें repeatable agent workflows चाहिए जिन्हें version control कर सकें।

वो लोग जो Claude Code के साथ बना रहे हैं और one-agent-does-everything chaos से थक गए हैं।

जिसने भी अपना AI workflow देखकर सोचा हो — "इसे असली structure चाहिए।"

## यह किसके लिए नहीं है

जिन्हें visual drag-and-drop agent builder चाहिए। यह directories में markdown files है। GUI चाहिए तो कहीं और देखो।

जो Claude Code use नहीं करते। Squads एक Claude Code skill है। Claude Code के अंदर चलती है। यही deal है।

---

## हर AI coding system पर काम करता है। सिर्फ Claude Code पर नहीं।

यह वो बात है जो लोग Squads देखकर पहली बार चूक जाते हैं।

Squad एक directory है जिसमें markdown files हैं। Skill एक standard है जिसे हर बड़ा AI coding system समझता है। Claude Code, Codex, Antigravity, Gemini CLI — सभी एक ही भाषा बोलते हैं: skills।

Squads skill Claude Code पर install करो। तुम्हारे squads काम करेंगे। Codex पर install करो। Same squads, same agents, same workflows। अगले महीने Antigravity पर जाओ। सब कुछ फिर भी काम करेगा। `squads/` directory को फर्क नहीं पड़ता कि कौन सा AI system उसे पढ़ रहा है। Agents markdown हैं। Tasks markdown हैं। Workflows YAML हैं। Universal formats।

तुम किसी एक vendor में lock नहीं हो। हर बार tool switch करने पर agent definitions नहीं लिखनी। Squads एक बार बनाओ। कहीं भी चलाओ।

यही असली portability है। "हमारे platform पर काम करता है" वाली नहीं। हर platform पर काम करता है वाली।

---

## एक marketplace पहले से मौजूद है

हर squad खुद से नहीं बनाना।

[squads.sh](https://squads.sh) एक marketplace है जहाँ लोग अपने squads publish करते हैं। Free या paid — तुम्हारी मर्ज़ी। एक content-pipeline squad बनाया जो सच में काम करे? Post करो। एक code-review squad बनाया जो दूसरे tools से ज़्यादा bugs पकड़े? जितना चाहो उतने में बेचो। SEO audits, landing pages, data analysis के लिए squad चाहिए? शायद किसी ने पहले ही बना दिया हो।

देखो क्या है। जो काम करे वो लो। Tweak करो। या खुद से zero से बनाओ और दूसरों को use करने दो।

किसी भी तरह, तुम अकेले शुरू नहीं कर रहे: [squads.sh](https://squads.sh)

---

## 30 seconds में pitch

अभी तुम्हारे पास एक AI agent है जो सब कुछ करता है। कोई boundary नहीं। कोई specialization नहीं। कोई collaboration pattern नहीं। कोई validation नहीं।

Squads तुम्हें structured teams देता है। हर agent का एक काम। हर task के conditions। हर workflow collaboration define करता है। सब कुछ तुम्हारे repo में portable markdown। Zero context pollution। Zero external dependencies। Zero cost।

30 seconds में install। 60 seconds में पहला squad। एक असली team के साथ ship करना शुरू करो — एक agent के नाटक की जगह।

```bash
cp -r squads-skill/ .claude/skills/squads/
mkdir -p squads/
/squads *create-squad my-first-squad
```

जाओ, team बनाओ। Happy shipping।

---

<p align="center">
  <a href="#install-30-seconds">Install</a> · <a href="#पहला-squad-बनाओ">Squad बनाओ</a> · <a href="#workflows--agents-असल-में-कैसे-collaborate-करते-हैं">Workflows</a> · <a href="#validation--ship-करने-से-पहले-20-checks">Validation</a>
</p>

## Author

Luiz Gustavo Vieira Rodrigues ([@gutomec](https://github.com/gutomec))

## License

MIT

Squad concept as structured multi-agent teams मूल रूप से [AIOX Framework](https://github.com/SynkraAI/aiox-core) (SynkraAI Inc.) से inspired था, जो खुद [BMad Method](https://github.com/bmad-code-org/BMAD-METHOD) (BMad Code, LLC) से derived है। यह एक independent project है जो concept को अपने architecture, protocols और features के साथ reimplements और expand करता है।

---

[English](README.md) | [Português](README.pt.md) | [中文](README.zh.md) | [Español](README.es.md) | [العربية](README.ar.md)
