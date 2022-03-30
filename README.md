# LazyFetch
Lazy fetch api for on scroll fetching images or any file.

```
const lf = new LazyFetch();

lf.add("./myFile");

lf.listenScroll(window, 100, ({ disconnect }) => {
    lf.fetch(5).forEach(async (val) => {
        val.then(res => res.text()).then(console.log)
    });

    if (lf.empty()) {
        disconnect();
    }
});
```
