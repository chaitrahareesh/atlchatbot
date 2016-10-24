var restify = require('restify');
var builder = require('botbuilder');

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
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        session.send("Hi I am ----. Here to help you get started");
        builder.Prompts.text(session, "Enter some text and I'll help you out.");
    },
    function (session, results) {
        //session.send("You entered '%s'", results.response);
        builder.Prompts.text(session, "I can help you bootstrap your work. can suggest some trainings you can undertake. And yes I can get you in touch with some testing resources. ");
    },
    function (session, results) {
        //session.send("You entered '%s'", results.response);
        builder.Prompts.text(session, "Yes. I starts with test case creation. Here are some great templates to get you started. You can also use these links.");
    },
    function (session, results) {
        //session.send("You entered '%s'", results.response);
        builder.Prompts.text(session, "you can use these popular resources for execution" + "https://www.tutorialspoint.com/software_testing_dictionary/test_execution.htm");
    },
    function (session, results) {
        //session.send("You entered '%s'", results.response);
        builder.Prompts.text(session, "here are some great training resources, ordered by priority.");
    },
    function (session, results) {
        //session.send("You entered '%s'", results.response);
        builder.Prompts.text(session, "Here are some great resources for contacting experts.");
    },
       
    function (session, results) {
        var style = builder.ListStyle[results.response.entity];
        builder.Prompts.choice(session, "Prompts.choice()\n\nNow pick an option.", "option A|option B|option C", { listStyle: style });
    }
   ]);

// bot.dialog('/', function (session) {
//  session.send("Hi I am ----. Here to help you get started", session.userData.name, session.message.text);
//  builder.Prompts.text(session, "Prompts.text()\n\nEnter some text and I'll say it back.");
//     // session.send("I can help you bootstrap your work. can suggest some trainings you can undertake. And yes I can get you in touch with some testing resources.");
//     // session.send("Yes. I starts with test case creation. Here are some great templates to get you started. You can also use these links.");
//     // session.send("you can use these popular resources for execution");
//     // session.send(": here are some great training resources, ordered by priority.");
//     // session.send("Hi I am ----. Here to help you get started", session.userData.name, session.message.text);
//     // session.send("Hi I am ----. Here to help you get started", session.userData.name, session.message.text);
// });
