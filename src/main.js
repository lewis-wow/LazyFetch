class LazyFetch {
    payloads = [];
    lastStamp = 0;

    /**
     * 
     * @param  {String} files
     */
    add(file, priority = null) {
        if (priority === null) {
            return this.payloads.push(file);
        }

        return this.payloads.splice(priority, 0, file);
    }

    /**
     * 
     * @param  {String} file
     */
    remove(file) {
        this.payloads.splice(this.payloads.indexOf(file), 1);
    }

    /**
     * 
     * @param {Number} numberOfPayloads 
     */
    fetch(numberOfPayloads, container = LazyFetch.Map) {
        const results = new Map();

        if (this.payloads.length < numberOfPayloads) {
            numberOfPayloads = this.payloads.length;
        }

        for (let i = 0; i < numberOfPayloads; i++) {
            const file = this.payloads.pop();
            results.set(file, window.fetch(file));
        }

        return results.size ? container(results) : null;
    }

    /**
     * 
     * @param {String} file 
     * @param {Number} priority 
     */
    setPriority(file, priority) {
        if (priority > this.payloads.length - 1) throw Error("Priority cannot be bigger than payloads length.");

        const priority_ = this.payloads.length - priority;

        const index = this.payloads.indexOf(file);
        [payloads[index], payloads[priority_]] = [payloads[priority_], payloads[index]];
    }

    /**
     * 
     * @param {Map} fetches 
     * @returns Map
     */
    static Map(fetches) {
        return fetches;
    }

    /**
     * 
     * @param {Map} fetches 
     * @returns Array
     */
    static Array(fetches) {
        return Array.from(fetches.values());
    }

    /**
     * 
     * @param {Map} fetches 
     * @returns Array
     */
    static KeyValueArray(fetches) {
        return Array.from(fetches.entries());
    }

    /**
     * 
     * @param {Map} fetches 
     * @returns Object
     */
    static Object(fetches) {
        const results = {};
        for (const [k, v] of fetches.entries()) {
            results[k] = v;
        }

        return results;
    }

    /**
     * @returns payloads length
     */
    get length() {
        return this.payloads.length;
    }

    /**
     * @returns payloads length
     */
    get All() {
        return this.length;
    }

    /**
     * @returns is payload empty
     */
    empty() {
        return this.length == 0;
    }

    /**
     * 
     * @param {Element|window|document} element 
     * @param {Number} from 
     * @param {Function} callback 
     */
    listenScroll(element, from, callback) {
        const eventCallback = (e) => {
            if (document.body.scrollTop > from + this.lastStamp || document.documentElement.scrollTop > from + this.lastStamp) {
                this.lastStamp += from;
                return callback({
                    disconnect() {
                        element.removeEventListener("scroll", eventCallback);
                    }
                });
            }
        };
        element.addEventListener("scroll", eventCallback);
    }

}
