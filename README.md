## Novatec Flowmap Panel

![Flowmap Showcase](src/img/screenshot-showcase.png)

### How to use it

##### Interaction

You can move a node by dragging it. You can also move the whole flowmap by dragging its background.

You can zoom in and out of the flowmap by using the mouse wheel while the SHIFT key is pressed.

##### Data Model

The data model is not final, yet.
In order to use the flowmap-plugin, you have to setup a data-source which provides a the data in the `TABLE` format! You can use multiple queries as long each data table contains the same `<from>` and `<to>` columns.

The table must be structured as follows:
- A `<from>` and `<to>` column must exist.
  - The naming of these columns has to be as follows. They need a common suffix and a unique prefix in order to differentiate them (e.g. `origin_component` and `target_component`). The suffix value must be present to the dashboard via a templating variable called `aggregationType`. The plugin's settings have to be adjusted in order to match the used prefixes.
- At least one `<value>` column must exist.
  - Each column can be mapped to a certain metric (e.g. rate, duration, ...) in the plugin's settings.

__Example Data Table:__

| origin_component | target_component | my_value |
|---|---|---|
| comp_a | comp_b | 200 |
| comp_b | comp_c | 100 |

### Development

##### How to build it:

1. Clone the repository and `cd` to it
1. Make sure you have [yarn]( https://yarnpkg.com/) installed
1. Install the project dependencies: `yarn install --pure-lockfile`
1. Link the customized Vizceral fork (see below)
1. Start the "watch" task: `yarn watch`
1. Mount the built `dist` directory into Grafana's plugin directory. You can also locate the cloned repository there. Grafana will mount the `dist` directory automatically and ignores the `src` one.

To build a production build with minification: `yarn build`

##### Link Vizceral:

This plugin is using a modified version of the Vizeral library, thus you have to link the customized Vizceral version in order to build the plugin!

1. Ensure that NodeJS and NPM is installed
1. Clone the Vizceral fork
1. Run inside the repository `npm link`
1. Build it: `npm run dev`
1. Go to the flowmap-plugin directory and execute `npm link vizceral`

#### Changelog

##### v0.0.1

- Initial release
