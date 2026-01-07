## CI (GitHub Actions)

Below is the project's CI workflow file with inline comments explaining each section. The actual file lives at `.github/workflows/ci.yml` — this copy is for reference and documentation.

```yaml
# Name of the workflow shown in GitHub Actions UI
name: CI

# Triggers: run on pushes to `main` and on pull requests targeting `main`
on:
	push:
		branches: [ main ]
	pull_request:
		branches: [ main ]

jobs:
	build:
		# Use the latest Ubuntu runner
		runs-on: ubuntu-latest
		strategy:
			# Matrix allows testing multiple Node versions; currently uses Node 18.x
			matrix:
				node-version: [18.x]

		steps:
			# 1) Check out repository source so subsequent steps can access files
			- name: Checkout repository
				uses: actions/checkout@v4

			# 2) Setup Node.js and enable npm cache for faster runs
			- name: Setup Node.js
				uses: actions/setup-node@v4
				with:
					node-version: ${{ matrix.node-version }}
					cache: 'npm'

			# 3) Install dependencies using `npm ci` for reproducible installs
			- name: Install dependencies
				run: npm ci

			# 4) Run linter; this prevents style/quality regressions
			- name: Run lint
				run: npm run lint

			# 5) Run tests if the project defines a `test` script; `--if-present` avoids failure when none exists
			- name: Run tests (if present)
				run: npm run test --if-present

			# 6) Build the project; ensures production build succeeds
			- name: Build
				run: npm run build

			# 7) Optional: inspect the `dist` output (helpful for debugging CI failures)
			- name: Inspect build output
				run: |
					if [ -d dist ]; then
						echo "dist contents:" && ls -la dist || true
						du -sh dist || true
					else
						echo "No dist directory produced."
					fi

```

Notes and recommendations:

### Core CI concepts

- **Cache dependencies**: Reusing dependency caches speeds up CI runs. In the workflow above we enabled `cache: 'npm'` in `setup-node`, which instructs the action to cache `~/.npm` and `node_modules` artifacts. You can also cache lockfiles and tool caches manually using `actions/cache@v4`:

```yaml
- name: Cache node modules
	uses: actions/cache@v4
	with:
		path: ~/.npm
		key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
		restore-keys: |
			${{ runner.os }}-node-
```

- **Filter for branches**: Use the `on` section to restrict when workflows run. We've set pushes and PRs to `main` only. To run on multiple branches or tags, list them in `branches` or use `branches-ignore` or `tags`.

```yaml
on:
	push:
		branches: [ main, dev ]
	pull_request:
		branches: [ main ]
```

- **Sequence jobs using `needs`**: Jobs run in parallel by default. Use the `needs` keyword to enforce ordering or to make a job depend on artifacts from previous jobs:

```yaml
jobs:
	build:
		runs-on: ubuntu-latest
		steps: ...

	test:
		runs-on: ubuntu-latest
		needs: build        # test will wait for build to finish successfully
		steps: ...

	deploy:
		runs-on: ubuntu-latest
		needs: [build, test]  # deploy runs after build and test succeed
		steps: ...
```

- **Use `uses` for external actions, `run` for commands**: In a job `steps`, prefer `uses` when invoking published actions (reusable tasks) and `run` for ad-hoc shell commands. Example:

```yaml
- name: Checkout
	uses: actions/checkout@v4   # external action

- name: Install deps
	run: npm ci                 # shell command
```

These patterns make workflows faster, more maintainable, and easier to debug. If you want, I can add a `cache` action example to the repository or update the workflow to include job sequencing and branch filters for a `dev` branch.
