## Novatec Service Dependency Graph Panel

[![Downloads](https://img.shields.io/badge/dynamic/json?color=orange&label=downloads&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22novatec-sdg-panel%22%29%5D.downloads&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/novatec-sdg-panel)
[![License](https://img.shields.io/github/license/NovatecConsulting/novatec-service-dependency-graph-panel)](LICENSE)


![Service Dependency Graph In Action](https://novatecconsulting.github.io/novatec-service-dependency-graph-panel/images/service-dependency-graph-panel.gif)



**Version 4.0.0 is only compatible with Grafana from version 7.1.0!**



The Service Dependency Graph Panel by [Novatec](https://www.novatec-gmbh.de/en/) provides you with many features such as monitoring 
your latencies, errors and requests of your desired service. This interactive panel for [Grafana](https://grafana.com/) will help you
visualize the processes of your application much better. 


### Updating the Service Dependency Graph Panel
The file structure for the icon mapping has changed for version 4.0.0. **Icons are now located in the path 'plugins/novatec-sdg-panel/assets/icons/'.** This also applies to custom icons!

___

## Configuration of the Data Source

### Using Static Dummy Data

If you want to get a first impression of this panel without having your own data source yet, the panels provides you some dummy data to play around with.

The dummy data is basically a snapshot of multiple query results in the table format. You'll find its source [here](https://github.com/NovatecConsulting/novatec-service-dependency-graph-panel/blob/master/src/dummy_data_frame.ts), in the panel's GitHub repository.

Depending on the query result, the data provides the following tags:
* **service**: The service (application) the data is realted to.
* **protocol**: The communication type (e.g. HTTP, JMS, ...).
* **origin_service**: In case of an incoming communication, this is the origin service.
* **target_service**: In case of an outgoing communication, this is the target service.
* **origin_external**: The origin of an incoming communication, which cannot be correlated to a known serive (e.g. HTTP request of a third party application).
* **target_external**: The target of an outgoing communication, which cannot be correlated to a known serive (e.g. third party HTTP endpoint).

Depending on the query result, the data provides the following fields:
* **in_timesum**: The total sum of all incoming request response times. (Prometheus style)
* **in_count**: The total amount of incoming requests.
* **error_in**: The amount of incoming requests which produced an error.
* **out_timesum**: The total sum of all outgoing request response times. (Prometheus style)
* **out_count**: The total amount of outgoing requests.
* **error_out**: The amount of outgoing requests which produced an error.
* **threshold**: The critical threshold in miliseconds for the response times of incoming requests.


In order to use this data you simply have to activate the Dummy Data Switch you can find in the General Settings. All necessary options will be applied.
After activating the Dummy Data your Data Mapping should look like this:

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

### Use your own Data Source

If you now want to use your own data source you have make sure, that the data received is in the `TABLE` format and is structured as follows:

* The table requires a column which is named equal to the value of the `aggregationType` settings field. This column defines the component to which the data refers to.
**Example**: Assuming the `aggregationType` variable is set to `app`, the data table has to provide a column named `app`.
* The table requires at least one column which specifies the connection's source or target. The settings `Source Component Column` and `Target Component Column` need to be set to the exact namings of the respective fields.
 
* The data can contain multiple value columns. These columns have to be mapped on specifc attributes using the panel's `Data Mappings` options. 
**Example**: Assuming the data table contains a column named `req_rate` which values represents a request rate for the related connection in the current time window. In order to correctly visualize these values as a request rate, the `Request Rate Column` option has to be set to `req_rate` - the column's name.

#### Examples

##### Example 1

If the previously described requirements are respected, a minimal table can be as follows:

| app | target_app | req_rate |
| --- | --- | --- | 
| service a | service b | 50 | 
| service a | service c | 75 |
| service c | service d | 25 |

Assuming a `aggregationType` variable is provided and set to `app` and the panel's settings are specified as seen in the screenshot, the panel will visualize the data as following:

![Visualization of the minimal data table.](https://raw.githubusercontent.com/NovatecConsulting/novatec-service-dependency-graph-panel/master/src/img/data-example-1.png)

> Note: It is important to know that connections can only be generated if at least one request-rate column (incoming or outgoing) is defined.

The data mapping represents always the data from the point of view of the component which is specified by the column which name is equal to the `aggregationType` variable. This means that if we want to represent an outgoing connection in this example, the `app` and `target_app` columns must be present. In case an incoming connection should be represented, the `app` and `origin_app` columns must be present.

##### Example 2

In this example, we extend the data table of example 1 by another column, representing the total sum of all request response times of a specific connection (e.g. sum of all HTTP request response times).

| app | target_app | req_rate | resp_time |
| --- | --- | --- | --- | 
| service a | service b | 50 | 4000 |
| service a | service c | 75 | 13650 |
| service c | service d | 25 | 750 |

Now, the panel's `Data Mappings` option `Response Time Column` is set to `resp_time`. This specifies that the value in the `resp_time` column should be handled as the response time for a connection. By default, the values in this column will be handled as a sum of all response times - kind of a Prometheus style metric. This behavior can be changed by using the `Handle Timings as Sums` option. This table will result in the following visualization.

![Visualization of a data table including request rate and response times.](https://raw.githubusercontent.com/NovatecConsulting/novatec-service-dependency-graph-panel/master/src/img/data-example-2.png)

___

## Service Icons

The service dependency graph plugin allows you to display your own symbols in the drawn nodes.
For this purpose the option 'Service Icon Mapping' can be used.
Here you can specify an assignment of icons to certain name patterns.
All nodes that match the specified pattern (regular expression) will get the icon.

![Custom service icons in the graph.](https://raw.githubusercontent.com/NovatecConsulting/novatec-service-dependency-graph-panel/master/src/img/service-icons.png)

##### Example

A sample assignment is included by default: `Pattern: java // Icon: java`.
This means that all nodes which have `java` in their name get the `java` icon.

#### Custom Service Icons

You can add custom icons, by putting them into the plugin's `/assets/icons/` directory.
The file type **has to be `PNG`** and the icon itself and **has to be square**.
In order to be able to use the icon, its name (without its ending) has to be put into the array contained in the `icon_index.json` file located in the `/assets/icons/` directory.

##### Example

If the `icon_index.json` has the following content:

```
["java", "star_trek"]
```

it is assumed that the files `java.png` and `star_trek.png` is existing in the `/assets/icons/` directory.
___

### Tracing Drilldown

The service dependency graph plugin allows you to specify a backend URL for each drawn node.
For this purpose the option 'Tracing Drilldown' can be used.
Here you can specify a backend URL. An open and closed curly bracket `{}` is the placeholder for the selected node.
Each node will get an arrow icon in the details view. This icon is a link to your backend, specified in the options.
The curly brackets `{}` will be replaced with the selected node.

#### Example

`http://{}/my/awesome/path` will end up to `http://customers-service/my/awesome/path` when you select the `customers-service`.

___

## Create a Release

To create a release bundle, ensure `release-it` is installed:
```
npm install --global release-it
```
To build a release bundle:
```
release-it [--no-git.requireCleanWorkingDir]
```

### Found a bug? Have a question? Wanting to contribute?

Feel free to open up an issue. We will take care of you and provide as much help as needed. Any suggestions/contributions are being very much appreciated.

