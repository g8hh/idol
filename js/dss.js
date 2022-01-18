function DSS()
{
	var ruleIndex = 0;
	var style;
	this.Clear = function()
	{
		if (style != null)
		{
			document.head.removeChild(style);
			ruleIndex = 0;
		}
		style = document.createElement("style");
		style.id = "dssStyle";
		style.appendChild(document.createTextNode(""));
		document.head.appendChild(style);
	}
	this.Dispose = function()
	{
		if (style != null)
		{
			document.head.removeChild(style);
		}
	}
	this.AddRule = function( selector, rules ) {
		var sheet = style.sheet;
		if (sheet)
		{
			if( "insertRule" in sheet)
			{
				sheet.insertRule(selector + "{" + rules + "}", ruleIndex);
			}
			else if("addRule" in sheet)
			{
				sheet.addRule(selector, rules, ruleIndex);
			}
			ruleIndex++;
		}
	}
	this.AddRuleVerbose = function( text ) {
		var sheet = style.sheet;
		if (sheet)
		{
			sheet.insertRule(text, sheet.cssRules.length);
			ruleIndex++;
		}
	}
	this.Clear();
}
