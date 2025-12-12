# SourceGuardian Action

This GitHub Action provides a comprehensive interface for
[SourceGuardian](https://www.sourceguardian.com/), a powerful PHP encryption
tool. It allows you to protect your PHP scripts by compiling them into bytecode
and adding various layers of protection directly within your GitHub Actions
workflows.

## Usage

Here is a basic example of how to use the action in your workflow:

```yaml
name: Build and Protect PHP Application

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      # Add a step here to install SourceGuardian if it's not in the runner's PATH
      # For example:
      # - name: Install SourceGuardian
      #   run: |
      #     wget https://www.sourceguardian.com/loaders/download/sourceguardian.x86_64-linux.tar.gz
      #     tar -xzf sourceguardian.x86_64-linux.tar.gz
      #     echo "$(pwd)/sourceguardian" >> $GITHUB_PATH

      - name: Run SourceGuardian
        uses: your-username/sourceguardian-action@v1 # Replace with your username and the correct version
        with:
          source: 'src'
          destination: 'encoded'
          phpversion: |
            8.2
            8.3
          files_to_exclude: |
            **/tests/*
            *.md

      # Add steps here to upload or deploy the 'encoded' directory
      - name: Upload Artifact
        uses: actions/upload-artifact@v4
        with:
          name: encoded-application
          path: encoded/
```

## Inputs

The following inputs can be used to configure the action.

| Input                       | Description                                                                                                                            | Default |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `source`                    | **Required.** The source directory or file mask to process (e.g., "src", "src/\*.php").                                                |         |
| `destination`               | **Required.** The output directory for encoded files. Source files remain unchanged.                                                   |         |
| `sourceguardian_path`       | The directory containing the sourceguardian executable. Defaults to searching the system PATH.                                         |         |
| `phpversion`                | A multiline list of PHP versions to compile for (e.g., 8.3, 7.4+).                                                                     | `8.3`   |
| `expire`                    | Expiration date (dd/mm/yyyy) or period from now (e.g., 10d, 1d12h, 90m).                                                               |         |
| `domain`                    | A multiline list of domain names to bind the script to. Cannot be used with `domain-encrypt`.                                          |         |
| `domain-encrypt`            | Bind and encrypt script to a single domain name. Cannot be used with `domain`.                                                         |         |
| `domain-ignore-cli`         | Ignore domain name check for CLI.                                                                                                      | `false` |
| `ip`                        | A multiline list of IP addresses/masks to bind the script to. Cannot be used with `ip-encrypt`.                                        |         |
| `ip-encrypt`                | Bind and encrypt script to a single IP address/mask. Cannot be used with `ip`.                                                         |         |
| `ip-ignore-cli`             | Ignore IP check for CLI.                                                                                                               | `false` |
| `mac`                       | A multiline list of MAC addresses to bind the script to.                                                                               |         |
| `machine-id`                | A multiline list of machine IDs to bind the script to. Cannot be used with `machine-id-encrypt`.                                       |         |
| `machine-id-encrypt`        | Bind and encrypt script to a single machine ID. Cannot be used with `machine-id`.                                                      |         |
| `remote-verification-url`   | URL for remote machine ID verification for CLI scripts.                                                                                |         |
| `external`                  | Comma-separated list of license filenames, paths, or URLs. Requires `projid` and `projkey`. Cannot be used with other locking options. |         |
| `conj`                      | Make scripts work only with other encoded files.                                                                                       | `false` |
| `projid`                    | Project ID. Required when using `external`.                                                                                            |         |
| `projkey`                   | Project Key. Required when using `external`. Use a GitHub secret.                                                                      |         |
| `time-server`               | Comma-separated list of time servers for expiration checks (e.g., "pool.ntp.org,time.nist.gov").                                       |         |
| `const`                     | A multiline list of custom defined constants (e.g., "name=value").                                                                     |         |
| `catch`                     | A multiline list of custom error handlers (e.g., "ERR_EXPIRED=my_handler").                                                            |         |
| `auto-global`               | A multiline list of custom auto-global variable names.                                                                                 |         |
| `asp-tags`                  | Enable the use of ASP-like <% %> tags.                                                                                                 | `false` |
| `no-short-tags`             | Disable the use of short PHP <? ?> tags.                                                                                               | `false` |
| `prepend-code`              | Custom header code to add to the top of every encoded file (e.g., "code" or "@file.php").                                              |         |
| `loader-error-code`         | Custom code to execute if the SourceGuardian loader is not found (e.g., "code" or "@file.php").                                        |         |
| `no-default-starter`        | Do not integrate the default starter code for loader discovery.                                                                        | `false` |
| `compression-level`         | Compression level from 0 (fastest) to 9 (maximum).                                                                                     |         |
| `entangle`                  | PRO Entangling mode X with granularity Y (e.g., "7" or "7,4").                                                                         |         |
| `compat`                    | Enable PHP 8.4+ compatibility mode.                                                                                                    | `false` |
| `eval-compatible`           | Enable eval() compatibility for encoded scripts.                                                                                       | `false` |
| `stop-on-error`             | Stop encoding on the first critical error.                                                                                             | `false` |
| `strict-errors`             | Report E_STRICT compiler errors.                                                                                                       | `false` |
| `deprec-errors`             | Report E_DEPRECATED PHP 5.3+ compiler errors.                                                                                          | `false` |
| `keep-file-date`            | Keep the original modification date for encoded files.                                                                                 | `false` |
| `keep-doc-comments`         | Keep doc comments within encoded files.                                                                                                | `false` |
| `backup`                    | Set backup file extension (e.g., "bak") or set to `false` to disable backups.                                                          |         |
| `recursive`                 | Recursively process files. Set to `false` to disable. Set to a number > 0 to strip that many directories from the target path.         | `0`     |
| `files_to_exclude`          | A multiline list of file masks to exclude from processing entirely.                                                                    |         |
| `files_to_encode`           | A multiline list of file masks to encode as PHP. If used, other files matching the source are copied as-is.                            |         |
| `files_to_encode_as_custom` | A multiline list of file masks to encode as custom non-PHP files.                                                                      |         |
| `files_to_copy`             | A multiline list of file masks to copy without encoding.                                                                               |         |
| `encode-newer-than`         | Only encode files newer than the specified date/time (YYYYMMDDhhmmss).                                                                 |         |
| `ignore-symlinks`           | Ignore symlinks while recursively scanning directories.                                                                                | `false` |
| `verbose`                   | Set verbosity level: 0 (quiet), 1 (errors only), 2 (encoding log).                                                                     | `2`     |
| `docker-socket`             | Path to the mapped docker socket for installing to a Docker container.                                                                 |         |
| `license-file`              | Path to the license file.                                                                                                              |         |
| `show-license-info`         | Output license information after encoding.                                                                                             | `true`  |
| `license-release`           | Release the license for this installation after encoding. Cannot be used with `license-dynamic`.                                       | `false` |
| `license-dynamic`           | Request a dynamic license. Requires username and password.                                                                             | `false` |
| `license-username`          | The username for a dynamic license request.                                                                                            |         |
| `license-password`          | The password for a dynamic license request. Use a GitHub secret.                                                                       |         |

## Outputs

| Output                   | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| `sourceguardian_version` | The version of the SourceGuardian encoder used.              |
| `sourceguardian_license` | The license information for the SourceGuardian installation. |
