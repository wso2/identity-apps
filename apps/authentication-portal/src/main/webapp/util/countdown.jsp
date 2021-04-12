<%--
  ~ Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
--%>

<script>

    const ZERO = 0;
    const THOUSAND_MILLISECONDS = 1000;
    const ONE_MINUTE = 60; // 1 * 60 Seconds
    const ONE_HOUR = 60; // 1 * 60 minutes
    const ONE_DAY = 24; // Hours

    /**
     * This function will give you a new instance of a Countdown object.
     * You can create the instance like for example:-
     *
     *      const countdown1 = new Countdown(Countdown.seconds(5), function () {
     *          // On done
     *      }, function (time) {
     *          // On tick
     *      }, "MY_TIMER").start();
     *
     *      const countdown2 = new Countdown(Countdown.seconds(5), function () {
     *          // On done
     *      }, null, "MY_TIMER").start();
     *
     *      const countdown3 = new Countdown(Countdown.seconds(5), function () {
     *          // On done
     *      }).start();
     *
     *
     * How can you utilize the onTick callback to do stuff?
     *
     * If you want to trigger some action on a specific time, what you can do is
     * check each time component state or in relative time. For example:-
     *
     * #1 Time state condition check
     * -----------------------------
     * Now say for example you set a countdown of 5 minutes
     * and want to run some code after 2 minute and 15 seconds
     * of the countdown. You can have a condition like:-
     *
     *      if (time.minutes === 2 && time.seconds === 45)
     *          # will execute once.
     *      if (time.minutes <= 2 && time.seconds <= 45)
     *          # will execute until finished.
     *
     * #2 Total time state relative check
     * ----------------------------------
     * Following the same example you can place a condition like below:-
     *
     *      const checkpoint = Countdown.minutes(2) + Countdown.seconds(15);
     *
     *      if (time.total === checkpoint)
     *          # will execute once
     *      if (time.total < checkpoint)
     *          # will execute until finished
     *
     * @param time {number} as minutes/seconds/hours.
     * @param onDone {function} called when countdown ends.
     * @param onTick {function({total: number, hours: number, seconds: number, minutes: number, days: number})}
     * @param name {String} a descriptive name for the timer.
     */
    function Countdown(
        time = ZERO,
        onDone = Countdown.noop,
        onTick = Countdown.noop,
        name = "COUNTDOWN"
    ) {
        this.until = new Date(Date.now() + time);
        this.onTick = onTick;
        this.onDone = onDone;
        this.name = name;
        this._enableLogs = false;
        this._timerInterval = null;
        this._running = false;
    }

    /**
     * Starts the countdown. If it's running calling this
     * multiple times won't reset the countdown.
     */
    Countdown.prototype.start = function () {
        if (!this._running) {
            // Since we have to use setInterval here we need to make
            // sure the scope of 'this' is bind to callee.
            this._timerInterval = setInterval(function () {
                this.tick();
            }.bind(this), THOUSAND_MILLISECONDS);
            this._running = true;
            this.log("Countdown: " + this.name + " started.");
        }
        return this;
    };

    /**
     * Stops the countdown. When not running calling this
     * will have no affect to the countdown instance.
     */
    Countdown.prototype.stop = function () {
        if (this._running) {
            clearInterval(this._timerInterval);
            this._running = false;
            if (this.onDone) {
                this.onDone();
            }
            this.log("Countdown " + this.name + " stopped.");
        }
    };

    Countdown.prototype.log = function (message) {
        if (this._enableLogs && console && console.debug && message) {
            console.debug(message);
        }
    };

    /**
     * Returns the remaining time as days, hours, minutes, and
     * seconds. It also include a total sum of epoch seconds
     * left (multiplied by 1000).
     */
    Countdown.prototype.getRemainingTime = function () {
        const total = Date.parse(this.until.toString()) - Date.parse(new Date().toString());
        const seconds = Math.floor((total / THOUSAND_MILLISECONDS) % ONE_MINUTE);
        const minutes = Math.floor((total / THOUSAND_MILLISECONDS / ONE_MINUTE) % ONE_MINUTE);
        const hours = Math.floor((total / (THOUSAND_MILLISECONDS * ONE_MINUTE * ONE_MINUTE)) % ONE_DAY);
        const days = Math.floor(total / (THOUSAND_MILLISECONDS * ONE_MINUTE * ONE_MINUTE * ONE_DAY));
        return { total, days, hours, minutes, seconds };
    };

    /**
     * Calls every second when the timer is started.
     */
    Countdown.prototype.tick = function () {
        const time = this.getRemainingTime();
        if (this.onTick) {
            this.onTick(time);
        }
        if (time.total <= ZERO) {
            this.stop();
        }
    };

    Countdown.seconds = function (input) {
        return (input * ONE_MINUTE * THOUSAND_MILLISECONDS) / ONE_MINUTE;
    };

    Countdown.minutes = function (input) {
        return input * ONE_MINUTE * THOUSAND_MILLISECONDS;
    };

    Countdown.hours = function (input) {
        return input * ONE_MINUTE * THOUSAND_MILLISECONDS * ONE_HOUR;
    };

    Countdown.days = function (input) {
        return (input * ONE_MINUTE * THOUSAND_MILLISECONDS) * ONE_HOUR * ONE_DAY;
    };

    /**
     * @param time {{
     *          total: number,
     *          hours: number,
     *          seconds: number,
     *          minutes: number,
     *          days: number
     *       }}
     */
    Countdown.timeToReadable = function (time) {

        let str = ""; // 1 days(s), 1 hour(s), 1 minute(s) and 30 second(s)
        let hasPrevious = false;

        if (time.days > 0) {
            if (time.days === 1) {
                str += "1 day";
            } else {
                str += String(time.days) + " days";
            }
            hasPrevious = true;
        }

        if (time.hours > 0) {
            if (hasPrevious) str += ", ";
            if (time.hours === 1) {
                str += "1 hour";
            } else {
                str += String(time.hours) + " hours";
            }
            hasPrevious = true;
        }

        if (time.minutes > 0) {
            if (hasPrevious) str += ", ";
            if (time.minutes === 1) {
                str += "1 minute";
            } else {
                str += String(time.minutes) + " minutes";
            }
            hasPrevious = true;
        }

        if (time.seconds > 0) {
            if (hasPrevious) str += ", and ";
            if (time.seconds === 1) {
                str += "1 second";
            } else {
                str += String(time.seconds) + " seconds";
            }
        }

        if (!str) return "now";
        return "in " + str;

    };

    Countdown.noop = function () {
        // No operations
    };

</script>
