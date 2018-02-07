'use strict';

var last_roll = '';
var streak_red = 0;
var streak_black = 0;

var roll_history = document.getElementsByClassName('col-6 text-uppercase')[0];

var colors = {
	    'green': [0],
	    'black': [1, 2, 3, 4, 5, 6, 7],
	    'red': [8, 9, 10, 11, 12, 13, 14]
	};

function Streaker() {
	var self = this;
	
	this.last_roll = last_roll;
	this.streak_red = streak_red;
	this.streak_black = streak_black;
	this.history = [];
	
	this.stats = {
			'lastroll': 0,
			'longesttrain_red': 0,
			'longesttrain_black': 0
		};
	
	var menu = document.createElement('div');
    menu.innerHTML = '' +
        '<div class="row">' +
            '<div class="col-lg-9">' +
                '<h2><small>Streak Analyzer by crow</small></h2>' +
                '<div class="col-lg-3">' +
                    '<div>' +
                    	'<p><b>Last roll: </b><span id="streaker_lastroll">' + this.stats.lastroll + '</span> - ' +
                    	'<b>Streak Red: </b>' + this.stats.streak_red + ' - ' +
                    	'<b>Streak Black: </b>' + this.stats.streak_black + '</p>' + 
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    document.getElementsByClassName('mt-5 mb-4')[0].appendChild(menu);
    
    this.menu = {
            'lastroll': document.getElementById('streaker_lastroll')
    }
	
    this.updater = setInterval(function() { // Update every 2 seconds
        self.updateHistory();
        self.updateStats();
    }, 5 * 1000);
}

Streaker.prototype.updateHistory = function() {
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
    
    this.last_roll = self.history[0];

    return this.history.length === 10;
};

Streaker.prototype.updateStats = function() {
	this.menu.lastroll.innerHTML = this.last_roll;
//    this.menu.statistics.longesttrain_red.innerHTML = this.stats.longesttrain_red;
//    this.menu.statistics.longesttrain_black.innerHTML = this.stats.longesttrain_black;
    return true;
};

var streaker = new Streaker();