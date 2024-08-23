#!/usr/bin/env node

import * as E from "./Errors";
import { GraphQLObjectType, Location } from "graphql";
import { getParsedTsConfig } from "./";
import {
  SchemaAndDoc,
  buildSchemaAndDocResult,
  extractSchemaAndDoc,
} from "./lib";
import { Command } from "commander";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { version } from "../package.json";
import { locate } from "./Locate";
import { printGratsSDL, printExecutableSchema } from "./printSchema";
import * as ts from "typescript";
import {
  locationlessErr,
  ReportableDiagnostics,
} from "./utils/DiagnosticError";
import { GratsConfig, ParsedCommandLineGrats } from "./gratsConfig";
import { err, ok, Result } from "./utils/Result";

const program = new Command();

program
  .name("grats")
  .description("Extract GraphQL schema from your TypeScript project")
  .version(version)
  .option(
    "--tsconfig <TSCONFIG>",
    "Path to tsconfig.json. Defaults to auto-detecting based on the current working directory",
  )
  .option("--watch", "Watch for changes and rebuild schema files as needed")
  .action(async ({ tsconfig, watch }) => {
    if (watch) {
      startWatchMode(tsconfig);
    } else {
      runBuild(tsconfig);
    }
  });

program
  .command("locate")
  .argument("<ENTITY>", "GraphQL entity to locate. E.g. `User` or `User.id`")
  .option(
    "--tsconfig <TSCONFIG>",
    "Path to tsconfig.json. Defaults to auto-detecting based on the current working directory",
  )
  .action((entity, { tsconfig }) => {
    const { config } = handleDiagnostics(getTsConfig(tsconfig));

    const { schema } = handleDiagnostics(buildSchemaAndDocResultForCli(config));

    const loc = locate(schema, entity);
    if (loc.kind === "ERROR") {
      console.error(loc.err);
      process.exit(1);
    }
    console.log(formatLoc(loc.value));
  });

program.parse();

/**
 * Run the compiler in watch mode.
 */
function startWatchMode(tsconfig: string) {
  const { config, configPath } = handleDiagnostics(getTsConfig(tsconfig));
  const watchHost = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    ts.createSemanticDiagnosticsBuilderProgram,
    (diagnostic) => reportDiagnostics([diagnostic]),
    (diagnostic) => reportDiagnostics([diagnostic]),
  );
  watchHost.afterProgramCreate = (program) => {
    // For now we just rebuild the schema on every change.
    const schemaResult = extractSchemaAndDoc(config, program.getProgram());
    if (schemaResult.kind === "ERROR") {
      reportDiagnostics(schemaResult.err);
      return;
    }
    writeSchemaFilesAndReport(schemaResult.value, config, configPath);
  };
  ts.createWatchProgram(watchHost);
}

/**
 * Like `buildSchemaAndDocResult` but applies a few additional validations that
 * are considered helpful for CLI usage, like warning if you have no types defined..
 */

function buildSchemaAndDocResultForCli(
  config: ParsedCommandLineGrats,
): Result<SchemaAndDoc, ReportableDiagnostics> {
  const result = buildSchemaAndDocResult(config);
  if (result.kind === "ERROR") {
    return result;
  }
  const types = Object.values(result.value.schema.getTypeMap());
  if (!types.some((t) => t instanceof GraphQLObjectType)) {
    return err(
      ReportableDiagnostics.fromDiagnostics([
        locationlessErr(E.noTypesDefined()),
      ]),
    );
  }

  return result;
}

/**
 * Run the compiler performing a single build.
 */
function runBuild(tsconfig: string) {
  const { config, configPath } = handleDiagnostics(getTsConfig(tsconfig));
  const schemaAndDoc = handleDiagnostics(buildSchemaAndDocResultForCli(config));

  writeSchemaFilesAndReport(schemaAndDoc, config, configPath);
}

/**
 * Serializes the SDL and TypeScript schema to disk and reports to the console.
 */
function writeSchemaFilesAndReport(
  schemaAndDoc: SchemaAndDoc,
  config: ParsedCommandLineGrats,
  configPath: string,
) {
  const { schema, doc } = schemaAndDoc;

  const gratsConfig: GratsConfig = config.raw.grats;

  const dest = resolve(dirname(configPath), gratsConfig.tsSchema);
  const code = printExecutableSchema(schema, gratsConfig, dest);
  writeFileSync(dest, code);
  console.error(`Grats: Wrote TypeScript schema to \`${dest}\`.`);

  const schemaStr = printGratsSDL(doc, gratsConfig);

  const absOutput = resolve(dirname(configPath), gratsConfig.graphqlSchema);
  writeFileSync(absOutput, schemaStr);
  console.error(`Grats: Wrote schema to \`${absOutput}\`.`);
}

/**
 * Utility function to report diagnostics to the console.
 */
function reportDiagnostics(diagnostics: ts.Diagnostic[]) {
  const reportable = ReportableDiagnostics.fromDiagnostics(diagnostics);
  console.error(reportable.formatDiagnosticsWithColorAndContext());
}

/**
 * Utility function to report diagnostics to the console.
 */
function handleDiagnostics<T>(result: Result<T, ReportableDiagnostics>): T {
  if (result.kind === "ERROR") {
    console.error(result.err.formatDiagnosticsWithColorAndContext());
    process.exit(1);
  }
  return result.value;
}

// Locate and read the tsconfig.json file
function getTsConfig(tsconfig?: string): Result<
  {
    configPath: string;
    config: ParsedCommandLineGrats;
  },
  ReportableDiagnostics
> {
  const configPath =
    tsconfig || ts.findConfigFile(process.cwd(), ts.sys.fileExists);
  if (configPath == null) {
    return err(
      ReportableDiagnostics.fromDiagnostics([
        locationlessErr(
          `Grats: Could not find \`tsconfig.json\` searching in ${process.cwd()}`,
        ),
      ]),
    );
    process.exit(1);
  }
  const optionsResult = getParsedTsConfig(configPath);
  if (optionsResult.kind === "ERROR") {
    return err(optionsResult.err);
  }
  return ok({ configPath, config: optionsResult.value });
}

// Format a location for printing to the console. Tools like VS Code and iTerm
// will automatically turn this into a clickable link.
export function formatLoc(loc: Location) {
  return `${loc.source.name}:${loc.startToken.line + 1}:${
    loc.startToken.column + 1
  }`;
}
