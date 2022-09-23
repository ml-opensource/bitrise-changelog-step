#!/usr/bin/env zx

let numTags = await quiet($`git tag -l | wc -l`)
let divider = "------"
let dateformat = process.env.dateformat || "%Y-%m-%d %H:%M:%S"
let prettygitformat = process.env.prettygitformat || "%s (%cn)"


let changelog = {
    text: '',
    convtext: '',
    markdown: ''
}

let sections = {
    features: [],
    fixes: [],
    maintenance: [],
    format: [],
    tests: [],
    refactors: [],
    documentation: [],
    other: []
}

async function fetchCommits() {
    if(numTags > 1) {
        let latest_tag_commit = await quiet($`git rev-list --tags --skip=0 --max-count=1`)
        let latest_tag = await quiet($`git describe --abbrev=0 --tags ${latest_tag_commit}`)
        
        let previous_tag_commit = await quiet($`git rev-list --tags --skip=1 --max-count=1`)
        let previous_tag = await quiet($`git describe --abbrev=0 --tags ${previous_tag_commit}`)

        let output = await quiet($`git log --no-merges --pretty=format:${prettygitformat} --date=format:${dateformat} ${latest_tag}...${previous_tag}`)
        return output.stdout.split('\n')
    } else {
        let output = await quiet($`git log --no-merges --pretty=format:${prettygitformat} --date=format:${dateformat}`)
        return output.stdout.split('\n')
    }
}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

function formatCommit(re, commit, list) {
    let matched = commit.match(re)
    let ticket = matched.groups.ticket1 || matched.groups.ticket2
    let message = capitalizeFirstLetter(matched.groups.message.trim())

    if(ticket) {
        list.push(`${ticket} ${message}`)
    } else {
        list.push(message)
    }
}

function fillSections(commits) {
    let featureRegEx = /^(feat\((?<ticket1>.*)\)|feat|feature|feature\((?<ticket2>.*)\))\s?:(?<message>.*)$/
    let fixRegEx = /^(fix\((?<ticket1>.*)\)|fix|bugfix|bugfix\((?<ticket2>.*)\))\s?:(?<message>.*)$/
    let maintenanceRegEx = /^(chore\((?<ticket1>.*)\)|chore|build|build\((?<ticket2>.*)\))\s?:(?<message>.*)$/
    let refactorRegEx = /^(refactor\((?<ticket1>.*)\)|refactor)\s?:(?<message>.*)$/
    let formatRegEx = /^(format\((?<ticket1>.*)\)|format)\s?:(?<message>.*)$/
    let testRegEx = /^(test\((?<ticket1>.*)\)|test|tests|tests\((?<ticket2>.*)\))\s?:(?<message>.*)$/
    let docsRegEx = /^(docs\((?<ticket1>.*)\)|docs|doc|doc\((?<ticket2>.*)\))\s?:(?<message>.*)$/

    /*
    // For quick testing
    commits = [
        "feat(JRA-123): lollert (Johnny)",
        "fix: something weird happened (Johnny)",
        "fix : lolollld (Johnny)",
        "build: something weird happened (Johnny)",
        "test: something weird happened (Johnny)",
        "refactor: something weird happened (Johnny)"
    ]
    */
    
    commits.forEach(commit => {
        if(featureRegEx.test(commit)) {
            formatCommit(featureRegEx, commit, sections.features)
        } else if(fixRegEx.test(commit)) {
            formatCommit(fixRegEx, commit, sections.fixes)
        } else if(maintenanceRegEx.test(commit)) {
            formatCommit(maintenanceRegEx, commit, sections.maintenance)
        } else if(refactorRegEx.test(commit)) {
            formatCommit(refactorRegEx, commit, sections.refactors)
        } else if(formatRegEx.test(commit)) {
            formatCommit(formatRegEx, commit, sections.format)
        } else if(testRegEx.test(commit)) {
            formatCommit(testRegEx, commit, sections.tests)
        } else if(docsRegEx.test(commit)) {
            formatCommit(docsRegEx, commit, sections.documentation)
        } else {
            sections.other.push(capitalizeFirstLetter(commit))
        }
    });
}

async function buildChangelog(commits) {
    let list = []

    try {
        let latest_tag = await getTitle()
        if(latest_tag) {
            list.push(latest_tag)
            list.push(divider)
            list.push('')
        }
    } catch {
        // empty
    }

    commits.forEach((commit) => {
        list.push(capitalizeFirstLetter(commit))
    })

    let text = list.join('\n')
    changelog.text = text
}

async function buildConventionalChangelog() {
    let list = []

    try {
        let latest_tag = await getTitle()
        if(latest_tag) {
            list.push(latest_tag)
            list.push(divider)
            list.push('')
        }
    } catch {
        // empty
    }

    let featureTitle = process.env.custom_features_name || "Features"
    let fixTitle = process.env.custom_bugfixes_name || "Bugfixes"
    let maintenanceTitle = process.env.custom_maintenance_name || "Maintenance"
    let refactorTitle = process.env.custom_refactor_name || "Refactors"
    let formatTitle = process.env.custom_format_name || "Formatting"
    let testsTitle = process.env.custom_test_name || "Tests"
    let docsTitle = process.env.custom_documentation_name || "Documentation"
    let otherTitle = process.env.custom_other_name || "Other changes"

    if(sections.features.length > 0) addSection(list, sections.features, featureTitle)
    if(sections.fixes.length > 0) addSection(list, sections.fixes, fixTitle)
    if(sections.maintenance.length > 0) addSection(list, sections.maintenance, maintenanceTitle)
    if(sections.refactors.length > 0) addSection(list, sections.refactors, refactorTitle)
    if(sections.format.length > 0) addSection(list, sections.format, formatTitle)
    if(sections.tests.length > 0) addSection(list, sections.tests, testsTitle)
    if(sections.other.length > 0) addSection(list, sections.other, otherTitle)

    let text = list.join('\n')
    changelog.convtext = text
}

async function buildMarkdown() {
    let list = []

    try {
        let latest_tag = await getTitle()
        if(latest_tag) {
            list.push("#" + latest_tag)
            list.push(divider)
            list.push('')
        }
    } catch {
        // empty
    }

    let featureTitle = process.env.custom_features_name || "## 🎉 Features"
    let fixTitle = process.env.custom_bugfixes_name || "## 🐛 Bugfixes"
    let maintenanceTitle = process.env.custom_maintenance_name || "## 🔨Maintenance"
    let refactorTitle = process.env.custom_refactor_name || "## 🧹 Refactors"
    let formatTitle = process.env.custom_format_name || "## 📋 Formatting"
    let testsTitle = process.env.custom_test_name || "## 📝 Tests"
    let docsTitle = process.env.custom_documentation_name || "## 📄 Documentation"
    let otherTitle = process.env.custom_other_name || "## 📚 Other changes"

    if(sections.features.length > 0) addMarkdownSection(list, sections.features, featureTitle)
    if(sections.fixes.length > 0) addMarkdownSection(list, sections.fixes, fixTitle)
    if(sections.maintenance.length > 0) addMarkdownSection(list, sections.maintenance, maintenanceTitle)
    if(sections.refactors.length > 0) addMarkdownSection(list, sections.refactors, refactorTitle)
    if(sections.format.length > 0) addMarkdownSection(list, sections.format, formatTitle)
    if(sections.tests.length > 0) addMarkdownSection(list, sections.tests, testsTitle)
    if(sections.other.length > 0) addMarkdownSection(list, sections.other, otherTitle)

    let md = list.join('\n')
    changelog.markdown = md
}

function addSection(list, section, title) {
    list.push(title)
    list.push(divider)
    section.forEach((c) => list.push(c))
    list.push('\n')
}

function addMarkdownSection(list, section, title) {
    list.push(title)
    list.push(divider)
    section.forEach((c) => list.push(" - " + c))
    list.push('\n')
}

async function getTitle() {
    let latest_tag_commit = await quiet($`git rev-list --tags --skip=0 --max-count=1`)
    let latest_tag = await quiet($`git describe --abbrev=0 --tags ${latest_tag_commit}`)
    return latest_tag.toString().trim()
}

// Let's fetch all tags as the default git clone step, doesn't do it
try {
    await nothrow($`git fetch --tags origin refs/heads/main`)
} catch(e) {
    console.log('Failed fetching tags...')
    console.log(e.toString())
}


let commits = await fetchCommits();
fillSections(commits)
await buildChangelog(commits)
await buildMarkdown()
await buildConventionalChangelog()

console.log(changelog.text)
console.log(changelog.markdown)

// Set environment variable for bitrise
await nothrow($`envman add --key COMMIT_CHANGELOG_TEXT --value ${changelog.text}`)
await nothrow($`envman add --key COMMIT_CHANGELOG --value ${changelog.convtext}`)
await nothrow($`envman add --key COMMIT_CHANGELOG_MARKDOWN --value ${changelog.markdown}`)
await nothrow($`envman add --key COMMIT_CHANGELOG_SECTIONS --value ${JSON.stringify(sections)}`)