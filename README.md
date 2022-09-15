# Git Changelog Step

## Conventional Commits-changelog
This step supports Conventional Commit formatting and parses the resulting commits into a nicely formatted changelog:

It parses the commit messages by the form:

`feat: implemented IAP` -> ` - Implemented IAP (John Doe)`

And if you supply extra context to a Jira ticket or similar:

`feat(JRA-123): implemented IAP` -> ` - JRA-123 Implemented IAP (John Doe)`

### Example of generated output `COMMIT_CHANGELOG`:
```
v1.0.1
-----

🎉 Features
-----
- Implemented IAP (John Doe)
- JRA-123 Implemented IAP (John Doe)

🐛 Bugfixes
-----
- JRA-123 Fixed unintended bug (John Doe)

🤷 Other changes
-----
 - Initial commit (John Doe)
```

It also generates a `COMMIT_CHANGELOG_MARKDOWN` which is Github/Slack markdown friendly.

### Options

You can override the formatting of each section via the following step inputs:
| Step input key  | Default value |
|----|----|
|`custom_features_name` | 🎉 Features |
|`custom_bugfixes_name` | 🐛 Bugfixes |
|`custom_maintenance_name` | 🔨Improvements |
|`custom_format_name` | ⚒ Formatting |
|`custom_test_name` | 📝 Tests |
|`custom_refactor_name` | 🧹 Refactors |
|`custom_documentation_name` | 📄 Documentation |
|`custom_other_name` | 🤷 Other changes |     

## Normal changelog
Generates a changelog message from git commit for use in other steps. It pulls every commit message between the last two tags or if less than 2 tags are found, all commit messages.

### Example of generated output `COMMIT_CHANGELOG`:
```
 - Cleaned up the code (John Doe)
 - Initial commit (John Doe)
```

## Input options

Commit messages are pulled via: `changelog="$(git log --no-merges --pretty=format:"$prettygitformat" --date=format:"$dateformat" $latest_tag...$previous_tag)"`.
Which enables custom commit message formatting via the step input: `pretty_git_format`. [Documentation on `git log` pretty formats can be found here](https://git-scm.com/docs/pretty-formats)
You can also override the date format used in `git log` via the step input: `custom_dateformat`

## How to use this Step

Can be run directly with the [bitrise CLI](https://github.com/bitrise-io/bitrise),
just `git clone` this repository, `cd` into it's folder in your Terminal/Command Line
and call `bitrise run test`.

*Check the `bitrise.yml` file for required inputs which have to be
added to your `.bitrise.secrets.yml` file!*

Step by step:

1. Open up your Terminal / Command Line
2. `git clone` the repository
3. `cd` into the directory of the step (the one you just `git clone`d)
5. Create a `.bitrise.secrets.yml` file in the same directory of `bitrise.yml` - the `.bitrise.secrets.yml` is a git ignored file, you can store your secrets in
6. Check the `bitrise.yml` file for any secret you should set in `.bitrise.secrets.yml`
  * Best practice is to mark these options with something like `# define these in your .bitrise.secrets.yml`, in the `app:envs` section.
7. Once you have all the required secret parameters in your `.bitrise.secrets.yml` you can just run this step with the [bitrise CLI](https://github.com/bitrise-io/bitrise): `bitrise run test`

An example `.bitrise.secrets.yml` file:

```
envs:
- A_SECRET_PARAM_ONE: the value for secret one
- A_SECRET_PARAM_TWO: the value for secret two
```

## How to create your own step

1. Create a new git repository for your step (**don't fork** the *step template*, create a *new* repository)
2. Copy the [step template](https://github.com/bitrise-steplib/step-template) files into your repository
3. Fill the `step.sh` with your functionality
4. Wire out your inputs to `step.yml` (`inputs` section)
5. Fill out the other parts of the `step.yml` too
6. Provide test values for the inputs in the `bitrise.yml`
7. Run your step with `bitrise run test` - if it works, you're ready

__For Step development guidelines & best practices__ check this documentation: [https://github.com/bitrise-io/bitrise/blob/master/_docs/step-development-guideline.md](https://github.com/bitrise-io/bitrise/blob/master/_docs/step-development-guideline.md).

**NOTE:**

If you want to use your step in your project's `bitrise.yml`:

1. git push the step into it's repository
2. reference it in your `bitrise.yml` with the `git::PUBLIC-GIT-CLONE-URL@BRANCH` step reference style:

```
- git::https://github.com/user/my-step.git@branch:
   title: My step
   inputs:
   - my_input_1: "my value 1"
   - my_input_2: "my value 2"
```

You can find more examples of step reference styles
in the [bitrise CLI repository](https://github.com/bitrise-io/bitrise/blob/master/_examples/tutorials/steps-and-workflows/bitrise.yml#L65).

## How to contribute to this Step

1. Fork this repository
2. `git clone` it
3. Create a branch you'll work on
4. To use/test the step just follow the **How to use this Step** section
5. Do the changes you want to
6. Run/test the step before sending your contribution
  * You can also test the step in your `bitrise` project, either on your Mac or on [bitrise.io](https://www.bitrise.io)
  * You just have to replace the step ID in your project's `bitrise.yml` with either a relative path, or with a git URL format
  * (relative) path format: instead of `- original-step-id:` use `- path::./relative/path/of/script/on/your/Mac:`
  * direct git URL format: instead of `- original-step-id:` use `- git::https://github.com/user/step.git@branch:`
  * You can find more example of alternative step referencing at: https://github.com/bitrise-io/bitrise/blob/master/_examples/tutorials/steps-and-workflows/bitrise.yml
7. Once you're done just commit your changes & create a Pull Request


## Share your own Step

You can share your Step or step version with the [bitrise CLI](https://github.com/bitrise-io/bitrise). If you use the `bitrise.yml` included in this repository, all you have to do is:

1. In your Terminal / Command Line `cd` into this directory (where the `bitrise.yml` of the step is located)
1. Run: `bitrise run test` to test the step
1. Run: `bitrise run audit-this-step` to audit the `step.yml`
1. Check the `share-this-step` workflow in the `bitrise.yml`, and fill out the
   `envs` if you haven't done so already (don't forget to bump the version number if this is an update
   of your step!)
1. Then run: `bitrise run share-this-step` to share the step (version) you specified in the `envs`
1. Send the Pull Request, as described in the logs of `bitrise run share-this-step`

That's all ;)
