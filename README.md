# cryptotrunks.co

> ## ⚠️ Retired product. **Live production infrastructure.**
>
> The CryptoTrunks site is no longer a product. This repository is **not** dormant.
>
> It is the GitHub Pages origin for **cryptotrunks.co**, which serves the on-chain
> metadata for a live NFT collection — 11,605 tokens, ~11,150 holders. Those tokens
> point here by URL, from data nobody can edit.
>
> **Do not delete this repository. Do not rename it. Do not change its visibility.
> Do not unpublish GitHub Pages. Do not remove the `CNAME` file.**
>
> Archiving is safe — an archived repo keeps serving Pages. Everything else is not.

## What is load-bearing

These paths are addressed by URL from outside this repository. Renaming or removing
any of them breaks something we cannot fix by deploying.

| Path | Referenced by |
|---|---|
| `poap/01-spring.json`<br>`poap/02-summer.json`<br>`poap/03-fall.json`<br>`poap/04-winter.json` | The CryptoTrunks POAP contract's on-chain `tokenURI` |
| `poap/01-spring.gif`<br>`poap/02-summer.gif`<br>`poap/03-fall.gif`<br>`poap/04-winter.gif` | The `image` field inside each of the JSON files above |
| `images/trunk_missing.png` | V1 trunk metadata, as the placeholder image |
| `individual-trunk-page.html` | The `external_url` stamped on V1 clone trunks |
| `CNAME` | Binds this Pages site to `cryptotrunks.co`. Deleting it drops the domain |

Verified against the contract on Ethereum mainnet:

```
eth_call 0x135511599d8d78e4e5d2ed7e224b54d80ff97309 tokenURI(10000)
→ https://cryptotrunks.co/poap/03-fall.json
```

That is a live contract handing out a `cryptotrunks.co` URL as the canonical location
of its metadata. It cannot be pointed elsewhere except by an owner-key transaction
(see *Recovery* below).

## Who consumes this

The `welikethetrees/machine-garden` backend, in production:

- `src/service/wallet/lib/upsertManyNfts.ts` writes
  `external_url: https://cryptotrunks.co/individual-trunk-page.html?token=<id>`
  into stored NFT metadata.
- `src/service/wallet/lib/v1CloneTrunks.ts` treats `trunk_missing.png` here as the
  V1 placeholder image.
- `src/lib/integrations/10_cryptotrunks_poap/` maps the POAP's season art, which is
  the `poap/*.gif` set above.

## If you are archiving this repo

Archiving does **not** unpublish a GitHub Pages site — the site keeps serving, but the
Pages settings become read-only. So after archiving you cannot change the custom
domain, and you cannot repair the Pages configuration if it ever breaks.

That is recoverable: **un-archive → fix → re-archive.** Do not conclude the site is
lost.

Do *not* follow the usual "retiring a repo" advice of removing the DNS records and
unpublishing the site. That is correct for a site being switched off, and it is the
exact opposite of what this one needs.

## Domain

| | |
|---|---|
| Registrar | Tucows Domains Inc. (OpenSRS) |
| Nameservers | Njalla |
| Registry expiry | 2027-04-22 |
| Locks | `clientTransferProhibited`, `clientUpdateProhibited` |

**The registrar renewal is the single point of failure.** GitHub Pages is free and its
TLS certificate renews itself; if the domain lapses, the metadata for a live NFT
collection goes with it.

## Recovery

If this host is ever lost, the metadata can be repointed. The POAP contract is
`Ownable` and exposes `setBaseURI`, and `machine-garden` already serves NFT metadata
from a route of the same shape (`src/routes/fish/fish.routes.ts`, the fish V2 route).

That requires the owner EOA `0xf459B83f676467e55Ed557a45B1E64569450F051`, which has no
code — a plain key, not a multisig. A deliberate operation, but it means this is
recoverable rather than terminal.

## Background

Full write-up and current status: `welikethetrees/machine-garden` issue **#658**.
