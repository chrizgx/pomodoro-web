const app = new Vue({
    el: '#app',
    data: {
        studySession: 60 * 25,
        breakSession: 60 * 5,
        remainingSeconds: this.studySession,
        start: null,
        state: 'await',
        update: true,
    },
    computed: {
        remainingSecondsFix: function() {
            return this.remainingSeconds % 60 >= 10 ? this.remainingSeconds % 60 : '0' + this.remainingSeconds % 60;
        },
        percentage: function() {
            if (this.state === 'await') {
                return 0;
            } else if (this.state === 'study') {
                return 100 / this.studySession * (this.studySession - this.remainingSeconds);
            } else if (this.state === 'break') {
                return 100 / this.breakSession * this.remainingSeconds;
            }
        }
    },
    methods: {
        updateRemainingSeconds: function() {
            if (!this.update) return this.remainingSeconds;
            let difference = this.findDifference(new Date());
            if (this.state === 'study' && difference > this.studySession) {
                this.remainingSeconds = this.breakSession;
                this.updateStart();
                this.state = 'break';
                difference = this.findDifference(new Date());
            } else if (this.state === 'break' && difference > this.breakSession) {
                this.remainingSeconds = this.studySession;
                this.updateStart();
                this.state = 'study';
                difference = this.findDifference(new Date());
            }

            if (this.state === 'await') {
                this.remainingSeconds = this.studySession;
            } else if (this.state === 'study') {
                this.remainingSeconds = this.studySession - difference;
            } else if (this.state === 'break') {
                this.remainingSeconds = this.breakSession - difference;
            }

        },
        updateStart: function() {
            this.start = new Date();
        },
        findDifference: function(dateObj) {
            return Math.trunc((dateObj - this.start) / 1000);
        },
        study: function() {
            this.updateStart();
            this.state = 'study';
            this.update = true;
        },
        pause: function() {
            this.update = false;
        },
        resume: function() {
            if (this.state === 'study') {
                this.start = new Date(Date.now() - (this.studySession-this.remainingSeconds) * 1000);
            } else {
                this.start = new Date(Date.now() - (this.breakSession - this.remainingSeconds) * 1000);
            }
            this.update = true;
        },
        reset: function() {
            this.state = 'await';
            this.update = true;
        }
    }
})

setInterval(app.updateRemainingSeconds, 950);
