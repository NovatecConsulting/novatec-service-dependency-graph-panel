## Novatec Service Dependency Graph Panel

![Service Dependency Graph Showcase](src/img/screenshot-showcase.png)
![Service Dependency Graph In Action](src/img/service-dependency-graph-panel.gif)

##### Data Model

The data model is not final, yet.
In order to use the plugin, you have to setup a data-source which provides a the data in the `TABLE` format! You can use multiple queries as long each data table contains the same `<from>` and `<to>` columns.

The table must be structured as follows:
- A `<from>` and `<to>` column must exist.
  - The naming of these columns has to be as follows. They need a common suffix and a unique prefix in order to differentiate them (e.g. `origin_component` and `target_component`). The suffix value must be present to the dashboard via a templating variable called `aggregationType`. The plugin's settings have to be adjusted in order to match the used prefixes.
- At least one `<value>` column must exist.
  - Each column can be mapped to a certain metric (e.g. rate, duration, ...) in the plugin's settings.

__Example Data Table:__

| origin_component | target_component | my_value | another_value |
|---|---|---|---|
| comp_a | comp_b | 200 | |
| comp_a | comp_b | | 200 |
| comp_b | comp_c | 100 | |

### Development

##### How to build it:

To build a production build with minification: `yarn build`

Run the following for hot-reloading during development: `yarn watch`
