import { BuildSpec } from "fluent_aws_codepipeline";

/**
 * Generates a BuildSpec object for AWS CodePipeline.
 * @returns A BuildSpec object with install, build, and post_build phases.
 */
export function generateYaml(): BuildSpec {
  const buildspec = new BuildSpec();
  buildspec
    .phase("install", {
      commands: [
        "curl -fsSL https://deno.land/x/install/install.sh | sh",
        'export DENO_INSTALL="$HOME/.deno"',
        'export PATH="$DENO_INSTALL/bin:$PATH"',
        "deno install -A -r https://cli.fluentci.io -n fluentci",
        "curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=0.9.3 sh",
        "mv bin/dagger /usr/local/bin",
        "dagger version",
      ],
    })
    .phase("build", {
      commands: ["fluentci run bun_pipeline"],
    })
    .phase("post_build", {
      commands: ["echo Build completed on `date`"],
    });
  return buildspec;
}
