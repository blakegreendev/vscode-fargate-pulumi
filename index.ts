import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";

let listener = new awsx.elasticloadbalancingv2.NetworkListener("vscode", { port: 9000 });

let service = new awsx.ecs.FargateService("vscode", {
    desiredCount: 1,
    taskDefinitionArgs: {
        containers: {
            vscode: {
                image: awsx.ecs.Image.fromPath("vscode", "./app"),
                memory: 4096,
                cpu: 2048,
                portMappings: [listener],
            },
        },
    },
});

export const hostname = pulumi.interpolate `https://${listener.endpoint.hostname}:9000`;
