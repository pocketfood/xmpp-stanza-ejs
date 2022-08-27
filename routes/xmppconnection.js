
const express = require("express");
const router = express.Router();

const XMPP = require('stanza');

const client = XMPP.createClient({
    jid: 'username',
    password: 'password',
    resource: "express-ui",
    transports: {
        websocket: 'wss://localhost:5443'
    }
});

// session
client.on('session:started', async (from, jid) => {
    console.log('\x1b[33m%s\x1b[0m', '--- XMPP Connection ---');
    console.log('\x1b[1m\x1b[36m','signed in as:',from,'\x1b[0m','\n');
    await client.getRoster();

// getLastActivity
console.log('\x1b[1m\x1b[36m','Last online:',await client.getLastActivity(jid),'\x1b[0m','\n');
const LastActivity = await client.getLastActivity(jid);


// Roster aka friendslist
    console.log('\x1b[1m\x1b[36m','Friends List:',(await client.getRoster(jid)).items,'\x1b[0m');

// Get Role From vcard
    console.log('\n','\x1b[1m\x1b[32m','--- Role ---','\x1b[0m');
    const vcard = await client.getVCard(jid);
    const vcardrole = vcard.records[4].value;
    console.log(vcardrole);

// Get Avatar in Base64 string
// IMPORTANT! Too much data uncomment when working with UI
    console.log('\n','\x1b[1m\x1b[32m','--- Avatar ---','\x1b[0m');
    const vcardavatar = vcard.records[0].data;
//    console.log(vcardavatar);


// sends presence
client.sendPresence();


// Outputs all messages
client.on('chat', (msg) => {
    client.sendMessage({
        to: msg.from,
        body: msg.body
    });

    console.log('\x1b[1m\x1b[32m','---',msg.from,'---','[' ,client.sendMessage({body: msg.body}),']');
    console.log('\n','\x1b[1m\x1b[36m','Message:',msg.body,'\x1b[0m','\n')

});


// Sending messages echoing
client.on('chat', msg  => {
    client.sendMessage({
        to: msg.to,
        body: msg.body
    });

    console.log('\x1b[1m\x1b[32m','---',msg.to,'---','[' ,client.sendMessage({body: msg.body}),']');
    console.log('\n','\x1b[1m\x1b[36m','Message:',msg.body,'\x1b[0m','\n');

});

// This wasnt finished but I was trying to send messages to UI using express but it only outputs one message

client.on ('chat', msg  => {
    client.sendMessage ({
        to: msg.to,
        body: msg.body

    });

     if (msg.body) {

    router.get('/api', (req, res) =>{
        let pagemessage = (msg.body);
        //let messageid = (client.sendMessage({body: msg.body}));

        //res.send({ Date: new Date, messageid: messageid});
        res.send({ Date: new Date, message: pagemessage});
        //res.send(JSON.stringify(new Date()));

        //res.status(201)
        console.log(messageid)
        console.log(req.headers);
    });

};
});



// Data below sends to UI

    router.get('/', (req, res) => {

        res.render("index", { Username: from,
                            Role: vcard.records[4].value,
                            Avatar: vcard.records[0].data,
                            LastActivity: LastActivity.value,
                            });

        // Shows user on page
        console.log(from,"is on Card page");


    });
});

client.connect();

module.exports = router;
