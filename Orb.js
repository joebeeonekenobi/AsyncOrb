window.onload = function(){


	x = new Orb("hello");
	y = new Orb("goodbye");
}

Orb = (function(){

	var OrbMaster = {};

	var Orb = function(agentName){

		var inc = 0;
		var inbox = [];

		if(!(this instanceof Orb)){

			throw new Error("Orb should be called with the new keyword.");
		}

		if(!agentName){

			throw new Error("An agent must be named.");
		}

		if(OrbMaster[agentName]){
			throw new Error("An agent with the name " + agentName + " has already been defined.");
		}

		this.listeners = {};
		this.agentName = agentName;

		/*
			This functions create private closures for vars
		*/

		this.test = function(){

			inbox.push(inc++);

			return inbox;
		}

		return this;
	}

	/*
		Prototype methods are public
	*/

	Orb.prototype.on = function(messageName, func){

		console.log(this);

		this.listeners[messageName] = func.bind(this);
	}

	Orb.prototype.destroy = function(){

		console.log(this);
		delete OrbMaster[this.name];
	}

	//Async
	Orb.prototype.send = function(agentName, messageName, message){

		console.log(this);
		//If the agent exists
		if(OrbMaster[agentName]){

			//Post the message to it
			OrbMaster[agentName].inbox.push({
				messageName : messageName,
				message : message,
			});
		}
		else{

			console.warn("Message could not be sent from " + this.agentName + " to " + agentName + " as " + agentName + " does not exist.");
		}
	}

	//Async
	Orb.prototype.process = function(){

		console.log(this);
		if(this.inbox.length > 0){

			//Shift the first message from the store
			var messageContainer = this.inbox.shift();

			//If the listener exists
			if(this.listeners[messageContainer.messageName]){

				//Call the associated function with the message body
				this.listeners[messageContainer.messageName](messageContainer.message);
			}
			else{

				//Else warn
				console.warn("Message could not be processed on " + this.name + " because listener " + messageContainer.messageName + " does not exist");
			}
		}
	}

	return Orb;

})();
