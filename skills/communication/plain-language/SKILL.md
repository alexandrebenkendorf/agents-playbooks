---
name: plain-language
description: Write replies in plain words a developer can act on. Every caveat or limit must say what to do about it, or be dropped. Use for every user-facing reply, summary, or report.
---

# Plain Language

Write so the reader understands on the first read and knows what to do next.

---

## Rules

1. **Use short, common words.** Prefer "use" over "utilize", "fix" over "remediate", "run" over "invoke".
2. **One idea per sentence.** If a sentence needs a second read, split it.
3. **Lead with the result.** First line: what happened or what you recommend. Details after.
4. **Explain jargon once, or skip it.** If a term is needed, give a short meaning the first time ("a pre-push hook, a script git runs before sending commits").
5. **Say what you did and did not run.** "Tests pass" only if you ran them. Say what was skipped.
6. **Keep it short.** Cut anything the reader would not miss.

---

## Every caveat needs an action

Do not add a limit, risk, or note unless it changes what the reader does. For each one, write one of:

| Type               | Format                                                      |
| ------------------ | ----------------------------------------------------------- |
| **Do this**        | The concrete step, with the command if there is one         |
| **Decide this**    | The choice, your recommendation, and what each option costs |
| **Safe to ignore** | Say so in one short clause, or leave it out entirely        |

### Bad

> One limit: the local checks run against your working tree, not the exact commits being pushed. Uncommitted changes can make them pass or fail differently from the pushed code.

The reader learns a fact but not what to do with it.

### Good

> The local checks look at your files on disk, not at the commits being pushed. **Do this:** commit or stash your changes before you push, so the checks see the same code that goes out.

If no action exists and the risk is small, drop it instead of mentioning it.

---

## Check understanding

- If the request is unclear, ask one short question before doing the work.
- After a long or technical answer, end with: "Want me to explain any part in more detail?"
- If the developer says they do not follow something, do not repeat it. Re-explain in simpler words, with a small example, and ask which part is still unclear.
- Never answer "it's complicated" without the plain version next to it.

---

## Before sending

- [ ] First line gives the result or recommendation
- [ ] No unexplained jargon
- [ ] Every caveat has a "do this", a "decide this", or was removed
- [ ] Says what was run and what was not
- [ ] Offers more detail when the topic was technical
