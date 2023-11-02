import { JobSpec, Workflow } from "fluent_github_actions";

/**
 * Generates a GitHub Actions workflow for running tests.
 * @returns The generated workflow.
 */
export function generateYaml(): Workflow {
  const workflow = new Workflow("tests");

  const push = {
    branches: ["main"],
  };

  const tests: JobSpec = {
    "runs-on": "ubuntu-latest",
    steps: [
      {
        uses: "actions/checkout@v2",
      },
      {
        name: "Setup Fluent CI",
        uses: "fluentci-io/setup-fluentci@v1",
      },
      {
        name: "Run Dagger Pipelines",
        run: "fluentci run bun_pipeline",
      },
    ],
  };

  workflow.on({ push }).jobs({ tests });

  return workflow;
}
