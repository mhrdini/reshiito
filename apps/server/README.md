# Server for reshiito

## Requirements

- [uv](https://docs.astral.sh/uv/getting-started/installation/)

## Setup

In the project root directory:

```bash
pnpm setup:python
```

## Development

To start server:

- In parallel as part of Turbo monorepo, from the root directory
- Or standalone, from this package directory

```bash
pnpm dev
```

To install dependencies, from this package directory:

```bash
uv add <package-name>
uv sync --upgrade
```

To export `uv` installs to `requirements.txt`:

```bash
uv export -o requirements.txt
```
