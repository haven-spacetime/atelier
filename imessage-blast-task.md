# Task: Blue iMessage Text Blast Service Research

## Objective

Find services that enable businesses to send text blasts via blue iMessage (not green SMS). This is mission critical for Atelier Motors' CRM integration.

## Context

- **Current mention:** Tello (but need to verify this is the right service)
- **Use case:** Marketing/promotional text blasts to customer list
- **Constraint:** Must appear as blue iMessage bubbles (iPhone users prefer this)
- **Integration:** Needs to work with custom CRM backend

## Research Questions

1. What is the current "Tello" service Brandon mentioned? (research Tello for business SMS)
2. What services exist for sending blue iMessage blasts at scale?
3. How do these services work technically? (iMessage Business API, Mac relay, etc.)
4. What are the costs? (per message, monthly, volume tiers)
5. What are the integration options? (API, webhooks, Zapier)
6. Any compliance/TCPA considerations?

## Technical Deep Dive

Research how blue iMessage sending works:

- Is there an official Apple Business iMessage API?
- Are third-party services using Mac Minis as relays? (common workaround)
- What are the rate limits?
- How do they handle deliverability?

## Services to Investigate

- Tello (the one Brandon mentioned)
- Zipwhip (now part of Twilio)
- SimpleTexting
- EZ Texting
- Attentive
- Klaviyo SMS
- Postscript
- Any iMessage-specific services

## Deliverables

1. List of viable services with pricing comparison
2. Technical implementation notes for integration
3. Recommendation with rationale
4. Any red flags or compliance issues

## Output File

`workspace/memory/research/imessage-text-blast-services.md`
