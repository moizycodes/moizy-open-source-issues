function sleep(ms) {
    // handle non-positive number
    const delay = (typeof ms !== 'number' || ms < 0) ? 0 : ms;

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, delay);
    });
}


// test run
async function runTask() {
    await sleep(2000);
    console.log("normal delay");

    await sleep(-2000);
    console.log("negative delay");

    await sleep("string");
    console.log("invalid number delay 1");

    await sleep();
    console.log("invalid number delay 2");
}
// runTask()