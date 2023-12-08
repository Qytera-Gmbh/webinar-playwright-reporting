import colors from "ansi-colors";
import * as esbuild from "esbuild";
import { createInterface } from "node:readline";

if (process.env.ARN_SECRET) {
    build(process.env.ARN_SECRET);
} else {
    console.log(
        colors.yellow(
            `Failed to find AWS Secret ARN in environment variables. It is recommended to build the lambda function using: ${colors.blue(
                "ARN_SECRET=<ARN of your secret> npm run build"
            )}\nTrying to parse the ARN from stdin instead.`
        )
    );
    const readline = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    readline.question(colors.blue("Please enter the ARN of the secret: "), (arn: string) => {
        if (!arn) {
            console.warn(
                "No ARN was provided, the AWS Lambda function will not be able to authenticate users. Make sure to rebuild it when you know your secret's ARN."
            );
            arn = "<TODO>";
        }
        readline.close();
        build(arn);
    });
}

function build(arn: string) {
    esbuild
        .build({
            entryPoints: ["src/index.ts"],
            bundle: true,
            minify: true,
            sourcemap: true,
            platform: "node",
            // The Lambda runtimes automatically include AWS SDKs.
            external: ["@aws-sdk/client-secrets-manager"],
            target: "es2020",
            outfile: "dist/index.js",
            define: {
                "process.env.ARN_SECRET": JSON.stringify(arn),
            },
        })
        .then(() => {
            console.log(
                colors.green(
                    `Successfully injected secret ARN ${colors.white(
                        arn
                    )} into the lambda function. You can now follow up with: ${colors.blue(
                        "terraform apply"
                    )}`
                )
            );
        })
        .catch((error: unknown) => {
            console.error(error);
            process.exit(1);
        });
}
