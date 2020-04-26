[
    {
        columns: [
            { type: "time", text: "Time" },
            { text: "origin_service" },
            { text: "protocol" },
            { text: "service" },
            { text: "target_external" },
            { text: "in_count" }
        ],
        refId: undefined,
        meta: undefined,
        rows: [
            [0, "", "http", "api-gateway", "", 471],
            [0, "", "http", "config-server", "", 0],
            [0, "", "http", "discovery-server", "", 0],
            [0, "api-gateway", "http", "api-gateway", "", 99],
            [0, "api-gateway", "http", "customers-service", "", 298],
            [0, "api-gateway", "http", "discovery-server", "", 18],
            [0, "api-gateway", "http", "vets-service", "", 74],
            [0, "api-gateway", "http", "visits-service", "", 99],
            [0, "customers-service", "http", "discovery-server", "", 20],
            [0, "vets-service", "http", "discovery-server", "", 20],
            [0, "visits-service", "http", "discovery-server", "", 20]
        ]
    },

    {
        columns: [
            { type: "time", text: "Time" },
            { text: "protocol" },
            { text: "service" },
            { text: "target_external" },
            { text: "target_service" },
            { text: "out_count" }
        ],
        refId: undefined,
        meta: undefined,
        rows: [
            [0, "http", "api-gateway", "", "api-gateway", 99],
            [0, "http", "api-gateway", "", "customers-service", 298],
            [0, "http", "api-gateway", "", "discovery-server", 18],
            [0, "http", "api-gateway", "", "vets-service", 74],
            [0, "http", "api-gateway", "", "visits-service", 99],
            [0, "http", "api-gateway", "6a6055adf528:34005", "", 0],
            [0, "http", "api-gateway", "7a8dce897616:8080", "", 0],
            [0, "http", "config-server", "github.com", "", 0],
            [0, "http", "customers-service", "", "discovery-server", 20],
            [0, "http", "discovery-server", "zipkin:9411", "", 0],
            [0, "http", "vets-service", "", "discovery-server", 20],
            [0, "http", "vets-service", "zipkin:9411", "", 0],
            [0, "http", "visits-service", "", "discovery-server", 20],
            [0, "jdbc", "customers-service", "jdbc:hsqldb:mem:testdb", "", 1632],
            [0, "jdbc", "vets-service", "jdbc:hsqldb:mem:testdb", "", 518],
            [0, "jdbc", "visits-service", "jdbc:hsqldb:mem:testdb", "", 99]
        ]
    },

    {
        columns: [
            { type: "time", text: "Time" },
            { text: "origin_service" },
            { text: "protocol" },
            { text: "service" },
            { text: "target_external" },
            { text: "in_timesum" }
        ],
        refId: undefined,
        meta: undefined,
        rows: [
            [0, "", "http", "api-gateway", "", 7306.366960000007],
            [0, "", "http", "config-server", "", 0],
            [0, "", "http", "discovery-server", "", 0],
            [0, "api-gateway", "http", "api-gateway", "", 1806.1961040000078],
            [0, "api-gateway", "http", "customers-service", "", 830.9444789999907],
            [0, "api-gateway", "http", "discovery-server", "", 20.000272999999964],
            [0, "api-gateway", "http", "vets-service", "", 371.9420119999995],
            [0, "api-gateway", "http", "visits-service", "", 392.7119640000001],
            [0, "customers-service", "http", "discovery-server", "", 25.07012199999994],
            [0, "vets-service", "http", "discovery-server", "", 24.73995899999997],
            [0, "visits-service", "http", "discovery-server", "", 22.116933000000046]
        ]
    },

    {
        columns: [
            { type: "time", text: "Time" },
            { text: "protocol" },
            { text: "service" },
            { text: "target_external" },
            { text: "target_service" },
            { text: "out_timesum" }

        ],
        refId: undefined,
        meta: undefined,
        rows: [
            [0, "http", "api-gateway", "", "api-gateway", 2229.2912749999887],
            [0, "http", "api-gateway", "", "customers-service", 3193.277726000022],
            [0, "http", "api-gateway", "", "discovery-server", 85.75270999999998],
            [0, "http", "api-gateway", "", "vets-service", 711.9325959999987],
            [0, "http", "api-gateway", "", "visits-service", 546.308599],
            [0, "http", "api-gateway", "6a6055adf528:34005", "", 0],
            [0, "http", "api-gateway", "7a8dce897616:8080", "", 0],
            [0, "http", "config-server", "github.com", "", 0],
            [0, "http", "customers-service", "", "discovery-server", 282.67790099999957],
            [0, "http", "discovery-server", "zipkin:9411", "", 0],
            [0, "http", "vets-service", "", "discovery-server", 300.54625000000055],
            [0, "http", "vets-service", "zipkin:9411", "", 0],
            [0, "http", "visits-service", "", "discovery-server", 457.36892300000045],
            [0, "jdbc", "customers-service", "jdbc:hsqldb:mem:testdb", "", 31.995974000000672],
            [0, "jdbc", "vets-service", "jdbc:hsqldb:mem:testdb", "", 15.545954999999992],
            [0, "jdbc", "visits-service", "jdbc:hsqldb:mem:testdb", "", 18.647533000000095]
        ]
    },

    {
        columns: [
            { type: "time", text: "Time" },
            { text: "origin_service" },
            { text: "protocol" },
            { text: "service" },
            { text: "target_external" },
            { text: "error" }
        ],
        refId: undefined,
        meta: undefined,
        rows: [
            [0, "", "http", "api-gateway", "", 235.5],
            [0, "", "http", "config-server", "", 0],
            [0, "", "http", "discovery-server", "", 0],
            [0, "api-gateway", "http", "api-gateway", "", 49.5],
            [0, "api-gateway", "http", "customers-service", "", 149],
            [0, "api-gateway", "http", "discovery-server", "", 9],
            [0, "api-gateway", "http", "vets-service", "", 37],
            [0, "api-gateway", "http", "visits-service", "", 49.5],
            [0, "customers-service", "http", "discovery-server", "", 10],
            [0, "vets-service", "http", "discovery-server", "", 10],
            [0, "visits-service", "http", "discovery-server", "", 10]]
    }
]