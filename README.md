## Novatec Service Dependency Graph Panel

![Service Dependency Graph In Action](https://novatecconsulting.github.io/novatec-service-dependency-graph-panel/images/service-dependency-graph-panel.gif)

The Service Dependency Graph Panel by [Novatec](https://www.novatec-gmbh.de/en/) provides you with many features such as monitoring 
your latencies, errors and requests of your desired service. This interactive panel for [Grafana](https://grafana.com/) will help you
visualize the processes of your application much better. 

___
### How to build

To build a production build with minification: `yarn build`

Run the following for hot-reloading during development: `yarn watch`

___

## Configuration of the Data Source

### Using Static Dummy Data

If you want to get a first impression of this panel without having your own data source yet, the panels provides you some dummy data to play around with.

The dummy data is basically a snapshot of multiple query results in the table format. You'll find its source [here](https://github.com/NovatecConsulting/novatec-service-dependency-graph-panel/blob/master/src/dummy_graph.ts), in the panel's GitHub repository.

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


In order to use this data you simply have to follow the following steps:

1. Add a `template variable` in Grafana called `aggregationType` having the constant value `service`.
2. After selecting the Novatec Service Dependency Graph in your panels' settings check the box called `Show Dummy Data`.
3. Adapt the panel's `Data Mapping` according to the dummy data. You can use the following settings. Note: at least you have to specify the `Request Rate` mapping!

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

* The table requires a column which is named equal to the value of the `aggregationType` template variable. This column defines the component to which the data refers.
**Example**: Assuming the `aggregationType` template variable is set to `app`, the data table has to provide a column named `app`.
* The table requires at least one column which specifies the connection's origin or target. This column has the following requirements for its naming:
    * It requires a suffix which has to be equal to the `aggregationType` template variable.
    * In case an incoming connection should be represented, a prefix is required which is equal to the `Source Component Column Prefix` panel option. By default it is `origin_`.
    * In case an outcoming connection should be represented, a prefix is required which is equal to the `Target Component Column Prefix` panel option. By default it is `target_`.
    
    **Example**: Assuming the `aggregationType` template variable is set to `app`, the previously mentioned column prefix options are in its default state (`origin_` or `target_`) and we want to represent an outgoing connection. In this case, the data table has to provide a column named: `target_app`
* The data table can contain multiple value columns. These columns have to be mapped on specifc attributes using the panel's `Data Mappings` options. 
**Example**: Assuming the data table contains a column named `req_rate` which values represents a request rate for the related connection in the current time window. In order to correctly visualize these values as a request rate, the `Request Rate Column` option has to be set to `req_rate` - the column's name.

#### Examples

##### Example 1

If the previously described requirements are respected, a minimal table can be as follows:

| app | target_app | req_rate |
| --- | --- | --- | 
| service a | service b | 50 | 
| service a | service c | 75 |
| service c | service d | 25 |

Assuming a `aggregationType` template variable is provided and set to `app` and the panel's settings are specified as seen in the screenshot, the panel will visualize the data as following:

![Visualization of the minimal data table.](https://raw.githubusercontent.com/NovatecConsulting/novatec-service-dependency-graph-panel/master/src/img/data-example-1.png)

> Note: It is important to know that connections can only be generated if at least one request-rate column (incoming or outgoing) is defined.

The data mapping represents always the data from the point of view of the component which is specified by the column which name is equal to the `aggregationType` template variable. This means that if we want to represent an outgoing connection in this example, the `app` and `target_app` columns must be present. In case an incoming connection should be represented, the `app` and `origin_app` columns must be present.

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

### Found a bug? Have a question? Wanting to contribute?

Feel free to open up an issue. We will take care of you and provide as much help as needed. Any suggestions/contributions are being very much appreciated.

