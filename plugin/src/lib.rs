use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn test(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("test")?
        .pkgx()?
        .with_exec(vec!["type node > /dev/null || pkgx install node"])?
        .with_exec(vec!["pkgx", "install", "bun"])?
        .with_exec(vec!["bun", "install"])?
        .with_exec(vec!["bun", "test", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn build(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("build")?
        .pkgx()?
        .with_exec(vec!["type node > /dev/null || pkgx install node"])?
        .with_packages(vec!["bun"])?
        .with_exec(vec!["bun", "install"])?
        .with_exec(vec!["bun", "build", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn run(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("run")?
        .pkgx()?
        .with_exec(vec!["type node > /dev/null || pkgx install node"])?
        .with_packages(vec!["bun"])?
        .with_exec(vec!["bun", "install"])?
        .with_exec(vec!["bun", "run", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn bunx(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("bunx")?
        .pkgx()?
        .with_exec(vec!["type node > /dev/null || pkgx install node"])?
        .with_packages(vec!["bun"])?
        .with_exec(vec!["bunx", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn install(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("install")?
        .pkgx()?
        .with_exec(vec!["type node > /dev/null || pkgx install node"])?
        .with_packages(vec!["bun"])?
        .with_exec(vec!["bun", "install", &args])?
        .stdout()?;
    Ok(stdout)
}
