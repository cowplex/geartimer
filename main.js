var app = new Vue({
    el: '#app',
    data: {
        gears: [],
        time: 0,
        timer: null,
		match_time: 135,
		endgame: 15,
		driver: null,
		saved: false,
		passcode: null,
		passcode_box: null,
		notes: null
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
			this.timer = null;
        },
		reset: function() {
			this.gears = [];
			this.time = 0;
			this.timer = null;
			this.saved = false;
		},
		save_passcode: function() {
			this.passcode = this.passcode_box;
			localStorage.gear_timer_passcode = this.passcode;
			this.passcode_box = null;
		},
		save_data: function() {
			this.save_passcode();
			
			var current_data = {time:Date.now(), driver:this.driver, notes:this.notes, gears:this.gears};
			//current_data = JSON.stringify(current_data);
			//console.log(current_data);
			
			var gear_data = [];
			if(typeof(localStorage.gear_data) != "undefined")
				gear_data = JSON.parse(localStorage.gear_data);
			
			gear_data.push(current_data);
			localStorage.setItem('gear_data', JSON.stringify(gear_data));
			
			this.saved = true;
		},
		post_data: function() {
			if(typeof(localStorage.gear_data) != "undefined")
				gear_data = JSON.parse(localStorage.gear_data);
			else
				return;
			
			var xhr = new XMLHttpRequest();   // new HttpRequest instance 
			xhr.open("POST", "http://team1504.cowplex.com/2017/gear_timer.php");
		//	xhr.setRequestHeader("Content-Type", "application/json");
			//xhr.onreadystatechange = function() {//Call a function when the state changes.
			//	if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
			//		// Request finished. Do processing here.
			//	}
			//}
			xhr.send(JSON.stringify({passcode:this.passcode, data:gear_data}));
			
			/*$.ajax({
				url: 'http://team1504.cowplex.com/2017/gear_timer.php',
				data: gear_data,
				dataType: 'json',
				success: function (data) {
					console.log(data);
				},
				error: function () {
					console.log("Error occurred");
				}
			});*/
		},
		reset_data: function() {
			//localStorage.gear_timer_passcode = 
			this.passcode = null;
			//localStorage.setItem('gear_data', null);
			
			localStorage.removeItem('gear_data');
			localStorage.removeItem('gear_timer_passcode');
			
			this.reset();
		}
	},
    computed: {
        // a computed getter
        delivery_estimate: function() {
            // `this` points to the vm instance
            if (this.gears.length == 0) {
                return "?";
            } else {
                return (Math.round((this.match_time - this.endgame) * (this.gears.length / this.gears[this.gears.length - 1].when) * 100) / 100).toFixed(1);
            }
        }
    }
})
