## Novatec Service Dependency Graph Panel

![Service Dependency Graph Showcase](src/img/screenshot-showcase.png)
![Service Dependency Graph Showcase in action](src/img/service-dependency-graph-panel.gif)

The Service Dependency Graph Panel by [Novatec](https://www.novatec-gmbh.de/en/) provides you with many features such as monitoring 
your latencies, errors and requests of your desired service. This interactive panel for [Grafana](https://grafana.com/) will help you
visualize the processes of your application much better. 

___
### How to build

To build a production build with minification: `yarn build`

Run the following for hot-reloading during development: `yarn watch`

___
#### Using dummy data
##### Static dummy data

If you want to get a first impression of this panel without having your own data source yet we have provided you with 
some dummy data to play around with. In order to use those you simply have to follow the following steps:

1. Add a `template variable` in Grafana called `aggregationType` having the constant value `service`.
2. After selecting the Novatec Service Dependency Graph in your panels' settings check the box called `Show Dummy Data`.
3. Change the columns at `Data Mapping` as follows:

| key | value |
| --- | --- |
| Response Time | in_timesum |
| Request Rate  | in_count |
| Error Rate    | error_in |
| Response Time (Outgoing) | out_timesum |
| Request Rate (Outgoing) | out_count |
| Error Rate (Outgoing) | error_out |
| Response Time Baseline (Upper) | threshold |

_Note that you may have to refresh the dashboard or reload the page in order for it to work._

##### Live example dummy data

Downloading and launching the [inspectIT Ocelot demo #1](https://inspectit.github.io/inspectit-ocelot/docs/getting-started/docker-examples) will provide you with live dummy data rather than static one. 
Just open the docker images' Grafana and choose the dashboard `Service Graph` to see the fully functional Service Dependency Graph.
___
#### Own datasource

If you now want to use your own data source you have make sure, that the data received is in the `TABLE` format and is structured as follows:
- You will need a `<from>` and `<to>` column. 
    - The naming of these columns has to be as follows:
        - They need a common suffix and a unique prefix (e.g. `origin_component` and `target_component`).
        - The suffix value must be present to the dashboard via a templating variable called `aggregationType`. The plugin's settings have to be adjusted in order to match the used prefixes.
- At least one `<value>` column has to exist.
    - Each column can be mapped to a certain metric (e.g. rate, duration, ...) in the plugin's settings.

An example table could look like this:

| origin_component | target_component | error_in | error_out |
| --- | --- | --- | --- |
| service a | service b | 0 | 10 |
| service b | service a | 10 | 0 |
| service a | service c | 15 | 0 |
| service c | service a | 0 | 15 |

___

#### Found a bug? Have a question? Wanting to contribute?
Feel free to open up an issue. We will take care of you and provide as much help as needed. Any suggestions/contributions are being very much appreciated.

