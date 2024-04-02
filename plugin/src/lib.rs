use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn test(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("test")?
        .pkgx()?
        .with_exec(vec!["pkgx", "install", "node", "bun"])?
        .with_exec(vec!["bun", "install"])?
        .with_exec(vec!["bun", "test", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn build(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("test")?
        .pkgx()?
        .with_exec(vec!["pkgx", "install", "node", "bun"])?
        .with_exec(vec!["bun", "install"])?
        .with_exec(vec!["bun", "build", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn run(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("test")?
        .pkgx()?
        .with_exec(vec!["pkgx", "install", "node", "bun"])?
        .with_exec(vec!["bun", "install"])?
        .with_exec(vec!["bun", "run", &args])?
        .stdout()?;
    Ok(stdout)
}
