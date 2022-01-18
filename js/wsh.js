(function (window, document)
{
	window.WSH = function ()
	{
		var obj = {}
		obj.host = null
		obj.websocket = null
		obj.onOpen = []
		obj.onMessage = []
		obj.onClose = []
		obj.onError = []
		obj.received = 0
		obj.sent = 0

		obj.connect = function (host)
		{
			if (window.MozWebSocket)
			{
				window.WebSocket = window.MozWebSocket;
			}
			if (!window.WebSocket)
			{
				alert("Your browser doesn't support WebSocket!");
			}
			obj.host = host
			obj.websocket = new WebSocket(obj.host)
			obj.websocket.onopen = function ()
			{
				for (var i = 0; i < obj.onOpen.length; i++)
				{
					obj.onOpen[i]()
				}
			}
			obj.websocket.onmessage = function (message)
			{
				for (var i = 0; i < obj.onMessage.length; i++)
				{
					obj.onMessage[i](message)
				}
				obj.received += message.data.length+2
			};
			obj.websocket.onclose = function ()
			{
				for (var i = 0; i < obj.onClose.length; i++)
				{
					obj.onClose[i]()
				}
			}
			obj.websocket.onerror = function ()
			{
				for (var i = 0; i < obj.onError.length; i++)
				{
					obj.onError[i]()
				}
			}
		}

		obj.close = function()
		{
			if ( obj.isOpen() )
			{
				obj.websocket.close();
			}
		}

		obj.attach = function(openCallback, errorCallback, messageCallback, closeCallback )
		{
			obj.attachOnOpen(openCallback);
			obj.attachOnError(errorCallback);
			obj.attachOnMessage(messageCallback);
			obj.attachOnClose(closeCallback);
		}

		obj.detach = function(openCallback, errorCallback, messageCallback, closeCallback )
		{
			obj.detachOnOpen(openCallback);
			obj.detachOnError(errorCallback);
			obj.detachOnMessage(messageCallback);
			obj.detachOnClose(closeCallback);
		}

		obj.attachOnOpen = function(callback)
		{
			if ( obj.onOpen.indexOf(callback) == -1)
			{
				obj.onOpen.push(callback)
			}
		}

		obj.detachOnOpen = function(callback)
		{
			if (obj.onOpen.indexOf(callback) > -1)
			{
				obj.onOpen.splice(obj.onOpen.indexOf(callback),1)
			}
		}

		obj.attachOnMessage = function(callback)
		{
			if ( obj.onMessage.indexOf(callback) == -1)
			{
				obj.onMessage.push(callback)
			}
		}

		obj.detachOnMessage = function(callback)
		{
			if (obj.onMessage.indexOf(callback) > -1)
			{
				obj.onMessage.splice(obj.onMessage.indexOf(callback),1)
			}
		}

		obj.attachOnClose = function(callback)
		{
			if ( obj.onClose.indexOf(callback) == -1)
			{
				obj.onClose.push(callback)
			}
		}

		obj.attachOnError = function(callback)
		{
			if ( obj.onError.indexOf(callback) == -1)
			{
				obj.onError.push(callback)
			}
		}

		obj.dispose = function()
		{
			if ( obj.isOpen() )
			{
				obj.websocket.close()
			}
		}

		obj.isOpen = function ()
		{
			if ( obj.websocket)
			{
				return obj.websocket.readyState == obj.websocket.OPEN
			}
			return false
		}

		obj.send = function (data)
		{
			if (obj.websocket && obj.websocket.readyState == obj.websocket.OPEN)
			{
				obj.websocket.send(data);
				obj.sent += data.length+2
			}
		}
		return obj
	}
})(window, document);
