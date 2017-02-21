var app = new Vue({
    el: '#app',
    data: {
        gears: [],
        time: 0,
        timer: null,
    },
    methods: {
        gear: function() {
            var t;
            if (this.gears.length == 0) {
                t = this.time;
            } else {
                t = this.time - this.gears[this.gears.length - 1].when
            }
            this.gears.push({ time: Math.round(t * 100) / 100, when: Math.round(this.time * 100) / 100 })
        },
        startTimer: function() {
            var self = this;
            this.timer = setInterval(function() {
                self.time = self.time + .1
            }, 100)
        },
        stopTimer: function() {
            clearInterval(this.timer)
        }
    },
    computed: {
        // a computed getter
        gpersec: function() {
            // `this` points to the vm instance
            if (this.gears.length == 0) {
                return 0
            } else {
                return Math.round((this.gears.length / this.gears[this.gears.length - 1].when) * 100) / 100
            }
        }
    }
})
