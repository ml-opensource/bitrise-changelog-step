# Bitrise ZX starter step

## Bash is hard
Bitrise step lib normally uses Go or Bash scripting for the step functionality.

[Google's ZX library](https://github.com/google/zx) on top of node.js makes shell scripting a lot easier.

This starter includes basic step setup including:
 - `step.sh` entrypoint for starting the zx script
 - A couple of example inputs for the Bitrise web UI in `step.yml`
 - One example output in `step.yml`

## How to use 

**1)**
Add this step manually in the bitrise.yml file:
```
workflows:
  randomWorkflow:
    steps:
      - git::https://github.com/monstar-lab-oss/reponame@main:
        inputs:
        - some_input: "no"
        is_always_run: true
```

**2)**
Change the url in `step.sh` to point to your new repo's `main.mjs` on line 16.

`zx https://raw.githubusercontent.com/monstar-lab-oss/bitrise-zx-starter-step/main/main.mjs`

## Resources

Bitrise step yml development: https://github.com/bitrise-io/bitrise/blob/master/_docs/bitrise-yml-format-spec.md
Bitrise step examples: https://github.com/bitrise-io/bitrise/tree/master/_examples


