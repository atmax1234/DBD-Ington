const express = require("express");
const url = require("url");
const path = require("path");
const Discord = require("discord.js");
const ejs = require("ejs");
const passport = require("passport");
const bodyParser = require("body-parser");
const Strategy = require("passport-discord").Strategy;
require('dotenv').config();
const Settings = require("./settings.json");
const flash = require('express-flash')

//Settings database
const db = require("../models/Prefix")
const welcomedb = require('../models/Welcome')

module.exports = client => {
    //WEBSITE CONFIG BACKEND
    const app = express();
    const session = require("express-session");
    const MemoryStore = require("memorystore")(session);
    
    //initialize the discord login
    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((obj, done) => done(null, obj))
    passport.use(new Strategy({
        clientID: Settings.config.clientID,
        clientSecret: process.env.secret || Settings.config.secret,
        callbackURL: Settings.config.callback,
        scope: ["bot", "applications.commands", "identify", "guilds", "guilds.join"]
    },
    (accessToken, refreshToken, profile, done) => {
        process.nextTick(()=>done(null, profile))
    }
    ))

    app.use(session({
        store: new MemoryStore({checkPeriod: 86400000}),
        secret: `b($oyDJ>fs|0)xb':]>*9ycbqr[LR]_@&+Ug_5X~L_bH)?X$oM7do{soI%?-DSn`,
        resave: false,
        saveUninitialized: false
    }))
    app.use(flash());
    //Middlewares
    app.use(passport.initialize());
    app.use(passport.session());

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "./views"));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }))
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }))
    //Load CSS Files
    app.use(express.static(path.join(__dirname, "./public")));

    const checkAuth = (req, res, next) => {
        if(req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    }
    app.get("/login", (req, res, next) => {
        if(req.session.backURL){
            req.session.backURL = req.session.backURL
        } else if(req.headers.referer){
            const parsed = url.parse(req.headers.referer);
            if(parsed.hostname == app.locals.domain){
                req.session.backURL = parsed.path
            }
        } else {
            req.session.backURL = "/"
        }
        next();
        }, passport.authenticate("discord", { prompt: "none"})
    );

    app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), async (req, res) => {
        let banned = false //Ako imame banlist v mongodb
        if(banned) {
            req.session.destroy()
            res.json({login: false, message: "You are banned from the dashboard", logout: true})
            req.logout();
        } else {
            res.redirect("/dashboard")
        }
    });

    app.get("/logout", function(req, res) {
        req.logout(() => {
            req.user
        });
        res.redirect('/')
    });

    app.get("/", (req, res) => {
        res.render("app", {
            req: req,
            user: req.isAuthenticated ? req.user : null,
            bot: client,
            Permissions: Discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
        })
    })

    app.get("/dashboard", (req, res) => {
        if(!req.isAuthenticated() || !req.user)
        return res.redirect("/?error=" + encodeURIComponent("Login First Please!"))
        if(!req.user.guilds)
        return res.redirect("/?error=" + encodeURIComponent("Fetching Guilds Failed!"))
        res.render("dashboard", {
            req: req,
            user: req.isAuthenticated ? req.user : null,
            bot: client,
            Permissions: Discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
        })
    })

    app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID)
        if(!guild)
        return res.redirect("/?error=" + encodeURIComponent("It seems you didn't invite me in this guild yet!"))
        let member = guild.members.cache.get(req.user.id);
        if(!member) {
            try{
                member = await guild.members.fetch(req.user.id);
            } catch{

            }
        }
        if(!member)
        return res.redirect("/?error=" + encodeURIComponent("Login first please! / Join the Guild again!"))
        if(!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
        return res.redirect("/?error=" + encodeURIComponent("You are not allowed to do that"))

        const data = await db.findOne({
			guild: guild.id
		});
        const welcomeData = welcomedb.findOne({guild: guild.id});

        if(req.body.welcomechannel) welcomeData.channel = req.body.welcomechannel;
        if(req.body.prefix) data.prefix = req.body.prefix;

        res.render("settings", {
            req: req,
            user: req.isAuthenticated ? req.user : null,
            guild: guild,
            bot: client,
            Permissions: Discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
            data: {
                prefix: data.prefix,
                welcome: welcomeData.channel,
            }
        })
    })

    app.post("/dashboard/:guildID", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID)
        if(!guild)
        return res.redirect("/?error=" + encodeURIComponent("It seems you didn't invite me in this guild yet!"))
        let member = guild.members.cache.get(req.user.id);
        if(!member) {
            try{
                member = await guild.members.fetch(req.user.id);
            } catch{

            }
        }
        if(!member)
        return res.redirect("/?error=" + encodeURIComponent("Login first please! / Join the Guild again!"))
        if(!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
        return res.redirect("/?error=" + encodeURIComponent("You are not allowed to do that"))

        const new_prefix = req.body.prefix
        if(new_prefix){
            let data = await db.findOne({guild: guild.id})
            if(!data) {
                const new_data = await db.create({
                    prefix: new_prefix,
                    guild: guild.id
                })
                new_data.save();
            }
            if(data) {
                await db.findOneAndUpdate({guild: guild.id}, { $set: {prefix: new_prefix}})
            }
        }

        const data = await db.findOne({
			guild: guild.id
		});
        if(!data) {
            const new_prefix_data = await db.create({
                prefix: req.body.prefix,
                guild: guild.id
            })
            new_prefix_data.save();
        }

        const new_channel = req.body.welcomechannel

        if(new_channel){
            let welcomeData = await welcomedb.findOne({guild: guild.id})
            if(!welcomeData) {
                const new_welcomeData = await welcomedb.create({
                    channel: new_channel,
                    guild: guild.id
                })
                new_welcomeData.save();
            }
            if(welcomeData) {
                await welcomedb.findOneAndUpdate({guild: guild.id}, { $set: {channel: new_channel}})
            }
        }

        const wData = await welcomedb.findOne({
			guild: guild.id
		});
        if(!wData) {
            const new_welcome_data = await welcomedb.create({
                channel: req.body.welcomechannel,
                guild: guild.id
            })
            new_welcome_data.save();
        }
        else if(wData){
            wData.channel = req.body.welcomechannel
        }

        res.render("settings", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            guild: guild,
            bot: client,
            Permissions: Discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
            data: {
                prefix: data.prefix,
                welcome: wData.channel
            }
        })
    })

    const http = require("http").createServer(app)
    http.listen(Settings.config.port, () =>{
        console.log(`Our website is online! Port: ${Settings.config.port}`)
    })

}