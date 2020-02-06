import { IGraph, EGraphNodeType } from "./types";

const graph: IGraph = {
    nodes: [
        {
            name: "gateway",
            type: EGraphNodeType.INTERNAL,
            metrics: {
                rate: 550,
                error_rate: 25,
                response_time: 38
            }
        },
        {
            name: "customer-service-1",
            type: EGraphNodeType.INTERNAL,
            metrics: {
                rate: 125,
                error_rate: 100,
                response_time: 24
            }
        },
        {
            name: "customer-service-2",
            type: EGraphNodeType.INTERNAL,
            metrics: {
                rate: 225,
                error_rate: 5,
                response_time: 25
            }
        },
        {
            name: "payment-service",
            type: EGraphNodeType.INTERNAL,
            metrics: {
                rate: 300,
                error_rate: 30,
                response_time: 18
            }
        },
        {
            name: "api.finance.com",
            type: EGraphNodeType.EXTERNAL,
            external_type: "http",
            metrics: {
                rate: 750,
                error_rate: 0,
                response_time: 134
            }
        },
        {
            name: "https://lb-customer.local",
            type: EGraphNodeType.EXTERNAL,
            external_type: 'balancer',
            metrics: {
                rate: 350
            }
        },
        {
            name: "inventory-service",
            type: EGraphNodeType.INTERNAL,
            metrics: {
                rate: 200,
                error_rate: 0,
                response_time: 12
            }
        },
        {
            name: "jdbc:oracle:thin:@sample-oracle-db:1521",
            type: EGraphNodeType.EXTERNAL,
            external_type: 'jdbc',
            metrics: {
                rate: 1200,
                response_time: 2
            }
        },
        {
            name: "api.productsupplier.com",
            type: EGraphNodeType.EXTERNAL,
            external_type: "http",
            metrics: {
                rate: 600,
                response_time: 83
            }
        },
        {
            name: "tcp://localhost:61616",
            type: EGraphNodeType.EXTERNAL,
            external_type: "jms",
            metrics: {
                rate: 300,
                response_time: 7
            }
        },
        {
            name: "reporting-service",
            type: EGraphNodeType.INTERNAL,
            metrics: {
                rate: 160,
                response_time: 18
            }
        },
        {
            name: "controlling-service",
            type: EGraphNodeType.INTERNAL,
            metrics: {
                rate: 300,
                response_time: 45
            }
        }
    ],
    edges: [
        {
            source: "tcp://localhost:61616",
            target: "reporting-service",
            metrics: {
                rate: 300,
                response_time: 20
            }
        },
        {
            source: "controlling-service",
            target: "reporting-service",
            metrics: {
                rate: 10,
                response_time: 12
            }
        },
        {
            source: "controlling-service",
            target: "jdbc:oracle:thin:@sample-oracle-db:1521",
            metrics: {
                rate: 300,
                response_time: 2
            }
        },
        {
            source: "tcp://localhost:61616",
            target: "controlling-service",
            metrics: {
                rate: 300,
                response_time: 45
            }
        },
        {
            source: "payment-service",
            target: "tcp://localhost:61616",
            metrics: {
                rate: 300,
                response_time: 7
            }
        },
        {
            source: "gateway",
            target: "https://lb-customer.local",
            metrics: {
                rate: 350,
                response_time: 35,
                error_rate: 30
            }
        },
        {
            source: "gateway",
            target: "inventory-service",
            metrics: {
                rate: 200,
                response_time: 15
            }
        },
        {
            source: "inventory-service",
            target: "jdbc:oracle:thin:@sample-oracle-db:1521",
            metrics: {
                rate: 400,
                response_time: 1
            }
        },
        {
            source: "payment-service",
            target: "jdbc:oracle:thin:@sample-oracle-db:1521",
            metrics: {
                rate: 500,
                response_time: 2
            }
        },
        {
            source: "https://lb-customer.local",
            target: "customer-service-1",
            metrics: {
                rate: 125,
                error_rate: 25,
                response_time: 45
            }
        },
        {
            source: "https://lb-customer.local",
            target: "customer-service-2",
            metrics: {
                rate: 225,
                error_rate: 5,
                response_time: 25
            }
        },
        {
            source: "customer-service-1",
            target: "payment-service",
            metrics: {
                rate: 125,
                error_rate: 100,
                response_time: 23
            }
        },
        {
            source: "customer-service-2",
            target: "payment-service",
            metrics: {
                rate: 225,
                error_rate: 5,
                response_time: 22
            }
        },
        {
            source: "payment-service",
            target: "api.finance.com",
            metrics: {
                rate: 750,
                response_time: 134
            }
        },
        {
            source: "inventory-service",
            target: "api.productsupplier.com",
            metrics: {
                rate: 600,
                response_time: 83
            }
        }
    ]
};

export default graph;