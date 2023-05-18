const app = new Vue({
    el: '#app',
    data: {
        studySession: 5 * 1,
        breakSession: 10 * 1,
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
            const difference = this.findDifference(new Date());
            if (this.state === 'study' && difference > this.studySession) {
                this.remainingSeconds = this.breakSession;
                this.updateStart();
                this.state = 'break';
                difference = this.findDifference(new Date());
            } else if (this.state === 'break' && difference > this.breakSession) {
                this.remainingSeconds = this.studySession;
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
        }
    }
})

setInterval(app.updateRemainingSeconds, 950);