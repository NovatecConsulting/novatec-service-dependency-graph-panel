# Contributing

## Releasing

To create a new release of the plugin, follow these steps.

You may also read the [official documentation](https://grafana.com/developers/plugin-tools/publish-a-plugin/publish-a-plugin).

### 1. Push a new tag

Push the current state of the plugin to the remote GitHub repository.

  `git tag <version>`

  `git tag push origin -tag <version>`

### 2. Create a release

Create a new release from the pushed tag manually in GitHub. 
Add appropriate release notes.

### 3. Add the signed plugin to the release

To sign a plugin, you will need a **plugin signing token**, 
which has been created in our Grafana Cloud account.

Set the environment variable `GRAFANA_POLICY_TOKEN_ACCESS` via

`export GRAFANA_POLICY_TOKEN_ACCESS=<token>` 

or in Windows 

`set GRAFANA_POLICY_TOKEN_ACCESS=<token>`

Then run the release script to create a signed plugin:

`./scripts/create-signed-plugin.sh`

Add the created zip file in the `/release` directory to the GitHub release.

### 4. Submit the plugin in Grafana

If you want to publish the release in the Grafana marketplace, you will have to submit the
release in our Grafana Cloud account.

You will need to provide:

- URL of the plugin (link to the zip file of the release)
- SHA1 of the plugin (SHA1 hash of the zip file)
- Source code URL (URL of the repository for the release tag)
- Test description (use the `docker-compose.yml` to run the plugin with dummy data)
