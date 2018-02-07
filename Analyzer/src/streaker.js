'use strict';

var last_roll = '';
var streak_red = 0;
var streak_black = 0;
var running_red = false;
var running_black = false;

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
	this.running_red = running_red;
	this.running_black = running_black;
	
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
                    	'<p><b>Last roll: </b><span id="streaker_lastroll">' + this.stats.lastroll + '</span></p>' +
                    	'<p><b>Streak Red: </b><span id="streaker_red">' + this.stats.streak_red + '</span></p>' +
                    	'<p><b>Streak Black: </b><span id="streaker_black">' + this.stats.streak_black + '</span></p>' + 
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    document.getElementsByClassName('mt-5 mb-4')[0].appendChild(menu);
    
    this.menu = {
            'lastroll': document.getElementById('streaker_lastroll'),
            'longesttrain_red': document.getElementById('streaker_red'),
            'longesttrain_black': document.getElementById('streaker_black'),
    }
	
    this.updater = setInterval(function() { 
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
    
    if(self.history[0] !== 'black' && )
    
    if(self.history[0] === 'red' && self.history[1] === 'red') {
	    if(!this.running_black && !this.running_red) {
	    	// Start redtrain
	    	this.running_red = true;
	    	this.streak_red++;
	    }
	    else if(this.running_red) {
	    	
	    }
	}

    return this.history.length === 10;
};

Streaker.prototype.updateStats = function() {
	this.menu.lastroll.innerHTML = this.last_roll;
    this.menu.longesttrain_red.innerHTML = this.streak_red;
    this.menu.longesttrain_black.innerHTML = this.streak_black;
    return true;
};

var streaker = new Streaker();