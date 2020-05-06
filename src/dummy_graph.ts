import { QueryResponse } from "./types";

const rowData: QueryResponse[] = [
    {
        columns: [
            { type: "time", text: "Time" },
            { text: "origin_external" },
            { text: "origin_service" },
            { text: "protocol" },
            { text: "service" },
            { text: "in_count" }
        ],
        refId: undefined,
        meta: undefined,
        rows: [
            [0, "", "", "http", "api-gateway", 508],
            [0, "", "", "http", "config-server", 0],
            [0, "", "", "http", "discovery-server", 0],
            [0, "", "api-gateway", "http", "api-gateway", 100],
            [0, "", "api-gateway", "http", "customers-service", 347],
            [0, "", "api-gateway", "http", "discovery-server", 20],
            [0, "", "api-gateway", "http", "vets-service", 63],
            [0, "", "api-gateway", "http", "visits-service", 100],
            [0, "", "customers-service", "http", "discovery-server", 20],
            [0, "", "vets-service", "http", "discovery-server", 20],
            [0, "", "visits-service", "http", "discovery-server", 20],
            [0, "MyService", "vets-service", "http", "visits-service", 300]
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
            [0, "http", "api-gateway", "", "api-gateway", 100],
            [0, "http", "api-gateway", "", "customers-service", 347],
            [0, "http", "api-gateway", "", "discovery-server", 20],
            [0, "http", "api-gateway", "", "vets-service", 62],
            [0, "http", "api-gateway", "", "visits-service", 100],
            [0, "http", "api-gateway", "7a8dce897616:8080", "", 0],
            [0, "http", "config-server", "github.com", "", 0],
            [0, "http", "customers-service", "", "discovery-server", 20],
            [0, "http", "vets-service", "", "discovery-server", 20],
            [0, "http", "vets-service", "MyService", "visits-service", 300],
            [0, "http", "visits-service", "", "discovery-server", 20],
            [0, "jdbc", "customers-service", "jdbc:hsqldb:mem:testdb", "", 1847],
            [0, "jdbc", "vets-service", "jdbc:hsqldb:mem:testdb", "", 441],
            [0, "jdbc", "visits-service", "jdbc:hsqldb:mem:testdb", "", 100]
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
            [0, "", "http", "api-gateway", "", 4514.008427999986],
            [0, "", "http", "config-server", "", 0],
            [0, "", "http", "discovery-server", "", 0],
            [0, "api-gateway", "http", "api-gateway", "", 1511.9842349999872],
            [0, "api-gateway", "http", "customers-service", "", 819.3634589999965],
            [0, "api-gateway", "http", "discovery-server", "", 21.881731999999943],
            [0, "api-gateway", "http", "vets-service", "", 281.0465210000002],
            [0, "api-gateway", "http", "visits-service", "", 325.85070300000007],
            [0, "customers-service", "http", "discovery-server", "", 21.53124399999996],
            [0, "vets-service", "http", "discovery-server", "", 21.40604300000001],
            [0, "visits-service", "http", "discovery-server", "", 20.813048000000038]
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
            [0, "http", "api-gateway", "", "api-gateway", 1700.468872999987],
            [0, "http", "api-gateway", "", "customers-service", 1481.533606999972],
            [0, "http", "api-gateway", "", "discovery-server", 540.746261],
            [0, "http", "api-gateway", "", "vets-service", 501.65547400000014],
            [0, "http", "api-gateway", "", "visits-service", 394.81158100000175],
            [0, "http", "api-gateway", "7a8dce897616:8080", "", 0],
            [0, "http", "config-server", "github.com", "", 0],
            [0, "http", "customers-service", "", "discovery-server", 84.59527999999978],
            [0, "http", "vets-service", "", "discovery-server", 381.87400800000023],
            [0, "http", "visits-service", "", "discovery-server", 225.65933600000017],
            [0, "jdbc", "customers-service", "jdbc:hsqldb:mem:testdb", "", 35.9093940000007],
            [0, "jdbc", "vets-service", "jdbc:hsqldb:mem:testdb", "", 13.000189000000091],
            [0, "jdbc", "visits-service", "jdbc:hsqldb:mem:testdb", "", 12.258137999999946]
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
            [0, "", "http", "api-gateway", "", 254.5],
            [0, "", "http", "config-server", "", 0],
            [0, "", "http", "discovery-server", "", 0],
            [0, "api-gateway", "http", "api-gateway", "", 49.5],
            [0, "api-gateway", "http", "customers-service", "", 173.5],
            [0, "api-gateway", "http", "discovery-server", "", 10],
            [0, "api-gateway", "http", "vets-service", "", 31.5],
            [0, "api-gateway", "http", "visits-service", "", 49.5],
            [0, "customers-service", "http", "discovery-server", "", 10],
            [0, "vets-service", "http", "discovery-server", "", 10],
            [0, "vets-service", "http", "visits-service", "", 150],
            [0, "visits-service", "http", "discovery-server", "", 10],
        ]
    },

    {
        columns: [
            { type: "time", text: "Time" },
            { text: "service" },
            { text: "threshold" }
        ],
        refId: undefined,
        meta: undefined,
        rows: [
            [0,  "api-gateway", 2], 
            [0,  "discovery-server",  40]
           
        ]
    }
]

export default rowData;