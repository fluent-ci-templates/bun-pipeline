import { gql } from "../../deps.ts";

export const run = gql`
  query Run($command: String!, $src: String!, $bunVersion: String!) {
    run(command: $command, src: $src, bunVersion: $bunVersion)
  }
`;

export const test = gql`
  query Test($src: String!, $bunVersion: String!) {
    test(src: $src, bunVersion: $bunVersion)
  }
`;
