'use strict';

var crash_history = document.getElementsByClassName('previous-crashes')[0];
var last_roll = 0.0;
var average_overall = 0.0;
var average_last10 = 0.0;
var average_last20 = 0.0;
var updater;

function Checker() {
	var self = this;
	
	this.history = [];
	this.last_roll = last_roll;
	this.average_overall = average_overall;
	this.average_last10 = average_last10;
	this.average_last20 = average_last20;
	
	var menu = document.createElement('div');
	menu.innerHTML = '' +
    '<div>' +
        '<div class="previous-crashes">' +
            '<h2>Historychecker</h2>' +
            '<div>' +
            	'<span>Last crash: </span><span id="checker_last_roll">' + this.last_roll + 'x</span>' +
            '</div>' +
            '<div>' +
                '<span>Average overall: </span><color="#51e1ec"><span id="checker_avg_overall">' + this.average_overall + 'x </span></color>' + 
                '<span> ||| Average last 10: </span><color="#51e1ec"><span id="checker_avg_last10">' + this.average_last10 + 'x</span></color>' + 
                '<span> ||| Average last 20: </span><color="#51e1ec"><span id="checker_avg_last20">' + this.average_last20 + 'x</span></color>' +
            '</div>' +
            '<div>' +
            '<span>Lowest avg overall: </span><color="#51e1ec"><span id="checker_avg_overall">' + this.average_overall + 'x </span></color>' + 
            '<span> ||| Lowest avg last 10: </span><color="#51e1ec"><span id="checker_avg_last10">' + this.average_last10 + 'x</span></color>' + 
            '<span> ||| Lowest avg last 20: </span><color="#51e1ec"><span id="checker_avg_last20">' + this.average_last20 + 'x</span></color>' +
        '</div>' +
        '</div>' +
    '</div>';
    document.getElementsByClassName('left-section')[0].appendChild(menu);
    
    this.menu = {
            'last_roll': document.getElementById('checker_last_roll'),
            'average_overall': document.getElementById('checker_avg_overall'),
            'average_last10': document.getElementById('checker_avg_last10'),
            'average_last20': document.getElementById('checker_avg_last20')
    };
    
    updater = setInterval(function() {
    	self.updateHistory();
    }, 5 * 1000);
}

Checker.prototype.updateStats = function() {
	this.menu.last_roll.innerHTML = this.last_roll;
	this.menu.average_overall.innerHTML = this.average_overall;
	this.menu.average_last10.innerHTML = this.average_last10;
	this.menu.average_last20.innerHTML = this.average_last20;
}

Checker.prototype.updateHistory = function() {
	var self = this;
	this.crash_history = document.getElementsByClassName('previous-crashes')[0];
	this.history = [];
	
	var amountCrashes = 0.0;
	for (var i = 1; i < crash_history.childNodes.length; i++) {
		var roll = crash_history.childNodes[i].textContent;
		var roll_fixed = roll.substr(0, roll.length - 1);
		var roll_float = parseFloat(roll_fixed);
		// Last crash
		if(i === 1) {
			self.last_roll = roll_float;
			console.log(roll_float);
		}
		// average all
		this.average_overall += roll_float;		

		// Last 10
		if(amountCrashes === 9) {
			var last10 = this.average_overall / 10;
			this.average_last10 = Math.round(last10 * 100) / 100;
		}
		
		// Last 20
		if(amountCrashes === 19) {
			var last20 = this.average_overall / 20;
			this.average_last20 = Math.round(last20 * 100) / 100;
		}
		amountCrashes++;
    }
	this.average_overall /= amountCrashes; 
	this.average_overall = Math.round(this.average_overall * 100) / 100; // 2 digit after decimal
	
	this.updateStats();
}

var checker = new Checker();