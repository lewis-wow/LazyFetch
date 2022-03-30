class LazyFetch {
    payloads: string[] = [];
    lastStamp: number = 0;

    /**
     * 
     * @param  {String} files
     */
    add(file: string, priority: number = null): string[] {
        if (priority === null) {
            this.payloads.push(file);
            return this.payloads;
        }

        this.payloads.splice(priority, 0, file);
        return this.payloads;
    }

    /**
     * 
     * @param  {String} file
     */
    remove(file): string[] {
        this.payloads.splice(this.payloads.indexOf(file), 1);
        return this.payloads;
    }

    /**
     * 
     * @param numberOfPayloads 
     * @param container 
     * @returns 
     */
    fetch(numberOfPayloads: Number, container: Function = LazyFetch.Map) {
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
    setPriority(file: string, priority: number): string[] {
        if (priority > this.payloads.length - 1) throw Error("Priority cannot be bigger than payloads length.");

        const priority_ = this.payloads.length - priority;

        const index = this.payloads.indexOf(file);
        [this.payloads[index], this.payloads[priority_]] = [this.payloads[priority_], this.payloads[index]];

        return this.payloads;
    }

    /**
     * 
     * @param {Map} fetches 
     * @returns Map
     */
    static Map(fetches: Map<string, Promise<string>>): Map<string, Promise<string>> {
        return fetches;
    }

    /**
     * 
     * @param {Map} fetches 
     * @returns Array
     */
    static Array(fetches: Map<string, Promise<string>>): Promise<string>[] {
        return Array.from(fetches.values());
    }

    /**
     * 
     * @param {Map} fetches 
     * @returns Array
     */
    static KeyValueArray(fetches: Map<string, Promise<string>>): [string, Promise<string>][] {
        return Array.from(fetches.entries());
    }

    /**
     * 
     * @param {Map} fetches 
     * @returns Object
     */
    static Object(fetches: Map<string, Promise<string>>): Object {
        const results = {};
        for (const [k, v] of fetches.entries()) {
            results[k] = v;
        }

        return results;
    }

    /**
     * @returns payloads length
     */
    get length(): number {
        return this.payloads.length;
    }

    /**
     * @returns payloads length
     */
    get All(): number {
        return this.length;
    }

    /**
     * @returns is payload empty
     */
    empty(): boolean {
        return this.length == 0;
    }

    /**
     * 
     * @param {Element|window|document} element 
     * @param {Number} from 
     * @param {Function} callback 
     */
    listenScroll(element: Element | Window | Document, from: number, callback: Function) {
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

export default LazyFetch;
