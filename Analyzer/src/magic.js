'use strict';

var crash_history = document.getElementsByClassName('style__history___2NM3T')[0];
var last_roll = 0.0;
var average_overall = 0.0;
var cumulated_overall = 0.0;
var crashes_overall = 0;
var average_last10 = 0.0;
var average_last20 = 0.0;
var colors_blue = 0;
var colors_red = 0;
var updater;

function Checker() {
	var self = this;
	
	this.history = [];
	this.last_roll = last_roll;
	this.average_overall = average_overall;
	this.average_last10 = average_last10;
	this.average_last20 = average_last20;
	this.colors_blue = colors_blue;
	this.colors_red = colors_red;
	this.crashes_overall = crashes_overall;
	this.cumulated_overall = cumulated_overall;
	
	var menu = document.createElement('div');
	menu.innerHTML = '' +
    '<div>' +
        '<div class="style__header___e336I">' +
            '<span>Stats</span>' +
            '<div>' +
            	'<p><span>Last: </span><b><span id="checker_last_roll">' + this.last_roll + 'x</span></b>' +
                '<span> - Avg overall: </span><b><span id="checker_avg_overall">' + this.average_overall + 'x </span></b>' +
                '<span> - blue all: </span><b><span id="checker_blue_all">' + this.colors_blue + '</span></b></p>' +
                '<p><span>Avg last 10: </span><b><span id="checker_avg_last10">' + this.average_last10 + 'x</span></b>' +
                '<span> - Avg last 20: </span><b><span id="checker_avg_last20">' + this.average_last20 + 'x</span></b>' +
                '<span> - red all: </span><b><span id="checker_red_all">' + this.colors_red + '</span></b></p>' +
            '</div>' +
        '</div>' +
    '</div>';
    document.getElementsByClassName('style__segment___1MMKP')[0].appendChild(menu);
    
    this.menu = {
            'last_roll': document.getElementById('checker_last_roll'),
            'average_overall': document.getElementById('checker_avg_overall'),
            'average_last10': document.getElementById('checker_avg_last10'),
            'average_last20': document.getElementById('checker_avg_last20'),
            'colors_blue': document.getElementById('checker_blue_all'),
            'colors_red': document.getElementById('checker_red_all')
    };
    
    updater = setInterval(function() {
    	self.checkForUpdates();
//    	self.pause();
    }, 4 * 1000);
}

Checker.prototype.updateStats = function() {
	this.menu.last_roll.innerHTML = this.last_roll;
	this.menu.average_overall.innerHTML = this.average_overall;
	this.menu.average_last10.innerHTML = this.average_last10;
	this.menu.average_last20.innerHTML = this.average_last20;
	this.menu.colors_blue.innerHTML = this.colors_blue;
	this.menu.colors_red.innerHTML = this.colors_red;
}

Checker.prototype.checkForUpdates = function() {
	var self = this;
	var running = document.getElementsByClassName('style__maxProfit___33w2y');
	// When website crashes, max profit display goes away. Pretty much the only way to determine the last crash properly
	// Only update stats when a new crash gets added, because otherwise the overall values are wrong.
	if(running.length === 0) {
		self.updateHistory();
	}
}

Checker.prototype.updateHistory = function() {
	var self = this;
	this.crash_history = document.getElementsByClassName('style__history___2NM3T')[0];
	this.history = [];
	console.log('Last crash:' + this.crash_history.childNodes[0].textContent);
	
	this.colors_blue = 0;
	this.colors_red = 0;
	
	var amountCrashes = 0.0;
	var cumulatedcrashes = 0.0;
	for (var i = 0; i < crash_history.childNodes.length - 1; i++) {
		var roll = crash_history.childNodes[i].textContent;
		var roll_fixed = roll.substr(0, roll.length - 1);
		var roll_float = parseFloat(roll_fixed);
		// Last crash
		if(i === 0) {
			self.last_roll = roll_float;
		}
		// average all
		this.cumulated_overall += roll_float;	
		this.crashes_overall++;
		
		// Values over the last 30ish crashes
		cumulatedcrashes += roll_float;

		// Last 10
		if(amountCrashes === 9) {
			var last10 = cumulatedcrashes / 10;
			this.average_last10 = Math.round(last10 * 100) / 100;
		}
		
		// Last 20
		if(amountCrashes === 19) {
			var last20 = cumulatedcrashes / 20;
			this.average_last20 = Math.round(last20 * 100) / 100;
		}
		
		// Colors
		var nodename = '' + crash_history.childNodes[i].className;
		if(nodename.includes("goodResult")) {
			this.colors_blue++;
		}
		else {
			this.colors_red++;
		}
		
		amountCrashes++;
    }
	this.average_overall = this.cumulated_overall / this.crashes_overall; 
	this.average_overall = Math.round(this.average_overall * 100) / 100; // 2 digit after decimal
	
	this.updateStats();
}

Checker.prototype.pause = function() {
	setTimeout(this.pause, 5000);
}

var checker = new Checker();