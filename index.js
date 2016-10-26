var restify = require('restify');
var builder = require('botbuilder');
var RiveScript = require("rivescript");
var fs = require("fs");

var opts = {
	debug: false,
	utf8: false,
	watch: true,
	brain: undefined
};

// BOTs for rivescript

var rivebot = null;
function loadriveBot() {
	rivebot = new RiveScript({
	});
	rivebot.ready = false;
	rivebot.loadDirectory("eg/quickchat", loadingDone, loadingError);
}
loadriveBot();

var rivebotreply = null;

function loadingDone(batchNumber) {
	rivebot.sortReplies();
	rivebot.ready = true;
}

function loadingError(error, batchNumber) {
	console.error("Loading error: " + error);
}



//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: '9c08ebaa-9c97-40f2-a1b4-2f8a15076316',
    appPassword: 'XCqMBbceiyDN0ToiamhUnVA'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Middleware
//=========================================================

// Anytime the major version is incremented any existing conversations will be restarted.
bot.use(builder.Middleware.dialogVersion({ version: 1.1, resetCommand: /^reset/i }));

//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i });

//=========================================================
// Activity Events
//=========================================================

bot.on('conversationUpdate', function (message) {
   // Check for group conversations
    if (message.address.conversation.isGroup) {
        // Send a hello message when bot is added
        if (message.membersAdded) {
            message.membersAdded.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                            .address(message.address)
                            .text("Hello everyone!");
                    bot.send(reply);
                }
            });
        }

        // Send a goodbye message when bot is removed
        if (message.membersRemoved) {
            message.membersRemoved.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                        .address(message.address)
                        .text("Goodbye");
                    bot.send(reply);
                }
            });
        }
    }
});

bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
                .address(message.address)
                .text("Hello %s... Thanks for adding me. I hope we will be good friends", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
    }
});

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        // Send a greeting and show help.
        var card = new builder.HeroCard(session)
            .title("Quick Chat")
            .text("The quick chat prototype for the smart tester")
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.beginDialog('/menu');
    },
	
    
]);

bot.dialog('/meaningOfLife', builder.DialogAction.validatedPrompt(builder.PromptType.text, function (response) {

	var reply = rivebot.reply("localuser", "My name is roshni");

	//rivebotreply = reply;
	console.log('recieved reply %s',reply);
	return true;
}));



bot.dialog('/menu', [
    function (session,args, next) {
		builder.Prompts.text(session, "");
    },
    function (session, results) {
        if (results.response) {
            // Launch demo dialog
            //session.beginDialog('/' + results.response.entity);
				var reply = rivebot.reply("localuser", results.response);
				if (reply.indexOf("ERR") == -1)
				{
					session.send(reply);
					//builder.Prompts.choice(session, "was this answer helpful?", "yes|no");
					session.replaceDialog('/menu');
				}else
				{
					session.send("I am afraid that I have not been programmed for that answer");
					session.replaceDialog('/menu');
				}
				console.log('recieved reply %s',reply);
				//results.response = true;

				
        } else {
            // Exit the menu
            session.endDialog();
        }
    }
	
	/*function (session, results) {
        if (results.response && results.response.entity == 'yes') {
            console.log("must log response");
			session.send("Thank you");
			session.replaceDialog('/menu');
        } else {
            // Exit the menu
            session.replaceDialog('/menu');
        }
    }*/
	
])
