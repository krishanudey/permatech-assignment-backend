export async function wait(delayMs: number) {
    const p = new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, delayMs);
    });

    await p;
    return;
}
