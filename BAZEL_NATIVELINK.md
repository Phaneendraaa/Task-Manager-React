# Bazel + NativeLink setup

This project includes a Bazel scaffold alongside the normal `npm run dev` workflow.
The npm workflow (`npm install && npm run dev`) works standalone and does not require Bazel.

## Files added

- `MODULE.bazel` — bzlmod deps: `aspect_rules_js`, `aspect_rules_ts`, `rules_nodejs`, `aspect_bazel_lib`.
- `BUILD.bazel` — links npm packages and defines a `:build` target that runs `vite build`
  via `js_run_binary`.
- `.bazelrc` — one `nativelink` config: remote cache only (no remote execution).
  Builds still **execute locally**; only action results are cached remotely. This is
  set as the default (`build --config=nativelink`), so plain `bazel build //:build` uses it.
- `.bazelversion` — pins Bazel to 7.4.1 (use with Bazelisk).
- `.bazelignore` — keeps Bazel out of `node_modules` and `dist`.
- `.npmrc` — required by `npm_translate_lock`.

## One-time setup to make `bazel build //:build` work

`rules_js`'s `npm_translate_lock` expects a **pnpm** lockfile, but this project was
scaffolded with plain `npm`. To wire it up:

```bash
npm install -g pnpm
pnpm import          # generates pnpm-lock.yaml from package-lock.json
bazel build //:build
```

## NativeLink remote cache (no remote execution)

1. Get your cache endpoint and API key from your NativeLink instance:
   - **NativeLink Cloud**: sign in at app.nativelink.com, create/open an instance,
     copy the gRPC cache URL and API key from the instance's settings page.
   - **Self-hosted**: use the gRPC address of your own NativeLink CAS/cache service
     (e.g. `grpc://your-host:50051`, or `grpcs://...` if TLS-terminated).
2. Export both as env vars:
   ```bash
   export NATIVELINK_CACHE_URL=grpcs://cas-your-instance.build-faster.nativelink.net
   export NATIVELINK_API_KEY=your-key-here
   ```
3. Build as usual — the cache config is the default:
   ```bash
   bazel build //:build
   ```
   Actions still run on your machine; results are pushed to and pulled from NativeLink's
   remote cache, so repeated/team builds skip re-running unchanged actions.

If your NativeLink setup doesn't require an API key (e.g. a private self-hosted instance
on a trusted network), just drop the `--remote_header` line in `.bazelrc`.

## Docker

The `Dockerfile` is a standard multi-stage Node → nginx build, independent of Bazel:

```bash
docker build -t task-manager .
docker run -p 8080:80 task-manager
```
