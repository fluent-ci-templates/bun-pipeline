import { gql } from "../../deps.ts";

export const run = gql`
  query Run($command: String!, $src: String!) {
    run(command: $command, src: $src)
  }
`;

export const test = gql`
  query Test($src: String!) {
    test(src: $src)
  }
`;
