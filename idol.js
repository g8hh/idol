var GAME_VERSION = "0.2.18";
var DEVELOPER = false;

var ShowError = function(text)
{
	document.getElementById("errorContainer").classList.remove("hidden");
	document.getElementById("errorContainer").childNodes[0].childNodes[0].nodeValue = text;
	document.getElementById("errorContainer").onclick = function(event)
	{
		paused = false;
		document.getElementById("errorContainer").classList.add("hidden");
		document.getElementById("errorContainer").onclick = null;
	}
	paused = true;
}

window.onerror = function (msg, url, line, col, error)
{
	if ( options ) 
	{
		options[Options.AutoSave] = false;
	}

	// Note that col & error are new to the HTML 5 spec and may not be 
	// supported in every browser.  It worked for me in Chrome.
	var extra = !col ? '' : '\ncolumn: ' + col;
	extra += !error ? '' : '\nerror: ' + error + "\n\nStack Trace:\n" + error.stack;

	// You can view the information in an alert to see things working like this:
	ShowError("Sorry, idol clicker has encountered an error! Auto save has been disabled to prevent file corruption. This error has been automatically reported and should be fixed shortly!\n\n" + msg + "\nurl: " + url + "\nline: " + line + extra);
	WSHSend("onTelemetry",{"key":"idolclicker","action":"error","message":(msg+"/"+url+"/"+line)});

	// If you return true, then error alerts (like in older versions of 
	// Internet Explorer) will be suppressed.
}

window.StackTrace = function() {
    var err = new Error();
    return err.stack;
}

var storageEnabled = (function() {
	try {
		localStorage.setItem("a", "b");
		localStorage.removeItem("a");
		return true;
	} catch (exception) {
		alert(exception);
		return false;
	}
}());

var LoadArray = function(target, data )
{
	for (var i in data)
	{
		if ( data[i] != null )
		{
			target[i] = data[i];
		}
	}
	return target;
}

var errorCanvas = document.createElement("canvas");
errorCanvas.width = 32;
errorCanvas.height = 32;
var errorContext = errorCanvas.getContext("2d");
errorContext.fillStyle = "#F00";
errorContext.fillRect(0,0,errorCanvas.width,errorCanvas.height);
errorContext.strokeStyle = "#FFF";
errorContext.lineWidth = 2;
errorContext.moveTo(0,0);
errorContext.lineTo(errorCanvas.width,errorCanvas.height);
errorContext.stroke();
errorContext.moveTo(errorCanvas.width,0);
errorContext.lineTo(0,errorCanvas.height);
errorContext.stroke();

/*var FAN_SYMBOL = "👤"; // 👤❤
var PERFORMANCE_SYMBOL = "🎤";
var ENCORE_SYMBOL = "👏";
var LEVEL_SYMBOL = "👑";
var ASTONISHMENT_SYMBOL = "❗";//
var INSPIRATION_SYMBOL = "☀";
var WORTH_SHARE_SYMBOL = "💕";
var SOUL_LINK_SYMBOL = "🔗";*/
var FAN_SYMBOL = ""; // 👤❤
var PERFORMANCE_SYMBOL = "";
var ENCORE_SYMBOL = "";
var LEVEL_SYMBOL = "";
var ASTONISHMENT_SYMBOL = "";//
var INSPIRATION_SYMBOL = "";
var WORTH_SHARE_SYMBOL = "";
var SOUL_LINK_SYMBOL = "";
var MASTERY_SYMBOLS = ["","",""];
var SUPERVISION_SYMBOL = "";
var TIME_SYMBOL = "";

var PERFORMANCE_TIME = 1000;
var PARTICLE_LIFETIME = 1000;
var AUTO_REFRESH_INTERVAL = 1000;
var COST_GROWTH_RATE = 1.025;
//var COST_GROWTH_DIVISOR = 1.10;
var AUTO_SAVE_THRESHOLD = 30000;
var SLOW_FRAME_THRESHOLD = 100;
var LOW_QUALITY_THRESHOLD = 16;
var CLICK_FAN_BONUS_INTERVAL = 100;
var PERFORMANCE_FAN_BONUS_AMOUNT = 0.0001;
var PERFORMANCE_FAN_BONUS_INTERVAL = 1;
var PERFORMANCE_FAN_BONUS_MAXIMUM = 1000000;
var MAXIMUM_AWAY_PERFORMANCE_TIME = 86400000;
var ALERT_FEED_SCROLL_SPEED = 0.02;
var NEW_UPDATE_ALERT_INTERVAL = 600000;
var MINIMUM_BPM = 60;
var MAXIMUM_BPM = 200;
var IDOL_SCALE_MINIMUM = 0.5;
var IDOL_SCALE_MAXIMUM = 1.5;
var IDOL_HOVER_DISTANCE = 96;
var SOUL_LINK_INTERVAL = 100;
var ASTONISHMENT_MULTIPLIER = 5;
var FORCE_DRAW_INTERVAL = 1000;
var INSPIRATION_LEVEL_LIMIT = 100;
var INSPIRATION_LEVEL_REQUIREMENT_MULTIPLIER = 1.35;
var INSPIRATION_LEVEL_BASE = 64;
var INSPIRATION_LOSS_RATE = 1/60/1000; // 100% of the requirement of 1 minutes
var INSPIRATION_PERFORMANCE_RATE_BONUS = 0.01;
var INSPIRATION_ENCORE_CHANCE_BONUS = 0.01;
var INSPIRATION_FAN_GAIN_RATE_BONUS = 0.01;
var INSPIRATION_WORTH_SHARE_RATE_BONUS = 0.0025;
var INSPIRATION_LOSS_DELAY = 500;
var AUTO_CLICK_MAXIMUM = 150;
var AUTO_CLICK_MINIMUM = 10;
var AUTO_CLICK_MULTIPLIER = 0.9;
var MAXIMUM_SPARKLES = 20;
var FAN_GAIN_PER_SECOND_AVERAGE_SAMPLES = 1;
var FAN_GAIN_PER_SECOND_INTERVAL = 1000;
var TIME_TO_SIMULATE_PER_STEP = 100;
var TIME_TO_SIMULATE_PER_FRAME = 1000*60*30;
var IDOL_PARTICLE_RATE = 1000;
var PLAYER_PARTICLE_RATE = 500;
var BPM_HELPER_LIFETIME = 3000;
var IDOL_INFO_LORE_LEVEL_REQUIREMENT = 25;
var IDOL_INFO_LIKES_LEVEL_REQUIREMENT = 50;
var TELEMETRY_INTERVAL = 1000 * 60 * 60 * 6;

var UPDATE_RATE = 15;
var STEP_TIME = 10;
var CSS_UPDATE_RATE = 100;
var PERIODIC_UPDATE_RATE = 1000;

var useCanvas = true;
// Reset
var activeIdol;
var autoClickInterval;
var autoClickLast;
var autoPerform;
var autoPerformAccumulator;
var autoPerformInterval;
var careerStarted;
var dragDistanceAccumulator;
var dragPerformanceDistance;
var fanGainMultiplierBuff;
var fanmail;
var fans;
var fansPerClickMultiplier;
var globalAstonishmentChance;
var globalEncoreChance;
var globalFansMultiplier;
var hoverIdol;
var idolListEntries;
var idols;
var inspiration;
var inspirationGain;
var inspirationGainRate;
var inspirationLevel;
var inspirationLossDelay;
var inspirationGainBuff;
var lifetimeFans;
var particles;
var paused;
var performOnDrag;
var performOnRightClick;
var performOnUnclick;
var shownFans;
var supervisionTime;
var temporaryPerformanceEndTime;
var temporaryPerformanceMultiplier;
var upgrades;
var userFanGainMultiplierBuff;
var userPerformances;
var particleBuffer;
var envyBonus;

var Reset = function()
{
	activeIdol = null;
	autoClickInterval = AUTO_CLICK_MAXIMUM;
	autoClickLast = Date.now();
	autoPerform = false;
	autoPerformAccumulator = 0;
	autoPerformInterval = 1000/25;
	careerStarted = Date.now();
	dragDistanceAccumulator = 0;
	dragPerformanceDistance = 2;
	fanGainMultiplierBuff = 0;
	fanmail = [];
	fans = 0;
	fansPerClickMultiplier = 1;
	globalAstonishmentChance = 0.00;
	globalEncoreChance = 0;
	globalFansMultiplier = 1.0;
	hoverIdol = null;
	idolListEntries = [];
	idols = [];
	inspiration = 0;
	inspirationGain = 0;
	inspirationGainRate = 1;
	inspirationLevel = 0;
	inspirationLossDelay = 0;
	inspirationGainBuff = 0.0;
	lifetimeFans = 0;
	particles = [];
	paused = false
	performOnDrag = false;
	performOnRightClick = false;
	performOnUnclick = false;
	shownFans = 0;
	supervisionTime = 0;
	temporaryPerformanceEndTime = 0;
	temporaryPerformanceMultiplier = 1;
	upgrades = [];
	userFanGainMultiplierBuff = 0;
	userPerformances = 0;
	envyBonus = 0;

	particleBuffer = new ParticleBuffer();
	QuickSkillsPanel.Clear();
	SkillRegistry.Reset();
	SortIdols();
	Resize();
}

// Other
var canvasRect = null;
var timeSinceLastSession = 0;
var lastBPMTap = 0;
var timeSimulated = 0;
var timeToSimulate = 0;
var inspirationLossMultiplier = 1.0;
var fansPerSecond = 0;
var lastFanGainPerSecondTime = Date.now();
var totalFanGainThisSecond = 0;
var fanGainPerSecondAverage = [];
var sparkleCount = 0;
var lastPerformTime = null;
var lastPeriodicUpdate = null;
var drawAnimationFrame = null;
var autoClickTarget = null;
var wsh = WSH();
var idolDrawOrder = [];
var saveFile = 0;
var screenWidth = 0;
var screenHeight = 0;
var debugInputStart = false;
var debugInputEnd = false;
var debugInputMove = false;
var spriteScaling = 1;
var beatLength = (60/100*1000);
var pauseOnBlur = false;
var inputX = 0;
var inputY = 0;
var lastInputX = 0;
var lastInputY = 0;
var averageVelocityX = 0;
var averageVelocityY = 0;
var now = Date.now();
var startTime = now;
var lastUpdateTime = now;
var lastCSSUpdateTime = now;
var lastAutoRefresh = 0;
var lastDrawTime = null;
var lastSaveTime = 0;
var stickyPanels = [];
var beatOffset = 0;
var telemetry = {};
var dss = new DSS();
var lastTelemetryTime = 0;
var drag = false;

var FormattingTypes = {};
FormattingTypes.Letters = 0;
FormattingTypes.SI = 1;

var OptionTypes = {};
OptionTypes.Boolean = 0;
OptionTypes.Slider = 1;
OptionTypes.ChoiceSlider = 2;

var Buffs = {};
Buffs.Overdrive = 0;
Buffs.SweetsSpree = 1;
Buffs.InspiringSong = 2;

var IdolOptions = {};
IdolOptions.Beat = 0;
IdolOptions.BeatOffset = 1;
IdolOptions.FrameLengthModifier = 2;
IdolOptions.Visible = 3;
IdolOptions.Scale = 4;
IdolOptions.Flip = 5;

var ParticleBuffer = function()
{
	this.fans = 0;
	this.encores = 0;
	this.astonishment = 0;
	this.performances = 0;
	this.Add = function(fans,performances,encores,astonishment)
	{
		this.fans += fans || 0;
		this.performances += performances || 0;
		this.encores += encores || 0;
		this.astonishment += astonishment || 0;
	}
	this.Generate = function(x,y,vx,vy,lifeTime,data,classes)
	{
		var bubble = new FansBubble(x,y,vx,vy,this.fans,lifeTime,null,classes,this.encores,this.performances, this.astonishment);
		this.fans = 0;
		this.encores = 0;
		this.astonishment = 0;
		this.performances = 0;
		return bubble;
	}
}

var SVGIcon = function(path)
{
	var icon = CreateSimpleElement("svg",["svgIcon"]);
	icon.setAttribute('viewBox', '0 0 1 1');
	var use = CreateSimpleElement("use");
	use.setAttribute('xlink:href', '#icon-star');
	icon.appendChild(use);
	//icon.src = path;
	return icon;
}

var FormatDuration = function(milliseconds)
{
	milliseconds = Math.abs(Math.floor(milliseconds));
	var s = Math.floor(milliseconds/1000);
	var m = Math.floor(s/60);
	var h = Math.floor(m/60);
	var string = "";
	if ( h > 0 ){ string += h+"h"; }
	if ( m > 0 ){ string += (m%60)+"m"; }
	string += (s%60);
	if ( s < 60 )
	{
		if ( milliseconds > 0 ) { string += "."+(milliseconds%1000); }
	}
	string += "s";
	return string;
}

var FanGainMultiplier = function()
{
	return 1 + fanGainMultiplierBuff;
}

var UserFanGainMultiplier = function()
{
	return 1 + userFanGainMultiplierBuff;
}

var LargestFittingPower = function(value)
{
	var i = 0;
	var power = 0;
	while ( power <= value )
	{
		power = Math.pow(2,i++);
	}
	return power /= 2;
}

var GameTime = function()
{
	return now - startTime;
}

var BeatTime = function()
{
	return GameTime() + beatOffset;
}

var IsElementDescendantOf = function(element,target)
{
	if( element === target )
	{
		return true;
	}
	element = element.parentNode;
	while ( element != null )
	{
		if ( element === target )
		{
			return true;
		}
		element = element.parentNode;
	}
	return false;
}

var CreateSimpleElement = function(type,classes,textNodes)
{
	var element = document.createElement(type);
	if ( classes != null )
	{
		for ( var i = 0; i < classes.length; i++ )
		{
			element.classList.add(classes[i]);
		}
	}
	if ( textNodes != null )
	{
		for ( var i = 0; i < textNodes.length; i++ )
		{
			element.appendChild(document.createTextNode(textNodes[i]));
		}
	}
	return element;
}

var GenerateCSS = function()
{
	dss.Clear();
	beatLength = 60/options[Options.BeatsPerMinute]*1000;
	//var animationTime = 16;
	var animationTime = (beatLength*2)/1000;
	dss.AddRule(".idol",
		"animation: frame "+animationTime+"s linear infinite;"
	);
	dss.AddRule(".bounce",
		"animation: bounce "+(animationTime/2)+"s cubic-bezier(0.18, 0.89, 0.32, 1.28) infinite;"
	);
}

var Achievement = function(id,name,description,rewardFunction,reapplyReward)
{
	this.id = id;
	this.name = name;
	this.earned = false;
	this.description = description;
	this.rewardFunction = rewardFunction;
	this.reapplyReward = reapplyReward;
	this.Earn = function()
	{
		if ( !this.earned && this.rewardFunction )
		{
			this.earned = true;
			this.rewardFunction();
		}
	}
	this.Serialize = function()
	{
		return [this.earned];
	}
	this.Deserialize = function(data)
	{
		this.earned = data[0];
		if( this.reapplyReward )
		{
			if ( this.rewardFunction )
			{
				this.rewardFunction();
			}
		}
	}
}

var AchievementRegistry = new (function()
{
	this.achievements = [];
	this.Register = function(id,name,description,rewardFunction,reapplyReward)
	{
		this.achievements[id] = new Achievement(id,name,description,rewardFunction,reapplyReward);
		return this.achievements[id];
	}
	this.Serialize = function()
	{
		var data = [];
		for ( var k in this.achievements )
		{
			data[k] = this.achievements[k].Serialize();
		}
		return data;
	}
	this.Deserialize = function(data)
	{
		for ( var k in data )
		{
			this.achievements[k].Deserialize(data[k]);
		}
	}
})();

var Achievements = {};
Achievements.FirstFan = AchievementRegistry.Register(0,"First Fan","Your first fan. Humble beginnings!");

var Slider = function(text,min,max,defaultValue,decimals,onValueChange)
{
	var slider = this;
	this.decimals = decimals || 0;
	this.text = text;
	this.minimum = min;
	this.maximum = max;
	this.OnValueChange = onValueChange;
	var element = document.createElement("div");
	element.classList.add("slider");
	var bar = document.createElement("div");
	bar.classList.add("sliderBar");
	var label = document.createElement("span");
	label.classList.add("sliderLabel");
	var labelText = document.createTextNode("Label");
	label.appendChild(labelText);
	element.appendChild(bar);
	element.appendChild(label);
	var mouseCapture;
	var anchorX = null;
	element.onmousedown = function(event)
	{
		var rect = element.getBoundingClientRect();
		mouseCapture = document.createElement("div");
		mouseCapture.classList.add("screen");
		anchorX = event.clientX;
		var anchorPercent = (event.clientX-rect.left) / rect.width;
		slider.percent = anchorPercent;
		slider.Refresh();
		mouseCapture.onmousemove = function(event)
		{
			slider.percent = Math.min(Math.max(anchorPercent+(event.clientX - anchorX)/rect.width,0),1);
			labelText.nodeValue = slider.Label();
			slider.Refresh();
		}
		mouseCapture.onmouseup = function(event)
		{
			if ( mouseCapture.parentNode == document.body )
			{
				document.body.removeChild(mouseCapture);
			}
			if (slider.OnValueChange)
			{
				slider.OnValueChange(slider.Value());
			}
		}
		document.body.appendChild(mouseCapture);
	}
	this.Refresh = function(value)
	{
		if ( value != null )
		{
			this.SetValue(value);
		}
		bar.style.width = (this.percent*100)+"%";
		labelText.nodeValue = this.Label();
	}
	this.Label = function()
	{
		return this.text + ": "+this.Value();
	}
	this.Value = function()
	{
		var value = this.minimum+(this.percent*(this.maximum-this.minimum));
		var power = Math.pow(10,this.decimals);
		value = Math.round(value * power)/power;
		return value;
	}
	this.SetValue = function(value)
	{
		this.percent = (value-min)/(max-min);
	}
	this.SetValue(defaultValue);

	this.element = element;
	this.Refresh();
}

var ChoiceSlider = function(text,choices,defaultIndex,onValueChange)
{
	var slider = this;
	this.text = text;
	this.choices = choices;
	this.OnValueChange = onValueChange;
	var element = document.createElement("div");
	element.classList.add("slider");
	var bar = document.createElement("div");
	bar.classList.add("sliderBar");
	var label = document.createElement("span");
	label.classList.add("sliderLabel");
	var labelText = document.createTextNode("Label");
	label.appendChild(labelText);
	element.appendChild(bar);
	element.appendChild(label);
	this.percent = 0;
	var mouseCapture;
	var anchorX = null;
	element.onmousedown = function(event)
	{
		var rect = element.getBoundingClientRect();
		mouseCapture = document.createElement("div");
		mouseCapture.classList.add("screen");
		anchorX = event.clientX;
		var anchorPercent = (event.clientX-rect.left) / rect.width;
		slider.percent = anchorPercent;
		slider.Refresh();
		mouseCapture.onmousemove = function(event)
		{
			slider.percent = Math.min(Math.max(anchorPercent+(event.clientX - anchorX)/rect.width,0),1);
			slider.Refresh();
		}
		mouseCapture.onmouseup = function(event)
		{
			document.body.removeChild(mouseCapture);
			if (slider.OnValueChange)
			{
				slider.OnValueChange(slider.Value());
			}
		}
		document.body.appendChild(mouseCapture);
	}
	this.Refresh = function(value)
	{
		if ( value != null )
		{
			this.SetIndex(this.FindIndex(value));
		}
		bar.style.width = (this.percent*100)+"%";
		labelText.nodeValue = this.Label();
	}
	this.Value = function()
	{
		var choiceIndex = Math.round(this.percent*(this.choices.length-1));
		return this.choices[choiceIndex][1];
	}
	this.Label = function()
	{
		var choiceIndex = Math.round(this.percent*(this.choices.length-1));
		return this.text +": "+this.choices[choiceIndex][0];
	}
	this.SetIndex = function(index)
	{
		index = Math.min(Math.max(index,0),this.choices.length-1);
		this.percent = 1/(this.choices.length-1) * index;
	}
	this.FindIndex = function(value)
	{
		for ( var i = 0; i < this.choices.length; i++ )
		{
			if ( this.choices[i][1] === value )
			{
				return i;
			}
		}
		return -1;
	}
	this.SetIndex(defaultIndex);

	this.element = element;
	this.Refresh();
}

var debugElement = CreateSimpleElement("span",["debug"],["Debug"]);
document.body.appendChild(debugElement);
var debugString = "";

var ToggleButtonElement = function(text)
{
	var hidden = false;
	var enabled = true;
	this.element = CreateSimpleElement("div",["button","toggleButton"],[text]);
	this.Enable = function()
	{
		if ( !enabled )
		{
			enabled = true;
			this.element.classList.remove("disabled");
		}
	}
	this.Disable = function()
	{
		if ( enabled )
		{
			enabled = false;
			this.element.classList.add("disabled");
		}
	}
	this.Hide = function()
	{
		if ( !hidden )
		{
			hidden = true;
			this.element.classList.add("hidden");
		}
	}
	this.Show = function()
	{
		if ( hidden )
		{
			hidden = false;
			this.element.classList.remove("hidden");
		}
	}
	this.Refresh = function(isEnabled)
	{
		if ( isEnabled && !enabled )
		{
			this.Enable();
		}
		else if ( !isEnabled && enabled )
		{
			this.Disable();
		}
	}
}

var metaContent = CreateSimpleElement("div",["meta"]);
metaContent.appendChild(CreateSimpleElement("span",["title"],["idol clicker v"+GAME_VERSION]));
metaContent.appendChild(CreateSimpleElement("span",["separator"]));

var Button = function(text, classes, onClickFunction, mouseDownInstead)
{
	var element = CreateSimpleElement("div",classes,[text]);
	var clickFunction = function(event)
	{
		if ( onClickFunction != null )
		{
			onClickFunction(event,this);
		}
		event.stopPropagation();
	}
	if ( mouseDownInstead )
	{
		element.onmousedown = clickFunction;
	}
	else
	{
		element.onclick = clickFunction;
	}
	this.element = element;
}

var optionsLink = CreateSimpleElement("span",["metaLink"],"选项");
optionsLink.onclick = function(event)
{
	var clientRect = optionsLink.getBoundingClientRect();
	OptionsPanel.Refresh();
	OptionsPanel.Show();
	OptionsPanel.Move(clientRect.left,clientRect.bottom+4,false,false);
	event.stopPropagation();
};
metaContent.appendChild(optionsLink);
metaContent.appendChild(CreateSimpleElement("span",["separator"]));

var changelogLink = CreateSimpleElement("span",["metaLink"],"更新日志");
changelogLink.onclick = function(event,button)
{
	var clientRect = changelogLink.getBoundingClientRect();
	WSHSend("onTelemetry",{"key":"idolclicker","action":"changelog"});
	ChangelogPanel.Refresh();
	ChangelogPanel.Show();
	ChangelogPanel.SetAnchor(clientRect.left,clientRect.bottom+4,false,false);
	event.stopPropagation();
};
metaContent.appendChild(changelogLink);
metaContent.appendChild(CreateSimpleElement("span",["separator"]));

var helpLink = CreateSimpleElement("span",["metaLink"],"帮助");
helpLink.onclick = function(event,button)
{
	var clientRect = helpLink.getBoundingClientRect();
	WSHSend("onTelemetry",{"key":"idolclicker","action":"help"});
	HelpPanel.Show();
	HelpPanel.SetAnchor(clientRect.left,clientRect.bottom+4,false,false);
	HelpPanel.Anchor();
	event.stopPropagation();
};
metaContent.appendChild(helpLink);
metaContent.appendChild(CreateSimpleElement("span",["separator"]));


var tappingBPM = false;
var tappingBPMLastTap = 0;
var tappingBPMStopThreshold = MINIMUM_BPM/60*1000 + 250;
var tappingBPMEndTimeout = null;
var tappingBPMSum = 0;
var tappingBPMTaps = 0;

var TapBPM = function()
{
	var resetTimeout = function()
	{
		if ( tappingBPMEndTimeout != null )
		{
			clearTimeout(tappingBPMEndTimeout);
		}
		tappingBPMEndTimeout = setTimeout(function()
		{
			tappingBPM = false;
			tappingBPMSum = 0;
			tappingBPMTaps = 0;
			NotificationPanel.Unstick(document.body);
			NotificationPanel.Hide();
		}, tappingBPMStopThreshold);
	}
	now = Date.now();
	lastBPMTap = now;
	var clientRect = bpmButton.getBoundingClientRect();
	if ( tappingBPM == false )
	{
		tappingBPM = true;
		tappingBPMLastTap = now;
		resetTimeout();
		beatOffset = beatLength-(GameTime()%beatLength);
		NotificationPanel.Refresh("Keep tapping to a beat");
	}
	else
	{
		var interval = now - tappingBPMLastTap;
		tappingBPMSum += interval;
		tappingBPMTaps++;
		var average = (tappingBPMSum/tappingBPMTaps/1000);
		var newBPM = Math.max(Math.min(MAXIMUM_BPM,1/average*60),MINIMUM_BPM);
		if( tappingBPMTaps > 16 )
		{
			newBPM = Math.floor(newBPM * 10)/10;
		}
		else
		{
			newBPM = Math.round(newBPM);
		}
		if ( !isNaN(newBPM) )
		{
			options[Options.BeatsPerMinute] = newBPM;
			GenerateCSS();
		}
		beatOffset = beatLength-(GameTime()%beatLength);
		resetTimeout();
		tappingBPMLastTap = now;
		NotificationPanel.Refresh(newBPM);
	}
	NotificationPanel.Stick(document.body);
	NotificationPanel.Show();
	NotificationPanel.Move(clientRect.left,clientRect.bottom+4,false,false);
}

var bpmButton = CreateSimpleElement("span",["metaLink"],"BPM");
bpmButton.onclick = function(event)
{
	TapBPM();
	event.stopPropagation();
};

metaContent.appendChild(bpmButton);
/*

metaContent.appendChild(CreateSimpleElement("span",["spring"]));

var patreonLink = CreateSimpleElement("span",["metaLink"],["Patreon"]);
patreonLink.onclick = function(event)
{
	WSHSend("onTelemetry",{"key":"patreon","action":"referidol"});
	window.open("https://patreon.com/pettankon","_blank");
	event.stopPropagation();
};
metaContent.appendChild(patreonLink);

var donateForm = CreateSimpleElement("form",["metaLink"]);
donateForm.setAttribute("action", "https://www.paypal.com/cgi-bin/webscr");
donateForm.setAttribute("method", "post");
donateForm.setAttribute("target", "_blank");
var donateCmd = CreateSimpleElement("input");
donateCmd.setAttribute("type", "hidden");
donateCmd.setAttribute("name", "cmd");
donateCmd.setAttribute("value", "_s-xclick");
var donateEncrypted = CreateSimpleElement("input");
donateEncrypted.setAttribute("type", "hidden");
donateEncrypted.setAttribute("name", "encrypted");
donateEncrypted.setAttribute("value", "-----BEGIN PKCS7-----MIIHLwYJKoZIhvcNAQcEoIIHIDCCBxwCAQExggEwMIIBLAIBADCBlDCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20CAQAwDQYJKoZIhvcNAQEBBQAEgYCzkOtTldKiBFiAdCK+ovIZjbTh27n7YN11B4NmZKmrQPM4i3y0AJ6/omRJCF5Mvq9UOFGTJ/2FeMXukzUQJzfnMlFtIYRIINjfUGaBbAZAFgP+2g7mwibbCwVE2x6/5NBbz+sdOTfYtIWYShbVCO/zUxNnc2TdAUnbtJVnbb4UYzELMAkGBSsOAwIaBQAwgawGCSqGSIb3DQEHATAUBggqhkiG9w0DBwQIkBB7D4lZFBmAgYgLP6tmT+h6N9efmcYcJuHtM/hQbMvD46N56D9f+jfx3YtdiSuVZEPrEguOvz8cxqw1a494ViLI+YZJvdRqyItoQR5dBURm608fLIKIX1LByllMu06FhCpFrRuAANgQlWnWh4YAanbnIYBLLLHFbyAvZVHKCoMfW1lKqD7+IR1dhjGerTsiox2soIIDhzCCA4MwggLsoAMCAQICAQAwDQYJKoZIhvcNAQEFBQAwgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tMB4XDTA0MDIxMzEwMTMxNVoXDTM1MDIxMzEwMTMxNVowgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBR07d/ETMS1ycjtkpkvjXZe9k+6CieLuLsPumsJ7QC1odNz3sJiCbs2wC0nLE0uLGaEtXynIgRqIddYCHx88pb5HTXv4SZeuv0Rqq4+axW9PLAAATU8w04qqjaSXgbGLP3NmohqM6bV9kZZwZLR/klDaQGo1u9uDb9lr4Yn+rBQIDAQABo4HuMIHrMB0GA1UdDgQWBBSWn3y7xm8XvVk/UtcKG+wQ1mSUazCBuwYDVR0jBIGzMIGwgBSWn3y7xm8XvVk/UtcKG+wQ1mSUa6GBlKSBkTCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb22CAQAwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQUFAAOBgQCBXzpWmoBa5e9fo6ujionW1hUhPkOBakTr3YCDjbYfvJEiv/2P+IobhOGJr85+XHhN0v4gUkEDI8r2/rNk1m0GA8HKddvTjyGw/XqXa+LSTlDYkqI8OwR8GEYj4efEtcRpRYBxV8KxAW93YDWzFGvruKnnLbDAF6VR5w/cCMn5hzGCAZowggGWAgEBMIGUMIGOMQswCQYDVQQGEwJVUzELMAkGA1UECBMCQ0ExFjAUBgNVBAcTDU1vdW50YWluIFZpZXcxFDASBgNVBAoTC1BheVBhbCBJbmMuMRMwEQYDVQQLFApsaXZlX2NlcnRzMREwDwYDVQQDFAhsaXZlX2FwaTEcMBoGCSqGSIb3DQEJARYNcmVAcGF5cGFsLmNvbQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMTYwMTIzMDcyMzI4WjAjBgkqhkiG9w0BCQQxFgQUKlc7TVkXRkldR+nohxTlf4CUil8wDQYJKoZIhvcNAQEBBQAEgYA8Q0OA1m2jd6CodMokRUjuZs9VU5ZwzbtkEqwQohINbpKfB7fm5/RHoahTREw0k+sGZFx2Payi4kuX51Nnx73EOiK9sPzHSlvwsCu6Xj7e4gtTPUYiQurYfnxkeDZw8JwcFKYxOtgFqe3r5KCToZjCKmZiYC24e65m/ro7ZvKsJw==-----END PKCS7-----");
var donateButton = CreateSimpleElement("input",["donateButton"],["Donate"]);
donateButton.setAttribute("type", "submit");
donateButton.setAttribute("value", "Donate");
donateButton.setAttribute("name", "Donate");
donateForm.appendChild(donateCmd);
donateForm.appendChild(donateEncrypted);
donateForm.appendChild(donateButton);
donateButton.onclick = function(event)
{
	WSHSend("onTelemetry",{"key":"donate","action":"referidol"});
	//window.open("https://patreon.com/pettankon","_blank");
	event.stopPropagation();
};
metaContent.appendChild(CreateSimpleElement("span",["separator"]));
metaContent.appendChild(donateForm);
*/
/*<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----MIIHLwYJKoZIhvcNAQcEoIIHIDCCBxwCAQExggEwMIIBLAIBADCBlDCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20CAQAwDQYJKoZIhvcNAQEBBQAEgYCzkOtTldKiBFiAdCK+ovIZjbTh27n7YN11B4NmZKmrQPM4i3y0AJ6/omRJCF5Mvq9UOFGTJ/2FeMXukzUQJzfnMlFtIYRIINjfUGaBbAZAFgP+2g7mwibbCwVE2x6/5NBbz+sdOTfYtIWYShbVCO/zUxNnc2TdAUnbtJVnbb4UYzELMAkGBSsOAwIaBQAwgawGCSqGSIb3DQEHATAUBggqhkiG9w0DBwQIkBB7D4lZFBmAgYgLP6tmT+h6N9efmcYcJuHtM/hQbMvD46N56D9f+jfx3YtdiSuVZEPrEguOvz8cxqw1a494ViLI+YZJvdRqyItoQR5dBURm608fLIKIX1LByllMu06FhCpFrRuAANgQlWnWh4YAanbnIYBLLLHFbyAvZVHKCoMfW1lKqD7+IR1dhjGerTsiox2soIIDhzCCA4MwggLsoAMCAQICAQAwDQYJKoZIhvcNAQEFBQAwgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tMB4XDTA0MDIxMzEwMTMxNVoXDTM1MDIxMzEwMTMxNVowgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBR07d/ETMS1ycjtkpkvjXZe9k+6CieLuLsPumsJ7QC1odNz3sJiCbs2wC0nLE0uLGaEtXynIgRqIddYCHx88pb5HTXv4SZeuv0Rqq4+axW9PLAAATU8w04qqjaSXgbGLP3NmohqM6bV9kZZwZLR/klDaQGo1u9uDb9lr4Yn+rBQIDAQABo4HuMIHrMB0GA1UdDgQWBBSWn3y7xm8XvVk/UtcKG+wQ1mSUazCBuwYDVR0jBIGzMIGwgBSWn3y7xm8XvVk/UtcKG+wQ1mSUa6GBlKSBkTCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb22CAQAwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQUFAAOBgQCBXzpWmoBa5e9fo6ujionW1hUhPkOBakTr3YCDjbYfvJEiv/2P+IobhOGJr85+XHhN0v4gUkEDI8r2/rNk1m0GA8HKddvTjyGw/XqXa+LSTlDYkqI8OwR8GEYj4efEtcRpRYBxV8KxAW93YDWzFGvruKnnLbDAF6VR5w/cCMn5hzGCAZowggGWAgEBMIGUMIGOMQswCQYDVQQGEwJVUzELMAkGA1UECBMCQ0ExFjAUBgNVBAcTDU1vdW50YWluIFZpZXcxFDASBgNVBAoTC1BheVBhbCBJbmMuMRMwEQYDVQQLFApsaXZlX2NlcnRzMREwDwYDVQQDFAhsaXZlX2FwaTEcMBoGCSqGSIb3DQEJARYNcmVAcGF5cGFsLmNvbQIBADAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcNMTYwMTIzMDcyMzI4WjAjBgkqhkiG9w0BCQQxFgQUKlc7TVkXRkldR+nohxTlf4CUil8wDQYJKoZIhvcNAQEBBQAEgYA8Q0OA1m2jd6CodMokRUjuZs9VU5ZwzbtkEqwQohINbpKfB7fm5/RHoahTREw0k+sGZFx2Payi4kuX51Nnx73EOiK9sPzHSlvwsCu6Xj7e4gtTPUYiQurYfnxkeDZw8JwcFKYxOtgFqe3r5KCToZjCKmZiYC24e65m/ro7ZvKsJw==-----END PKCS7-----
">
<input type="image" src="/img/donate.png" border="0" name="submit" alt="donate to nyanpals via PayPal">
</form>*/

/*
var merchLink = CreateSimpleElement("span",["metaLink"],["Merch"]);
merchLink.onclick = function(event)
{
	WSHSend("onTelemetry",{"key":"merch","action":"referidol"});
	window.open("http://www.redbubble.com/people/pettankon","_blank");
	event.stopPropagation();
};
metaContent.appendChild(CreateSimpleElement("span",["separator"]));
metaContent.appendChild(merchLink);

var gamesLink = CreateSimpleElement("span",["metaLink"],["Other Games"]);
gamesLink.onclick = function(event)
{
	WSHSend("onTelemetry",{"key":"games","action":"referidol"});
	window.open("/games","_blank");
	event.stopPropagation();
};
metaContent.appendChild(CreateSimpleElement("span",["separator"]));
metaContent.appendChild(gamesLink);
*/
var InterfaceCanHide = function()
{
	var hidden = false;
	this.Hidden = function()
	{
		return hidden;
	}
	this.Hide = function()
	{
		if ( !hidden )
		{
			hidden = true;
			this.element.classList.add("hidden");
		}
	}
	this.Show = function(skipHiding)
	{
		if ( !skipHiding )
		{
			HidePanels(this.element);
		}
		if ( hidden )
		{
			hidden = false;
			this.element.classList.remove("hidden");
		}
	}
	this.ToggleHide = function()
	{
		if ( hidden )
		{
			this.Show();
		}
		else
		{
			this.Hide();
		}
	}
}

var InterfaceCanStick = function()
{
	var sticky = false;
	var stuckTo = [];
	this.Stick = function(target)
	{
		if( stuckTo.indexOf(target) === -1 )
		{
			stuckTo.push(target);
		}
		if( stuckTo.length > 0 )
		{
			sticky = true;
		}
	}
	this.Sticky = function()
	{
		return sticky;
	}
	this.StuckTo = function()
	{
		return stuckTo;
	}
	this.Unstick = function(target)
	{
		var targetIndex = stuckTo.indexOf(target);
		if( targetIndex !== -1 )
		{
			stuckTo.splice(targetIndex,1);
			if ( stuckTo.length === 0 )
			{
				sticky = false;
			}
		}
	}
	this.CleanSticky = function()
	{
		stuckTo = [];
		sticky = false;
	}
}

var resizeResponsivePanels = [];
window.addEventListener("onresize", function(event)
{
	for( var i = 0; i < resizeResponsivePanels.length; i++ )
	{
		resizeResponsivePanels[i].Resize();
	}
});
var InterfaceIsResizeResponsive = function()
{
	this.Resize = function(){}
	resizeResponsivePanels.push(this);
}

var InterfaceCanMove =function()
{
	this.Move = function(x,y,flipX,flipY)
	{
		var clientRect = this.element.getBoundingClientRect();
		var xOffset = flipX ? -clientRect.width : 0;
		var yOffset = flipY ? -clientRect.height : 0;
		var x = Math.max(0 + xOffset,Math.min(x+ xOffset ,screenWidth-clientRect.width));
		var y = Math.max(0 + yOffset,Math.min(y+ yOffset, screenHeight-clientRect.height));
		this.element.style.left = x+"px";
		this.element.style.top = y+"px";
	}
}

var InterfaceCanAnchor = function()
{
	var anchorX = null;
	var anchorY = null;
	var anchorRight = false;
	var anchorBottom = false;
	this.SetAnchor = function(x,y,right,bottom)
	{
		anchorX = x || 0;
		anchorY = y || 0;
		anchorRight = right || false;
		anchorBottom = bottom || false;
	}
	this.ClearAnchor = function()
	{
		anchorX = null;
		anchorY = null;
		anchorRight = false;
		anchorBottom = false;
	}
	this.Anchor = function()
	{
		if( anchorX != null && anchorY != null )
		{
			var clientRect = this.element.getBoundingClientRect();
			var xOffset = anchorRight ? -clientRect.width : 0;
			var yOffset = anchorBottom ? -clientRect.height : 0;
			var x = Math.max(xOffset, Math.min(anchorX + xOffset, screenWidth - clientRect.width));
			var y = Math.max(yOffset, Math.min(anchorY + yOffset, screenHeight - clientRect.height));
			this.element.style.left = x+"px";
			this.element.style.top = y+"px";
		}
	}
	this.CopyAnchor = function(target)
	{
		target.SetAnchor(anchorX,anchorY,anchorRight,anchorBottom);
	}
}

var tooltipHideTimeout = null;
var QueueTooltipHide = function(timeout)
{
	if ( TOOLTIP_HIDE_TIMEOUT > 0 )
	{
		if ( tooltipHideTimeout != null )
		{
			clearTimeout(tooltipHideTimeout);
		}
		tooltipHideTimeout = setTimeout(function(){
			lastShowingItem = null;
			tooltip.Hide();
		}, timeout || TOOLTIP_HIDE_TIMEOUT );
	}
	else
	{
		lastShowingItem = null;
		tooltip.Hide();
	}
}

var Tooltip = new (function(interactive)
{
	this.element = CreateSimpleElement("div",["tooltip"]);
	this.x = 0;
	this.y = 0;
	this.visible = false;
	this.invertX = false;
	this.invertY = false;
	//if( interactive )
	//{
	//	this.element.classList.add("popup");
	//}
	//else
	//{
	//	this.element.classList.add("tooltip");
	//}
	//var note = document.createElement("span");
	this.dirty = false;
	this.Show = function(invertX,invertY)
	{
		this.element.classList.remove("hidden");
		if ( invertX != null )
		{
			this.invertX = invertX;
		}
		if ( invertY != null )
		{
			this.invertY = invertY;
		}
		if ( this.invertX )
		{
			this.element.classList.add("rightToLeft");
		}
		else
		{
			this.element.classList.remove("rightToLeft");
		}
		if ( tooltipHideTimeout != null )
		{
			clearTimeout(tooltipHideTimeout);
		}
		this.visible = true;
		this.dirty = true;
		this.Refresh();
	}
	var clientWidth = 0;
	var clientHeight = 0;
	this.Move = function(x,y)
	{
		//var rect = obj.getBoundingClientRect();
		if ( this.invertX )
		{
			x -= clientWidth;
		}
		if ( this.invertY )
		{
			y -= clientHeight;
		}
		if (x < 0 )
		{
			x = 0;
		}
		else if (x + clientWidth > window.innerWidth )
		{
			x = window.innerWidth - clientWidth;
		}
		if (y < 0)
		{
			y = 0;
		}
		else if (y + clientHeight > window.innerHeight )
		{
			y = window.innerHeight -clientHeight;
		}
		this.x = x;
		this.y = y;
	}
	this.Refresh = function()
	{
		if ( this.dirty )
		{
			clientWidth = this.clientWidth;
			clientHeight = this.clientHeight;
			this.dirty = false;
			this.ForceUpdate();
		}
		this.element.style.left = this.x+"px";
		this.element.style.top = this.y+"px";
	}
	this.ForceUpdate = function()
	{
		var offsetX = 16;
		var offsetY = 0;
		if ( this.invertX )
		{
			offsetX *= -1;
		}
		if ( this.invertY )
		{
			offsetY *= -1;
		}
		this.Move(mouseX + offsetX,mouseY + offsetY);
	}
	this.Hide = function()
	{
		this.element.classList.add("hidden");
		this.visible = false;
	}
	if ( interactive)
	{
		//obj.onmousedown = function(event)
		//{
		//	event.stopPropagation();
		//}
	}
	this.element.onmouseenter = function()
	{
		if ( tooltipHideTimeout != null )
		{
			clearTimeout(tooltipHideTimeout);
		}
	}
	this.element.onmouseleave = function()
	{
		QueueTooltipHide();
	}
});
document.body.appendChild(Tooltip.element);

var AddClasses = function(element,array)
{
	if( array != null )
	{
		for( var i= 0 ;i < array.length ;i++ )
		{
			element.classList.add(array[i]);
		}
	}
	return element;
}

var RemoveClasses = function(element,array)
{
	if( array != null )
	{
		for( var i = 0; i < array.length; i++ )
		{
			element.classList.remove(array[i]);
		}
	}
	return element;
}

var Bar = function(barClasses, barFillClasses)
{
	InterfaceCanHide.call(this);
	var bar = CreateSimpleElement("div",["bar"]);
	var fill = CreateSimpleElement("div",["barFill"]);
	bar.appendChild(fill);
	this.Refresh = function(percent)
	{
		fill.style.width = percent+"%";
	}
	this.AddClasses = function(barClasses,barFillClasses)
	{
		AddClasses(bar,barClasses);
		AddClasses(fill,barFillClasses);
	}
	this.RemoveClasses = function(barClasses,barFillClasses)
	{
		RemoveClasses(bar,barClasses);
		RemoveClasses(fill,barFillClasses);
	}
	this.AddClasses(barClasses,barFillClasses);
	this.element = bar;
}

var Panel = function()
{
	InterfaceCanStick.call(this);
	InterfaceCanAnchor.call(this);
	InterfaceCanMove.call(this);
	InterfaceCanHide.call(this);
	this.element = CreateSimpleElement("div",["panel"]);
}

var options = [];
var Options = {};
Options.SimpleDance = 0;
Options.LockIdolPositions = 1;
Options.ShowPlayerParticles = 2;
Options.ShowIdolParticles = 3;
Options.ShowDebugInfo = 4;
//Options.LowResolutionSprites = 5;
Options.RunInBackground = 6;
Options.BeatsPerMinute = 7;
Options.IdolDropShadow = 8;
Options.AutoSave = 9;
Options.IdolScale = 10;
//Options.UseCSSAnimations = 11;
Options.BigNumberFormatting = 12;
Options.ShowAdditionalData = 13;
Options.SimpleParticles = 14;
Options.Telemetry = 15;
Options.FormattingPrecision = 16;
Options.FormattingType = 17;
Options.UseSymbols = 18;
Options.SkipRender = 19;
//Options. = 5;
var OptionsPanel = new (function()
{
	Panel.call(this);
	var elements = [];
	this.element = CreateSimpleElement("div",["panel","optionsPanel","fixed"]);
	this.element.appendChild(CreateSimpleElement("span",["name","bold"],["Options"]));
	this.AddButton = function(text,onClickFunction)
	{
		var button = new Button(text,["button"],onClickFunction);
		this.element.appendChild(button.element);
	}
	this.AddBooleanOption = function(id,text,defaultValue,onClickFunction)
	{
		options[id] = defaultValue;
		var button = new ToggleButtonElement(text);
		button.element.onclick = function(event)
		{
			options[id] = !options[id];
			if ( onClickFunction )
			{
				onClickFunction(options[id]);
			}
			if ( options[id] )
			{
				button.Enable();
			}
			else
			{
				button.Disable();
			}
			event.stopPropagation();
		}
		elements[id] = button;
		if ( options[id] == false ) 
		{
			button.Disable();
		}
		this.element.appendChild(button.element);
	}
	this.AddSliderOption = function(id,text,minimum,maximum,defaultValue,decimals,onValueChangeFunction)
	{
		options[id] = defaultValue;
		var slider = new Slider(text,minimum,maximum,defaultValue,decimals,function(value)
		{
			options[id] = value;
			if ( onValueChangeFunction )
			{
				onValueChangeFunction(value);
			}
		});
		elements[id] = slider;
		slider.SetValue(options[id]);
		this.element.appendChild(slider.element);
	}
	this.AddChoiceSliderOption = function(id,text,choices,defaultIndex,onValueChangeFunction)
	{
		options[id] = choices[defaultIndex][1];
		var slider = new ChoiceSlider(text,choices,defaultIndex,function(value)
		{
			options[id] = value;
			if ( onValueChangeFunction )
			{
				onValueChangeFunction(value);
			}
		});
		elements[id] = slider;
		slider.SetIndex(slider.FindIndex(options[id]));
		this.element.appendChild(slider.element);
	}
	this.Refresh = function()
	{
		for ( var i in options )
		{
			if ( options[i] != null )
			{
				if ( elements[i] != null )
				{
					elements[i].Refresh(options[i]);
				}
			}
		}
	}
})();
document.body.appendChild(OptionsPanel.element);
OptionsPanel.Hide();
OptionsPanel.AddBooleanOption(Options.ShowPlayerParticles,"Player Particles",true);
OptionsPanel.AddBooleanOption(Options.ShowIdolParticles,"Idol Particles",true);
OptionsPanel.AddBooleanOption(Options.SimpleParticles,"Simple Particles",true);
OptionsPanel.AddBooleanOption(Options.SimpleDance,"Simple Dancing",false,function(enabled){ QualityChange(enabled); });
//OptionsPanel.AddBooleanOption(Options.UseCSSAnimations,"CSS Animations",true);
//OptionsPanel.AddBooleanOption(Options.LowResolutionSprites,"Low Resolution Sprites",false);
OptionsPanel.AddBooleanOption(Options.LockIdolPositions,"Lock Idols",false);
//OptionsPanel.AddBooleanOption(Options.IdolDropShadow,"Idol Shadow",true);
OptionsPanel.AddSliderOption(Options.IdolScale,"Idol Scale",IDOL_SCALE_MINIMUM,IDOL_SCALE_MAXIMUM,1.00,2);
OptionsPanel.AddBooleanOption(Options.ShowDebugInfo,"Show Debug Info",false);
OptionsPanel.AddBooleanOption(Options.ShowAdditionalData,"Show Additional Data",false);
OptionsPanel.AddBooleanOption(Options.UseSymbols,"Show Symbols",true,function(enabled)
{
	SymbolChange(enabled);
});
OptionsPanel.AddBooleanOption(Options.BigNumberFormatting,"Format Numbers",false,function(enabled)
{
	NumberFormattingChange(enabled);
});
OptionsPanel.AddSliderOption(Options.FormattingPrecision,"Formatting Precision",0,3,3,0,function(value)
{
	NumberFormattingChange(options[Options.BigNumberFormatting]);
});
OptionsPanel.AddChoiceSliderOption(Options.FormattingType,"Formatting Type",[
		["Letters",FormattingTypes.Letters],
		["SI",FormattingTypes.SI]
	],0,function(value)
{
	NumberFormattingChange(options[Options.BigNumberFormatting]);
});
OptionsPanel.AddBooleanOption(Options.RunInBackground,"Run In Background",true);
//OptionsPanel.AddBooleanOption(Options.Telemetry,"Allow Telemetry",true);
OptionsPanel.AddBooleanOption(Options.AutoSave,"Save Automatically",true);
OptionsPanel.AddButton("Reset Game",function(event,button)
	{
		var clientRect = button.getBoundingClientRect();
		OptionsPanel.Stick(ConfirmationPanel.element);
		ConfirmationPanel.Move(clientRect.right,clientRect.top);
		ConfirmationPanel.Refresh("Are you sure you want to reset your game and start from scratch? This is permanent!",function(confirm)
		{
			if( confirm )
			{
				WSHSend("onTelemetry",{"key":"idolclicker","action":"resetgame"});
				Reset();
				Initialize();
			}
			OptionsPanel.Unstick(ConfirmationPanel.element);
			ConfirmationPanel.Hide();
			event.stopPropagation();
		});
		ConfirmationPanel.Stick(OptionsPanel.element);
		ConfirmationPanel.Show();
	});
OptionsPanel.AddSliderOption(Options.BeatsPerMinute,"BPM",MINIMUM_BPM,MAXIMUM_BPM,85,0,function(value)
{
	beatsPerMinute = value;
	beatLength = (60/beatsPerMinute*1000);
	GenerateCSS();
});


var ChangelogPanel = new (function()
{
	Panel.call(this);
	var elements = [];
	var changelogPanel = this;
	this.element = CreateSimpleElement("div",["panel","changelogPanel","fixed"]);
	this.element.appendChild(CreateSimpleElement("span",["name","bold"],["Changelog"]));
	var changelog = null;
	this.Refresh = function()
	{
		if ( changelog != null )
		{
			this.element.removeChild(changelog);
		}
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status === 200 ) {
				var text = xhttp.responseText.trim();
				changelog = document.createElement("div");
				changelog.innerHTML = text;
				changelogPanel.element.appendChild(changelog);
				changelogPanel.Anchor();
			}
		};
		xhttp.open("GET", "changelog", true);
		xhttp.setRequestHeader("Cache-Control","no-cache");
		xhttp.send();
	}
})();
document.body.appendChild(ChangelogPanel.element);
ChangelogPanel.Hide();

var HelpPanel = new ( function()
{
	Panel.call(this);
	this.element = CreateSimpleElement("div",["panel","helpPanel","fixed","prewrap"]);
	this.element.appendChild(CreateSimpleElement("span",["helpHeader"],["Glossary"]));
	this.element.appendChild(CreateSimpleElement("span",["helpSection"],[
		LEVEL_SYMBOL+": Level - A level. Raising an Idol's level requires fans. Higher level Idol's earn more fans. Leveling up can unlock upgrades.\n",
		FAN_SYMBOL+": Fan - A fan. idol clicker's main currency.\n",
		PERFORMANCE_SYMBOL+": Performance - An action that gains fans.\n",
		ENCORE_SYMBOL+": Encore - An extra performance performed automatically at the end of a performance.\n",
		WORTH_SHARE_SYMBOL+": Worth Share - The percentage of an Idol's fan gain per performance that the user gains per user performance.\n",
		SOUL_LINK_SYMBOL+": Soul Link - The percentage increase of an Idol's fan gain per performance per 100 user performances.\n",
		ASTONISHMENT_SYMBOL+": Astonishment - The percent chance to perform astonishingly. Astonishing performances gain significantly more fans.\n",
		INSPIRATION_SYMBOL+": Inspiration Level - The level of inspiration. Every level of inspiration increases Idol performance rate, encore chance, worth share, and fan gain.\n",
		TIME_SYMBOL+": Total Career Time - The time passed since the career started until this moment.\n",
		SUPERVISION_SYMBOL+": Total Supervision Time - The time passed while the game is running."
	]));	

	this.element.appendChild(CreateSimpleElement("span",["helpHeader"],["\nHow to Play"]));
	this.element.appendChild(CreateSimpleElement("span",["helpSection"],[
		"Click (almost) anywhere on the screen to perform. Performances gain fans. Every 100 performances increases your base fan gain.\n",
		"As you gain more fans, more options will unlock. Try to get 100 fans to begin with.\n"
	]));		
})();
document.body.appendChild(HelpPanel.element);
HelpPanel.Hide();

var FeedbackPanel = new (function()
{
	Panel.call(this);
	var elements = [];
	this.element = CreateSimpleElement("div",["panel","feedbackPanel","fixed"]);
	this.element.appendChild(CreateSimpleElement("span",["name","bold"],["Leave Feedback"]));
	this.element.appendChild(CreateSimpleElement("span",["note","prewrap"],["Feedback is completely anonymous and not tied to your save file, your ip address, or any previous telemetry.\n\nFeel free to leave comments, criticisms, suggestions, bug reports, links to fanart, memes, or whatever."]));
	var textarea = CreateSimpleElement("textarea",["feedback"]);
	textarea.maxLength = 1000;
	this.element.appendChild(textarea);
	var sendButton = CreateSimpleElement("span",["button","active"],["Send"]);
	this.element.appendChild(sendButton);
	var error = CreateSimpleElement("span",["flavour"],[""]);
	this.element.appendChild(error);
	sendButton.onclick = function()
	{
		var message = textarea.value.substr(0,1000);
		if ( message.length > 0)
		{
			WSHSend("onTelemetry",{"key":"idolclicker","action":"feedback","message":message});
			textarea.value = "";
			error.childNodes[0].nodeValue = "Thank you for your feedback!";
		}
		else
		{
			error.childNodes[0].nodeValue = "There's nothing there!";
		}
	}
	this.Refresh = function()
	{
		error.childNodes[0].nodeValue = "";
	}
})();
document.body.appendChild(FeedbackPanel.element);
FeedbackPanel.Hide();

var IdolInfoPanel = new (function()
{
	Panel.call(this);
	this.lastIdol = null;
	this.lastTemplate = null;
	var elements = [];
	var idolInfoPanel = this;
	var element = CreateSimpleElement("div",["panel","idolInfoPanel","fixed"]);
	//element.appendChild(CreateSimpleElement("span",["name","bold"],["Idol Info"]));

	var data = CreateSimpleElement("div",["idolInfoPanelData"]);

	var info = CreateSimpleElement("span",["idolInfoPanelInfo"]);
	var infoText = document.createTextNode("Idol");
	info.appendChild(infoText);
	data.appendChild(info);
	element.appendChild(data);

	var levelUpButton = CreateSimpleElement("div",["button","levelUpButton"]);
	var levelUpButtonImage = CreateSimpleElement("img",["levelUpButtonImage"]);
	levelUpButtonImage.src = "./img/levelu.png";
	levelUpButton.appendChild(levelUpButtonImage);


	levelUpButton.onclick = function(event)
	{
		levelUpButton.Pressed();
		event.stopPropagation();
	}

	levelUpButton.onmousedown = function(event)
	{
		if ( event.button == 2 )
		{
			autoClickLast = Date.now();
			autoClickTarget = levelUpButton;
			autoClickTarget.Pressed();
		}
		event.stopPropagation();
	}

	/*var toggleButton = CreateSimpleElement("div",["button","idolToggleButton"]);
	var toggleButtonImage = CreateSimpleElement("img",["idolToggleButtonImage"]);
	toggleButtonImage.src = "./img/visible.png";
	toggleButton.appendChild(toggleButtonImage);*/

	var detailsButton = CreateSimpleElement("div",["button","idolDetailsButton"]);
	var detailsButtonImage = CreateSimpleElement("img",["idolDetailsButtonImage"]);
	detailsButtonImage.src = "./img/information.png";
	detailsButton.appendChild(detailsButtonImage);

	var upgradeButtons = CreateSimpleElement("div",["idolInfoPanelButtons"]);
	element.appendChild(upgradeButtons);

	var otherButtons = CreateSimpleElement("div",["idolInfoPanelButtons"]);
	otherButtons.appendChild(levelUpButton);
	//otherButtons.appendChild(toggleButton);
	otherButtons.appendChild(detailsButton);

	element.appendChild(upgradeButtons);
	element.appendChild(otherButtons);

	var buttons = {};
	

	var changelog = null;
	this.clientRect = null;
	this.Refresh = function(idol,template)
	{
		var clear = template != this.lastTemplate;
		this.lastIdol = idol;
		this.lastTemplate = template;
		if ( clear )
		{
			buttons  = [];
			ClearElement(upgradeButtons);
		}
		if ( idol != null )
		{
			var upgrades = idol.upgrades;
			levelUpButtonImage.src = "./img/levelu.png";
			if ( fans >= idol.UpgradeCost() )
			{
				levelUpButton.classList.remove("expensive");
			}
			else
			{
				levelUpButton.classList.add("expensive");
			}
			levelUpButton.Pressed = function()
			{
				if ( fans >= idol.UpgradeCost() )
				{
					fans -= idol.UpgradeCost();
					idol.Upgrade();
					idolListEntries[idol.id].Refresh();
					idolInfoPanel.Refresh(idol);
				}
			}
			/*toggleButton.classList.remove("hidden");
			toggleButton.classList.remove("locked");
			if ( idol.away )
			{
				toggleButtonImage.src = "./img/visible.png";
			}
			else
			{
				toggleButtonImage.src = "./img/invisible.png";
			}
			toggleButton.onclick = function(event)
			{
				idol.Travel();
				IdolInfoPanel.Refresh(idol);
				event.stopPropagation();
			}*/

			detailsButton.classList.remove("hidden");
			detailsButton.classList.remove("locked");
			detailsButton.onclick = function(event)
			{
				IdolDetailsPanel.Show();
				IdolDetailsPanel.Refresh(idol);
				IdolDetailsPanel.Stick(IdolInfoPanel.element);
				IdolInfoPanel.CopyAnchor(IdolDetailsPanel);
				IdolInfoPanel.Hide();
				IdolDetailsPanel.Anchor();
				event.stopPropagation();
			}
			if ( upgrades )
			{
				for ( var i = 0; i < upgrades.length; i++ )
				{
					var upgrade = upgrades[i];
					if ( upgrade != null )
					{
						if ( buttons[upgrade.id] == null )
						{
							var button = CreateSimpleElement("div",["button","upgradeButton"]);
							upgradeButtons.appendChild(button);
							if ( upgrade.icon != null )
							{
								var buttonImage = CreateSimpleElement("img",["upgradeButtonImage"]);
								buttonImage.src = upgrade.icon;
								button.appendChild(buttonImage);
							}
							buttons[upgrade.id] = button;
						}
						var upgradeButton = buttons[upgrade.id];
						
						if ( upgrade.Condition(idol))
						{
							upgradeButton.classList.remove("hidden");
						}
						else
						{
							upgradeButton.classList.add("hidden");
						}
						if ( !upgrade.unlocked )
						{
							upgradeButton.classList.add("locked");
							upgradeButton.classList.remove("active");
							if ( fans < upgrade.Cost(idol) )
							{
								upgradeButton.classList.add("expensive");
							}
							else
							{
								upgradeButton.classList.remove("expensive");
							}
						}
						else
						{
							upgradeButton.classList.remove("locked");
							if ( !upgrade.Toggle && upgrade.skillID == null )
							{
								upgradeButton.classList.add("hidden");
							}
							if(  upgrade.skillID != null )
							{
								var skill = SkillRegistry.Get(upgrade.skillID);
								if ( Date.now() < skill.cooldownTime )
								{
									upgradeButton.classList.add("expensive");
								}
								else
								{
									upgradeButton.classList.remove("expensive");
								}
							}
						}
						if ( upgrade.unlocked && upgrade.Toggle != null )
						{
							if ( !upgrade.enabled )
							{
								upgradeButton.classList.add("inactive");
								upgradeButton.classList.remove("active");
							}
							else
							{
								upgradeButton.classList.add("active");
								upgradeButton.classList.remove("inactive");
							}
						}
						
						upgradeButton.onclick = (function(upgrade){return function(event)
						{
							var clientRect = this.getBoundingClientRect();
							UpgradePanel.SetAnchor(clientRect.left,clientRect.top-4,false,true);
							IdolInfoPanel.Stick(UpgradePanel.element);
							UpgradePanel.Show();
							UpgradePanel.Refresh(upgrade);
							UpgradePanel.Anchor();
							event.stopPropagation();
						}})(upgrade);
					}
				}
			}
			infoText.nodeValue = idol.template.name;
			if ( idol.Mastery() > 0 )
			{
				infoText.nodeValue += " "+MASTERY_SYMBOLS[idol.Mastery()-1];
			}
			//infoText.nodeValue = "L"+Formatters.Format("integer",idol.level)+" "+idol.template.name+
			//"\n"+Formatters.Format("integer",(idol.FanGain()*1000)/PERFORMANCE_TIME)+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL+
			//"\n"+Formatters.Format("integer",idol.UpgradeCost())+FAN_SYMBOL+
			//"\n"+Formatters.Format("integer",idol.performances)+PERFORMANCE_SYMBOL;
		}
		else if ( template != null )
		{
			infoText.nodeValue = "???" +
			"\n"+Formatters.Format("integer",(template.baseCost))+FAN_SYMBOL;
			levelUpButtonImage.src = "./img/unlocku.png";
			/*toggleButtonImage.src = "./img/empty.png";
			toggleButton.classList.add("locked");
			toggleButton.classList.add("hidden");*/
			if ( fans < template.baseCost )
			{
				levelUpButton.classList.add("expensive");
			}
			else
			{
				levelUpButton.classList.remove("expensive");
			}
			levelUpButton.Pressed = function()
			{
				if ( template != null )
				{
					if ( fans >= template.baseCost )
					{
						fans -= template.baseCost;
						var idol = template.Generate();
						AddIdol(idol);
						idolListEntries[idol.id].Refresh();
						idolInfoPanel.Refresh(idol);
					}
				}
			}
			//toggleButton.onclick = null;
			detailsButton.classList.add("locked");
			detailsButton.classList.add("hidden");
			detailsButton.onclick = null;
		}
		this.clientRect = element.getBoundingClientRect();
		this.Anchor();
	}
	
	this.element = element;
})();
document.body.appendChild(IdolInfoPanel.element)
IdolInfoPanel.Hide();

var StatElement = function(advanced)
{
	this.element = CreateSimpleElement("div",["stat"]);
	var label = CreateSimpleElement("span",["statLabel"],["Label"]);
	this.element.appendChild(label);
	var value = CreateSimpleElement("span",["statValue"],["Value"]);
	this.element.appendChild(value);
	this.Refresh = function(labelText,valueText)
	{
		if ( this.advanced && !options[Options.ShowAdditionalData] ) 
		{
			this.element.classList.add("hidden");
		}
		else if ( !this.advanced || options[Options.ShowAdditionalData] )
		{
			this.element.classList.remove("hidden");
			label.childNodes[0].nodeValue = labelText;
			value.childNodes[0].nodeValue = valueText;
		}
	}
}

var StatList = function()
{
	var stats = [];
	var element = CreateSimpleElement("div",["statList"]);
	var labels = CreateSimpleElement("div",["statListLabels","prewrap"],["Label"]);
	var values = CreateSimpleElement("div",["statListValues","prewrap"],["Value"]);
	element.appendChild(labels);
	element.appendChild(values);
	this.Register = function(label,valueFunction,advanced)
	{
		stats.push([label,valueFunction,advanced]);
	}
	this.Refresh = function(data)
	{
		var labelString = "";
		var valueString = "";
		for ( var i = 0; i < stats.length ;i++ )
		{
			if ( !stats[i][2] || ( options[Options.ShowAdditionalData] && stats[i][2] ) )
			{
				labelString += stats[i][0]+"\n";
				valueString += stats[i][1](data)+"\n";
			}
		}
		labels.childNodes[0].nodeValue = labelString;
		values.childNodes[0].nodeValue = valueString;
	}
	this.element= element;
}

var IdolDetailsPanel = new (function()
{
	Panel.call(this);
	var idolDetailsPanel = this;
	var lastIdol = null;

	var left = CreateSimpleElement("div",["idolDetailsPanelLeft"]);
	this.element.appendChild(left);
	var right = CreateSimpleElement("div",["idolDetailsPanelRight"]);
	this.element.appendChild(right);

	var previewCanvas = document.createElement("canvas");
	var previewContext = previewCanvas.getContext("2d");
	var previewScale = 0.5
	previewCanvas.height = 512*previewScale;
	previewCanvas.width = 512*previewScale;
	left.appendChild(previewCanvas);
	this.element.classList.add("idolDetailsPanel");
	previewCanvas.classList.add("nearestNeighbour");

	var nameElement = CreateSimpleElement("span",["idolName"],["Name"]);
	left.appendChild(nameElement);

	var statsElement = CreateSimpleElement("div",["idolStats","panel"]);
	var stats = [
		[LEVEL_SYMBOL						,function(idol){return Formatters.Format("integer",idol.level);}, new StatElement()],
		[FAN_SYMBOL+"/"+LEVEL_SYMBOL		,function(idol){return Formatters.Format("integer",idol.UpgradeCost());}, new StatElement()],
		[FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL	,function(idol){return Formatters.Format("integer",idol.BaseFanGain());}, new StatElement()],
		[ENCORE_SYMBOL						,function(idol){return Formatters.Format("percent",idol.EncoreChance());}, new StatElement()],
		[PERFORMANCE_SYMBOL					,function(idol){return Formatters.Format("integer",idol.performances);}, new StatElement()],
		[WORTH_SHARE_SYMBOL					,function(idol){return Formatters.Format("percent",idol.WorthShare());}, new StatElement()],
		[FAN_SYMBOL							,function(idol){return Formatters.Format("integer",idol.fans);}, new StatElement()],
		[SOUL_LINK_SYMBOL					,function(idol){return Formatters.Format("percent",idol.SoulLink());}, new StatElement()],
		[ASTONISHMENT_SYMBOL				,function(idol){return Formatters.Format("percent",idol.AstonishmentChance());}, new StatElement()],
		[PERFORMANCE_SYMBOL+"/s"			,function(idol){return Formatters.Format("decimal",1000/idol.PerformanceTime());}, new StatElement()]
	];
	for( var i = 0; i < stats.length; i++ )
	{
		statsElement.appendChild(stats[i][2].element);
	}
	left.appendChild(statsElement);

	var tabBar = CreateSimpleElement("div",["idolDetailsPanelTabBar"]);
	right.appendChild(tabBar);
	
	var storyTab = CreateSimpleElement("span",["idolDetailsPanelTab","button","unlocked"],["Data"]);
	var storyTabPage = CreateSimpleElement("div",["idolDetailsPanelTabPage"]);
	var storyTabPanel = CreateSimpleElement("div",["storyTabPanel","panel"]);
	var storyTabInfo = CreateSimpleElement("span",["storyTabInfo","prewrap"],["Info"]);
	storyTabPanel.appendChild(storyTabInfo);
	storyTabPage.appendChild(storyTabPanel);

	var wardrobeTab = CreateSimpleElement("span",["idolDetailsPanelTab","button","unlocked"],["Wardrobe"]);
	var wardrobeTabContent = CreateSimpleElement("div",["tabPageContent"]);
	var wardrobeTabPage = CreateSimpleElement("div",["idolDetailsPanelTabPage"]);
	var wardrobeTabInfo = CreateSimpleElement("span",["wardrobeTabInfo","prewrap"],["Info"]);
	wardrobeTabContent.appendChild(wardrobeTabInfo);
	wardrobeTabPage.appendChild(wardrobeTabContent);

	var upgradeButtons = [];
	var upgradesTab = CreateSimpleElement("span",["idolDetailsPanelTab","button","unlocked"],["Upgrades"]);
	var upgradesContent = CreateSimpleElement("div",["tabPageContent"]);
	var upgradesTabPage = CreateSimpleElement("div",["idolDetailsPanelTabPage"]);
	upgradesTabPage.appendChild(upgradesContent);

	var optionsTab = CreateSimpleElement("span",["idolDetailsPanelTab","button","unlocked"],["Options"]);
	var optionsTabContent = CreateSimpleElement("div",["tabPageContent"]);
	var optionsTabPage = CreateSimpleElement("div",["idolDetailsPanelTabPage"]);

	var beatRateChoices = [
		["4",0.25],
		["2",0.50],
		["1",1.00],
		["1/3",1.50],
		["1/4",2.00],
		["1/8",3.00],
		["1/16",4.00]
	];
	var beatOffsetChoices = [
		["0",0],
		["1/2",0.50],
		["1",1],
		["3/2",1.5],
		["2",2],
		["3",3],
		["4",4]
	];
	var frameRateModifierChoices = [
		["1/4",0.25],
		["1/2",0.50],
		["1",1.00],
		["1.5",1.50],
		["2",2.00],
		["3",3.00],
		["4",4.00]
	];
	var idolOptions = [
		[OptionTypes.Boolean,"Visible",IdolOptions.Visible,true,null],
		[OptionTypes.Boolean,"Flip",IdolOptions.Flip,false,null],
		[OptionTypes.Slider,"Scale",IdolOptions.Scale,[0.25,2.00,1.00,2],true,null],
		[OptionTypes.ChoiceSlider,"Beat Rate",IdolOptions.Beat,beatRateChoices,null],
		[OptionTypes.ChoiceSlider,"Beat Offset",IdolOptions.BeatOffset,beatOffsetChoices,null],
		[OptionTypes.ChoiceSlider,"Frame Length Modifier",IdolOptions.FrameLengthModifier,frameRateModifierChoices,null]
	];
	for( var i = 0; i < idolOptions.length; i++)
	{
		var optionElement = null;
		if ( idolOptions[i][0] === OptionTypes.ChoiceSlider )
		{
			optionElement = new ChoiceSlider(idolOptions[i][1],idolOptions[i][3],0);
		}
		else if ( idolOptions[i][0] === OptionTypes.Boolean )
		{
			optionElement = new ToggleButtonElement(idolOptions[i][1]);
		}
		else if ( idolOptions[i][0] === OptionTypes.Slider )
		{
			optionElement = new Slider(idolOptions[i][1],idolOptions[i][3][0],idolOptions[i][3][1],idolOptions[i][3][2],idolOptions[i][3][3]);
		}
		idolOptions[i][4] = optionElement;
		optionsTabContent.appendChild(optionElement.element);
	}
	optionsTabPage.appendChild(optionsTabContent);

	var tabs = [
		[storyTab,storyTabPage],
		[wardrobeTab,wardrobeTabPage],
		[upgradesTab,upgradesTabPage],
		[optionsTab,optionsTabPage]
	];

	var ActivateTabPage = function(index)
	{
		for ( var i = 0; i < tabs.length; i++ )
		{
			tabs[i][0].classList.remove("active");
			tabs[i][1].classList.add("hidden");
		}
		tabs[index][0].classList.add("active");
		tabs[index][1].classList.remove("hidden");
		idolDetailsPanel.Anchor();
	}
	for ( var i = 0; i < tabs.length; i++ )
	{
		tabBar.appendChild(tabs[i][0]);
		right.appendChild(tabs[i][1]);
		tabs[i][0].onclick = (function(i){ return function(){ ActivateTabPage(i); }})(i);
	}
	var variantButtons = [];
	ActivateTabPage(0);

	this.Refresh = function(idol,previewOnly)
	{
		if ( idol === undefined || idol === null )
		{
			idol = lastIdol;
		}
		if ( !this.Hidden() && idol != null)
		{
			if( !previewOnly === true )
			{
				var upgrades = idol.upgrades;
				if( lastIdol != idol )
				{
					var name = idol.template.name;
					if ( idol.Mastery() > 0 )
					{
						name += " "+MASTERY_SYMBOLS[idol.Mastery()-1];
					}
					nameElement.childNodes[0].nodeValue = name;

					for( var i = 0; i < idolOptions.length; i++)
					{
						var optionElement = idolOptions[i][4];
						if (idolOptions[i][0] === OptionTypes.ChoiceSlider )
						{
							optionElement.Refresh(idol.options[idolOptions[i][2]]);
							optionElement.OnValueChange = (function(idol,idolOption){
								return function(value)
								{
									idol.options[idolOption] = value;
								}
							})(idol,idolOptions[i][2]);
						}
						else if (idolOptions[i][0] === OptionTypes.Slider )
						{
							optionElement.Refresh(idol.options[idolOptions[i][2]]);
							optionElement.OnValueChange = (function(idol,idolOption){
								return function(value)
								{
									idol.options[idolOption] = value;
								}
							})(idol,idolOptions[i][2]);
						}
						else if (idolOptions[i][0] === OptionTypes.Boolean )
						{
							if ( idol.options[idolOptions[i][2]] )
							{
								optionElement.Enable();
							}
							else
							{
								optionElement.Disable();
							}
							optionElement.element.onclick = (function(optionElement,idol,idolOption){
								return function(event)
								{
									idol.options[idolOption] = !idol.options[idolOption];
									if ( idol.options[idolOption] )
									{
										optionElement.Enable();
									}
									else
									{
										optionElement.Disable();
									}
									event.stopPropagation();
								}
							})(optionElement,idol,idolOptions[i][2]);
						}
					}
					
					ClearElement(wardrobeTabContent);
					for( var i = 0; i < idol.template.outfits.length; i++ )
					{
						var outfit = idol.template.outfits[i];
						var outfitEntry = CreateSimpleElement("div",["idolOutfitEntry","button"]);
						var outfitName = CreateSimpleElement("span",["idolOutfitEntryName"],["Name"]);
						outfitEntry.appendChild(outfitName);
						var outfitDescription = CreateSimpleElement("span",["idolOutfitEntryDescription"],["Description"]);
						outfitEntry.appendChild(outfitDescription);
						wardrobeTabContent.appendChild(outfitEntry);
						if ( outfit.frames.length > 1 )
						{
							var variants = CreateSimpleElement("div",["idolVariants"]);
							outfitEntry.appendChild(variants);
							for (var j = 0; j < outfit.frames.length; j++)
							{
								var variantButton = CreateSimpleElement("div",["idolVariantButton","button"],[String.fromCharCode(j+65)]);
								variantButton.outfit = i;
								variantButton.variant = j;
								variantButton.outfitEntry = outfitEntry;
								variantButtons.push(variantButton);
								variants.appendChild(variantButton);
							}
						}
						else
						{
							outfitEntry.outfitEntry = outfitEntry;
							outfitEntry.outfit = i;
							outfitEntry.variant = 0;
							variantButtons.push(outfitEntry);
						}
					}
					ClearElement(upgradesContent);
					upgradeButtons = [];
					if ( upgrades )
					{
						for ( var i = 0; i < upgrades.length; i++ )
						{
							var upgrade = upgrades[i];
							if ( upgrade != null )
							{
								if ( upgradeButtons[upgrade.id] == null )
								{
									var button = CreateSimpleElement("div",["button","upgradeButton"]);
									upgradesContent.appendChild(button);
									if ( upgrade.icon != null )
									{
										var buttonImage = CreateSimpleElement("img",["upgradeButtonImage"]);
										buttonImage.src = upgrade.icon;
										button.appendChild(buttonImage);
									}
									upgradeButtons[upgrade.id] = button;
								}
							}
						}
					}
				}
				if ( upgrades )
				{
					for ( var i = 0; i < upgrades.length; i++ )
					{
						var upgrade = upgrades[i];
						var upgradeButton = upgradeButtons[upgrade.id];
											
						if ( upgrade.Condition(idol))
						{
							upgradeButton.classList.remove("hidden");
						}
						else
						{
							upgradeButton.classList.add("hidden");
						}
						if ( !upgrade.unlocked )
						{
							upgradeButton.classList.add("locked");
							upgradeButton.classList.remove("active");
							if ( fans < upgrade.Cost(idol) )
							{
								upgradeButton.classList.add("expensive");
							}
							else
							{
								upgradeButton.classList.remove("expensive");
							}
						}
						else
						{
							upgradeButton.classList.remove("expensive");
							upgradeButton.classList.remove("locked");
							if(  upgrade.skillID != null )
							{
								var skill = SkillRegistry.Get(upgrade.skillID);
								if ( Date.now() < skill.cooldownTime )
								{
									upgradeButton.classList.add("expensive");
								}
								else
								{
									upgradeButton.classList.remove("expensive");
								}
							}
						}
						if ( upgrade.unlocked && upgrade.Toggle != null )
						{
							if ( !upgrade.enabled )
							{
								upgradeButton.classList.add("inactive");
								upgradeButton.classList.remove("active");
							}
							else
							{
								upgradeButton.classList.add("active");
								upgradeButton.classList.remove("inactive");
							}
						}
						
						upgradeButton.onclick = (function(upgrade){return function(event)
						{
							var clientRect = this.getBoundingClientRect();
							UpgradePanel.SetAnchor(clientRect.left,clientRect.top-4,false,true);
							IdolDetailsPanel.Stick(UpgradePanel.element);
							UpgradePanel.Show();
							UpgradePanel.Refresh(upgrade);
							UpgradePanel.Anchor();
							event.stopPropagation();
						}})(upgrade);
					}
				}

				storyTabInfo.childNodes[0].nodeValue = idol.template.bio[0] +
				"\n" + idol.template.bio[1] +
				"\n\n" + idol.template.bio[2] +
				"\n\n" + (idol.level >= IDOL_INFO_LORE_LEVEL_REQUIREMENT ? idol.template.bio[3] : "??? (Unlocks at level "+IDOL_INFO_LORE_LEVEL_REQUIREMENT+")") +
				"\n\nLikes: " + (idol.level >= IDOL_INFO_LIKES_LEVEL_REQUIREMENT ?  idol.template.bio[4] : "??? (Unlocks at level "+IDOL_INFO_LIKES_LEVEL_REQUIREMENT+")") +
				"\n\nDislikes: " + (idol.level >= IDOL_INFO_LIKES_LEVEL_REQUIREMENT ?  idol.template.bio[5] : "??? (Unlocks at level "+IDOL_INFO_LIKES_LEVEL_REQUIREMENT+")");



				for( var i = 0; i < stats.length; i++ )
				{
					stats[i][2].Refresh(stats[i][0],stats[i][1](idol));
				}

				for( var i = 0; i < variantButtons.length; i++ )
				{
					var variantButton = variantButtons[i];
					var outfitEntry = variantButton.outfitEntry;
					var outfit = idol.template.outfits[variantButton.outfit];
					var variant = variantButton.variant;
					var outfitName = outfitEntry.childNodes[0];
					var outfitDescription = outfitEntry.childNodes[1];
					if ( idol.wardrobe[variantButton.outfit] === true )
					{
						outfitEntry.classList.remove("locked");
						outfitEntry.classList.add("unlocked");
						variantButton.classList.remove("locked");
						variantButton.classList.add("unlocked");
						variantButton.classList.remove("hidden");
						if ( idol.outfit == variantButton.outfit )
						{
							outfitEntry.classList.add("active");
							if ( idol.variant == variantButton.variant )
							{
								variantButton.classList.add("active");
							}
							else
							{
								variantButton.classList.remove("active");
							}
						}
						else
						{
							outfitEntry.classList.remove("active");
							variantButton.classList.remove("active");
						}
						outfitName.childNodes[0].nodeValue = outfit.name;
						outfitDescription.childNodes[0].nodeValue = outfit.description;
						variantButton.onclick = (function(outfit,variant){
							return function()
							{
								idol.outfit = outfit;
								idol.variant = variant;
								idolDetailsPanel.Refresh();
							}
						})(variantButton.outfit,variantButton.variant);
					}
					else
					{
						outfitEntry.classList.add("locked");
						outfitEntry.classList.remove("unlocked");
						variantButton.classList.add("locked");
						variantButton.classList.remove("unlocked");
						if ( variantButton.outfitEntry != variantButton )
						{
							variantButton.classList.add("hidden");
						}
						outfitName.childNodes[0].nodeValue = "???";
						outfitDescription.childNodes[0].nodeValue = "This outfit has not been unlocked.";
					}
				}
			}

			var frame = idol.Frame();
			var image = idol.template.outfits[idol.outfit].frames[idol.variant][frame];
			previewContext.clearRect(0,0,previewCanvas.width, previewCanvas.height);
			previewContext.save();
			var x = previewCanvas.width;
			var y = previewCanvas.height;
			previewContext.translate(previewCanvas.width/2,previewCanvas.height * idol.registrationY);
			previewContext.scale(previewScale,previewScale);
			previewContext.scale(idol.scaleX,idol.scaleY);
			if ( idol.options[IdolOptions.Flip] )
			{
				previewContext.scale(-idol.scaleX,1);
			}
			previewContext.rotate(idol.rotation);
			previewContext.translate(image.width * -idol.registrationX, image.height * -idol.registrationY);
			if ( image.ready )
			{
				previewContext.drawImage(image,0,0,image.width,image.height);
			}
			else
			{
				previewContext.drawImage(errorCanvas,0,0,image.width,image.height);
			}
			
			previewContext.restore();
		}
		
		lastIdol = idol;
	}
});
document.body.appendChild(IdolDetailsPanel.element)
IdolDetailsPanel.Hide();

var NotificationPanel = new(function()
{
	Panel.call(this);
	var element = CreateSimpleElement("div",["panel","notificationPanel","fixed"],["Hello World"]);
	this.Refresh = function(text)
	{
		element.childNodes[0].nodeValue = text;
	}
	this.element = element;
})();
document.body.appendChild(NotificationPanel.element);
NotificationPanel.Hide();

var ConfirmationPanel = new(function()
{
	Panel.call(this);
	var element = CreateSimpleElement("div",["panel","confirmationPanel","fixed"],["Confirm"]);
	//💀
	var buttons = CreateSimpleElement("div",["confirmationPanelButtons"]);
	var confirmButton = CreateSimpleElement("div",["button","confirm"],["Confirm"]);
	buttons.appendChild(confirmButton);
	var cancelButton = CreateSimpleElement("div",["button","cancel"],["Cancel"]);
	buttons.appendChild(cancelButton);
	element.appendChild(buttons);
	this.Refresh = function(text,callback)
	{
		element.childNodes[0].nodeValue = text;
		if ( callback )
		{
			confirmButton.onclick = function(event)
			{
				callback(true);
				event.stopPropagation();
			}
			cancelButton.onclick = function(event)
			{
				callback(false);
				event.stopPropagation();
			}
		}
		else
		{
			confirmButton.onclick = null;
			cancelButton.onclick = null;
		}
	}
	this.element = element;
})();
document.body.appendChild(ConfirmationPanel.element);
ConfirmationPanel.Hide();

var Log = function()
{
	var string = "";
	for ( var i= 0 ;i < arguments.length; i++ )
	{
		string += String(arguments[i]);
	}
	var message = document.createElement("span");
	message.classList.add("consoleMessage");
	message.appendChild(document.createTextNode(string));
	//consoleElement.appendChild(message);
}

var ClearLog = function()
{
	/*while ( consoleElement.childNodes.length > 0 )
	{
		consoleElement.removeChild(consoleElement.firstChild);
	}*/
}

var ClearElement = function(element)
{
	while( element.firstChild )
	{
		element.removeChild(element.firstChild);
	}
}

var container = document.createElement("div");
container.classList.add("container");
container.appendChild(metaContent);

var idolContainer = document.createElement("div");
idolContainer.classList.add("idolContainer");

var inspirationElement = CreateSimpleElement("div",["inspiration"]);
idolContainer.appendChild(inspirationElement);

var inspirationBar = CreateSimpleElement("div",["bar","inspirationBar"]);
inspirationElement.appendChild(inspirationBar);

var inspirationBarFill = CreateSimpleElement("div",["barFill","inspirationBarFill"]);
inspirationBar.appendChild(inspirationBarFill);

var inspirationText = CreateSimpleElement("span",["inspirationText"],["Inspiration"]);
inspirationElement.appendChild(inspirationText);

var inspirationIcon = SVGIcon("./img/star.svg");
inspirationElement.appendChild(inspirationIcon);

var inspirationSubText = CreateSimpleElement("span",["inspirationSubText"],["Duration"]);
inspirationElement.appendChild(inspirationSubText);

var idolCanvas = document.createElement("canvas");
idolCanvas.classList.add("idolCanvas");
idolCanvas.width = 640;
idolCanvas.height = 480;
var idolContext = idolCanvas.getContext("2d");

idolContainer.appendChild(idolCanvas);
container.appendChild(idolContainer);

/*var IdolContainerRect = function()
{
	if ( idolContainer.boundingRect == null )
	{
		idolContainer.boundingRect = idolContainer.getBoundingClientRect();
	}
	return idolContainer.boundingRect;
}*/

var IdolListRect = function()
{
	if ( idolList.boundingRect == null )
	{
		idolList.boundingRect = idolList.getBoundingClientRect();
	}
	return idolList.boundingRect;
}

var particleContainer = document.createElement("div");
particleContainer.classList.add("particleContainer");

var PlayerInfoPanel = new (function()
{
	Panel.call(this);
	this.element = CreateSimpleElement("div",["panel","playerInfoPanel","fixed"]);
	var statList = new StatList();
	statList.Register(FAN_SYMBOL							,function(){return Formatters.Format("integer",shownFans);						});
	statList.Register(FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL		,function(){return Formatters.Format("integer",FanGain(1,false).fans);			});
	statList.Register(FAN_SYMBOL+"/s"						,function(){return Formatters.Format("integer",fansPerSecond);					});
	statList.Register(PERFORMANCE_SYMBOL					,function(){return Formatters.Format("integer",Math.round(userPerformances));	}, true);
	statList.Register(TIME_SYMBOL							,function(){return FormatDuration((now-careerStarted));							}, true);
	statList.Register(SUPERVISION_SYMBOL					,function(){return FormatDuration(supervisionTime);								}, true);
	this.element.appendChild(statList.element);
	this.Refresh = function()
	{
		statList.Refresh();
	}
})();
idolContainer.appendChild(PlayerInfoPanel.element);

//var fansCounter = document.createElement("div");
//fansCounter.classList.add("fans");
//fansCounter.appendChild(document.createTextNode(FAN_SYMBOL));
//idolContainer.appendChild(fansCounter);


var idolList = document.createElement("span");
idolList.classList.add("idolList");
container.appendChild(idolList);

var AlertFeed = new (function()
{
	var alerts = [];
	var queue = [];
	var scrollPercent = 0;
	var feed = CreateSimpleElement("div",["alertFeed"]);
	var messages = CreateSimpleElement("div",["alertMessages"]);
	feed.appendChild(messages);
	this.Update = function(dt,now)
	{
		if ( alerts.length > 0 )
		{
			scrollPercent += ALERT_FEED_SCROLL_SPEED * dt/1000;
		}
		else
		{
			scrollPercent = 0;
		}
		if ( scrollPercent >= 1 || (scrollPercent == 0 && alerts.length == 0 ))
		{
			for( var i = 0; i < alerts.length; i++ )
			{
				messages.removeChild(alerts[i].element);
			}
			alerts = queue;
			for( var i = 0; i < alerts.length; i++ )
			{
				messages.appendChild(alerts[i].element);
			}
			queue = [];
			if( alerts.length == 0 )
			{
				this.Hide();
			}
			scrollPercent = 0;
		}
		for ( var i = 0; i < alerts.length; i++ )
		{
			alerts[i].Update(dt,now);
		}
	}
	this.Refresh = function()
	{
		if ( alerts.length > 0 )
		{
			var width = messages.scrollWidth;
			for ( var i = 0; i < alerts.length; i++ )
			{
				alerts[i].Refresh();
			}
			messages.style.left = Math.floor(-width+((1-scrollPercent) * (screenWidth+width)))+"px";
		}
	}
	this.AddAlert = function(text)
	{
		if( queue.length == 0 )
		{
			ShowAlertFeed();
		}
		var alert = new Alert(text);
		queue.push( alert );
	}
	this.Show = function()
	{
		feed.classList.add("active");
		Resize();
	}
	this.Hide = function()
	{
		feed.classList.remove("active");
		Resize();
	}
	this.element = feed;
})();
container.appendChild(AlertFeed.element);

var Alert = function(text)
{
	this.element = CreateSimpleElement("span",["alertFeedMessage"],[text]);
	//this.percent = 0;
	this.Update = function(dt)
	{
	}
	this.Refresh = function()
	{
	}
}
document.body.appendChild(container);
document.body.appendChild(particleContainer);

var Particle = function(x,y,vx,vy,element,lifeTime,data,classes)
{
	var x = x;
	var y = y;
	var vx = vx;
	var vy = vy;
	vx == null ? vx = (Math.random()-.5) * 3 : null;
	vy == null ? vy = -4 : null;
	var rotation = 0;
	var rotationSpeed = (Math.random()-.5)*3;
	var lifeTime = lifeTime;
	if( lifeTime == null )
	{
		lifeTime = PARTICLE_LIFETIME;
	}
	var time = 0;
	this.flow = false;
	this.dead = false;
	this.element = element;
	this.element.style.left = x+"px";
	this.element.style.top = y+"px";
	if( classes != null )
	{
		for( var i= 0; i < classes.length; i++ )
		{
			this.element.classList.add(classes[i]);
		}
	}
	this.Update = function(dt)
	{
		time += dt;
		if ( time >= lifeTime )
		{
			this.dead = true;
		}
	}
	this.Refresh = function()
	{
		if ( this.element != null )
		{
			/*if ( !options[Options.SimpleParticles] )
			{
				x += vx;
				y += vy;
				rotation += rotationSpeed;
				vx *= .9;
				vy *= .9;
				rotationSpeed *= .9;
				this.element.style.left = x+"px";
				this.element.style.top = y+"px";
				this.element.style.transform = "translate(-50%,-50%) rotate("+rotation+"deg)";
				this.element.style.opacity = 1-Math.pow(time/lifeTime,6);
			}*/
		}
	}
}

var canvasParticles = [];

var CanvasParticle = function(x,y,vx,vy,lifeTime)
{
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.vx == null ? this.vx = (Math.random()-.5) * 3 : null;
	this.vy == null ? this.vy = Math.random()*-4 : null;
	this.rotation = 0;
	this.rs = 0;
	this.lifeTime = lifeTime;
	this.startTime = now;
	this.registrationX = 0.5;
	this.registrationY = 0.5;
	this.scaleX = 1;
	this.scaleY = 1;
	this.dead = false;
	this.Update = function(dt){}
	this.Refresh = function(){}
	this.Dispose = function(){}
}

var sparkleImage = document.createElement("img");
sparkleImage.src = "./img/sparkle.svg";
var Sparkle = function(x,y,vx,vy,lifeTime,size)
{
	CanvasParticle.call(this,x,y,vx,vy,lifeTime);
	this.width = size || Math.random()*24+24;
	this.height = this.width;
	this.Update = function(dt,now)
	{
		if( now - this.startTime > this.lifeTime )
		{
			this.dead = true;
		}
	}
	this.Refresh = function(now)
	{
		var percent = (now - this.startTime)/this.lifeTime;
		var b = EASING.linear(percent,1,-1,1);
		this.scaleX = Math.sin(b*Math.PI);
		this.scaleY = Math.sin(b*Math.PI);
		idolContext.save();
		idolContext.translate(this.width * (this.registrationX)+this.x-this.width/2,this.height* (this.registrationY)+this.y-this.height/2);
		idolContext.scale(this.scaleX,this.scaleY);
		idolContext.rotate(this.rotation);
		idolContext.translate(-this.width * this.registrationX,-this.height * this.registrationY);
		idolContext.drawImage(sparkleImage,0,0,this.width,this.height)
		idolContext.restore();
	}
	this.Dispose = function()
	{
		sparkleCount--;
	}
	sparkleCount++;
	canvasParticles.push(this);
}

var PerformanceSpark = function(x,y,vx,vy,lifeTime,size)
{
	CanvasParticle.call(this,x,y,vx,vy,lifeTime);
	this.width = size || Math.random()*32+32;
	this.height = this.width;
	this.rs = (Math.random() -.5)*2
	this.Update = function(dt,now)
	{
		if( now - this.startTime > this.lifeTime )
		{
			this.dead = true;
		}
	}
	this.Refresh = function(now)
	{
		this.x += this.vx;
		this.y += this.vy;
		this.vx *= .9;
		this.vy *= .9;
		this.rotation += this.rs;
		var percent = (now - this.startTime)/this.lifeTime;
		var b = Math.max(Math.min(1,EASING.inCubic(percent,1,-1,1)),0);
		this.scaleX = b;
		this.scaleY = b;
		idolContext.save();
		idolContext.translate(this.x,this.y);
		idolContext.rotate(this.rotation/180*Math.PI);
		idolContext.scale(this.scaleX,this.scaleY);
		idolContext.translate(-this.width * this.registrationX,-this.height * this.registrationY);
		idolContext.fillStyle = "#FFF";
		idolContext.drawImage(sparkleImage,0,0,this.width,this.height);
		idolContext.restore();
	}
	this.Dispose = function()
	{
	}
	canvasParticles.push(this);
}

var FansBubble = function(x,y,vx,vy,amount,lifeTime,data,classes,encores,performances,astonishment)
{
	if ( !options[Options.SimpleParticles] )
	{
		CSSFansBubble(x,y,vx,vy,amount,lifeTime,data,classes,encores,performances,astonishment);
	}
	else
	{
		new CanvasFansBubble(x,y,vx,vy,amount,lifeTime,data,classes,encores,performances,astonishment);
	}
}

var CSSFansBubble = function(x,y,vx,vy,amount,lifeTime,data,classes,encores,performances,astonishment)
{
	classes = classes = [];
	var element = document.createElement("div");
	element.classList.add("fansBubble");
	element.appendChild(document.createTextNode("+"+Formatters.Format("integer",amount)+" "+FAN_SYMBOL));
	if ( encores > 0 || performances > 0 || astonishment > 0 )
	{
		var subWrapper = CreateSimpleElement("div",["fansBubbleSubtextWrapper"]);
		if ( performances > 1 )
		{
			subWrapper.appendChild(CreateSimpleElement("span",["fansBubbleSubtext"],[performances+" "+PERFORMANCE_SYMBOL]));
		}
		if ( encores > 0 )
		{
			subWrapper.appendChild(CreateSimpleElement("span",["fansBubbleSubtext"],[encores+" "+ENCORE_SYMBOL]));
		}
		if ( astonishment > 0 )
		{
			classes.push("particleAstonishment")
			subWrapper.appendChild(CreateSimpleElement("span",["fansBubbleSubtext"],[astonishment+" "+ASTONISHMENT_SYMBOL]));
		}

		element.appendChild(subWrapper);
	}
	particles.push(new Particle(x+(Math.random()-.5)*8,y+(Math.random()-.5)*8,vx,vy,element,lifeTime,data,classes));
}

var CanvasFansBubble = function(x,y,vx,vy,amount,lifeTime,data,classes,encores,performances,astonishment)
{
	CanvasParticle.call(this,x,y,vx,vy,lifeTime || 1000);
	this.rs = (Math.random()-.5)*1.5;
	this.width = Math.random()*64+32;
	this.height = this.width;
	var initiliazed = false;
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	var font = "Roboto, idolclicker";
	context.font = "2em "+font;
	var string = "+"+Formatters.Format("integer",amount)+" "+FAN_SYMBOL;
	var stringWidth = context.measureText(string).width;
	var substring = "";
	if ( performances > 1 )
	{
		substring += performances +" "+ PERFORMANCE_SYMBOL+" ";
	}
	if ( encores > 0 )
	{
		substring += encores +" "+ ENCORE_SYMBOL+" ";
	}
	if ( astonishment > 0 )
	{
		substring += astonishment +" "+ ASTONISHMENT_SYMBOL;
	}
	context.font = "1.5em "+font;
	var substringWidth = context.measureText(substring).width;
	var width = Math.max(stringWidth,substringWidth);
	canvas.width = (width + 8)*2;
	canvas.height = 96;
	//context.fillStyle = "#034";
	//context.globalAlpha = .5;
	//context.fillRect(0,0,canvas.width,canvas.height);
	context.globalAlpha = 1;
	context.font = "4em "+font;
	context.fillStyle = "#005273";
	context.fillText(string,8,canvas.height/2+4);
	context.fillStyle = "#FFF";
	context.fillText(string,4,canvas.height/2);
	context.font = "3em "+font;
	context.fillStyle = "#005273";
	context.fillText(substring,canvas.width/2-substringWidth+4,canvas.height);
	context.fillStyle = "#FFF";
	context.fillText(substring,canvas.width/2-substringWidth,canvas.height-4);
	this.Update = function(dt, now)
	{
		if( now - this.startTime > this.lifeTime )
		{
			this.dead = true;
		}
	}
	this.Refresh = function(now)
	{
		var percent = (now - this.startTime)/this.lifeTime;
		this.x += this.vx;
		this.y += this.vy;
		this.rotation += this.rs;
		this.vx *= .9;
		this.vy *= .9;
		this.rs *= .9;
		idolContext.save();
		var height = canvas.height/2;
		var width = canvas.width/2;
		idolContext.translate(width * (this.registrationX)+this.x-width/2,height* (this.registrationY)+this.y-height/2);
		idolContext.scale(this.scaleX,this.scaleY);
		idolContext.rotate(this.rotation/180*Math.PI);
		idolContext.translate(-width * this.registrationX,-height * this.registrationY);
		idolContext.globalAlpha = Math.max(0,1-Math.pow(percent,4));
		idolContext.drawImage(canvas,0,-height/2,width,height);
		idolContext.restore();
	}
	canvasParticles.push(this);
}

var QuickSkillsPanel = new (function()
{
	Panel.call(this);
	this.element.classList.add("quickSkillsPanel");
	var skillButtons = {};
	this.Refresh = function()
	{
		var shouldShow = false;
		for( var i in idols )
		{
			var idol = idols[i];
			var upgrades = idols[i].upgrades;
			for( var j = 0; j < upgrades.length; j++ )
			{
				var upgrade = upgrades[j];
				if ( upgrade.skillID != null )
				{
					if ( skillButtons[upgrade.skillID] == null )
					{
						var button = CreateSimpleElement("div",["button","upgradeButton"]);
						var wrapper = CreateSimpleElement("div",["upgradeButtonWrapper"]);
						button.appendChild(wrapper);
						this.element.appendChild(button);
						if ( upgrade.icon != null )
						{
							var buttonImage = CreateSimpleElement("img",["upgradeButtonImage"]);
							buttonImage.src = upgrade.icon;
							wrapper.appendChild(buttonImage);
						}
						/*button.cooldownBar = CreateSimpleElement("div",["bar","cooldownBar"]);
						button.cooldownBarFill = CreateSimpleElement("div",["barFill","cooldownBarFill"]);
						button.cooldownBar.appendChild(button.cooldownBarFill);*/
						button.cooldownBar = new Bar(["cooldownBar"],["cooldownBarFill"]);
						//button.buffBar = CreateSimpleElement("div",["bar","buffBar"]);
						//button.buffBarFill = CreateSimpleElement("div",["barFill","buffBarFill"]);
						//button.buffBar.appendChild(button.buffBarFill);
						wrapper.appendChild(button.cooldownBar.element);
						//wrapper.appendChild(button.buffBar);
						skillButtons[upgrade.skillID] = button;
					}
					var upgradeButton = skillButtons[upgrade.skillID];
					var now = Date.now();

					if ( upgrade.Condition(idol) == true)
					{
						shouldShow = true;
						upgradeButton.classList.remove("hidden");
					}
					else
					{
						upgradeButton.classList.add("hidden");
					}
					if ( !upgrade.unlocked )
					{
						upgradeButton.classList.add("locked");
						upgradeButton.classList.remove("active");
						if ( fans < upgrade.Cost(idol) )
						{
							upgradeButton.classList.add("expensive");
						}
						else
						{
							upgradeButton.classList.remove("expensive");
						}
						upgradeButton.cooldownBar.Hide(true);
					}
					else
					{
						upgradeButton.classList.remove("locked");
						upgradeButton.cooldownBar.Show(true);
						if ( !upgrade.Toggle && upgrade.skillID == null )
						{
							upgradeButton.classList.add("hidden");
						}
						if(  upgrade.skillID != null )
						{
							var skill = SkillRegistry.Get(upgrade.skillID);
							if ( Date.now() < skill.cooldownTime && (upgrade.buffID == null || buffs[upgrade.buffID] == null) )
							{
								upgradeButton.classList.add("expensive");
							}
							else
							{
								upgradeButton.classList.remove("expensive");
							}
						}
						if ( upgrade.skillID != null )
						{
							var skill = SkillRegistry.Get(upgrade.skillID);
							var timeSinceLastUse = now - skill.lastUseTime;
							var skippedCooldown = Math.max(0,skill.cooldown-(skill.cooldownTime-skill.lastUseTime));
							var cooldownUntilNextUse = Math.max(0,(skill.cooldown));
							//var cooldownUntilNextUse = Math.max(0,(timeSinceLastUse+skill.cooldown-skippedCooldown));
							var difference = (timeSinceLastUse+skippedCooldown)/cooldownUntilNextUse;
							var percent = Math.max(Math.min(1,difference),0);
							//upgradeButton.cooldownBarFill.style.width = (percent*100) + "%";
							upgradeButton.cooldownBar.Refresh(percent*100);
						}
						if ( upgrade.buffID != null )
						{
							if ( buffs[upgrade.buffID] != null )
							{
								//upgradeButton.cooldownBarFill.classList.add("buffBarFill");
								upgradeButton.cooldownBar.AddClasses(null,["buffBarFill"]);
								var buff = buffs[upgrade.buffID];
								if ( buff != null )
								{
									var percent = 1-Math.max(Math.min(1,buff.accumulator/buff.length),0);
									upgradeButton.cooldownBar.Refresh(percent*100);
								}
							}
							else
							{
							//	upgradeButton.cooldownBarFill.classList.remove("buffBarFill");
								upgradeButton.cooldownBar.RemoveClasses(null,["buffBarFill"]);
							}
						}
						else
						{
							upgradeButton.cooldownBar.RemoveClasses(null,["buffBarFill"]);
							//upgradeButton.cooldownBarFill.classList.remove("buffBarFill");
						}
					}
					if ( upgrade.unlocked && upgrade.Toggle != null )
					{
						if ( !upgrade.enabled )
						{
							upgradeButton.classList.add("inactive");
							upgradeButton.classList.remove("active");
						}
						else
						{
							upgradeButton.classList.add("active");
							upgradeButton.classList.remove("inactive");
						}
					}
					
					upgradeButton.onclick = (function(upgrade){return function(event)
					{
						var clientRect = this.getBoundingClientRect();
						UpgradePanel.SetAnchor(clientRect.left,clientRect.bottom+4,false,false);
						QuickSkillsPanel.Stick(UpgradePanel.element);
						UpgradePanel.Show();
						UpgradePanel.Refresh(upgrade);
						UpgradePanel.Anchor();
						event.stopPropagation();
					}})(upgrade);
				}
			}
		}
		if ( shouldShow )
		{
			this.element.classList.remove("hidden");
		}
		else
		{
			this.element.classList.add("hidden");
		}
	}
	this.Clear = function()
	{
		ClearElement(this.element);
		skillButtons = {};
	}
});
idolContainer.appendChild(QuickSkillsPanel.element);

var IdolRegistry = new (function()
{
	this.idols = [];
	this.Register = function(id,template)
	{
		template.id = id;
		this.idols[id] = template;
	}
	this.Get = function(id)
	{
		return this.idols[id];
	}
})();

/* IDOL LIST ENTRY */

var IdolListEntry = function(idol,template,icon)
{
	var idolListEntry = this;
	this.idol = idol;
	this.template = template;
	var element = document.createElement("div");
	element.classList.add("idolListEntry");
	
	var data = CreateSimpleElement("div",["idolListEntryData"]);

	var image = CreateSimpleElement("div",["idolListEntryImage"]);
	element.appendChild(image);

	var info = CreateSimpleElement("span",["idolListEntryInfo"]);
	var infoText = document.createTextNode("Idol");
	info.appendChild(infoText);
	data.appendChild(info);

	element.appendChild(data);
	//element.appendChild(buttons);
	this.clientRect = null;
	this.Refresh = function()
	{
		if (idols[template.id] != null )
		{
			this.idol = idols[template.id];
		}
		if ( this.idol == null )
		{
			if ( fans < this.template.baseCost/2 - 25 )
			{
				if ( !element.classList.contains("hidden") )
				{
					element.classList.add("hidden");
				}
			}
			else
			{
				if ( element.classList.contains("hidden") )
				{
					element.classList.remove("hidden");
				}
			}
			infoText.nodeValue = "???"+
			"\n"+Formatters.Format("integer",this.template.baseCost)+FAN_SYMBOL;
			element.classList.add("locked");
			//image.src = icon;
			image.style.backgroundImage = "url("+icon+")";
		}
		else
		{
			if ( element.classList.contains("hidden") )
			{
				element.classList.remove("hidden");
			}
			
			var name = this.template.name;
			if ( this.idol.Mastery() > 0 )
			{
				name += " "+MASTERY_SYMBOLS[this.idol.Mastery()-1];
			}
			var infoTextString = name+
			"\n"+Formatters.Format("integer",this.idol.level)+" "+LEVEL_SYMBOL+
			"\n"+Formatters.Format("integer",this.idol.UpgradeCost())+" "+FAN_SYMBOL+"/"+LEVEL_SYMBOL+
			"\n"+Formatters.Format("integer",(this.idol.BaseFanGain()))+" "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL;

			

			infoText.nodeValue = infoTextString;
			var upgradeAvailable = false;
			for (var i = 0; i  < this.idol.upgrades.length ;i++ )
			{
				var upgrade = this.idol.upgrades[i];
				if ( !upgrade.unlocked && fans >= upgrade.Cost(this.idol) && upgrade.Condition(this.idol))
				{
					upgradeAvailable = true;
					break;
				}
			}

			if ( fans < this.idol.UpgradeCost() && upgradeAvailable == false )
			{
				element.classList.add("unavailable");
			}
			else
			{
				element.classList.remove("unavailable");
			}
			element.classList.remove("locked");
			//image.src = this.idol.frames[this.idol.outfit][0].src;
			image.style.backgroundImage = "url("+this.idol.template.outfits[this.idol.outfit].frames[this.idol.variant][0].src+")";
		}
	}
	element.onclick = function(event)
	{
		var clientRect = element.getBoundingClientRect();
		//UpgradePanel.Hide();
		HidePanels(element);
		IdolInfoPanel.SetAnchor(clientRect.left, clientRect.top - 4,false,true);
		IdolInfoPanel.Show();
		IdolInfoPanel.Stick();
		IdolInfoPanel.Refresh(idolListEntry.idol,idolListEntry.template);
		IdolInfoPanel.Anchor();
		//IdolInfoPanel.Move(idolListEntry.clientRect.left, idolListEntry.clientRect.top - 4,false,true);
		event.stopPropagation();
	}
	this.element = element;
	this.Refresh();
}

var IdolTemplate = function(name,baseCost,baseWorth,classes,icon,outfits,upgrades,bio,danceFunction,options)
{
	this.name = name;
	this.baseCost = baseCost;
	this.baseWorth = baseWorth;
	this.classes = classes;
	this.icon = icon;
	this.outfits = outfits;
	this.bio = bio;
	this.Dance = danceFunction || function(idol,element,beatLength){
		var b = EASING.idolBounce(BeatTime()%beatLength,.96,.06,beatLength);
		element.style.transform = "scale(1, "+b+")";
	};
	this.options = {
		[IdolOptions.Beat]: 1,
		[IdolOptions.BeatOffset]: 0,
		[IdolOptions.FrameLengthModifier]: 1,
		[IdolOptions.Visible]: true,
		[IdolOptions.Scale]: 1.0
	};
	LoadArray(this.options,options);
	for (var i = 0; i < this.outfits.length; i++ )
	{
		var outfit = this.outfits[i];
		for ( var j = 0; j < outfit.frames.length; j++ )
		{
			var variants = outfit.frames[j];
			for ( var k = 0; k < variants.length; k++ )
			{
				var image = document.createElement("img");
				image.src = variants[k];
				image.onload = (function(image) { return function()
				{
					image.ready = true;
					image.onload = null;
				}})(image);
				outfit.frames[j][k] = image;
			}
		}
	}
	this.upgrades = upgrades;
	this.Generate = function(data)
	{
		var idol = new Idol(this.baseWorth,this.baseCost,(Math.random()-.5)*.2+.5,(Math.random()-.5)*.2+.5,null,null,this.classes,this.frames,this.upgrades,this.options);
		idol.template = this;
		idol.id = this.id;
		if( data )
		{
			idol.Deserialize(data);
		}
		return idol;
	}
	this.GetUpgrade = function(id)
	{
		for( var i = 0; i < this.upgrades.length; i++ )
		{
			if ( this.upgrades[i].id === id )
			{
				return this.upgrades[i];
			}
		}
	}
}

var SortIdols = function()
{
	idolDrawOrder = [];
	for ( var i = 0; i < idols.length; i++ )
	{
		idolDrawOrder.push(idols[i]);
	}
	idolDrawOrder.sort(function(a,b)
	{
		return a.layer - b.layer;
	});
}

/* BUFFS */

var buffs = [];
var Buff = function(id,name,description,length,activateFunction,deactivateFunction)
{
	this.id = id;
	this.name = name;
	this.description = description;
	this.accumulator = 0;
	this.length = length;
	this.Update = function(dt,now)
	{
		this.accumulator += dt;
		if ( this.accumulator >= this.length )
		{
			this.Deactivate();
			buffs[this.id] = null;
		}
	}
	this.Activate = function()
	{
		if ( activateFunction )
		{
			activateFunction();
		}
	}
	this.Deactivate = function()
	{
		if ( deactivateFunction )
		{
			deactivateFunction();
		}
	}
	this.Remaining = function()
	{
		return this.length - this.accumulator;
	}
	this.Activate();
	buffs[id] = this;
}

/* SKILLS */

var SkillRegistry = new (function()
{
	this.skills = [];
	this.Register = function(id,skill)
	{
		skill.id = id;
		this.skills[id] = skill;
	}
	this.Random = function(onCooldown)
	{
		var list = [];
		var now = Date.now();
		for ( var k in this.skills)
		{
			if ( !onCooldown )
			{
				list.push(k);
			}
			else if ( now < this.skills[k].cooldownTime )
			{
				list.push(k);
			}
		}
		return this.skills[list[Math.floor(Math.random()*list.length)]];
	}
	this.Get = function(id)
	{
		return this.skills[id];
	}
	this.AdjustCooldowns = function(amount)
	{
		for ( var k in this.skills)
		{
			var skill = this.skills[k];
			skill.AdjustCooldown(amount);
		}
	}
	this.Reset = function()
	{
		for ( var k in this.skills)
		{
			var skill = this.skills[k];
			skill.Reset();
		}
	}
});

var STAT_BONUS_VALUES = [];
var StatBonus = {};
StatBonus.EncoreChance = 0;
StatBonus.AstonishmentChance = 1;
StatBonus.FanGain = 2;
StatBonus.PerformanceSpeed = 3;
StatBonus.WorthShare = 4;
StatBonus.SoulLink = 5;
STAT_BONUS_VALUES[StatBonus.EncoreChance] = 0.01;
STAT_BONUS_VALUES[StatBonus.AstonishmentChance] = 0.001;
STAT_BONUS_VALUES[StatBonus.FanGain] = 0.01;
STAT_BONUS_VALUES[StatBonus.PerformanceSpeed] = 0.01;
STAT_BONUS_VALUES[StatBonus.WorthShare] = 0.01;
STAT_BONUS_VALUES[StatBonus.SoulLink] = 0.001;

var Skill = function(name,description,cooldown,activateFunction)
{
	this.name = name;
	this.description = description;
	this.cooldown = cooldown;
	this.lastUseTime = 0;
	this.cooldownTime = 0;
	this.Activate = function()
	{
		this.lastUseTime = Date.now();
		this.cooldownTime = Date.now() + this.cooldown;
		if ( activateFunction != null )
		{
			activateFunction(this);
		}
	}
	this.AdjustCooldown = function(amount)
	{
		this.cooldownTime += amount;
	}
	this.Reset = function(amount)
	{
		this.lastUseTime = 0;
		this.cooldownTime = 0;
	}
	this.Serialize = function()
	{
		return [this.lastUseTime,this.cooldownTime];
	}
	this.Deserialize = function(data)
	{
		this.lastUseTime = data[0];
		this.cooldownTime = data[1];
	}
}

var Skills = {};
Skills.InspiringSong = 0;
Skills.UserPerformanceBuff = 1;
Skills.CooldownReduction = 2;
Skills.EncoreChanceBuff = 3;
Skills.AstonishmentBuff = 4;
Skills.Gamble = 5;
Skills.PermanentStatGains = 6;
Skills.AutoPerform = 7;
Skills.CatLikeCharm = 8;
Skills.InspirationCooldown = 9;

SkillRegistry.Register(Skills.InspiringSong,new Skill(
	"Inspiring Song",
	"Sing a song that inspires everyone who hears it to try their best. Gain 100% more inspiration for 1 minute.",
	1000*60*30,
	function()
	{
		//var Buff = function(id,length,activateFunction,deactivateFunction)
		new Buff(Buffs.InspiringSong,"Inspiring Song","Gain 100% more Inspiration for 1 minute.",1000*60,
			function(){ inspirationGainBuff += 1; }, 
			function(){ inspirationGainBuff -= 1; }
		);
	}
));

SkillRegistry.Register(Skills.UserPerformanceBuff,new Skill(
	"Overdrive",
	"Run a hacking program that enchances your performances. Increase fans gained from user performances by 10,000% for 15 seconds.",
	1000*60*90,
	function()
	{
		//var Buff = function(id,length,activateFunction,deactivateFunction)
		new Buff(Buffs.Overdrive,"Overdrive","User performances gain 10,000% more fans",1000*15,
			function(){ userFanGainMultiplierBuff += 100; }, 
			function(){ userFanGainMultiplierBuff -= 100; }
		);
	}
));

SkillRegistry.Register(Skills.CooldownReduction,new Skill(
	"C.U.T.E!",
	"Tear a rip in the fabric of spacetime! Reduces skill cooldowns by 1 hour.",
	1000*60*60*6,
	function(skill)
	{
		SkillRegistry.AdjustCooldowns(-1000*60*60);
		skill.cooldownTime = Date.now()+skill.cooldown;
	}
));

SkillRegistry.Register(Skills.AutoPerform,new Skill(
	"Sweets Spree",
	"Do nothing but eat a bunch of sweets for a while. Automatically perform 25 times a second for 45 seconds.",
	1000*60*30,
	function()
	{
		new Buff(Buffs.SweetsSpree,"Sweets Spree","Automatically performing 25 times a second",1000*45,
			function(){ autoPerform = true; }, 
			function(){ autoPerform = false; }
		);
	}
));

SkillRegistry.Register(Skills.CatLikeCharm,new Skill(
	"Cat-like Charm",
	"Convince everyone that you're really cute and cuddly to inspire them. Instantly gain 10 Inspiration Levels worth of Inspiration.",
	1000*60*120,
	function()
	{
		for( var i = 0; i < 10; i++ )
		{
			var previousInspirationRequirement = InspirationRequirement(inspirationLevel);
			var inspirationRequirement = InspirationRequirement(inspirationLevel+1);
			InspirationGain(0,inspirationRequirement-previousInspirationRequirement);
		}
	}
));

SkillRegistry.Register(Skills.PermanentStatGains,new Skill(
	"Super Cheer",
	"Perform a happy little song and dance that's so cute it can enhance abilities. Spend all Inspiration Levels to permanently improve randomly chosen stats for randomly chosen Idols.",
	1000*60*60*12,
	function()
	{
		for( var i = 0; i < inspirationLevel; i++ )
		{
			var idol = RandomIdol();
			if ( idol != null )
			{
				idol.GainRandomStats();
			}
		}
		inspiration = 0;
	}
));

SkillRegistry.Register(Skills.InspirationCooldown,new Skill(
	"Lubrication",
	"Bounce around, making everything all slippery. Spend all Inspiration Levels to reduce randomly chosen skill cooldowns by 60 seconds per level spent.",
	1000*60*5,
	function()
	{
		for ( var i = 0; i < inspirationLevel; i++)
		{
			//SkillRegistry.Random(true).AdjustCooldown(-60000);
			var skill = SkillRegistry.Random(true);
			if ( skill != null )
			{
				skill.AdjustCooldown(-60000);
			}
		}
		inspiration = 0;
	}
));

/* IDOL */

var Idol = function(baseWorth, baseCost,xPercent,yPercent,width,height,classes,frames,upgrades,idolOptions)
{
	var idol = this;
	this.dirty = true;
	var active = false;
	var hover = false;
	var frame = null;
	var lastParticleTime = Date.now();
	var particleBuffer = new ParticleBuffer();

	this.registrationX = 0.5;
	this.registrationY = 0.95;
	this.scaleX = 1;
	this.scaleY = 1;
	this.rotation = 0;

	this.bonuses = [];
	for( var k in StatBonus )
	{
		this.bonuses[StatBonus[k]] = 0;
	}
	this.danceInfo = {};
	this.mastery = 0;
	//this.away = false;
	this.performanceAccumulator = 0;
	this.performances = 0;
	this.level = 1;
	this.fans = 0;
	this.baseWorth = baseWorth;
	this.baseCost = baseCost;
	this.layer = 0;
	this.worthMultiplier = 1;
	this.worthShare = 0;
	this.encoreChance = 0;
	this.astonishmentChance = 0;
	this.upgrades = [];
	this.dragAnchorX = 0;
	this.dragAnchorY = 0;
	this.performRate = 1.0;
	this.soulLink = 0.0;
	if( upgrades  != null )
	{
		for ( var i = 0; i < upgrades.length; i++ )
		{
			upgrades[i].unlocked = false;
			upgrades[i].idol = this;
			//this.upgrades[upgrades[i].id] = upgrades[i];
			this.upgrades.push(upgrades[i]);
		}
	}
	this.x = 0;
	this.y = 0;
	this.xPercent = xPercent;
	this.yPercent = yPercent;
	this.frames = frames;
	this.outfit = 0;
	this.variant = 0;
	this.wardrobe = [true];
	this.fansPerSecond = 0;
	this.options = idolOptions || {};

	
	//this.baseWidth = width;
	//this.baseHeight = height;
	//this.width = width;
	//this.height = height;

	//this.image = document.createElement("img");
	//this.image.src = this.frames[this.outfit][0];

	this.canvas = document.createElement("canvas");
	this.canvas.classList.add("idolCanvas");
	var context = this.canvas.getContext("2d");

	this.element = document.createElement("div");
	this.element.style.width = this.width+"px";
	this.element.style.height = this.height +"px";
	this.element.classList.add("idol");

	this.mover = document.createElement("div");
	this.mover.classList.add("mover");

	//this.mover.appendChild(this.image);
	this.mover.appendChild(this.canvas);
	this.element.appendChild(this.mover);

	this.FollowMouse = function()
	{
		var rect = IdolListRect();
		this.dirty = true;
		this.x = inputX - dragAnchorX;
		this.y = inputY - dragAnchorY;
		this.Constrain();
		SortIdols();
	}

	this.Constrain = function()
	{
		if ( !this.options[IdolOptions.Visible] )
		{
			return;
		}
		var left = 0;
		var top = 0;
		var right = idolCanvas.width;
		var bottom = idolCanvas.height;
		var horizontalThreshold = this.width / 2;
		var verticalThreshold = this.height / 2;
		if ( this.x - horizontalThreshold < left )
		{
			this.x = left + horizontalThreshold;
		}
		if ( this.x + horizontalThreshold > right )
		{
			this.x = right - horizontalThreshold;
		}
		if ( this.y - verticalThreshold < top )
		{
			this.y = top + verticalThreshold;
		}
		if ( this.y + verticalThreshold > bottom )
		{
			this.y = bottom - verticalThreshold;
		}
		this.xPercent = this.x/right;
		this.yPercent = this.y/bottom;
		if (this.xPercent < 0 )
		{
			this.xPercent = 0;
		}
		if (this.xPercent > 1 )
		{
			this.xPercent = 1;
		}
		if (this.yPercent < 0 )
		{
			this.yPercent = 0;
		}
		if (this.yPercent > 1 )
		{
			this.yPercent = 1;
		}
	}

	this.CSSUpdate = function(dt)
	{
		if ( !options[Options.SimpleDance] && options[Options.UseCSSAnimations] )
		{
			this.template.Dance(this,this.mover,beatLength,this.danceInfo);
		}
	}
	this.PerformanceTime = function()
	{
		var baseTime = this.performRate + INSPIRATION_PERFORMANCE_RATE_BONUS * inspirationLevel + this.bonuses[StatBonus.PerformanceSpeed] * STAT_BONUS_VALUES[StatBonus.PerformanceSpeed];
		if( this.id != Idols.PrettyIdol )
		{
			baseTime += envyBonus;
		}
		return 1/baseTime * PERFORMANCE_TIME;
	}
	this.WorthShare = function()
	{
		return this.worthShare + this.bonuses[StatBonus.WorthShare] * STAT_BONUS_VALUES[StatBonus.WorthShare] + INSPIRATION_WORTH_SHARE_RATE_BONUS * inspirationLevel;
	}
	this.SoulLink = function()
	{
		return this.soulLink + this.bonuses[StatBonus.SoulLink] * STAT_BONUS_VALUES[StatBonus.SoulLink]
	}
	this.GainRandomStats = function(amount)
	{
		if ( amount == null )
		{
			amount = 1;
		}
		var choices = [
			StatBonus.EncoreChance,
			StatBonus.AstonishmentChance,
			StatBonus.FanGain,
			StatBonus.PerformanceSpeed,
			StatBonus.WorthShare,
			StatBonus.SoulLink
		];
		for ( var i = 0; i < amount; i++ )
		{
			var choice = choices[Math.floor(Math.random()*choices.length)];
			this.bonuses[choice]++;
			console.log(this.template.name,choice,this.bonuses[choice]);
		}
	}
	this.Mastery = function()
	{
		var mastery = 0;
		if ( this.performances >= PERFORMANCE_FAN_BONUS_MAXIMUM )
		{
			mastery++;
		}
		return mastery;
	}

	this.Update = function(dt, now)
	{

		var oldFrame = frame;
		
		this.performanceAccumulator += dt;
		//var timeSinceLastPerformance = Date.now() - this.lastPerformance;
		var performanceTime = this.PerformanceTime();
		if ( this.performanceAccumulator >= performanceTime )
		{
			var performancesToDo = Math.floor(this.performanceAccumulator/performanceTime);
			this.performanceAccumulator -= performanceTime * performancesToDo;
			//this.lastPerformance = Date.now();
			//var performancesToDo = Math.floor(Math.min(timeSinceLastPerformance,MAXIMUM_AWAY_PERFORMANCE_TIME)/performanceTime);
			var encores = 0;
			if ( this.EncoreChance() > 0 )
			{
				var encoreChance = this.EncoreChance();
				while(Math.random() < encoreChance )
				{
					encores++;
					encoreChance /= 2;
				}
			}
			var lifeTime = PARTICLE_LIFETIME;
			var vx = null;
			var vy = null;
			if ( performancesToDo > 1)
			{
				lifeTime = PARTICLE_LIFETIME;
				vy = -5;
			}
			if ( encores > 0 )
			{
				performancesToDo += encores;
			}
			if ( performancesToDo > 0 )
			{
				this.performances += performancesToDo;
				var performance = this.FanGain(performancesToDo);
				this.fans += performance.fans;
				GainFans(performance);
				particleBuffer.Add(performance.fans,performancesToDo,encores,performance.astonishment);
				this.dirty = true;
			}
		}
		if( this.options[IdolOptions.Visible] && timeSimulated == 0 && now - lastParticleTime > IDOL_PARTICLE_RATE && options[Options.ShowIdolParticles] == true )
		{
			if ( particleBuffer.fans > 0 )
			{
				var classes = [];
				if ( particleBuffer.performances > 1)
				{
					classes.push(["particleImportant"]);
				}
				if ( particleBuffer.encores > 1)
				{
					classes.push(["particleEncore"]);
				}
				//new FansBubble(this.x,this.y-this.height/2-16,vx,vy,particleFans,lifeTime,null,classes,particleEncores,particlePerformances, particleAstonishment);
				particleBuffer.Generate(this.x,this.y-this.height/2-16,vx,vy,lifeTime,null,classes)
				lastParticleTime = now;
			}
		}
	}
	var canvasScale = 1;
	this.Frame = function()
	{
		var frames = this.template.outfits[this.outfit].frames;
		if ( frames.length <= this.variant )
		{
			this.variant = 0;
		}
		return Math.floor(BeatTime()/beatLength) % frames[this.variant].length;
	}
	this.Refresh = function(now)
	{
		if ( !options[Options.SimpleDance] && !options[Options.UseCSSAnimations] )
		{
			this.template.Dance(this,this.mover,beatLength,this.danceInfo);
		}
		if ( !this.options[IdolOptions.Visible] )
		{
			return;
		}
		var lastFrame = frame;
		frame = this.Frame();
		var outfitFrames = this.template.outfits[this.outfit].frames[this.variant];
		var frameImage = outfitFrames[frame];
		if ( !frameImage.ready )
		{
			frameImage = errorCanvas;
		}
		var frameWidth = frameImage.width;
		var frameHeight = frameImage.height;
		if ( this.dirty && !useCanvas )
		{
			if ( hover )
			{
				this.element.classList.add("idolHover");
			}
			else
			{
				this.element.classList.remove("idolHover");
			}
			if ( active )
			{
				this.element.classList.add("idolActive");
			}
			else
			{
				this.element.classList.remove("idolActive");
			}
			if( options[Options.SimpleDance] )
			{
				this.element.classList.add("lowQuality");
			}
			else
			{
				this.element.classList.remove("lowQuality");
			}
			this.width = this.canvas.width * (this.yPercent+.25)* options[Options.IdolScale]* this.options[IdolOptions.Scale];
			this.height = this.canvas.height * 	(this.yPercent+.25)* options[Options.IdolScale]* this.options[IdolOptions.Scale];
			this.x = this.xPercent * idolCanvas.width;
			this.y = this.yPercent * idolCanvas.height;
			this.layer = this.y + this.height/2;
			this.element.style.width = this.width+"px";
			this.element.style.height = this.height+"px";
			this.element.style.left = (this.x-this.width/2)+"px";
			this.element.style.top = (this.y-this.height/2)+"px";
			this.element.style.zIndex = Math.floor(this.layer);
			this.dirty = false;
		}
		else
		{
			this.width = frameWidth * (this.yPercent+.25)* options[Options.IdolScale]* this.options[IdolOptions.Scale];
			this.height = frameHeight * (this.yPercent+.25)* options[Options.IdolScale]* this.options[IdolOptions.Scale];
			this.x = this.xPercent * idolCanvas.width;
			this.y = this.yPercent * idolCanvas.height;
			this.layer = this.y + this.height/2;
		}
		if ( useCanvas )
		{
			idolContext.save();
			if ( options[Options.IdolDropShadow] )
			{
				/*idolContext.globalCompositeOperation = "source-over";
				idolContext.drawImage(outfitFrames[frame],0,0);
				idolContext.globalCompositeOperation = "source-out";*/
				
				//idolContext.drawImage(outfitFrames[frame],4,4);

				//idolContext.globalCompositeOperation = "source-in";
				//idolContext.fillStyle = '#112233';
				///idolContext.globalAlpha = 0.3;
	        	//idolContext.fillRect(0,0,this.canvas.width,this.canvas.height);
			}
			//idolContext.globalAlpha = 1.0;
			//idolContext.globalCompositeOperation = "source-over";
			if ( hover || active )
			{
				idolContext.globalAlpha = 0.5;
			}
			else
			{
				idolContext.globalAlpha = 1.0;
			}
			idolContext.translate(this.width * (this.registrationX)+this.x-this.width/2,this.height* (this.registrationY)+this.y-this.height/2);
			idolContext.scale(this.scaleX,this.scaleY);
			if ( idol.options[IdolOptions.Flip] )
			{
				idolContext.scale(-idol.scaleX,1);
			}
			idolContext.rotate(this.rotation);
			idolContext.translate(-this.width * this.registrationX,-this.height * this.registrationY);
			
			idolContext.drawImage(frameImage,0,0,this.width,this.height);
			idolContext.restore();
		}
		else if ( lastFrame != frame )
		{
			if ( this.canvas.width != outfitFrames[frame].width || this.canvas.height != outfitFrames[frame].height )
			{
				this.canvas.width = outfitFrames[frame].width;
				this.canvas.height = outfitFrames[frame].height;
			}
			else
			{
				context.clearRect(0,0,this.canvas.width,this.canvas.height);
			}

			context.save();
			/*if ( !options[Options.UseCSSAnimations] )
			{
				
				context.translate(0,this.canvas.height);
				context.scale(1,canvasScale);
				context.translate(0,-this.canvas.height);
				var b = EASING.idolBounce(GameTime()%beatLength,.96,.05,beatLength);
				canvasScale += (b-canvasScale)/2;
			}*/

			if ( options[Options.IdolDropShadow] )
			{
				context.globalCompositeOperation = "source-over";
				context.drawImage(outfitFrames[frame],0,0);
				context.globalCompositeOperation = "source-out";
				
				context.drawImage(outfitFrames[frame],4,4);

				context.globalCompositeOperation = "source-in";
				context.fillStyle = '#112233';
				context.globalAlpha = 0.3;
	        	context.fillRect(0,0,this.canvas.width,this.canvas.height);
			}
			context.globalAlpha = 1.0;
			context.globalCompositeOperation = "source-over";
			context.drawImage(outfitFrames[frame],0,0);
			context.restore();
		}
	}
	this.BaseFanGain = function()
	{
		var soulLinkBonus = this.SoulLink() * Math.floor(userPerformances/SOUL_LINK_INTERVAL);
		var baseFans = this.level * (this.baseWorth + this.baseWorth * Math.floor(Math.min(this.performances,PERFORMANCE_FAN_BONUS_MAXIMUM) / PERFORMANCE_FAN_BONUS_INTERVAL) * PERFORMANCE_FAN_BONUS_AMOUNT) * this.worthMultiplier * (1+soulLinkBonus) * (1+this.bonuses[StatBonus.FanGain] * STAT_BONUS_VALUES[StatBonus.FanGain]);
		baseFans *= 1+(INSPIRATION_FAN_GAIN_RATE_BONUS * inspirationLevel);
		return baseFans;
	}

	this.FanGain = function(performances,base)
	{
		if ( performances == null )
		{
			performances = 1;
		}
		var baseFans = this.BaseFanGain();
		var gainedFans = 0;
		var astonishment = 0;
		for( var i = 0; i < performances; i++ )
		{
			if ( base !== false && Math.random() <= this.AstonishmentChance() )
			{
				gainedFans += baseFans * ASTONISHMENT_MULTIPLIER;
				astonishment++;
			}
			else
			{
				gainedFans += baseFans;
			}
		}
		return new Performance(gainedFans * FanGainMultiplier(),astonishment);
	}
	this.UpgradeCost = function(level)
	{
		level = (level || this.level) + 1;
		var a = Math.pow(level,COST_GROWTH_RATE)/level;
		var b = Math.pow(a,level);
		//var b = Math.pow(a,Math.log(level))*level;
		//var c = b*this.baseCost;
		return b * this.baseCost;
		//return Math.floor(this.baseCost*Math.pow(COST_GROWTH_RATE,this.level/COST_GROWTH_DIVISOR));
		//return Math.floor(Math.pow(this.level*this.baseCost*COST_GROWTH_CONSTANT,COST_GROWTH_EXPONENT));
	}
	this.EncoreChance = function()
	{
		return Math.min(globalEncoreChance + this.encoreChance + INSPIRATION_ENCORE_CHANCE_BONUS * inspirationLevel + this.bonuses[StatBonus.EncoreChance] * STAT_BONUS_VALUES[StatBonus.EncoreChance],1000);
	}
	this.AstonishmentChance = function()
	{
		return globalAstonishmentChance + this.astonishmentChance+ this.bonuses[StatBonus.AstonishmentChance] * STAT_BONUS_VALUES[StatBonus.AstonishmentChance];
	}
	this.Upgrade = function()
	{
		this.level++;
	}
	this.Activate = function(x,y)
	{
		dragAnchorX = inputX - this.x;
		dragAnchorY = inputY - this.y;

		if ( !active )
		{
			active = true;
			this.dirty = true;
		}
	}
	this.Deactivate = function()
	{
		if ( active )
		{
			active = false;
			this.dirty = true;
		}
	}
	this.Hover = function()
	{
		if ( !hover )
		{
			hover = true;
			this.dirty = true;
		}
	}
	this.Leave = function()
	{
		if ( hover )
		{
			this.dirty = true;
			hover = false;
		}
	}
	this.Serialize = function()
	{
		var data = [];
		data[0] = this.level;
		data[1] = this.fans;
		data[2] = this.xPercent;
		data[3] = this.yPercent;
		data[4] = this.lastPerformance;
		data[5] = 0;
		data[6] = 0;
		data[7] = this.performances;
		var upgradeData = {};
		if( upgrades != null )
		{
			for (var i = 0; i < this.upgrades.length; i++ )
			{
				var upgrade = this.upgrades[i];
				if ( upgrade != null )
				{
					upgradeData[upgrade.id] = [Number(upgrade.unlocked) || 0, Number(upgrade.enabled)];
				}
			}
		}
		data[8] = upgradeData;
		data[9] = this.outfit;
		data[10] = this.wardrobe;
		data[11] = this.bonuses;
		data[12] = this.variant;
		data[13] = this.options;
		return data;
	}
	this.Deserialize = function(data)
	{
		this.level = data[0] || 1;
		this.fans = data[1] || 0;
		this.xPercent = data[2] || 0;
		this.yPercent = data[3] || 0;
		this.lastPerformance = data[4] || Date.now();
		//this.worthMultiplier = data[5] || 1;
		//this.worthShare = data[6] || 0;
		this.performances = data[7] || 0;
		// Before upgrade so that upgrades can set the wardrobe up for people who don't have wardrobe data
		this.wardrobe = data[10] || [true];
		var upgradeData = data[8];
		if( upgradeData != null )
		{
			for (var k in upgradeData)
			{
				for (var i = 0; i < this.upgrades.length; i++ )
				{
					if ( Number(k) == this.upgrades[i].id )
					{
						this.upgrades[i].unlocked = Boolean(upgradeData[k][0]);
						if ( this.upgrades[i].unlocked && this.upgrades[i].applyOnLoad )
						{
							this.upgrades[i].Unlock(this);
						}
						this.upgrades[i].enabled = upgradeData[k][1] ? true : false;		
					}
				}
			}
		}
		// After Upgrades so that upgrades that set outfit don't override what the outfit value was
		this.outfit = data[9] || 0;
		this.bonuses = LoadArray(this.bonuses,data[11]);
		this.variant = data[12] || 0;
		this.options = LoadArray(this.options,data[13]);
	}
}

var UpgradePanel = new(function()
{
	InterfaceCanMove.call(this);
	InterfaceCanHide.call(this);
	InterfaceCanAnchor.call(this);
	InterfaceCanStick.call(this);
	var clientRect = null;
	var element = CreateSimpleElement("div",["panel","fixed","upgradePanel"]);
	/*var name = document.createElement("span");
	name.classList.add("name");
	var nameText = document.createTextNode("Upgrade Name");
	name.appendChild(nameText);*/
	var name = CreateSimpleElement("span",["upgradePanelName"],["Upgrade Name"]);
	var description = CreateSimpleElement("span",["upgradePanelDescription"],["Upgrade Description"]);
	var flavour = CreateSimpleElement("span",["upgradePanelFlavour"],["Upgrade Flavour Text"]);
	var cost = CreateSimpleElement("span",["upgradePanelCost","prewrap"],["Upgrade Cost"]);

	var unlockButton = CreateSimpleElement("div",["button"],["Unlock"]);

	/*var description = document.createElement("span");
	description.classList.add("description");
	var descriptionText = document.createTextNode("Upgrade Description");
	description.appendChild(descriptionText);*/

	element.appendChild(name);
	element.appendChild(cost);
	element.appendChild(description);
	element.appendChild(flavour);
	element.appendChild(unlockButton);
	var lastUpgrade = null;

	this.Refresh = function(upgrade)
	{
		if( upgrade == null )
		{
			upgrade = lastUpgrade;
		}
		if( upgrade != null )
		{
			name.childNodes[0].nodeValue = upgrade.name;
			description.childNodes[0].nodeValue = upgrade.description;
			flavour.childNodes[0].nodeValue = '"'+upgrade.flavour+'"';
			cost.childNodes[0].nodeValue = Formatters.Format("integer",upgrade.Cost(upgrade.idol)) + " "+FAN_SYMBOL;
			if ( upgrade.skillID != null )
			{
				cost.childNodes[0].nodeValue += "\n" + FormatDuration(SkillRegistry.Get(upgrade.skillID).cooldown)+" cooldown";
			}
			if ( upgrade.unlocked )
			{
				unlockButton.classList.remove("expensive");
				if ( upgrade.Toggle != null )
				{
					if ( upgrade.enabled )
					{
						unlockButton.childNodes[0].nodeValue = "Disable";
					}
					else
					{
						unlockButton.childNodes[0].nodeValue = "Enable";
					}
				}
				else if ( upgrade.skillID != null )
				{
					var skill = SkillRegistry.Get(upgrade.skillID);
					if ( Date.now() < skill.cooldownTime )
					{
						unlockButton.childNodes[0].nodeValue = "Unavailable (" +FormatDuration((Date.now()-skill.cooldownTime))+ ")";
						unlockButton.classList.add("expensive");
					}
					else
					{
						unlockButton.childNodes[0].nodeValue = "Activate";
					}
					//this.Activate = skill.Activate
				}
				else
				{
					unlockButton.childNodes[0].nodeValue = "Unlocked";
					
				}
			}
			else
			{
				if ( fans >= upgrade.Cost(upgrade.idol) )
				{
					unlockButton.classList.remove("expensive");
				}
				else
				{
					unlockButton.classList.add("expensive");
				}
				unlockButton.childNodes[0].nodeValue = "Unlock with "+Formatters.Format("integer",upgrade.Cost(upgrade.idol)) + FAN_SYMBOL;
			}
			unlockButton.onclick = function(event)
			{
				if ( !upgrade.unlocked && upgrade.Condition(upgrade.idol) && fans >= upgrade.Cost(upgrade.idol))
				{
					fans -= upgrade.Cost(upgrade.idol);
					upgrade.Unlock(upgrade.idol);
					upgrade.unlocked = true;
					UpgradePanel.Hide();
					IdolInfoPanel.Refresh(upgrade.idol);
					if ( !IdolDetailsPanel.Hidden() )
					{
						IdolDetailsPanel.Refresh();
					}
				}
				else if ( upgrade.unlocked )
				{
					if( upgrade.Toggle != null )
					{
						upgrade.Toggle(upgrade.idol);
					}
					else if ( upgrade.skillID != null )
					{
						var skill = SkillRegistry.Get(upgrade.skillID);
						if ( Date.now() >= skill.cooldownTime )
						{
							skill.Activate(skill);
							//WSHSend("onTelemetry",{"key":"idolclicker","action":"skill","message":skill.name});
						}
					}
					IdolInfoPanel.Refresh(upgrade.idol);
					UpgradePanel.Refresh(upgrade);
				}

				event.stopPropagation();
			}
		}
		clientRect = element.getBoundingClientRect();
		lastUpgrade = upgrade;
	}
	this.element = element;
	this.Hide();
});
document.body.appendChild(UpgradePanel.element);

var Upgrade = function(id,name,description,flavour,icon,applyOnLoad,costFunction,unlockFunction,conditionFunction,toggleFunction,skillID,buffID)
{
	this.id = id;
	this.idol = null;
	this.name = name || "Generic Upgrade";
	this.unlocked = false;
	this.icon = icon;
	this.description = description || "Empty upgrade";
	this.flavour = flavour || "This is some upgrade flavour text";
	this.enabled = false;
	this.applyOnLoad = applyOnLoad || false;
	this.Cost = costFunction || function(idol)
	{
		return 0;
	}
	this.Unlock = function(idol)
	{
		if ( unlockFunction )
		{
			unlockFunction(idol);
		}
		if ( this.Toggle )
		{
			this.Toggle(idol);
		}
	}
	this.Condition = conditionFunction || function(idol)
	{
		return true;
	}
	this.Toggle = null;
	this.skillID = skillID;
	this.buffID = buffID;
	if ( toggleFunction )
	{
		this.Toggle = function(idol)
		{
			this.enabled = !this.enabled;
			if ( toggleFunction )
			{
				toggleFunction(idol,this.enabled);
			}
		}
	}
}

var Outfit = function(name,description,frames)
{
	this.name = name;
	this.description = description;
	this.frames = frames;
}

var Idols = {};
Idols.CatgirlIdol = 1;
Idols.SingsongIdol = 2;
Idols.CandyIdol = 3;
Idols.SlimeIdol = 4;
Idols.CameoIdol = 5;
Idols.ClickerIdol = 6;
Idols.PrettyIdol = 7;
Idols.TestIdol = 99;

var IdolsIndexed = [
Idols.ClickerIdol,
Idols.CatgirlIdol,
Idols.SlimeIdol,
Idols.CandyIdol,
Idols.SingsongIdol,
Idols.CameoIdol,
Idols.PrettyIdol
];

/* IDOL REGISTRY */


var UPGRADES_BASE_COST_EXPONENT 						= 1.00;
var UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER 		= [12,	147,	3693,	27512,	9.693E5,	3.487E6,	3.46E7];
var UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL 				= [1,	10,		25,		50,		75,			100, 		125];
var UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER 			= [111,		4337,	9.653E5,	4.152E8];
var UPGRADES_FAN_SHARE_REQUIRED_LEVEL 					= [10,		35,		75,			110];
var UPGRADES_ENCORE_BASE_COST_MULTIPLIER 				= [35,2679,45997,1151375];
var UPGRADES_ENCORE_REQUIRED_LEVEL 						= [15,30,45,60];
var UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER 	= [9.312E4,	7.6837E5,	5.937E6];
var UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL 		= [50,		75,			100];
var UPGRADES_OUTFIT_BASE_COST_MULTIPLIER 				= [4444,	1.111E6,	3.17E8,		1.41E10];
var UPGRADES_OUTFIT_REQUIRED_LEVEL 						= [30,		60,			90,			120];

var CalculateBasedCost = function(baseCost, multiplier)
{
	return Math.pow(baseCost*multiplier,UPGRADES_BASE_COST_EXPONENT);
}

IdolRegistry.Register(Idols.ClickerIdol, new IdolTemplate(
	"Clicker Idol", 25, 1,
	[],
	"./img/clicker0.png",
	[
		new Outfit("Classic",
			"The default theme. It includes pieces that reference common user interface terminology and icongraphy.",
			[["./img/clicker1.png","./img/clicker2.png"]]
		),
		new Outfit("Blue",
			"A variation on the default theme. Comes pre-packaged with enterprise editions of the operating system.",
			[["./img/clicker1b.png","./img/clicker2b.png"]]
		),
		new Outfit("Late Night",
			"Part of a paid theming content release that came out a few months after the launch of the operating system. It didn't sell well.",
			[["./img/clicker1c.png","./img/clicker2c.png"]]
		)
	],
	[
		new Upgrade(0,"Custom Cursor","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"It's even animated!", 
			"./img/fanmultiplieru1.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(1,"Custom Taskbar","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"All of the icons are the same image.", 
			"./img/fanmultiplieru2.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(2,"Custom Wallpaper","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"It's just her, though.", 
			"./img/fanmultiplieru3.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(3,"Custom Sounds","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Low bitrate vocal alerts for login, email, and notifications.", 
			"./img/fanmultiplieru4.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(4,"Custom Case","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"A new exterior doesn't really increase performance, but it sure looks nice!", 
			"./img/fanmultiplieru5.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[4]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[4]; }
		),
		new Upgrade(5,"Custom Parts","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"The latest enthusiast tech to make sure she can run modern software.", 
			"./img/fanmultiplieru6.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[5]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[5]; }
		),
		new Upgrade(6,"Liquid Cooling","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Say goodbye to overheating!", 
			"./img/fanmultiplieru7.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[6]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[6]; }
		),
		new Upgrade(120,"Puzzle Game App","Perform 10% more often", "A shoddy clone of a popular match 3 game.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(121,"Base Defense Game App","Perform 10% more often", "Protect a floating sprite of an Idol from an army of invading cursors. Reached #1,150 in popularity on the app store.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(122,"Platform Game App","Perform 10% more often", "An unfair platformer where all the blocks look the same, but do different things.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(200,"Loopback Connection", "Gain 50% "+WORTH_SHARE_SYMBOL,"There's no place like 127.0.0.1.",
			"./img/uniqueu.png",true,
			function(idol) { return 127001; },
			function(idol) { idol.worthShare += 0.50; },
			function(idol) { return idol.level >= 25; }
		),
		new Upgrade(201,"Soul Link Module", "Gain 1% "+SOUL_LINK_SYMBOL,"Our souls are connected by a Cat 5.",
			"./img/uniqueu.png",true,
			function(idol) { return 100000000; },
			function(idol) { idol.soulLink += 0.01; },
			function(idol) { return idol.level >= 75; }
		),
		new Upgrade(202,"Inspiration Module", "Gain 1 Inspiration for every user performance","Show everyone what it means to pour your heart into being an idol.",
			"./img/uniqueu.png",true,
			function(idol) { return 1.134E6; },
			function(idol) { inspirationGain += 1; },
			function(idol) { return idol.level >= 50; }
		),
		new Upgrade(203,"Operating System Upgrade", "Gain 50% "+WORTH_SHARE_SYMBOL,"It takes up less disk space, supports more RAM, and has a new user interface!",
			"./img/uniqueu.png",true,
			function(idol) { return 1000000000; },
			function(idol) { idol.worthShare += 0.50; },
			function(idol) { return idol.level >= 100; }
		),
		new Upgrade(204,"Overclocking", "Gain 100% "+WORTH_SHARE_SYMBOL,"Get some more power out of the same hardware! More! MORE! ...Is that smoke!?",
			"./img/uniqueu.png",true,
			function(idol) { return 10000000000; },
			function(idol) { idol.worthShare += 1.00; },
			function(idol) { return idol.level >= 125; }
		),
		new Upgrade(500,"Skill: "+SkillRegistry.Get(Skills.UserPerformanceBuff).name,SkillRegistry.Get(Skills.UserPerformanceBuff).description, "Click, click, click! You're running out of time!", 
			"./img/skill_clicker_1.png",false,
			function(idol) { return 2.56E9; },
			null,
			function(idol) { return idol.level >= 100; },
			null,
			Skills.UserPerformanceBuff,
			Buffs.Overdrive
		),
		new Upgrade(1000,"Image Change: Blue","Unlock a new outfit for the wardrobe", "It's blue.", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.wardrobe[1] = true; idol.outfit = 1; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(1001,"Image Change: Late Night","Unlock a new outfit for the wardrobe", "The new model that stays up late torrenting the latest hit shows.", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.wardrobe[2] = true; idol.outfit = 2; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[1]; }
		)
	],
	// Real Name, Aliases
	[
		"4C71-CK3R-1D07","Input, Putty, Cursor, 4-C",
		// Description
		"A cursor sprite who is invariably interested in your input. She seems to want to help you out and is willing to work as an Idol to do so. Her skills are largely based around improving your ability to perform and her potential for growth seems rather...limitless?",
		// Lore
		"No one really knows much about where cursor sprites come from, but they are said to make very dependable life partners. Their frail, diminutive, pet-like stature makes physical contact dangerous however. Subsisting on a diet of electricity, data, and input, these strange creatures require a symbiotic relationship with humans in order to survive. Don't leave them alone for too long!",
		// Likes
		"Input, data, VoIP, nybbling bits",
		// Dislikes
		"DDoS, hiccups, ground, hibernation"
	],
	function(idol,element,beatLength,data)
	{
		data.scale = data.scale != null ? data.scale : 1;
		var beatTime = BeatTime()*idol.options[IdolOptions.Beat];
		var beatOffset = idol.options[IdolOptions.BeatOffset] * beatLength;
		var frameLength = idol.options[IdolOptions.FrameLengthModifier] * beatLength;
		var b = EASING.idolBounce((beatTime+beatOffset)%(frameLength),.97,.03,frameLength);
		data.scale += (b-data.scale)/(options[Options.UseCSSAnimations] ? 1 : 2);
		//element.style.transform = "scale("+(1/data.scale)+", "+data.scale+")";
		idol.scaleX = 1/data.scale;
		idol.scaleY = data.scale;
	},
	{
		[IdolOptions.Beat]:1,
		[IdolOptions.BeatOffset]:1,
		[IdolOptions.FrameLengthModifier]:2,
	}
));

IdolRegistry.Register(Idols.CatgirlIdol, new IdolTemplate(
	"Catgirl Idol", 300, 7,
	[],
	"./img/cat0.png",
	[
		new Outfit("Feline Fashion",
			"Light, thin, and hugs every curve. Her standard performance outfit.",
			[["./img/cat1.png","./img/cat2.png","./img/cat1.png","./img/cat3.png"],
			["./img/cat1.png","./img/cat2.png"]]
		),
		new Outfit("Goth",
			"Underground concert-goers are big fans of this outfit.",
			[["./img/cat1b.png","./img/cat2b.png","./img/cat1b.png","./img/cat3b.png"],
			["./img/cat1b.png","./img/cat2b.png"]]
		),
		new Outfit("Trash Panda",
			"Her outfit for the Animal Appreciate Day concert. Her suggestion to attend the event nude was denied.",
			[["./img/cat1c.png","./img/cat2c.png","./img/cat1c.png","./img/cat3c.png"],
			["./img/cat1c.png","./img/cat2c.png"]]
		),
		new Outfit("Bluebird",
			"Her choice for the Idol Crisscross Colour Pairing event.",
			[["./img/cat1d.png","./img/cat2d.png","./img/cat1d.png","./img/cat3d.png"],
			["./img/cat1d.png","./img/cat2d.png"]]
		)
	],
	[
		new Upgrade(0,"Vocal Meowstery","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Learn how to sing using meows.", 
			"./img/fanmultiplieru1.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(1,"Purrfect Pitch","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Something something tune a fish!", 
			"./img/fanmultiplieru2.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(2,"Feline Footwork","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Perfect the art of hip sway.", 
			"./img/fanmultiplieru3.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(3,"Kitt'n Kaboodle","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"There's a little bit of kitty in every fan's heart.", 
			"./img/fanmultiplieru4.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(4,"Professional Grooming","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"It doesn't look like much changed...fans love it though!", 
			"./img/fanmultiplieru5.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[4]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[4]; }
		),
		new Upgrade(5,"Pounce Pratice","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Learn to pounce on fans with pinpoint accuracy!", 
			"./img/fanmultiplieru6.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[5]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[5]; }
		),
		new Upgrade(6,"Exercise Regimen","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Gain a little muscle definition and show off that body!", 
			"./img/fanmultiplieru7.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[6]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[6]; }
		),
		new Upgrade(50,"Cat Scratch","Gain 1% "+WORTH_SHARE_SYMBOL,"Fever!", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.worthShare += 0.01; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(51,"Pounce","Gain 2% "+WORTH_SHARE_SYMBOL,"Knock them off their feet! Literally!", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.worthShare += 0.02; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(52,"Ultimate Relaxation","Gain 3% "+WORTH_SHARE_SYMBOL,"Sit, loaf, tuck, peep, hang...time to relax!", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.worthShare += 0.03; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(53,"Stray Fur","Gain 4% "+WORTH_SHARE_SYMBOL,"You can find a lot on stage after stressful performances.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.worthShare += 0.04; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(100,"Encore: The Cat's Meow","Gain 10% "+ENCORE_SYMBOL+" chance", "3 minutes and 20 seconds of meowing in different ways.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(101,"Encore: 1,000 Feet of Yarn","Gain 10% "+ENCORE_SYMBOL+" chance", "Her cutest performance in which she plays with a large ball of yarn.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(102,"Encore: Paw Pad Prance","Gain 10% "+ENCORE_SYMBOL+" chance", "Lots of complex hand motions and hip shaking.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(103,"Encore: Whiskers","Gain 10% "+ENCORE_SYMBOL+" chance", "A creepy tune made for a hallowe'en promo.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(120,"Cat Toy","Perform 10% more often", "She's strangely attracted to it.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(121,"Scratching Post","Perform 10% more often", "It's actually just a set prop.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(122,"Deluxe Tuna","Perform 10% more often", "Good alone, better in a sandwich.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(200,"Quick Attack","Perform again at the end of an input", "The fans will never see it coming! Is that a bad thing?", 
			"./img/uniqueu.png",false,
			function(idol) { return 1000000; },
			null,
			function(idol) { return idol.level >= 25; },
			function(idol,enabled) { performOnUnclick = enabled; }
		),
		new Upgrade(201,"Afternoon Nap","Cuts inspiration loss by 25%", "Save energy for the 4 hours of actual activity per day.", 
			"./img/uniqueu.png",true,
			function(idol) { return 2.5E11; },
			function(idol) { inspirationLossMultiplier *= .75; },
			function(idol) { return idol.level >= 100; }
		),
		new Upgrade(500,"Skill: "+SkillRegistry.Get(Skills.CatLikeCharm).name,SkillRegistry.Get(Skills.CatLikeCharm).description, "Meow, purr, beckon, and nuzzle to inspire everyone.", 
			"./img/skill_catgirl_1.png",false,
			function(idol) { return 7.77777E10; },
			null,
			function(idol) { return idol.level >= 75; },
			null,
			Skills.CatLikeCharm
		),
		new Upgrade(1000,"Image Change: Goth","Unlock a new outfit for the wardrobe", "Markedly different colour palette, but still a fan favourite.", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.wardrobe[1] = true; idol.outfit = 1; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(1001,"Image Change: Trash Panda","Unlock a new outfit for the wardrobe", "The cutest little pest.", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.wardrobe[2] = true; idol.outfit = 2; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(1002,"Image Change: Bluebird","Unlock a new outfit for the wardrobe", "The costume from an Idol duo promotion.", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.wardrobe[3] = true; idol.outfit = 3; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[0]; }
		)
	],
	[
		// Real Name, Aliases
		"Four","Kitty, Cat, The Sexy One",
		// Description
		"The idol fans know as \"The Sexy One\". Her cat ears and tail excite a lot of visually stimulated fans and her cat-like mannerisms win her massive points on the internet. Known especially for her hipnotic hip shaking and particularly nice body, though her flat chest is an oft discussed topic. She is in a professional rivalry with the Candy Idol.",
		// Lore
		"Though she never originally had any interest in becoming an Idol, everything changed when she realized how much attention she could get just by acting cute. Rumour has it that she spends so much of her professional life acting like a cat that her private life is largely spent sleeping. She has a pet cat at home.",
		// Likes
		"Yarn, string, cables, fish, chin scratches, head pats, nap time",
		// Dislikes
		"Paw pad presses, tail tugs, belly rubs"
	],
	function(idol,element,beatLength,data)
	{
		data.scale = data.scale != null ? data.scale : 1;
		data.rotation = data.rotation != null ? data.rotation : 0;
		//var b = 1;
		var beatTime = BeatTime()*idol.options[IdolOptions.Beat];
		var beatOffset = idol.options[IdolOptions.BeatOffset] * beatLength;
		var frameLength = idol.options[IdolOptions.FrameLengthModifier] * beatLength;
		var b = EASING.idolBounce((beatTime+beatOffset)%(frameLength),1.02,-0.04,frameLength);
		var c = Math.cos((BeatTime()-beatLength/2)/beatLength*Math.PI);
		var r = c * 2.5;
		data.scale += (b-data.scale)/(options[Options.UseCSSAnimations] ? 1 : 4);
		data.rotation += (r-data.rotation)/(options[Options.UseCSSAnimations] ? 1 : 8);
		//element.style.transform = "scale("+1+", "+data.scale+") rotate("+data.rotation+"deg)";
		idol.scaleX = 1;
		idol.scaleY = data.scale;
		idol.rotation = data.rotation /180*Math.PI;
	}
));

IdolRegistry.Register(Idols.SlimeIdol, new IdolTemplate(
	"Slime Idol", 1986, 22,
	[],
	"./img/slime0.png",
	[
		new Outfit("Level 1",
			"The default sprite. It looks more beautiful than any other slime for some reason.",
			[["./img/slime1.png","./img/slime2.png"]]
		),
		new Outfit("Level 15",
			"The second difficulty level of slimes. They gain magical powers sometimes.",
			[["./img/slime1b.png","./img/slime2b.png"]]
		),
		new Outfit("Starry Night",
			"The outfit used to promote the opening of a new space museum. It was very popular.",
			[["./img/slime1c.png","./img/slime2c.png"]]
		),
		new Outfit("Miniboss",
			"A more powerful version of the standard slime. The crown was a gift from a rich prince, though she could not become his princess.",
			[["./img/slime1d.png","./img/slime2d.png"]]
		)
	],
	[
		new Upgrade(0,"Extra Slime","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"A slime's charm point.", 
			"./img/fanmultiplieru1.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(1,"Extra Bounce","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Playing basketball with the fans. As the ball.", 
			"./img/fanmultiplieru2.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(2,"Extra Heart","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Just incase something happens to the first one.", 
			"./img/fanmultiplieru3.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(3,"Extra Life","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Even the hero of light can't beat this slime!", 
			"./img/fanmultiplieru4.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(4,"Extra Loot","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Rare, magic, legendary, heroic, special! Fans go wild for how rare these drops are!", 
			"./img/fanmultiplieru5.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[4]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[4]; }
		),
		new Upgrade(5,"Extra Body","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Behold! Two idols in one! Shapeshifting evolved!", 
			"./img/fanmultiplieru6.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[5]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[5]; }
		),
		new Upgrade(6,"Extra Charm","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Just as mysteriously as before, she somehow seems more charming than other slimes!", 
			"./img/fanmultiplieru7.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[6]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[6]; }
		),
		new Upgrade(50,"Wink","Gain 1% "+WORTH_SHARE_SYMBOL,"Without limbs or a voice, this is about as much interaction a fan can ask for!", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.worthShare += 0.01; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(51,"Autograph","Gain 2% "+WORTH_SHARE_SYMBOL,"It's actually just some slime.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.worthShare += 0.02; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(52,"Slime Pillow","Gain 3% "+WORTH_SHARE_SYMBOL,"Fans pay a lot for a quick nap on such a lovely pillow.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.worthShare += 0.03; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(53,"Sparring","Gain 4% "+WORTH_SHARE_SYMBOL,"Spend some time helping adventurous fans practice the art of RPG fighting.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.worthShare += 0.04; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(100,"Encore: Boing Boing","Gain 10% "+ENCORE_SYMBOL+" chance", "The dance that started her career. Popular in night clubs.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(101,"Encore: Squish Squish Squish","Gain 10% "+ENCORE_SYMBOL+" chance", "It's a lot a bouncing.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(102,"Encore: Pre-emptive Attack","Gain 10% "+ENCORE_SYMBOL+" chance", "Quick movements and an elaborate stage make for an entertaining performance.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(103,"Encore: Final Boss","Gain 10% "+ENCORE_SYMBOL+" chance", "An intimidating dance designed to strike fear in the hearts of heroes.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(120,"Touph Ring","Perform 10% more often", "Wait--what'd that say?", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(121,"Slimedrik's Sword","Perform 10% more often", "A once great warrior's sword now used as an Idol's accessory.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(122,"Spritzer","Perform 10% more often", "To keep refreshed and moisturized.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(200,"Reverberations","Gain a global 20% chance to perform an encore (can occur multiple times)", "The universe power of bounce is amazing!", 
			"./img/uniqueu.png",true,
			function(idol) { return 2.43E6; },
			function(idol) { globalEncoreChance += 0.20; },
			function(idol) { return idol.level >= 25; }
		),
		new Upgrade(201,"Astonishing Glare","Gain a global 5% chance to astonish with any performance, gaining " + ASTONISHMENT_MULTIPLIER + " more fans than usual", "The reflectivity of her surface illuminates fan's minds.", 
			"./img/uniqueu.png",true,
			function(idol) { return 1.52E8; },
			function(idol) { globalAstonishmentChance += 0.05; },
			function(idol) { return idol.level >= 50; }
		),
		new Upgrade(500,"Skill: "+SkillRegistry.Get(Skills.InspirationCooldown).name,SkillRegistry.Get(Skills.InspirationCooldown).description, "Just a little here and there to get things moving!", 
			"./img/skill_slime_1.png",false,
			function(idol) { return 3.14159E12; },
			null,
			function(idol) { return idol.level >= 75; },
			null,
			Skills.InspirationCooldown
		),
		new Upgrade(1000,"Image Change: Level 15","Unlock a new outfit for the wardrobe", "These are just palette swaps! Do the designers even care?!", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.wardrobe[1] = true; idol.outfit = 1; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(1001,"Image Change: Starry Night","Unlock a new outfit for the wardrobe", "There's (something like) an entire galaxy (being simulated) in there.", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.wardrobe[2] = true; idol.outfit = 2; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(1002,"Image Change: Miniboss","Unlock a new outfit for the wardrobe", "A beautiful crown for a happy slime.", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.wardrobe[3] = true; idol.outfit = 3; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[2]; }
		)
	],
	[
		// Real Name, Aliases
		"Slime","Goo",
		// Description
		"An exceptionally good looking slime who managed to get work based on her incredibly good looks. With no ability to sing, her success is largely based around her bouncy personality. Always cheerful and accepting of fans curious of her texture, her supporters are never far away with extra water in case she gets a little dried up. She can change her shape at will, but doesn't do so often.",
		// Lore
		"Originally a feral slime roaming the Slime Plains, a hero came along and saw her for beauty rather than her experience points. He offered her a better life and eventually she worked her way up the social ladder to stardom.",
		// Likes
		"Heroes, gold coins, rainy days, loot",
		// Dislikes
		"Sharp knives, hot and dry weather"
	],
	function(idol,element,beatLength,data)
	{
		data.scale = data.scale != null ? data.scale : 1;
		//var b = 1;
		var beatTime = BeatTime()*idol.options[IdolOptions.Beat];
		var beatOffset = idol.options[IdolOptions.BeatOffset] * beatLength;
		var frameLength = idol.options[IdolOptions.FrameLengthModifier] * beatLength;
		var b = EASING.idolBounce((beatTime+beatOffset)%(frameLength),.94,.08,frameLength);
		data.scale += (b-data.scale)/(options[Options.UseCSSAnimations] ? 1 : 8);
		element.style.transform = "scale("+1+", "+data.scale+")";
		idol.scaleX = 1;
		idol.scaleY = data.scale;
	}
));

IdolRegistry.Register(Idols.CandyIdol, new IdolTemplate(
	"Candy Idol", 7071, 64,
	[],
	"./img/bun0.png",
	[
		new Outfit("Pretty in Pink",
			"Her standard performance outfit. Specially crafted to drive fans crazy.",
			[["./img/bun2.png","./img/bun1.png"],
			["./img/bun2_b.png","./img/bun1_b.png"]]
		),
		new Outfit("Blue Rasbunny",
			"Part of a healthy food campaign. The dye was so tasty she couldn't help but snack on it.",
			[["./img/bun2b.png","./img/bun1b.png"]]
		),
		new Outfit("Magical Bunbun Creamy",
			"The costume for a magical girl anime promotion event. She struggled with the contact lenses.",
			[["./img/bun2c.png","./img/bun1c.png"]]
		),
		new Outfit("Precocious",
			"An extreme shift in appearance for a movie she had a role in. She won a few awards for her unexpectedly powerful performance.",
			[["./img/bun2d.png","./img/bun1d.png"]]
		),
		new Outfit("Monster",
			"A playful outfit based on a monster created for a children's game.",
			[["./img/bun2e.png","./img/bun1e.png"],
			["./img/bun2e_b.png","./img/bun1e_b.png"]]
		),
		new Outfit("Silent Type",
			"Expensive, rare, and dangerous outfit made from the ears of rabbits.",
			[["./img/bun2f.png","./img/bun1f.png"]]
		)
	],
	[
		new Upgrade(0,"Sugar Coating","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Hands off! No sampling!", 
			"./img/fanmultiplieru1.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(1,"Glaze","Gain 5x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"What a sticky mess...It's a hit with the fans?!", 
			"./img/fanmultiplieru2.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(2,"Rainbow Sprinkles","Gain 10x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"They fall off while dancing and sell for a high price on idolBae.", 
			"./img/fanmultiplieru3.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(3,"Chocolate Sauce","Gain 25x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"It makes for a yummy snack...in your dreams!",
			"./img/fanmultiplieru4.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(4,"Strawberry on top","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"A pleasant surprise when you forget it's there and remember before bed!", 
			"./img/fanmultiplieru5.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[4]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[4]; }
		),
		new Upgrade(5,"Caramel Lip Gloss","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Too alluring not to reapply hourly.", 
			"./img/fanmultiplieru6.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[5]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[5]; }
		),
		new Upgrade(6,"Apple Tart Perfume","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Fans follow their nose and find an even better treat than an apple tart in the end.", 
			"./img/fanmultiplieru7.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[6]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[6]; }
		),
		new Upgrade(50,"Gumdrop Trail","Gain 1% "+WORTH_SHARE_SYMBOL,"Anyone looking for a tasty treat is sure to be caught.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.worthShare += 0.01; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(51,"Candy Tape","Gain 2% "+WORTH_SHARE_SYMBOL,"Trap the fans in a binding they'll probably eat.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.worthShare += 0.02; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(52,"Vanilla Wafer Sticks","Gain 3% "+WORTH_SHARE_SYMBOL,"Hand feed fans. Ratings are through the roof!", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.worthShare += 0.03; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(100,"Encore: Sugar Sweet Cutie","Gain 10% "+ENCORE_SYMBOL+" chance", "A difficult to perform routine that requires backup dancers to be stepped on.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(101,"Encore: Cavities","Gain 10% "+ENCORE_SYMBOL+" chance", "A denpa song about all her favourite sweets and the ways to eat them.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(102,"Encore: Candyism","Gain 10% "+ENCORE_SYMBOL+" chance", "Her most popular video featuring the consumption of many snacks.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(103,"Encore: Cotton Candy Crush","Gain 10% "+ENCORE_SYMBOL+" chance", "A very pastel theatrical performance about high school romance.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(120,"Swirl Lollipop","Perform 10% more often", "A classic sweet.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(121,"Candy Corn","Perform 10% more often", "Functionally tooth glue.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(122,"Peach Chews","Perform 10% more often", "Made with 0% real peach juice.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(200,"Sugar Rush","Perform as the input moves (click/tap and drag)", "A high energy Idol creates high energy fans!", 
			"./img/uniqueu.png",false,
			function(idol) { return 3.781E7; },
			function(idol) { performOnDrag = true; },
			function(idol) { return idol.level >= 25; },
			function(idol,enabled) { performOnDrag = enabled; }
		),
		new Upgrade(201,"Candy Addiction","Doubles inspiration gain", "It tastes real good, so keep eating! Dental care is important though so brush your teeth as well.", 
			"./img/uniqueu.png",true,
			function(idol) { return 4.551E10; },
			function(idol) { inspirationGainRate *= 2 },
			function(idol) { return idol.level >= 100; }
		),
		new Upgrade(500,"Skill: "+SkillRegistry.Get(Skills.AutoPerform).name,SkillRegistry.Get(Skills.AutoPerform).description, "This is what happens when she's not supervised. Someone's about to get fired!", 
			"./img/skill_candy_1.png",false,
			function(idol) { return 1.777E8; },
			null,
			function(idol) { return idol.level >= 50; },
			null,
			Skills.AutoPerform,
			Buffs.SweetsSpree
		),
		new Upgrade(1000,"Image Change: Blue Rasbunny","Unlock a new outfit for the wardrobe", "Does the costume change come with a flavour change too?", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.wardrobe[1] = true; idol.outfit = 1; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(1001,"Image Change: Magical Bunbun Creamy","Unlock a new outfit for the wardrobe", "For a transformation, her outfit didn't change much. The starry eyes really make it.", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.wardrobe[2] = true; idol.outfit = 2; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(1002,"Image Change: Precocious","Unlock a new outfit for the wardrobe", "The costume of a very precocious character in a popular movie. Regarded as one of Candy's strongest roles.", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.wardrobe[3] = true; idol.outfit = 3; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(1003,"Image Change: Monster","Unlock a new outfit for the wardrobe", "Cute yellows and blacks. The ruffly fluff is soft as fleece. Fans line up for hours to grab a handful.", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.wardrobe[4] = true; idol.outfit = 4; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(1004,"Image Change: Silent Type","Unlock a new outfit for the wardrobe", "It took over 100 rabbit ears to produce this outfit. Don't get any junk on it!", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[3]); },
			function(idol) { idol.wardrobe[5] = true; idol.outfit = 5; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[3]; }
		)
	],
	[
		// Real Name, Aliases
		"Candy","Princess, Bunny, Bunbun, Ribbon",
		// Description
		"A bun who loves the spotlight almost as much as she loves sweets. Her petite size and penchant for posting risque selfies and snack tasting vlogs to chans makes her a hit with otaku. She's in a professional rivalry with the Catgirl Idol.",
		// Lore
		"She pursued the path of an idol in order to fuel her insatiable lust for snacks from all over the world. If it's sweet she wants it! Initially she was not very popular, but Four suggested they start a friendly rivalry and the foil dynamic they created helped her climb the rankings.",
		// Likes
		"Candy, sweet, treats, pastries, presents, teasing fans",
		// Dislikes
		"Bitter foods, spicy foods, bland foods, overbearing fans"
	],
	function(idol,element,beatLength,data)
	{
		data.scale = data.scale != null ? data.scale : 1;
		data.rotation = data.rotation != null ? data.rotation : 0;
		//var b = 1;
		var beatTime = BeatTime()*idol.options[IdolOptions.Beat];
		var beatOffset = idol.options[IdolOptions.BeatOffset] * beatLength;
		var frameLength = idol.options[IdolOptions.FrameLengthModifier] * beatLength;
		var b = EASING.idolBounce((beatTime+beatOffset)%(frameLength),.98,.04,frameLength);
		var c = Math.cos((BeatTime()+beatLength)/beatLength*Math.PI);
		var r = -c * 2;
		data.scale += (b-data.scale)/(options[Options.UseCSSAnimations] ? 1 : 4);
		data.rotation += (r-data.rotation)/(options[Options.UseCSSAnimations] ? 1 : 8);
		//element.style.transform = "scale("+1+", "+data.scale+") rotate("+data.rotation+"deg)";
		idol.scaleX = 1;
		idol.scaleY = data.scale;
		idol.rotation = data.rotation / 180 * Math.PI;
	}
));

IdolRegistry.Register(Idols.SingsongIdol, new IdolTemplate(
	"Singsong Idol", 35565, 127,
	[],
	"./img/sing0.png",
	[
		new Outfit("Ben Davis",
			"Her standard performance wear. Most fans believe this is her key look and think no outfit she wears will better suit her.",
			[["./img/sing1.png","./img/sing2.png"]]
		),
		new Outfit("Golden Delicious",
			"An outfit she chose for herself when she attended a vocal awards ceremony. She looked like her trophy.",
			[["./img/sing1b.png","./img/sing2b.png"]]
		),
		new Outfit("Melancholy Strawberry",
			"Part of a healthy food campaign. This outfit was met with a lot of speculation, as she appeared very absent-minded during the campaign.",
			[["./img/sing1c.png","./img/sing2c.png"]]
		)
	],
	[
		new Upgrade(0,"Singing Practice","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Because being second best isn't good enough.", 
			"./img/fanmultiplieru1.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(1,"Voice Coaching","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Push past that plateau!", 
			"./img/fanmultiplieru2.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(2,"Golden Voice","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"The voice that ends wars.", 
			"./img/fanmultiplieru3.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(3,"Swan Song","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"For some reason everyone is moved beyond words.", 
			"./img/fanmultiplieru4.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return  idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(4,"Range Gain","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Beat out those baritones! Surpass those soprano! Become unstoppable!", 
			"./img/fanmultiplieru5.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[4]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[4]; }
		),
		new Upgrade(5,"Throat Lozenge","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Fight through any irritation and overcome.", 
			"./img/fanmultiplieru6.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[5]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[5]; }
		),
		new Upgrade(6,"Acting Lessons","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"For her appearances in TV dramas, movies, and to make sure she appeals to even more fans.", 
			"./img/fanmultiplieru7.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[6]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[6]; }
		),
		new Upgrade(50,"Siren Call","Gain 1% "+WORTH_SHARE_SYMBOL,"Lure the fans in and make sure they never leave.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.worthShare += 0.01; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(51,"Lullaby","Gain 2% "+WORTH_SHARE_SYMBOL,"Sow the seeds of slumber.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.worthShare += 0.02; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(52,"Mass Hallucination","Gain 3% "+WORTH_SHARE_SYMBOL,"Everyone is chanting their support in unison.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.worthShare += 0.03; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(100,"Encore: Midnight Unrest","Gain 10% "+ENCORE_SYMBOL+" chance", "The title sounds deep, but the lyrics just talk about late night TV addiction.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.encoreChance += .05; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(101,"Encore: Decomposing","Gain 10% "+ENCORE_SYMBOL+" chance", "A song about the opposite of life.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.encoreChance += .05; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(102,"Encore: Apple Seeds","Gain 10% "+ENCORE_SYMBOL+" chance", "6 minutes of listing apple names alongside apple related puns. A best seller.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.encoreChance += .05; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(103,"Encore: Teacher's Gift","Gain 10% "+ENCORE_SYMBOL+" chance", "Sung poetry about eloping with a teacher after graduation. Loosely based on an unpopular drama.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.encoreChance += .05; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(120,"Apple Pie","Perform 10% more often", "Made by the apple herself. With love. But it's not very good.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(121,"Apple Cider","Perform 10% more often", "Is it hard? Why, yes. It is.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(122,"Apple Cinnamon Cereal","Perform 10% more often", "Really not a healthy choice, but it is tasty.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(200,"Hypnosis","Can perform with alternative inputs", "When I snap my fingers you will wake up and love me twice as much!", 
			"./img/uniqueu.png",false,
			function(idol) { return 9.876E6; },
			function(idol) { performOnRightClick = true; },
			function(idol) { return idol.level >= 25; },
			function(idol,enabled) { performOnRightClick = enabled; }
		),
		new Upgrade(500,"Skill: "+SkillRegistry.Get(Skills.InspiringSong).name,SkillRegistry.Get(Skills.InspiringSong).description, "Let the flawless vibrations inspire every atom in your body.", 
			"./img/skill_singsong_1.png",false,
			function(idol) { return 1E10; },
			null,
			function(idol) { return idol.level >= 75; },
			null,
			Skills.InspiringSong,
			Buffs.InspiringSong
		),
		new Upgrade(1000,"Image Change: Golden Delicious","Unlock a new outfit for the wardrobe", "It's a golden apple.", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.wardrobe[1] = true; idol.outfit = 1; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(1001,"Image Change: Melancholic Strawberry","Unlock a new outfit for the wardrobe", "Her change in mood is just for show, right?", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.wardrobe[2] = true; idol.outfit = 2; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[1]; }
		)
	],
	[
		// Real Name, Aliases
		"Cynthia","Apple, Red, Siren",
		// Description
		"A very professional idol. She takes her work seriously and has by far the best voice in the industry. Any time she spends not performing is spent doing vocal training exercises and writing new songs. She is her own toughest critique and struggles with insecurity, but pays a lot of attention to what the fans want.",
		// Lore
		"Heartbroken after a relationship that went sour, she began to pour her emotions into her songs. Finding singing cathartic, she continued to practice and naturally made her way into the industry. Though there are plenty of potential lovers out there now, she refuses to get involved in romance.",
		// Likes
		"Singing, songwriting, poetry",
		// Dislikes
		"Romance",
	],
	function(idol,element,beatLength,data)
	{
		data.scale = data.scale != null ? data.scale : 1;
		data.rotation = data.rotation != null ? data.rotation : 0;
		//var b = 1;
		//+beatLength/2
		var beatTime = BeatTime()*idol.options[IdolOptions.Beat];
		var beatOffset = idol.options[IdolOptions.BeatOffset] * beatLength;
		var frameLength = idol.options[IdolOptions.FrameLengthModifier] * beatLength;
		var b = EASING.idolBounce((beatTime+beatOffset)%(frameLength),.97,.03,frameLength);
		var c = Math.cos(BeatTime()/beatLength*Math.PI);
		var r = c * 1;
		data.rotation += (r-data.rotation)/(options[Options.UseCSSAnimations] ? 1 : 8);
		data.scale += (b-data.scale)/(options[Options.UseCSSAnimations] ? 1 : 4);
		//element.style.transform = "scale("+1+", "+data.scale+") rotate("+r+"deg)";
		idol.scaleX = 1;
		idol.scaleY = data.scale;
		idol.rotation = data.rotation / 180 * Math.PI;
	},
	{
		[IdolOptions.Beat]:1,
		[IdolOptions.BeatOffset]:.5,
		[IdolOptions.FrameLengthModifier]:1,
	}
));

IdolRegistry.Register(Idols.CameoIdol, new IdolTemplate(
	"Cameo Idol", 301301, 301,
	[],
	"./img/cameo0.png",
	[
		new Outfit("Raglan",
			"The outfit that she wore on the day she entered the office. Her everyday clothes, actually. Known for the ability to make any person seem younger than they are.",
			[["./img/cameo1.png","./img/cameo2.png"],
			["./img/cameo1_b.png","./img/cameo2_b.png"],
			["./img/cameo1_c.png","./img/cameo2_c.png"]]
		),
		new Outfit("Hannah Lily",
			"A cosplay outfit. The clothes worn by a peculiarly quiet protagonist in a wildly unpopular webcomic.",
			[["./img/cameo1b.png","./img/cameo2b.png"],
			["./img/cameo1b_b.png","./img/cameo2b_b.png"]]
		),
		new Outfit("Background Character",
			"A cosplay outfit. The clothes worn by a character who had less than one minute of screen time during a flashback.",
			[["./img/cameo1c.png","./img/cameo2c.png"]]
		)
	],
	[
		new Upgrade(0,"Disguise","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Wait, is that her? Nah, must be mistaken...", 
			"./img/fanmultiplieru1.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(1,"Eye Contact","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Even a quick glance is enough to bring a fan to their knees.", 
			"./img/fanmultiplieru2.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(2,"Cute Laugh","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"A video in which she was tickled went viral with over 100,000,000,000 views!", 
			"./img/fanmultiplieru3.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(3,"Puppy Dog Eyes","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"It's actually a crime in some places to refuse her.",
			"./img/fanmultiplieru4.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(4,"Sexy Smirk","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"A slight tug on the left corner of her mouth. Close up videos of this smirk are highly treasured.", 
			"./img/fanmultiplieru5.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[4]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[4]; }
		),
		new Upgrade(5,"Expression Practice","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Hours and hours spent looking at herself in the mirror pays off.", 
			"./img/fanmultiplieru6.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[5]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[5]; }
		),
		new Upgrade(6,"Extra Hair Care","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Loose strands of her hair are worth more than gold nuggets.", 
			"./img/fanmultiplieru7.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[6]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[6]; }
		),
		new Upgrade(50,"Professional Hug","Gain 1% "+WORTH_SHARE_SYMBOL,"$1,000 for a 3 second hug with a $250 per second overtime charge.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.worthShare += 0.01; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(51,"Funny Faces","Gain 2% "+WORTH_SHARE_SYMBOL,"Even though she's bad at them, she tries real hard and makes new fans anyway.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.worthShare += 0.02; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(52,"Yawn","Gain 3% "+WORTH_SHARE_SYMBOL,"Even the most mundane actions are broadcast on the big news stations.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.worthShare += 0.03; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(100,"Encore: Love Me, Love You","Gain 10% "+ENCORE_SYMBOL+" chance", "Cheerful and upbeat gushing about lovey dovey stuff.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(101,"Encore: Reflection","Gain 10% "+ENCORE_SYMBOL+" chance", "A sorrowful song about the duality of humanity.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(102,"Encore: ME247","Gain 10% "+ENCORE_SYMBOL+" chance", "A first person music video about spending the day with her. It made record sales among her fans.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(103,"Encore: Solitude","Gain 10% "+ENCORE_SYMBOL+" chance", "Slow and sad, this song about loneliness brings fans to tears every time.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(120,"Strawberry Scented Shampoo","Perform 10% more often", "Hair care is important (and the smell attracts more fans.)", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(121,"Incense","Perform 10% more often", "Stressed? Take a warm bath with some incense burning and chill out!", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(122,"Body Pillow","Perform 10% more often", "Something to hug on those restless nights.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(200,"Endless Energy","Perform 100% more often", "Can't stop, won't stop!!", 
			"./img/uniqueu.png",true,
			function(idol) { return 10000000000; },
			function(idol) { idol.performRate += 1.00; },
			function(idol) { return idol.level >= 25; }
		),
		new Upgrade(500,"Skill: "+SkillRegistry.Get(Skills.CooldownReduction).name,SkillRegistry.Get(Skills.CooldownReduction).description, "Catastrophically Unwieldy Temporal Energy! Tear the fabrics of spacetime!", 
			"./img/skill_cameo_1.png",false,
			function(idol) { return 1E12; },
			null,
			function(idol) { return idol.level >= 50; },
			null,
			Skills.CooldownReduction
		),
		new Upgrade(1000,"Image Change: Hannah Lily","Unlock a new outfit for the wardrobe", "Based on the heroine of some webcomic.", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.wardrobe[1] = true; idol.outfit = 1; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(1001,"Image Change: Background Character","Unlock a new outfit for the wardrobe", "Really cute, really blue, really unimportant.", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.wardrobe[2] = true; idol.outfit = 2; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[1]; }
		)
	],
	[
		// Real Name, Aliases
		"Ilise Rose","Cosplay, Outfit, Hyper",
		// Description
		"A hyperactive, befreckled newcomer to the idol scene. Known for her cosplay hobby, she makes a lot of friends (and a few enemies) by paying tribute to their outfits. Her followers tend to treat her like a child because of her innocent appearance which she takes advantage of at every opportunity.",
		// Lore
		"She became an idol to get away from a rather difficult family situation. Her fans show her the dedication and appreciation that she couldn't find at home. She continues to try her best in order to keep that warmth of being loved alive.",
		// Likes
		"Raglan designs, snuggling up under blankets on cold days, wistfully watching out into the snow with hot chocolate in hand",
		// Dislikes
		"Actually being out in cold weather, screwing up during a performance"
	],
	function(idol,element,beatLength,data)
	{
		data.scale = data.scale != null ? data.scale : 1;
		//var b = 1;
		// +beatLength
		var beatTime = BeatTime()*idol.options[IdolOptions.Beat];
		var beatOffset = idol.options[IdolOptions.BeatOffset] * beatLength;
		var frameLength = idol.options[IdolOptions.FrameLengthModifier] * beatLength;
		var b = EASING.idolBounce((beatTime+beatOffset)%(frameLength),.98,.04,frameLength);
		data.scale += (b-data.scale)/(options[Options.UseCSSAnimations] ? 1 : 4);
		//element.style.transform = "scale("+1+", "+data.scale+")";
		idol.scaleX = 1;
		idol.scaleY = data.scale;
		//idol.rotation = data.rotation / 180 * Math.PI;
	},
	{
		[IdolOptions.Beat]:1.5,
		[IdolOptions.BeatOffset]:1,
		[IdolOptions.FrameLengthModifier]:1,
	}
));

IdolRegistry.Register(Idols.PrettyIdol, new IdolTemplate(
	"Pretty Idol", 5.523E6, 7777,
	[],
	"./img/trap0.png",
	[
		new Outfit("Lovely Cheer",
			"His standard idol outfit. It was the second outfit he was given for a photoshoot. A few low angle shots leaked before the release and propelled him into popularity online resulting in unexpectedly high sales.",
			[["./img/trap1.png","./img/trap2.png"],
			["./img/trap1_b.png","./img/trap2_b.png"]]
		),
		new Outfit("Heartbreak",
			"A spin on his standard outfit based on Candy Idol's Precocious theme. His decision for the Idol Crisscross Colour Pairing event.",
			[["./img/trap1b.png","./img/trap2b.png"],
			["./img/trap1b_b.png","./img/trap2b_b.png"]]
		),
		new Outfit("Farmhand",
			"Tan and loose, this outfit was what he wore to a summer cover photoshoot. The outdoors shoot drew in a lot of free publicity for the issue.",
			[["./img/trap1c.png","./img/trap2c.png"]]
		)
	],
	[
		new Upgrade(0,"Forced Blush","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"The power to blush on call is great for fan meetups.", 
			"./img/fanmultiplieru1.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(1,"Fake Tears","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Turn on the waterworks at a moment's notice and score a bunch of pity points.", 
			"./img/fanmultiplieru2.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(2,"Geometry Studies","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Perfect the art of placing your hips at the teasiest angle during a photoshoot to maximize sales.", 
			"./img/fanmultiplieru3.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(3,"Upwards Look","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Run into their arms and give them this look and they'll be fans forever!",
			"./img/fanmultiplieru4.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(4,"Feign Innocence","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"An uncanny ability to make anyone want to protect you.", 
			"./img/fanmultiplieru5.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[4]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[4]; }
		),
		new Upgrade(5,"Laser Hair Removal","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Make sure all the right places are as smooth as can be.", 
			"./img/fanmultiplieru6.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[5]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[5]; }
		),
		new Upgrade(6,"Eating Practice","Gain 2x more "+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL,"Skills gained from classes on how to stimulate others by how you eat certain foods.", 
			"./img/fanmultiplieru7.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_MULTIPLIER_BASE_COST_MULTIPLIER[6]) },
			function(idol) { idol.worthMultiplier *= 2; },
			function(idol) { return idol.level >= UPGRADES_FAN_MULTIPLIER_REQUIRED_LEVEL[6]; }
		),
		new Upgrade(50,"Skirt Twirl","Gain 1% "+WORTH_SHARE_SYMBOL,"Perform a little spin that precises lifts the skirt for optimal viewing.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.worthShare += 0.01; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(51,"Heart Symbol","Gain 2% "+WORTH_SHARE_SYMBOL,"Make a cute heart with your hands and all the fans will return the gesture.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.worthShare += 0.02; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(52,"Quick Nap","Gain 3% "+WORTH_SHARE_SYMBOL,"Pretend to fall asleep and gently lean on a fan to keep them there.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.worthShare += 0.03; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(53,"Aggressive Lead","Gain 4% "+WORTH_SHARE_SYMBOL,"Grab a fan's hand in both of yours and lead them while walking backwards. They won't be able to refuse whatever you bring them to do.", 
			"./img/fanshareu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_FAN_SHARE_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.worthShare += 0.04; },
			function(idol) { return idol.level >= UPGRADES_FAN_SHARE_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(100,"Encore: Is This Me?","Gain 10% "+ENCORE_SYMBOL+" chance", "A song about what it's like to be a cross-dressing idol.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(101,"Encore: Serendipity","Gain 10% "+ENCORE_SYMBOL+" chance", "A slow paced, relaxed song about fan appreciation and happy events that have happened to him since becoming an Idol.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(102,"Encore: Slow Kiss","Gain 10% "+ENCORE_SYMBOL+" chance", "His most popular song amongst his older male audience. A particularly detailed song about what he believes the perfect kiss would be like.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(103,"Encore: Trip Trap","Gain 10% "+ENCORE_SYMBOL+" chance", "An experimental punk song that didn't do very well when he sang, but has been more successfully covered by other idols.", 
			"./img/encoreu.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_ENCORE_BASE_COST_MULTIPLIER[3]) },
			function(idol) { idol.encoreChance += 0.10; },
			function(idol) { return idol.level >= UPGRADES_ENCORE_REQUIRED_LEVEL[3]; }
		),
		new Upgrade(120,"Fanmail","Perform 10% more often", "Reading fanmail motivates him to try even harder.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(121,"Spa Trips","Perform 10% more often", "The occasional trip to the helps him loosen up and look the best he can.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[1]; }
		),
		new Upgrade(122,"Gifts","Perform 10% more often", "Fans send in expensive gifts in the hopes of winning his heart.", 
			"./img/stopwatch.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_PERFORMANCE_MASTERY_BASE_COST_MULTIPLIER[2]) },
			function(idol) { idol.performRate += 0.10; },
			function(idol) { return idol.level >= UPGRADES_PERFORMANCE_MASTERY_REQUIRED_LEVEL[2]; }
		),
		new Upgrade(200,"Envious Body","All other Idols perform 25% more often.", "Everyone else seems to work a little harder when he's around.", 
			"./img/uniqueu.png",true,
			function(idol) { return 1.00E12; },
			function(idol) { envyBonus += 0.25; },
			function(idol) { return idol.level >= 50; }
		),
		new Upgrade(500,"Skill: "+SkillRegistry.Get(Skills.PermanentStatGains).name,SkillRegistry.Get(Skills.PermanentStatGains).description, "Solidify everyone's inspiration into pure ability with a delightful cheer routine.", 
			"./img/mic.png",false,
			function(idol) { return 1.53241E13; },
			null,
			function(idol) { return idol.level >= 50; },
			null,
			Skills.PermanentStatGains
		),
		new Upgrade(1000,"Image Change: Heartbreak","Unlock a new outfit for the wardrobe", "Dark and menacing colours on such and adorable Idol. Great juxtaposition!", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[0]) },
			function(idol) { idol.wardrobe[1] = true; idol.outfit = 1; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[0]; }
		),
		new Upgrade(1001,"Image Change: Heartbreak","Unlock a new outfit for the wardrobe", "The tan and farmer-typical clothing juxtapose well against his soft, unworked skin to exemplify his portrayed innocence.", 
			"./img/outfit.png",true,
			function(idol) { return CalculateBasedCost(idol.baseCost,UPGRADES_OUTFIT_BASE_COST_MULTIPLIER[1]) },
			function(idol) { idol.wardrobe[2] = true; idol.outfit = 2; },
			function(idol) { return idol.level >= UPGRADES_OUTFIT_REQUIRED_LEVEL[1]; }
		)
	],
	[
		// Real Name, Aliases
		"Errol","Pretty Boy, Trap",
		// Description
		"A sheepish, soft voiced idol known for having a body that makes his female friends envious and his male friends stutter. Very popular with a particular group of fans who idolize pretty boys.",
		// Lore
		"As a kid he liked to dress up in his sister's clothes because they looked better than his own. He realized his potential to make it as an idol after a great deal of praise online and went against his shy nature to join the agency.",
		// Likes
		"Sunshine showers, beach vacations, sharing umbrellas, trying on clothes (but not buying them)",
		// Dislikes
		"Being surprised, acne, sleeping in, tight schedules"
	],
	function(idol,element,beatLength,data)
	{
		data.scale = data.scale != null ? data.scale : 1;
		//var b = 1;
		// +beatLength
		data.rotation = data.rotation != null ? data.rotation : 0;
		var c = Math.cos(BeatTime()/beatLength*Math.PI);
		var r = c * -1;
		var beatTime = BeatTime()*idol.options[IdolOptions.Beat];
		var beatOffset = idol.options[IdolOptions.BeatOffset] * beatLength;
		var frameLength = idol.options[IdolOptions.FrameLengthModifier] * beatLength;
		var b = EASING.idolBounce((beatTime+beatOffset)%(frameLength),.98,.04,frameLength);
		data.scale += (b-data.scale)/(options[Options.UseCSSAnimations] ? 1 : 4);
		//element.style.transform = "scale("+1+", "+data.scale+")";
		data.rotation += (r-data.rotation)/(options[Options.UseCSSAnimations] ? 1 : 8);
		idol.scaleX = 1;
		idol.scaleY = data.scale;
		idol.rotation = data.rotation / 180 * Math.PI;
	},
	{
		[IdolOptions.Beat]:1,
		[IdolOptions.BeatOffset]:0,
		[IdolOptions.FrameLengthModifier]:1,
	}
));

/*IdolRegistry.Register(Idols.TestIdol, new IdolTemplate(
	"Test Idol", 1, 1,
	[],
	"./img/bun0.png",
	[["./img/cat1c.png","./img/cat2c.png"]],
	[
		new Upgrade(0,"Foo","Bar","Baz", 
			function(idol) { return 1; },
			"./img/x2u.png",
			function(idol) { },
			function(idol) { return true; }
		)
	]
));*/

var AddIdol = function(idol)
{
	idols[idol.id] = idol;
	if ( !useCanvas )
	{
		idolContainer.appendChild(idol.element);
	}
	else
	{
		SortIdols();
	}
	return idol;
}

var ValidIdols = function()
{
	var choices = [];
	for( var i = 0; i <= idols.length; i++ )
	{
		if ( idols[i] != null )
		{
			choices.push(idols[i]);
		}
	}
	return choices;
}

var RandomIdol = function()
{
	var choices = ValidIdols();
	if ( choices.length > 0 )
	{
		var choice = choices[Math.floor(Math.random()*choices.length)];
		return choice;
	}
	return null;
}

var HidePanels = function(target)
{
	var panels = [
		ConfirmationPanel,
		NotificationPanel,
		UpgradePanel,
		IdolInfoPanel,
		OptionsPanel,
		ChangelogPanel,
		IdolDetailsPanel,
		FeedbackPanel,
		HelpPanel
	];
	for ( var i = 0; i < panels.length; i++ )
	{
		var panel = panels[i];
		var shouldShow = false;
		if ( IsElementDescendantOf(target,panel.element) || target == panel.element )
		{
			shouldShow = true;
		}
		
		var stuckTo = panel.StuckTo();
		for( var j = 0; j < stuckTo.length; j++ )
		{
			if ( stuckTo[j] != null && IsElementDescendantOf(target,stuckTo[j]) )
			{
				shouldShow = true;
			}
		}
		if ( shouldShow )
		{
			panel.Show(true);
		}
		else
		{
			panel.Hide();
			panel.CleanSticky();
		}
	}
}

var Inputs = new(function()
{
	this.inputs = {};
	this.Attach = function(input)
	{
		this.inputs[input.id] = input;
	}
	this.Detach = function(input)
	{
		delete this.inputs[input.id];
	}
	this.Get = function(id)
	{
		return this.inputs[id];
	}
})();

var Input = function(id,alt)
{
	this.id = id;
	this.alt = alt;
	this.x = null;
	this.y = null;
	this.dx = null;
	this.dy = null;
	this.distanceX = null;
	this.distanceY = null;
	this.Start = function(x,y)
	{
		this.x = x;
		this.y = y;
		InputStart(this,this.x,this.y,this.alt)
		Inputs.Attach(this);
	}
	this.Move = function(x,y)
	{
		this.dx = x - this.x;
		this.dy = y - this.y;
		this.x = x;
		this.y = y;
		this.distanceX += Math.abs(this.dx);
		this.distanceY += Math.abs(this.dy);
		InputMove(this,this.x,this.y,this.dx,this.dy,this.alt);
	}
	this.End = function(x,y)
	{
		this.x = x;
		this.y = y;
		InputEnd(this,this.x,this.y,this.alt);
		Inputs.Detach(this);
	}
}

var InputStart = function(input,x,y,alt)
{
	debugInputStart = true;
	if ( activeIdol != null )
	{
		activeIdol.Deactivate();
		activeIdol = null;
	}
	if ( hoverIdol != null )
	{
		hoverIdol.Leave();
		hoverIdol = null;
	}
	if ( !options[Options.LockIdolPositions] )
	{
		var closestIdol = GetClosestIdolWithin(x,y);
		if( hoverIdol != null && hoverIdol != closestIdol  )
		{
			hoverIdol.Leave();
		}
		hoverIdol = closestIdol;
	}
	if( hoverIdol != null )
	{
		activeIdol = hoverIdol;
		activeIdol.Activate(inputX,inputY);
	}
	else
	{
		if ( !alt )
		{
			Perform();
		}
		else if ( alt && performOnRightClick )
		{
			Perform();
		}
	}
}

document.addEventListener("touchstart",function(event)
{
	if( timeToSimulate > 0 )
	{
		event.stopPropagation();
		return;
	}
	for ( var i = 0; i < event.touches.length; i++ )
	{
		var touch = event.touches[i];
		inputX = touch.clientX - canvasRect.left;
		inputY = touch.clientY - canvasRect.top;
		//InputStart(inputX,inputY,false);
		new Input(touch.identifier,false).Start(inputX,inputY);
	}
});

document.onclick = function(event)
{
	if( timeToSimulate > 0 )
	{
		event.stopPropagation();
		return;
	}
	HidePanels(event.target);
}

var lastMouseDownTarget = null;
document.onmousedown = function(event)
{
	if( timeToSimulate > 0 )
	{
		event.stopPropagation();
		return;
	}
	lastMouseDownTarget = event.target;
}

idolContainer.onmousedown = function(event)
{
	if ( !event.sourceCapabilities || (event.sourceCapabilities && !event.sourceCapabilities.firesTouchEvents)  )
	{
		inputX = event.clientX - canvasRect.left;
		inputY = event.clientY - canvasRect.top;
		var buttons = event.buttons;
		while( buttons > 0)
		{
			var id = LargestFittingPower(buttons);
			buttons -= id;
			if ( Inputs.Get(id) == null )
			{
				var input = new Input(id,event.button > 0);
				input.Start(inputX,inputY);
			}
		}
	}
}

var InputEnd = function(input,x,y,alt)
{
	debugInputEnd = true;
	if( performOnUnclick )
	{
		if ( !alt )
		{
			Perform();
		}
		else if ( alt && performOnRightClick )
		{
			Perform();
		}
	}
	if ( activeIdol != null )
	{
		activeIdol.Deactivate();
		activeIdol = null;
	}

	if ( hoverIdol != null )
	{
		hoverIdol.Leave();
		hoverIdol = null;
	}
}

document.addEventListener("touchend",function(event)
{
	for ( var i = 0; i < event.changedTouches.length; i++ )
	{
		var touch = event.changedTouches[i];
		inputX = touch.clientX - canvasRect.left;
		inputY = touch.clientY - canvasRect.top;
		var input = Inputs.Get(touch.identifier);
		if ( input != null )
		{
			input.End(inputX,inputY);
		}
	}
});

document.onmouseup = function(event)
{
	if( timeToSimulate > 0 )
	{
		event.stopPropagation();
		return;
	}
	if ( !event.sourceCapabilities || (event.sourceCapabilities && !event.sourceCapabilities.firesTouchEvents)  )
	{
		inputX = event.clientX - canvasRect.left;
		inputY = event.clientY - canvasRect.top;
		var buttons = event.buttons;
		for ( var k in Inputs.inputs )
		{
			var input = Inputs.inputs[k];
			if ( (buttons & input.id) != input.id )
			{
				input.End(inputX,inputY);
			}
		}
		autoClickTarget = null;
		autoClickInterval = AUTO_CLICK_MAXIMUM;
	}
}

document.addEventListener("touchmove",function(event)
{
	for ( var i = 0; i < event.changedTouches.length; i++ )
	{
		var touch = event.changedTouches[i];
		lastInputX = inputX;
		lastInputY = inputY;
		inputX = touch.clientX;
		inputY = touch.clientY;
		var input = Inputs.Get(touch.identifier);
		if ( input )
		{
			input.Move(inputX,inputY);
		}
	}
});

document.onmousemove = function(event)
{
	if( timeToSimulate > 0 )
	{
		event.stopPropagation();
		return;
	}
	if ( !event.sourceCapabilities || (event.sourceCapabilities && !event.sourceCapabilities.firesTouchEvents)  )
	{
		lastInputX = inputX;
		lastInputY = inputY;
		inputX = event.clientX - canvasRect.left;
		inputY = event.clientY - canvasRect.top;
		var buttons = event.buttons;
		while( buttons > 0)
		{
			var id = LargestFittingPower(buttons);
			buttons -= id;
			var input = Inputs.Get(id);
			if ( input )
			{
				Inputs.Get(id).Move(inputX,inputY);
			}
		}
		InputMove(null,inputX,inputY,inputX-lastInputX,inputY-lastInputY);
	}
}

var CollidingPointRect = function(x,y,rx,ry,rw,rh)
{
	var px = (rw)/2 - Math.abs((rx+rw/2)-x);
	var py = (rh)/2 - Math.abs((ry+rh/2)-y);
	if ( px > 0 && py > 0 )
	{
		return true;
	}
	return false;
}

var CollidingPointAABB = function(x,y,rx,ry,rw,rh)
{
	var px = rw/2-Math.abs(rx-x);
	var py = rh/2-Math.abs(ry-y);
	if ( px > 0 && py > 0 )
	{
		return true;
	}
	return false;
}

var GetClosestIdolWithin = function(x,y,distance)
{
	var closest = 1000000;
	var closestIdol = null;
	for ( var i = 0; i < idols.length; i++ )
	{
		var idol = idols[i];
		if ( idol )
		{
			var idolDistance = Math.sqrt(Math.pow(idol.x-inputX,2)+Math.pow(idol.y-inputY,2));
			if( idol.options[IdolOptions.Visible] && idolDistance < closest && /*idolDistance <= idol.width/2*/ CollidingPointAABB(inputX,inputY,idol.x,idol.y,idol.width,idol.height ))
			{
				closest = idolDistance;
				closestIdol = idol;
			}
		}
		
	}
	return closestIdol;
}

var InputMove = function(input,x,y,dx,dy,alt)
{
	debugInputMove = true;
	var vx = dx/12;
	var vy = dy/12;
	averageVelocityX += vx;
	averageVelocityY += vy;
	if ( input != null && alt == false )
	{
		drag = true;
	}
	if ( !options[Options.LockIdolPositions] )
	{
		var closestIdol = GetClosestIdolWithin(x,y,IDOL_HOVER_DISTANCE);
		if( hoverIdol != null && hoverIdol != closestIdol  )
		{
			hoverIdol.Leave();
		}
		if ( closestIdol != null && !activeIdol )
		{
			hoverIdol = closestIdol;
			hoverIdol.Hover();
		}
	}
	if( activeIdol != null )
	{
		activeIdol.FollowMouse();
	}
}

document.oncontextmenu = function(event)
{
	event.preventDefault();
	if( timeToSimulate > 0 )
	{
		event.stopPropagation();
		return;
	}
}

var InspirationGain = function(performances,raw)
{
	var gain = inspirationGainRate * performances + (raw||0);
	gain = gain + gain * inspirationGainBuff;
	inspiration += gain;
	return gain;
}

var Performance = function(fans, astonishment)
{
	this.fans = fans || 0;
	this.astonishment = astonishment || 0;
}

var BaseFanGain = function()
{
	var fansPerClick = Math.floor(userPerformances / CLICK_FAN_BONUS_INTERVAL) + 1;
	var baseFans = fansPerClick * fansPerClickMultiplier;
	return baseFans;
}

var FanGain = function(amount,base)
{
	amount = amount || 1;
	var baseFans = BaseFanGain();
	var gainedFans = 0;
	for ( var k in idols )
	{
		var idol = idols[k];
		if ( idol.WorthShare() > 0 )
		{
			baseFans += idol.WorthShare() * idol.BaseFanGain();
		}
	} 
	var astonishment = 0;
	for( var i = 0; i < amount; i++ )
	{
		if ( base !== false && Math.random() <= globalAstonishmentChance )
		{
			gainedFans += baseFans * ASTONISHMENT_MULTIPLIER;
			astonishment++;
		}
		else
		{
			gainedFans += baseFans;
		}
	}
	return new Performance(Math.ceil(gainedFans * FanGainMultiplier() * UserFanGainMultiplier()), astonishment);
}

var Perform = function(performancesToDo)
{
	lastPerformTime = Date.now();
	inspirationLossDelay = INSPIRATION_LOSS_DELAY;
	performancesToDo = performancesToDo || 1;
	var encores = 0;
	if ( globalEncoreChance > 0 )
	{
		var encoreChance = globalEncoreChance;
		while(Math.random() < encoreChance )
		{
			encores++;
			encoreChance /= 2;
		}
	}
	if( encores > 0 )
	{
		performancesToDo += encores;
	}
	userPerformances += performancesToDo;
	InspirationGain(performancesToDo * inspirationGain);
	var performance = FanGain(performancesToDo);
	GainFans(performance);

	if( options[Options.ShowPlayerParticles] )
	{
		particleBuffer.Add(performance.fans,performancesToDo,encores,performance.astonishment);
		//new PerformanceSpark(inputX,inputY,averageVelocityX+(Math.random()-0.5)*4,averageVelocityY+(Math.random()-0.5)*4,Math.random()*250 + 250,Math.random()*24+8);
		new PerformanceSpark(inputX,inputY,(Math.random()-0.5)*4,(Math.random()-0.5)*4,Math.random()*250 + 250,Math.random()*24+8);
	}
}

var GainFans = function(performance)
{
	fans += performance.fans;
	lifetimeFans += performance.fans;
	totalFanGainThisSecond += performance.fans;
}

var RefreshIdolListEntries = function()
{
	for ( var i = 0; i < idolListEntries.length; i++ )
	{
		if( idolListEntries[i] != null )
		{
			idolListEntries[i].Refresh(GameTime());
		}
	}
}

var localLastUpdateTime;
var Update = function()
{
	var nextUpdateDelay = UPDATE_RATE;
	averageVelocityX *= .7;
	averageVelocityY *= .7;
	ClearLog();
	now = Date.now();
	if ( localLastUpdateTime == null )
	{
		localLastUpdateTime = now;
	}
	supervisionTime += now - localLastUpdateTime;
	localLastUpdateTime = now;
	var dt = now - lastUpdateTime;
	if ( !paused )
	{
		if ( dt > 1000 )
		{
			timeToSimulate = dt;
		}
		var timeToStep = dt;
		var steps = 1;
		if ( timeSimulated >= timeToSimulate )
		{
			timeSimulated = 0;
			timeToSimulate = 0;
		}
		if ( timeSimulated < timeToSimulate )
		{
			timeToStep = Math.min(timeToSimulate - timeSimulated,TIME_TO_SIMULATE_PER_FRAME);
			nextUpdateDelay = 1;
		}
		while( timeToStep > 0 )
		{
			var step = Math.min(TIME_TO_SIMULATE_PER_STEP,timeToStep);
			GameLogicStep(step,now);
			now += step;
			timeSimulated += step;
			timeToStep -= step;
		}
		if ( performOnDrag && drag )
		{
			dragDistanceAccumulator += 1;
			var performancesToDo = Math.floor(dragDistanceAccumulator/dragPerformanceDistance);
			if ( performancesToDo > 0 )
			{
				dragDistanceAccumulator -= performancesToDo * dragPerformanceDistance;
				Perform(performancesToDo);
			}
			drag = false;
		}
		if ( now - lastPerformTime > PLAYER_PARTICLE_RATE )
		{
			if ( particleBuffer.fans > 0 )
			{
				var classes = [];
				if ( particleBuffer.encores > 0 )
				{
					classes.push("particleEncore");
				}
				if ( particleBuffer.astonishment > 0 )
				{
					classes.push("particleAstonishment");
				}
				//new FansBubble( ,performance.fans,null,null,classes,encores,performancesToDo,performance.astonishment);
				particleBuffer.Generate(inputX,inputY,averageVelocityX+(Math.random()-.5)*4,averageVelocityY+(Math.random()-.5)*4,null,null,classes);
			}
		}
		for ( var i = particles.length-1; i >= 0; i-- )
		{
			particles[i].Update(dt,now);
		}
		for ( var i = canvasParticles.length-1; i >= 0; i-- )
		{
			canvasParticles[i].Update(dt,now);
			if ( canvasParticles[i].dead )
			{
				canvasParticles[i].Dispose();
				canvasParticles.splice(i,1);
			}
		}
		if ( autoClickTarget != null && autoClickTarget.Pressed != null )
		{
			if ( now - autoClickLast > autoClickInterval )
			{
				autoClickTarget.Pressed();
				autoClickLast = now;
				autoClickInterval = Math.max(autoClickInterval*AUTO_CLICK_MULTIPLIER,AUTO_CLICK_MINIMUM);
			}
		}
		if ( now - lastDrawTime > FORCE_DRAW_INTERVAL )
		{
			cancelAnimationFrame(drawAnimationFrame);
			Draw();
		}
		if ( now - lastFanGainPerSecondTime > FAN_GAIN_PER_SECOND_INTERVAL )
		{
			fanGainPerSecondAverage.push(totalFanGainThisSecond);
			if ( fanGainPerSecondAverage.length > FAN_GAIN_PER_SECOND_AVERAGE_SAMPLES )
			{
				fanGainPerSecondAverage.shift();
			}
			totalFanGainThisSecond = 0;
			lastFanGainPerSecondTime = now;
		}
		AlertFeed.Update(dt,now);
		
		fansPerSecond = 0;
		for ( var i = 0; i < fanGainPerSecondAverage.length; i++ )
		{
			fansPerSecond += fanGainPerSecondAverage[i];
		}
		fansPerSecond /= fanGainPerSecondAverage.length;

		if ( sparkleCount < MAXIMUM_SPARKLES && sparkleCount < inspirationLevel)
		{
			new Sparkle(Math.random() * idolCanvas.width,Math.random() * idolCanvas.height,0,0,Math.random()*250 + 500);
		}
		lastUpdateTime = Date.now();
	}
	if ( options[Options.AutoSave] && now - lastSaveTime > AUTO_SAVE_THRESHOLD && timeToSimulate === 0 )
	{
		Save(saveFile);
	}
	if( now - lastPeriodicUpdate > PERIODIC_UPDATE_RATE )
	{
		PeriodicUpdate();
		lastPeriodicUpdate = now;
	}
	if ( Date.now() - lastTelemetryTime > TELEMETRY_INTERVAL && wsh.isOpen() )
	{
		var validIdols = ValidIdols();
		var idolInfo = "idols: \n\t\t";
		for ( var i = 0; i < validIdols.length; i++ )
		{
			var idol = validIdols[i];
			idolInfo += idol.template.name +"\n\t\t\t"+
			"level: "+idol.level+"\n\t\t\t"+
			"outfit/variant: "+idol.outfit +"/" +idol.variant+"\n\t\t\t"+
			"performances: "+Formatters.Format("integer",idol.performances)+"\n\t\t";
		}

		var message = "Telemetry Update:\n\t"+
		"total time: " + FormatDuration(Date.now()-careerStarted) + "\n\t"+
		"supervision time: " + FormatDuration(supervisionTime) + "\n\t" +
		"fans: " + Formatters.Format("integer",fans) + "\n\t"+
		"user performances: " + Formatters.Format("integer",userPerformances) + "\n\t"+
		"inspiration (level): " + Formatters.Format("integer",Math.floor(inspiration)) + " (" + inspirationLevel+ ")\n\t"+
		idolInfo;
		WSHSend("onTelemetry",{"key":"idolclicker","action":"telemetry","message":message});
		lastTelemetryTime = Date.now();
	}
	setTimeout(Update,nextUpdateDelay);
}

var PeriodicUpdate = function()
{
	idolList.boundingRect = null;
	RefreshIdolListEntries();
	UpgradePanel.Refresh();
	QuickSkillsPanel.Refresh();
	IdolInfoPanel.Refresh(IdolInfoPanel.lastIdol,IdolInfoPanel.lastTemplate);
	if ( !IdolDetailsPanel.Hidden() )
	{
		IdolDetailsPanel.Refresh();
	}
	Resize();
}

var InspirationRequirement = function(level)
{
	return INSPIRATION_LEVEL_BASE*Math.pow(level,INSPIRATION_LEVEL_REQUIREMENT_MULTIPLIER)
}

var GameLogicStep = function(stepTime,now)
{
	if ( autoPerform  )
	{
		autoPerformAccumulator += stepTime;
		var performancesToDo = Math.floor(autoPerformAccumulator/autoPerformInterval);
		if ( performancesToDo > 0 )
		{
			autoPerformAccumulator -= performancesToDo * autoPerformInterval;
			Perform(performancesToDo);
		}
	}
	if ( inspiration > 0 )
	{
		var previousInspirationRequirement = InspirationRequirement(inspirationLevel);
		var inspirationRequirement = InspirationRequirement(inspirationLevel+1);
		while ( inspiration >= inspirationRequirement && inspirationLevel < INSPIRATION_LEVEL_LIMIT )
		{
			inspirationLevel++;
			inspirationRequirement = INSPIRATION_LEVEL_BASE*Math.pow(inspirationLevel+1,INSPIRATION_LEVEL_REQUIREMENT_MULTIPLIER);
		}
		while ( inspiration < previousInspirationRequirement )
		{
			inspirationLevel--;
			previousInspirationRequirement = INSPIRATION_LEVEL_BASE*Math.pow(inspirationLevel,INSPIRATION_LEVEL_REQUIREMENT_MULTIPLIER);
		}
		if ( inspirationLossDelay <= 0 )
		{
			inspiration -= INSPIRATION_LOSS_RATE * (inspirationRequirement-previousInspirationRequirement) * stepTime * inspirationLossMultiplier;
		}
		else
		{
			inspirationLossDelay -= stepTime;
		}
	}
	else
	{
		inspiration = 0;
	}
	for ( var i = 0; i < idols.length; i++ )
	//for ( var i in idols )
	{
		if( idols[i] != null )
		{
			idols[i].Update(stepTime,now);
			//fansPerSecond += idols[i].FansPerSecond();
		}
	}
	for ( var i = 0; i < fanmail.length; i++ )
	{
		fanmail[i].Update(stepTime,now);
	}
	for ( var i = 0; i < buffs.length; i++ )
	{
		if ( buffs[i] != null )
		{
			buffs[i].Update(stepTime,now);
		}
	}
}

var CSSUpdate = function()
{
	setTimeout(CSSUpdate,CSS_UPDATE_RATE);
	var dt = Date.now() - lastCSSUpdateTime;
	if ( !paused )
	{
		lastCSSUpdateTime = Date.now();
		for ( var i = 0; i < idols.length; i++ )
		{
			if( idols[i] != null )
			{
				idols[i].CSSUpdate(dt);
			}
		}
	}
}

var Draw = function()
{
	drawAnimationFrame = requestAnimationFrame(Draw);
	if ( paused )
	{
		return;
	}
	now = Date.now();
	if ( lastDrawTime == null )
	{
		lastDrawTime = now;
	}
	idolContext.clearRect(0,0,idolCanvas.width, idolCanvas.height);
	var time = now;
	var dt = now - lastDrawTime;
	lastDrawTime = now;
	AlertFeed.Refresh();
	var particleFragment = document.createDocumentFragment();
	for ( var i = 0; i < particles.length; i++ )
	{
		var particle = particles[i];
		if( particle.dead )
		{
			if ( particle.flow )
			{
				//if ( particleContainer.contains(particleContainer.childNodes[i]) )
				//{
				//	particleContainer.removeChild(particleContainer.childNodes[i]);
				//}
				particleContainer.removeChild(particle.element);
				//particle.element.parentNode.removeChild(particle.element);
				particle.flow = false;
			}
			particles.splice(i,1);
		}
		else
		{
			particle.Refresh(now);
			if ( !particle.flow )
			{
				//particleFragment.appendChild(particle.element);
				particleContainer.appendChild(particle.element);
				particle.flow = true;
			}
		}
	}
	if ( particleFragment.childNodes.length > 0)
	{
		particleContainer.appendChild(particleFragment);
	}

	for ( var i = 0; i < idolDrawOrder.length; i++ )
	{
		if( idolDrawOrder[i] != null )
		{
			idolDrawOrder[i].Refresh(now);
		}
	}
	for ( var i = 0; i < canvasParticles.length; i++ )
	{
		canvasParticles[i].Refresh(now);	
	}
	for ( var i = 0; i < fanmail.length; i++ )
	{
		fanmail[i].Refresh(now);
	}
	IdolDetailsPanel.Refresh(null,true);

	shownFans += (fans-shownFans)/8;
	var fansCounterString = Formatters.Format("integer",shownFans)+FAN_SYMBOL+
		"\n"+Formatters.Format("integer",FanGain(1,false).fans)+FAN_SYMBOL+"/"+PERFORMANCE_SYMBOL+
		"\n"+Formatters.Format("integer",fansPerSecond)+FAN_SYMBOL+"/s";
		

	if ( options[Options.ShowAdditionalData] )
	{
		fansCounterString +="\n"+Formatters.Format("integer",Math.round(userPerformances))+PERFORMANCE_SYMBOL+
		"\n"+FormatDuration((now-careerStarted))+"Σ🕒" +
		"\n"+FormatDuration(supervisionTime)+"👀🕒";
	}

	debugString += inspiration+"\n";
	if ( inspiration > 0 )
	{
		if ( inspirationElement.classList.contains("hidden"))
		{
			inspirationElement.classList.remove("hidden");
		}
		var previousInspirationRequirement = INSPIRATION_LEVEL_BASE*Math.pow(inspirationLevel,INSPIRATION_LEVEL_REQUIREMENT_MULTIPLIER);
		var inspirationRequirement = INSPIRATION_LEVEL_BASE*Math.pow(inspirationLevel+1,INSPIRATION_LEVEL_REQUIREMENT_MULTIPLIER);
		var percent = (inspiration-previousInspirationRequirement) / (inspirationRequirement-previousInspirationRequirement);
		inspirationBarFill.style.width = (Math.min(1,percent)*100)+"%";
		var timePerInspirationLevel = 1/(INSPIRATION_LOSS_RATE * inspirationLossMultiplier);
		var timeThisInspirationLevel = percent * timePerInspirationLevel;

		inspirationText.childNodes[0].nodeValue = inspirationLevel+" " + INSPIRATION_SYMBOL;
		inspirationSubText.childNodes[0].nodeValue = FormatDuration(timePerInspirationLevel*inspirationLevel+timeThisInspirationLevel);
	}
	else
	{
		inspirationLevel = 0;
		if ( !inspirationElement.classList.contains("hidden"))
		{
			inspirationElement.classList.add("hidden");
		}
	}

	if ( Date.now() - lastBPMTap < BPM_HELPER_LIFETIME )
	{
		var radius = 16;
		var diameter = radius * 2;
		var barLength = beatLength;
		var beatPercent = (BeatTime()%barLength-beatLength*i)/beatLength;
		beatPercent = 1-EASING.linear(beatPercent,0,1,1);
		beatPercent = Math.max(beatPercent,0);
		idolContext.lineWidth = 4;
		idolContext.strokeStyle = "#FFF";
		idolContext.fillStyle = "#FFF";
		idolContext.beginPath();
		idolContext.arc(idolCanvas.width/2 - radius + diameter * i + 16,64,beatPercent*radius,0,Math.PI*2);
		idolContext.stroke();
	}

	if ( timeToSimulate > 0 )
	{
		idolContext.fillStyle = "#034";
		idolContext.globalAlpha = 0.8;
		idolContext.fillRect(0,0,idolCanvas.width, idolCanvas.height);
		//idolContext.fillRect(0,idolCanvas.height/2-4,idolCanvas.width*(timeSimulated/timeToSimulate), 8);
		idolContext.globalAlpha = 1.0;
		idolContext.fillStyle = "#FFF";
		idolContext.fillRect(0,idolCanvas.height/2-2,idolCanvas.width*(timeSimulated/timeToSimulate), 4);
		idolContext.font = "2em Roboto";
		var string = "Simulating "+(timeToSimulate/1000)+" seconds...";
		idolContext.fillText(string,idolCanvas.width/2 - idolContext.measureText(string).width/2,idolCanvas.height/2 - 16);
	}

	//fansCounter.childNodes[0].nodeValue = fansCounterString;
	PlayerInfoPanel.Refresh();
	
	//debugString += "\n"+Math.floor(averageVelocityX)+"/"+	Math.floor(averageVelocityY)+"\n";
	if ( options[Options.ShowDebugInfo] )
	{
		debugString += dt+"ms\n";
		debugString += screenWidth+"/"+screenHeight+"\n";
		debugString +=  inputX +"/"+inputY;
		debugString +=  debugInputStart ? "S" : "s";
		debugString +=  debugInputMove ? "M" : "m";
		debugString +=  debugInputEnd ? "E" : "e";
		debugString += "\nv"+GAME_VERSION;
		debugInputStart = false;
		debugInputMove = false;
		debugInputEnd = false;
		if ( debugElement.classList.contains("hidden"))
		{
			debugElement.classList.remove("hidden");
		}
		debugElement.childNodes[0].nodeValue = debugString;
	}
	else
	{
		if ( !debugElement.classList.contains("hidden"))
		{
			debugElement.classList.add("hidden");
		}
	}
	debugString = "";
}

var TryLoadLocalStorage = function(key,defaultValue)
{
	var item = localStorage.getItem(key);
	if ( item != null )
	{
		defaultValue = JSON.parse(item);
	}
	return defaultValue;
}

/* FAN MAIL */

var fanmailImage = document.createElement("img");
fanmailImage.src = "./img/fanmail.png";
var FANMAIL_APPEAR_TIME = 500;
var FANMAIL_RADIUS = 64;
var Fanmail = function(idol,buff)
{
	var xPercent = Math.random();
	var yPercent = Math.random();
	var buff = buff;
	var idol = idol;
	var lifeTime = -1;
	var spawnTime = GameTime();
	var scale = 0;
	this.hover = false;
	this.Update = function(dt)
	{
	}
	this.Apply = function()
	{
		ShowAlert("Fan Mail for " + idol);
	}
	this.Refresh = function()
	{
		var x = xPercent * screenWidth;
		var y = yPercent * IdolListRect().top;
		if ( this.hover )
		{
			idolContext.globalAlpha = 0.5;
		}
		else
		{
			idolContext.globalAlpha = 1.0;
		}
		/*
		idolContext.translate(this.width * (this.registrationX)+this.x-this.width/2,this.height* (this.registrationY)+this.y-this.height/2);
		idolContext.scale(this.scaleX,this.scaleY);
		idolContext.rotate(this.rotation);
		idolContext.translate(-this.width * this.registrationX,-this.height * this.registrationY);
		*/
		var time = GameTime() - spawnTime;
		scale = EASING.outElastic(Math.min(time,FANMAIL_APPEAR_TIME),0.001,1,FANMAIL_APPEAR_TIME);
		idolContext.save();
		idolContext.translate(x,y);
		idolContext.scale(scale,scale);
		idolContext.rotate(Math.cos(time/333)*15/180*Math.PI);
		//idolContext.translate(-scale*FANMAIL_RADIUS,-scale*FANMAIL_RADIUS);
		idolContext.drawImage(fanmailImage,-FANMAIL_RADIUS,-FANMAIL_RADIUS,FANMAIL_RADIUS*2,FANMAIL_RADIUS*2);
		idolContext.restore();
	}
}

var SpawnFanmail = function(idol,buff)
{
	if ( idol == null )
	{

	}
	if ( buff == null )
	{

	}
	fanmail.push(new Fanmail(idol,buff));
}

/* SAVE */

var Save = function(saveFile)
{
	if ( storageEnabled )
	{
		lastSaveTime = Date.now();
		var data = [];
		data[0] = fans;
		var idolDictionary = {};
		for (var i = 0; i < idols.length; i++ )
		{
			if ( idols[i] != null )
			{
				idolDictionary[idols[i].id] = idols[i].Serialize();
			}
		}
		data[1] = idolDictionary;
		data[2] = userPerformances;
		data[3] = upgrades;
		data[4] = fansPerClickMultiplier;
		data[5] = performOnUnclick;
		data[6] = performOnRightClick;
		data[7] = options;
		data[8] = GAME_VERSION;
		data[9] = careerStarted;
		data[10] = supervisionTime;
		data[11] = performOnDrag;
		var skillsData = [];
		for( var i = 0; i < SkillRegistry.skills.length; i++ )
		{
			var skill = SkillRegistry.skills[i];
			if ( skill != null )
			{
				skillsData[i] = skill.Serialize();
			}
		}
		data[12] = skillsData;
		data[13] = lifetimeFans;
		data[14] = lastTelemetryTime;
		data[15] = inspiration;
		data[16] = lastUpdateTime;
		data[17] = telemetry;
		localStorage.setItem("idolclicker_savefile",JSON.stringify(saveFile));
		localStorage.setItem("idolclicker"+saveFile,JSON.stringify(data));
	}
}

var Load = function(saveFile)
{
	try
	{
		if( storageEnabled )
		{
			var loadedSaveFile = TryLoadLocalStorage("idolclicker_savefile");
			var data = null;
			if ( loadedSaveFile != null )
			{
				saveFile = loadedSaveFile;
				data = JSON.parse(localStorage.getItem("idolclicker"+saveFile));
				console.log("Loading save file"+saveFile);
			}
			else
			{
				data = TryLoadLocalStorage("idolclicker");
				console.log("No save file index found. Falling back to global save file");
			}
			if( data )
			{
				fans = data[0];
				for( var k in data[1] )
				{
					var template = IdolRegistry.Get(Number(k));
					if ( template != null )
					{
						var idol = IdolRegistry.Get(Number(k)).Generate();
						idol.Deserialize(data[1][k]);
						AddIdol(idol);
					}
				}
				userPerformances = data[2] || 0;
				upgrades = data[3] || [];
				fansPerClickMultiplier = data[4] || 1;
				performOnUnclick = data[5] || false;
				performOnRightClick = data[6] || false;
				options = LoadArray(options,data[7]);
				careerStarted = data[9] || Date.now();
				supervisionTime = data[10] || 0;
				performOnDrag = data[11] || false;
				var skillsData = data[12];
				for( var i = 0; i < skillsData.length; i++ )
				{
					if( skillsData[i] != null )
					{
						var skill = SkillRegistry.Get(i);
						if ( skill != null )
						{
							skill.Deserialize(skillsData[i]);
						}
					}
				}
				lifetimeFans = data[13] || 0;
				lastTelemetryTime = data[14] || 0;
				inspiration = data[15] || 0;
				lastUpdateTime = data[16] || Date.now();
				timeSinceLastSession = Date.now() - lastUpdateTime;
				telemetry = LoadArray(telemetry,data[17]);
				if ( telemetry.firstPlay == null )
				{
					telemetry.firstPlay = false;
				}
				//timeToSimulate = Date.now() - lastUpdateTime;
				lastAutoRefresh = 0;
				OptionsPanel.Refresh();
				RefreshIdolListEntries();
			}
			else
			{
				console.log("No data in save slot found, loading impossible");
			}
		}
	}
	catch(ex)
	{
		var error = "Error loading save file. Gameplay will continue, but auto save has been disabled. Please contact a developer with the following information:\n\n";
		error += ex + ex.stack;
		ShowError(error);
		options[Options.AutoSave] = false;
	}
}

var Initialize = function()
{
	if ( !useCanvas )
	{
		while(idolContainer.childNodes.length > 0 )
		{
			idolContainer.removeChild(idolContainer.firstChild);
		}
	}
	while(idolList.childNodes.length > 0 )
	{
		idolList.removeChild(idolList.firstChild);
	}
	for( var i = 0; i < IdolRegistry.idols.length; i++ )
	{
		//var template = IdolRegistry.Get(i);
		var template = IdolRegistry.Get(IdolsIndexed[i]);
		if ( template != null )
		{
			var idolListEntry = new IdolListEntry(null,template,template.icon);
			idolListEntries[template.id] = idolListEntry;
			idolList.appendChild(idolListEntry.element);
		}
	}
}

var WSHSend = function (request, obj)
{
	if (wsh.isOpen())
	{
		wsh.send(JSON.stringify([request, obj]));
	}
}

var WSHOpen = function()
{
	WSHSend("onTelemetry",{"key":"idolclicker","action":"access","message":"last session "+FormatDuration(timeSinceLastSession)+" ago v "+GAME_VERSION+" refer "+document.referrer});
	if ( telemetry.firstPlay == null )
	{
		WSHSend("onTelemetry",{"key":"idolclicker","action":"firstplay"});
	}
}

var WSHError = function()
{
}

var WSHMessage = function(message)
{
}

var WSHClose = function()
{
}

window.onkeydown = function(event)
{
	if ( DEVELOPER )
	{
		if ( event.which == 65  )
		{
			fans += 1E12;
		}
		else if ( event.which == 67  )
		{
			timeToSimulate = 1000*60*60*24;
		}
		else if ( event.which == 68  )
		{
			inspiration += 2500;
		}
		else if ( event.which == 69  )
		{
			inspiration = 0;
			fans = 0;
		}
		else if ( event.which == 70  )
		{
			SkillRegistry.AdjustCooldowns(-1000*60*60);
		}
		else if ( event.which == 71  )
		{
			userPerformances += 100000;
		}
	}
	if ( FeedbackPanel.Hidden() && event.which == 66 && !event.repeat  )
	{
		TapBPM();
	}
}

var Resize = function()
{
	canvasRect = idolCanvas.getBoundingClientRect();
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;
	//idolCanvas.width = screenWidth;
	//idolCanvas.height = screenHeight;
	idolCanvas.width = idolContainer.clientWidth;
	idolCanvas.height = idolContainer.clientHeight;
	idolContainer.boundingRect = null;
	idolList.boundingRect = null;
	for ( var i = 0; i < idols.length; i++ )
	{
		if( idols[i] != null )
		{
			idols[i].dirty = true;
			idols[i].Refresh();
			idols[i].Constrain();
		}
	}
}

window.onresize = function()
{
	Resize();
}

window.onblur = function()
{
	if ( !options[Options.RunInBackground] )
	{
		paused = true;
	}
}

window.onfocus = function()
{
	if ( !options[Options.RunInBackground] )
	{
		paused = false;
	}
}

var Destroy = function()
{
	wsh.detach(WSHOpen, WSHError, WSHMessage, WSHClose);
	wsh.close();
}

var NavigateAway = function()
{
	if( telemetry.sessions == null )
	{
		telemetry.sessions = 0;
	}
	telemetry.sessions++;
	var message = "session " + telemetry.sessions+ " was " + FormatDuration(Date.now() - startTime) + " long" +
	", total time " + FormatDuration(Date.now()-careerStarted) + " long" +
	", supervision time " + FormatDuration(supervisionTime) +
	", inspiration/level " + Math.floor(inspiration) + "/" + inspirationLevel;
	WSHSend("onTelemetry",{"key":"idolclicker","action":"sessionend","message":message});
	if ( options[Options.AutoSave] && timeToSimulate === 0 )
	{
		Save(saveFile);
	}
}

window.onbeforeunload = function()
{
	NavigateAway();
}

var lastKnownUpdate = null;
var lastUpdateAlert = 0;
var CheckForUpdates = function()
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.response.length > 0 && xhttp.status === 200 ) {
			var checkVersion = xhttp.responseText.trim();
			if ( GAME_VERSION != checkVersion && (lastKnownUpdate != checkVersion || Date.now() - lastUpdateAlert > NEW_UPDATE_ALERT_INTERVAL) )
			{
				AlertFeed.AddAlert("New version " + checkVersion + " available! Refresh to get the update.");
				lastKnownUpdate = checkVersion;
				lastUpdateAlert = Date.now();
			}
		}
	};
	xhttp.open("GET", "version.js", true);
	xhttp.setRequestHeader("Cache-Control","no-cache");
	xhttp.send();
	setTimeout(CheckForUpdates,60000)
}

var alertTimeout = null;

var ShowAlertFeed = function(message,length)
{
	AlertFeed.Show();
}

var HideAlert = function()
{
	//document.querySelector(".alertWrapper .alert").classList.remove("force");
	//document.querySelector(".alertWrapper .alert").onmouseleave = null;
}

/*http://www.javascriptkit.com/javatutors/loadjavascriptcss2.shtml*/
function removejscssfile(filename, filetype){
	var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
	var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
	var allsuspects=document.getElementsByTagName(targetelement)
	for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
	if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
		allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
	}
}
/*http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml*/
function loadjscssfile(filename, filetype){
	if (filetype=="js"){ //if filename is a external JavaScript file
		var fileref=document.createElement('script')
		fileref.setAttribute("type","text/javascript")
		fileref.setAttribute("src", filename)
	}
	else if (filetype=="css"){ //if filename is an external CSS file
		var fileref=document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename)
	}
	if (typeof fileref!="undefined")
		document.getElementsByTagName("head")[0].appendChild(fileref)
}

var SymbolChange = function(enabled)
{
	return;
	if ( !enabled )
	{
		FAN_SYMBOL = "fans"; // 👤❤
		PERFORMANCE_SYMBOL = "performances";
		ENCORE_SYMBOL = "encores";
		LEVEL_SYMBOL = "levels";
		ASTONISHMENT_SYMBOL = "astonishment";
		INSPIRATION_SYMBOL = "inspiration";
		WORTH_SHARE_SYMBOL = "worth share";
		SOUL_LINK_SYMBOL = "soul link";
	}
	else
	{
		/*FAN_SYMBOL = "👤"; // 👤❤
		PERFORMANCE_SYMBOL = "🎤";
		ENCORE_SYMBOL = "👏";
		LEVEL_SYMBOL = "👑";
		ASTONISHMENT_SYMBOL = "❗";//
		INSPIRATION_SYMBOL = "☀";
		WORTH_SHARE_SYMBOL = "💕";
		SOUL_LINK_SYMBOL = "🔗";*/
		FAN_SYMBOL = ""; // 👤❤
		PERFORMANCE_SYMBOL = "";
		ENCORE_SYMBOL = "";
		LEVEL_SYMBOL = "👑";
		ASTONISHMENT_SYMBOL = "";//
		INSPIRATION_SYMBOL = "";
		WORTH_SHARE_SYMBOL = "";
		SOUL_LINK_SYMBOL = "";
		MASTERY1_SYMBOL = "";
		MASTERY2_SYMBOL = "";
		MASTERY3_SYMBOL = "";
	}
}

var NumberFormattingChange = function(enabled)
{
	if (enabled )
	{
		Formatters.Register("integer",new SIFormatter("0,00", options[Options.FormattingPrecision]));
	}
	else
	{
		Formatters.Register("integer",new SingleFormatter("0,00"));
	}
}

var QualityChange = function(lowQuality)
{
	if (lowQuality)
	{
		loadjscssfile("./lowQuality.css","css");
	}
	else
	{
		removejscssfile("./lowQuality.css","css");
	}
}

/* FORMATTERS AND FORMATS */
var Formatters = new (function()
{
	this.formatters = {};
	this.Register = function(key,formatter)
	{
		this.formatters[key] = formatter;
	}
	this.Get = function(key)
	{
		return this.formatters[key];
	}
	this.Format = function(key,value)
	{
		return this.formatters[key].Format(value);
	}
});

var siFormatting = [
	{value:1E3,symbol:" thousand"},
	{value:1E6,symbol:" million"},
	{value:1E9,symbol:" billion"},
	{value:1E12,symbol:" trillion"},
	{value:1E15,symbol:" quadrillion"},
	{value:1E18,symbol:" quintillion"},
	{value:1E21,symbol:" sextillion"},
	{value:1E24,symbol:" septillion"},
	{value:1E27,symbol:" octillion"},
	{value:1E30,symbol:" nonillion"}
];
function SIFormatter(format,decimals,percent) {
	var si = [];
	if ( options[Options.FormattingType] === FormattingTypes.Letters )
	{
		var symbols = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		for( var i = 0; i < symbols.length; i++)
		{
			si.push({value:Math.pow(10,3*(i+1)), symbol: symbols[i]});
		}
	}
	else
	{
		si = siFormatting;
	}

	var decimals = decimals || 0;
	this.formatter = numeral();
	this.format = format;
	this.decimalFormat = "";
	if ( decimals > 0 )
	{
		this.decimalFormat += ".";
		for ( var i = 0; i < decimals; i++ )
		{
			this.decimalFormat += "0";
		}
		this.decimalFormat += "";
	}
	this.Format = function(value)
	{
		if ( isNaN(value) )
		{
			return "NaN";
		}
		var append = "";
		var usedFormat = format;
		if( percent ) 
		{
			value = value * 100;
		}
		for ( var i = si.length-1; i >= 0; i-- )
		{
			if ( Math.abs(value) >= si[i].value )
			{
				value = value/si[i].value;
				append = si[i].symbol;
				usedFormat += this.decimalFormat;
				break;
			}
		}
		this.formatter.set(value);
		var formatted = this.formatter.format(usedFormat);
		formatted += append;
		if ( percent )
		{
			formatted += "%";
		}
		return formatted;
	}
}

var SingleFormatter = function(format)
{
	this.formatter = numeral();
	this.format = format;
	this.Format = function(value)
	{
		if ( isNaN(value) )
		{
			return "NaN";
		}
		this.formatter.set(value);
		return this.formatter.format(this.format);
	}
}
//Formatters.Register("integer",new SingleFormatter("0,00"));
//Formatters.Register("integer",new SIFormatter("0,00", 3));
Formatters.Register("integer",new SingleFormatter("0,00"));
Formatters.Register("cost",new SIFormatter("+0,00", 3));
Formatters.Register("decimal",new SingleFormatter("0,00.000"));
Formatters.Register("damage",new SingleFormatter("0,00a"));
Formatters.Register("percent",new SIFormatter("0,00.[000]",3,true));
Formatters.Register("percentInteger",new SingleFormatter("0,0%"));
Formatters.Register("time",new SingleFormatter("00:00:00"));

Reset()
Initialize();
Load(saveFile);

//if ( options[Options.Telemetry] === true )
//{
//	wsh.attach(WSHOpen, WSHError, WSHMessage, WSHClose);
//	wsh.connect("wss://"+window.location.hostname+"/");
//}
//else
//{
//	console.log("Telemetry disabled. No connection opened.");
//}

SymbolChange(options[Options.UseSymbols]);
NumberFormattingChange(options[Options.BigNumberFormatting]);
GenerateCSS();
Update();
CSSUpdate();
SortIdols();
Draw();
QualityChange(options[Options.SimpleDance]);
CheckForUpdates();
Resize();

if ( DEVELOPER )
{
	AlertFeed.AddAlert("DEVELOPER BUILD");
}
AlertFeed.AddAlert("This game is no longer receiving updates.");

//options[Options.AutoSave] = false;
//timeToSimulate = 1000*60*60*28;
//throw ( "Forced error" );
