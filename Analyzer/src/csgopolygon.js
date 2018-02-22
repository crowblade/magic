// ==UserScript==
// @name            csgodouble.com - automated
// @description     An script that automates csgodouble.com betting using martingale system.
// @namespace       automated@mole
// @version         1.40
// @run-at          document-end
// @grant           none

'use strict';

var debug = false;
var stop_on_min_balance = false;
var base_bet = 5;
var default_color = 'red';
var default_method = 'martingale';
var initial_bet = 5;
var afterparty = false;
var afterpartyactive = false;
var playgreen = 3;
var samecolorbet = 0;
var maxsamecolor = 0;
var trainchanged = false;

var colors = {
    'green': [0],
    'red': [1, 2, 3, 4, 5, 6, 7],
    'black': [8, 9, 10, 11, 12, 13, 14]
};

var balance = document.getElementById('balance_r');
var roll_history = document.getElementById('past');
var bet_input = document.getElementById('betAmount');
var bet_buttons = {
    'green': document.getElementById('panel0-0-b').childNodes[1].childNodes[1],
    'red': document.getElementById('panel11-7-b').childNodes[1].childNodes[1],
    'black': document.getElementById('panel8-14-b').childNodes[1].childNodes[1]
};

Array.prototype.equals = function(array) {
    if (!array) {
        return false;
    }

    if (this.length != array.length) {
        return false;
    }

    for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i])) {
                return false;
            }
        } else if (this[i] != array[i]) {
            return false;
        }
    }
    return true;
};

Object.defineProperty(Array.prototype, "equals", {enumerable: false});


function Automated() {
	var self = this;

    this.running = false;
    this.game = null;

    this.debug = debug;
    this.stop_on_min_balance = stop_on_min_balance;
	this.initial_bet = base_bet;
	this.afterparty = afterparty;
	this.afterpartyactive = afterpartyactive;
	this.playgreen = playgreen;
	this.samecolorbet = samecolorbet;
	this.maxsamecolor = maxsamecolor;
	this.trainchanged = trainchanged;

    this.base_bet = base_bet;
    this.default_color = default_color;
    this.default_method = default_method;
    this.method = this.default_method;
    this.old_method = '';
    this.color = 'rainbow';
    this.old_base = 0;
    this.balance = 0;
    this.last_bet = 0;
    this.bet_history = [];
    this.min_balance = 0;
    this.starting_balance = 0;
    this.biggestbet = 0;
    this.minreached = 0;
    this.last_color = null;
    this.last_result = null;
    this.history = [];
    this.waiting_for_bet = false;

    this.stats = {
        'wins': 0,
        'losses': 0,
        'profit': 0,
        'biggestbet': 0,
        'minreached': 0
    };

    var menu = document.createElement('div');
    menu.innerHTML = '' +
        '<div class="row">' +
            '<div class="col-lg-9">' +
                '<h2>CSGO BetBot <small>by crow</small></h2>' +
                '<div class="form-group">' +
                    '<div class="btn-group">' +
                        '<button type="button" class="btn btn-success" id="automated-start" disabled>Start</button>' +
                        '<button type="button" class="btn btn-warning" id="automated-stop" disabled>Pause</button>' +
                        '<button type="button" class="btn btn-danger" id="automated-abort" disabled>Abort</button>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group">' +
                    '<div class="btn-group">' +
                        '<button type="button" class="btn btn-default" id="automated-martingale" ' + (this.method === 'martingale' ? 'disabled' : '') + '>Martingale</button>' +
                        '<button type="button" class="btn btn-default" id="automated-great-martingale" ' + (this.method === 'great martingale' ? 'disabled' : '') + '>Great Martingale</button>' +
                        '<button type="button" class="btn btn-default" id="automated-dalembert" ' + (this.method === 'dalembert' ? 'disabled' : '') + '>D\'alembert</button>' +
                        '<button type="button" class="btn btn-default" id="automated-bet-green" ' + (this.method === 'green' ? 'disabled' : '') + '>Green (Fibonacci)</button>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group automated-hide-on-green">' +
                    '<div class="btn-group">' +
                        '<button type="button" class="btn btn-default" id="automated-red" ' + (this.color === 'red' ? 'disabled' : '') + '>Red</button>' +
                        '<button type="button" class="btn btn-default" id="automated-black" ' + (this.color === 'black' ? 'disabled' : '') + '>Black</button>' +
                        '<button type="button" class="btn btn-default" id="automated-rainbow" ' + (this.color === 'rainbow' ? 'disabled' : '') + '>Rainbow</button>' +
                        '<button type="button" class="btn btn-default" id="automated-random" ' + (this.color === 'random' ? 'disabled' : '') + '>Random</button>' +
                        '<button type="button" class="btn btn-default" id="automated-last" ' + (this.color === 'last' ? 'disabled' : '') + '>Last winning</button>' +
                        '<button type="button" class="btn btn-default" id="automated-raintrain" ' + (this.color === 'raintrain' ? 'disabled' : '') + '>Rainbow Trains</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="col-lg-3">' +
                '<h3>Statistics</h3>' +
                '<p><b>Wins:</b> <span id="automated-stats-wins">' + this.stats.wins + '</span></p>' +
                '<p><b>Losses:</b> <span id="automated-stats-loses">' + this.stats.losses + '</span></p>' +
                '<p><b>Profit:</b> <span id="automated-stats-balance">' + this.stats.profit + '</span></p>' +
                '<p><b>Biggest Bet:</b> <span id="automated-stats-biggestbet">' + this.stats.biggestbet + '</span></p>' +
                '<p><b>Min Reached:</b> <span id="automated-stats-minreached">' + this.stats.minreached + '</span></p>' +
            '</div>' +
        '</div>' +
        '<div class="form-group">' +
            '<div class="input-group">' +
                '<div class="input-group-addon">Base value</div>' +
                '<input type="number" class="form-control" id="automated-base-bet">' +
            '</div>' +
        '</div>' +
        '<div class="form-group">' +
            '<div class="input-group">' +
                '<div class="input-group-addon">Keep balance above</div>' +
                '<input type="number" class="form-control" value="0" id="automated-min-balance">' +
            '</div>' +
        '</div>' +
        '<div class="checkbox">' +
            '<label><input class="" id="automated-stop-on-min-balance" type="checkbox" ' + (this.stop_on_min_balance ? 'checked' : '') + '> Stop on minimal balance (If checked the bot will stop after getting close to minimal balance, otherwise it will continue starting on base)</label>' +
        '</div>' +
        '<div class="checkbox">' +
    		'<label><input class="" id="automated-afterparty" type="checkbox" ' + (this.afterparty ? 'checked' : '') + '> Afterparty: If green hits, play green again the next 3 rounds with low base_bet </label>' +
    	'</div>';
    document.getElementsByClassName('well text-center')[0].appendChild(menu);

    this.menu = {
            'start': document.getElementById('automated-start'),
            'stop': document.getElementById('automated-stop'),
            'abort': document.getElementById('automated-abort'),
            'basebet': document.getElementById('automated-base-bet'),
            'minbalance': document.getElementById('automated-min-balance'),
            'afterparty' : document.getElementById('automated-afterparty'),
            'stoponminbalance': document.getElementById('automated-stop-on-min-balance'),
            'red': document.getElementById('automated-red'),
            'black': document.getElementById('automated-black'),
            'rainbow': document.getElementById('automated-rainbow'),
            'random': document.getElementById('automated-random'),
            'last': document.getElementById('automated-last'),
            'raintrain': document.getElementById('automated-raintrain'),
            'statistics': {
                'wins': document.getElementById('automated-stats-wins'),
                'losses': document.getElementById('automated-stats-loses'),
                'profit': document.getElementById('automated-stats-balance'),
                'biggestbet': document.getElementById('automated-stats-biggestbet'),
                'minreached': document.getElementById('automated-stats-minreached')
            },
    		'safebetamount': document.getElementById('automated-safe-bet-amount'),
            'martingale': document.getElementById('automated-martingale'),
            'greatmartingale': document.getElementById('automated-great-martingale'),
            'betgreen': document.getElementById('automated-bet-green'),
            'dalembert': document.getElementById('automated-dalembert'),
            'hideongreen': document.getElementsByClassName('automated-hide-on-green')
        };

    this.updater = setInterval(function() { // Update every 2 seconds
        if (!self.running) {
            if (self.updateAll()) {				
				if (self.menu.stop.disabled && self.menu.start.disabled) {
					self.menu.start.disabled = false;
                    self.menu.basebet.value = self.base_bet;
					self.starting_balance = self.balance;
				}
            }
        }
    }, 2 * 1000);

this.menu.start.onclick = function() {
    	
        self.start();
    };

    this.menu.stop.onclick = function() {
        self.stop();
    };

    this.menu.abort.onclick = function() {
        self.stop(true);
    };

    this.menu.basebet.onchange = function() {
        var value = parseInt(self.menu.basebet.value);
        if (!isNaN(value)) {
            self.base_bet = value;
            self.initial_bet = value;
        }
    };

    this.menu.minbalance.onchange = function() {
        var value = parseInt(self.menu.minbalance.value);
        if (!isNaN(value)) {
            self.min_balance = value;
        }
    };

    this.menu.stoponminbalance.onchange = function() {
        self.stop_on_min_balance = self.menu.stoponminbalance.checked;
    };
	
	this.menu.afterparty.onchange = function() {
		self.afterparty = self.menu.afterparty.checked;
	};

    // WTF is this shit below? >,.,<

    this.menu.black.onclick = function() {
    	self.menu.raintrain.disabled = false;
        self.menu.rainbow.disabled = false;
        self.menu.black.disabled = true;
        self.menu.red.disabled = false;
        self.menu.random.disabled = false;
        self.menu.last.disabled = false;
        self.color = 'black';
        self.log('Current mode: black');
    };

    this.menu.red.onclick = function() {
    	self.menu.raintrain.disabled = false;
        self.menu.rainbow.disabled = false;
        self.menu.black.disabled = false;
        self.menu.red.disabled = true;
        self.menu.random.disabled = false;
        self.menu.last.disabled = false;
        self.color = 'red';
        self.log('Current mode: red');
    };

    this.menu.rainbow.onclick = function() {
    	self.menu.raintrain.disabled = false;
        self.menu.rainbow.disabled = true;
        self.menu.black.disabled = false;
        self.menu.red.disabled = false;
        self.menu.random.disabled = false;
        self.menu.last.disabled = false;
        self.color = 'rainbow';
        self.log('Current mode: rainbow');
    };

    this.menu.random.onclick = function() {
    	self.menu.raintrain.disabled = false;
        self.menu.rainbow.disabled = false;
        self.menu.black.disabled = false;
        self.menu.red.disabled = false;
        self.menu.random.disabled = true;
        self.menu.last.disabled = false;
        self.color = 'random';
        self.log('Current mode: random');
    };

    this.menu.last.onclick = function() {
    	self.menu.raintrain.disabled = false;
        self.menu.rainbow.disabled = false;
        self.menu.black.disabled = false;
        self.menu.red.disabled = false;
        self.menu.random.disabled = false;
        self.menu.last.disabled = true;
        self.color = 'last';
        self.log('Current mode: last');
    };
    
    this.menu.raintrain.onclick = function() {
    	self.menu.raintrain.disabled = true;
        self.menu.rainbow.disabled = false;
        self.menu.black.disabled = false;
        self.menu.red.disabled = false;
        self.menu.random.disabled = false;
        self.menu.last.disabled = false;
        self.color = 'raintrain';
        self.log('Current mode: Rainbow Trains');
    };

    this.menu.martingale.onclick = function() {
        self.menu.martingale.disabled = true;
        self.menu.greatmartingale.disabled = false;
        self.menu.betgreen.disabled = false;
        self.menu.dalembert.disabled = false;
        for (var i = 0; i < self.menu.hideongreen.length; i++) {
            self.menu.hideongreen[i].style.display = 'block';
        }
        self.method = 'martingale';
        self.log('Current method: Martingale');
    };

    this.menu.greatmartingale.onclick = function() {
        self.menu.martingale.disabled = false;
        self.menu.greatmartingale.disabled = true;
        self.menu.betgreen.disabled = false;
        self.menu.dalembert.disabled = false;
        for (var i = 0; i < self.menu.hideongreen.length; i++) {
            self.menu.hideongreen[i].style.display = 'block';
        }
        self.method = 'great martingale';
        self.log('Current method: Great martingale');
    };

    this.menu.dalembert.onclick = function() {
        self.menu.martingale.disabled = false;
        self.menu.greatmartingale.disabled = false;
        self.menu.betgreen.disabled = false;
        self.menu.dalembert.disabled = true;
        for (var i = 0; i < self.menu.hideongreen.length; i++) {
            self.menu.hideongreen[i].style.display = 'block';
        }
        self.method = 'dalembert';
        self.log('Current method: D\'alembert');
    };

    this.menu.betgreen.onclick = function() {
        self.menu.martingale.disabled = false;
        self.menu.greatmartingale.disabled = false;
        self.menu.betgreen.disabled = true;
        self.menu.dalembert.disabled = false;
        for (var i = 0; i < self.menu.hideongreen.length; i++) {
            self.menu.hideongreen[i].style.display = 'none';
        }
        self.method = 'green';
        self.log('Current method: Bet green');
    };

//    setInterval(function() {
//        if(!WS) {
//            self.log('Reconnecting...');
//            connect();
//        }
//    }, 5000);
}

Automated.prototype.updateBalance = function() {
    this.balance = parseInt(balance.textContent);

    if (isNaN(this.balance)) {
        this.log('Error getting current balance!');
        return false;
    }

    if (this.debug) { this.logdebug('Balance updated: ' + this.balance); }
    return true;
};

Automated.prototype.updateHistory = function() {
    var self = this;
    this.history = [];

    for (var i = 0; i < roll_history.childNodes.length; i++) {
        var roll = parseInt(roll_history.childNodes[i].textContent);

        if (!isNaN(roll)) {
            if (colors.green.indexOf(roll) !== -1) {
                self.history.push('green');
            } else if (colors.red.indexOf(roll) !== -1) {
                self.history.push('red');
            } else {
                self.history.push('black');
            }
        }
    }

    if (this.debug) { this.logdebug('History updated: ' + this.history.map(function(value) { return value; }).join(', ')); }
    return this.history.length === 10;
};

Automated.prototype.updateStats = function() {
    this.stats.profit = parseInt(this.balance) - parseInt(this.starting_balance);
    this.menu.statistics.wins.innerHTML = this.stats.wins;
    this.menu.statistics.losses.innerHTML = this.stats.losses;
    this.menu.statistics.profit.innerHTML = this.stats.profit;
    this.menu.statistics.biggestbet.innerHTML = this.stats.biggestbet;
    this.menu.statistics.minreached.innerHTML = this.stats.minreached;
    return true;
};

Automated.prototype.updateAll = function() {
    return this.updateBalance() && this.updateHistory() && this.updateStats();
};

Automated.prototype.bet = function(amount, color) {
	var self = this;
    color = color || this.color || this.default_color;

    if (color === 'rainbow') {
        if (this.last_color) {
            color = (this.last_color === 'red' ? 'black' : 'red');
        } else {
            color = this.default_color;
        }
    } else if (color === 'random') {
        color = 'red';
        if ((Math.random() * (1 - 0.1) + 0.1) > 0.5) {
            color = 'black';
        }
    } else if (color === 'last') {
        color = this.history[this.history.length - 1];
    } else if (color === 'raintrain') {
    	if(this.samecolorbet === 0) {
    		// Start new train
    		this.maxsamecolor = 3 + parseInt((Math.random() * (3 - 1) + 1));
    		this.log('New Train. Length: ' + this.maxsamecolor);
    		this.samecolorbet++;
    		var lastc = this.last_color;
    		color = (lastc === 'red' ? 'black' : 'red');
    	}
    	else {
    		// Train going currently
    		if(this.samecolorbet < this.maxsamecolor) {
    			this.samecolorbet++;
    			if (this.last_color) {
    	            color = (this.last_color === 'red' ? 'red' : 'black');
    	        } else {
    	            color = this.default_color;
    	        }
    			var toohigh = this.base_bet;
    			for(var i = 0; i < 4; i++) {
    				toohigh = toohigh * 2;
    			}
    			if(!this.trainchanged && (amount === toohigh) && this.samecolorbet >= 2) {
    				// Bet too high and didn't switch recently, change color now
    				this.log('Bet too high. Switching color.')
    				color = (color === 'red' ? 'black' : 'red');
    				this.trainchanged = true;
    			}
    			this.log('Betting Number ' + this.samecolorbet + ' of ' + this.maxsamecolor + ' on current train.')
    		}
    		else {
    			// Train ending
    			this.log('Train ending.')
    			this.maxsamecolor = 0;
    			this.samecolorbet = 0;
    			this.trainchanged = false;
//    			this.maxsamecolor = 4 + parseInt((Math.random() * (5 - 1) + 1));
//        		this.log('Trainlength: ' + this.maxsamecolor);
//        		this.samecolorbet++;
        		var lastc = this.last_color;
        		color = (lastc === 'red' ? 'red' : 'black');
    		}
    	}
    }
    
    if (this.balance - amount < this.min_balance) {
        this.log('Reached minimal balance!');
        this.last_result = 'reached min balance';
        self.stats.minreached += 1;
        if (this.stop_on_min_balance || this.balance - this.base_bet < this.min_balance) {
            this.stop();
        }
        this.waiting_for_bet = false;
        return false;
    }  

    bet_input.value = amount;

    if (!bet_buttons[color].disabled) {
        var old_balance = self.balance;
        this.log('Betting ' + amount + ' on ' + color);
        if (!self.simulation) {
            bet_buttons[color].click();
            var checker = setInterval(function() {
                if (!bet_buttons[color].disabled) {
                    clearInterval(checker);
                    setTimeout(function() {
                        if (self.updateBalance() && self.balance === old_balance) {
                            if (!self.game) { return false; }
                            self.log('Bet rejected, retrying...');
                            self.bet(amount, color);
                        } else {
                            if (self.debug) { self.logdebug('Bet accepted!'); }
                            self.last_bet = amount;
                            if(amount > self.stats.biggestbet) {
                            	self.stats.biggestbet = amount;
                            }
                            self.bet_history.push(amount);
                            self.last_color = color;
                            self.waiting_for_bet = false;
                            return true;
                        }
                    }, 2500);
                }
            }, 1000);
        } else {
            self.bet_history.push(amount);
            self.last_bet = amount;
            self.last_color = color;
            self.waiting_for_bet = false;
            return true;
        }
    } else {
        if (!self.game) { return false; }
        self.log('Button disabled, retrying...');
        setTimeout(function() { self.bet(amount, color) }, (Math.random() * 3 + 2).toFixed(3) * 1000);
    }
};

Automated.prototype.play = function() {
    var self = this;

    if (this.game !== null) {
        if (this.debug) { this.logdebug('Tried to reinitialize running game!'); }
        return false;
    }

    this.game = setInterval(function() {
        var history = self.history;
        if (!self.waiting_for_bet && self.updateAll() && !history.equals(self.history)) {
        	console.log('Last roll: ' + self.history[self.history.length - 1]);
            self.waiting_for_bet = true;
            if (self.last_color === null) {
                self.bet(self.base_bet);
            } else if (self.last_color === self.history[self.history.length - 1]) {
                self.last_result = 'win';
                self.log('Win!');
                self.stats.wins += 1;
                self.old_base = self.base_bet;
                self.old_method = self.method;
                if (self.old_method === 'dalembert') {
                    if (self.last_bet > self.old_base) {
                        self.bet(self.last_bet - 1);
                    } else {
                        self.bet(self.base_bet);
                    }
                } else {
                    self.bet(self.base_bet);
                }
            } else {
                self.last_result = 'lose';
                self.log('Lose!');
                self.stats.losses += 1;
                if (self.old_method === 'martingale') {
                    self.bet(self.last_bet * 2);
                } else if (self.old_method === 'great martingale') {
                    self.bet(self.last_bet * 2 + self.initial_bet);
                } else if (self.old_method === 'green') {
                    var bet_value = 0;
                    if (self.bet_history[self.bet_history.length - 1] === 1) {
                        if (self.bet_history[self.bet_history.length - 2] === 1) {
                            bet_value = 2;
                        } else {
                            bet_value = 1;
                        }
                    } else {
                        bet_value = self.bet_history[self.bet_history.length - 1] + self.bet_history[self.bet_history.length - 2];
                    }
                    self.bet(bet_value, 'green');
                } else if (self.old_method === 'dalembert') {
                    self.bet(self.last_bet + 1);
                }
            }
            // Afterparty
//            var last_color = '';
//            last_color = this.history[this.history.length - 1];
            if(this.afterparty && (self.last_color === 'green' || this.afterpartyactive)) {
            	// play next three times green
            	this.log('Afterparty! Betting on green...')
            	this.playgreen--;
            	if(this.playgreen > 0) {
            		this.afterpartyactive = true;
            		self.bet(initial_bet, 'green');
            	}
            	else {
            		this.log('Afterparty over.')
            		this.afterpartyactive = false;
            		this.playgreen = 3;
            	}
            }
        }
    }, 2 * 1000);

    return true;
};

Automated.prototype.start = function() {
	
    this.initial_bet = this.base_bet;
    
    // Actual start
    this.old_base = this.base_bet;
    this.old_method = this.method;
    if (this.updateAll()) {
        if (this.last_result === 'lose') {
            this.running = true;
            if (this.old_method === 'martingale') {
                this.bet(this.last_bet * 2);
            } else if (this.old_method === 'great martingale') {
                this.bet(this.last_bet * 2 + this.old_base);
            } else if (self.old_method === 'green') {
                var bet_value = 0;
                if (self.bet_history[self.bet_history.length - 1] === 1) {
                    if (self.bet_history[self.bet_history.length - 2] === 1) {
                        bet_value = 2;
                    } else {
                        bet_value = 1;
                    }
                } else {
                    bet_value = self.bet_history[self.bet_history.length - 1] + self.bet_history[self.bet_history.length - 2];
                }
                self.bet(bet_value, 'green');
            } else if (self.old_method === 'dalembert') {
                self.bet(self.last_bet + 1);
            }
            this.play();
        } else {
            this.running = true;
            this.bet(this.base_bet);
            this.play();
        }
    }
    this.menu.abort.disabled = false;
    this.menu.stop.disabled = false;
    this.menu.start.disabled = true;
};

Automated.prototype.stop = function(abort) {
    var self = this;
    if (abort) { this.last_result = 'abort'; }
    this.stats.balance = parseInt(this.balance) - parseInt(this.starting_balance);
    this.maxsamecolor = 0;
    this.samecolorbet = 0;
    this.trainchanged = false;
    setTimeout(function() {
        clearInterval(self.game);
        self.game = null;
        self.running = false;
        self.menu.abort.disabled = true;
        self.menu.stop.disabled = true;
        self.menu.start.disabled = false;
    }, 1); // Next tick
};

Automated.prototype.log = function(message) {
    chat('alert', '[Automated] ' + message);
};

Automated.prototype.logdebug = function(message) {
    chat('italic', '[Automated] ' + message);
};

var automated = new Automated();